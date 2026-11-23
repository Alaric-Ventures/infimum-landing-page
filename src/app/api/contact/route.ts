import { NextResponse } from "next/server";

import { sendContactEmail } from "@/lib/email";
import { contactRequestSchema } from "@/lib/validations";
import { ContactEmailError } from "@/lib/microsoft-graph";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const MAX_BODY_BYTES = 25_000;
const DUPLICATE_WINDOW_MS = 2 * 60 * 1000;

/**
 * Best-effort rate limiting for a single Node process. This is sufficient for
 * a small brochure site, but on multi-instance/serverless hosting it should be
 * replaced with a shared store (for example Upstash Redis or Vercel KV).
 *
 * Limitations: the in-memory store is reset on PM2 restarts and is not shared
 * across multiple Node processes/instances.
 */
const requestLog = new Map<string, number[]>();
const recentSubmissions = new Map<string, number>();

function cleanupMaps(now: number): void {
  const cutoff = now - RATE_LIMIT_WINDOW_MS;
  for (const [key, timestamps] of requestLog.entries()) {
    const recent = timestamps.filter((timestamp) => timestamp > cutoff);
    if (recent.length === 0) {
      requestLog.delete(key);
    } else {
      requestLog.set(key, recent);
    }
  }

  const dupCutoff = now - DUPLICATE_WINDOW_MS;
  for (const [key, timestamp] of recentSubmissions.entries()) {
    if (timestamp <= dupCutoff) recentSubmissions.delete(key);
  }
}

/**
 * Resolve the client IP without blindly trusting a client-supplied
 * X-Forwarded-For. In production behind Nginx, prefer X-Real-IP (set by
 * Nginx to $remote_addr). Fall back to the last entry of X-Forwarded-For,
 * which is the value appended by the trusted proxy, rather than the first.
 */
function getClientIp(request: Request): string {
  const realIp = request.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const parts = forwardedFor
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
    if (parts.length > 0) {
      return parts[parts.length - 1] ?? "unknown";
    }
  }

  return "unknown";
}

function checkRateLimit(ip: string): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  cleanupMaps(now);

  const recentRequests = requestLog.get(ip) ?? [];
  if (recentRequests.length >= RATE_LIMIT_MAX) {
    const oldest = recentRequests[0] ?? now;
    return {
      allowed: false,
      retryAfterSeconds: Math.max(
        1,
        Math.ceil((oldest + RATE_LIMIT_WINDOW_MS - now) / 1000),
      ),
    };
  }

  recentRequests.push(now);
  requestLog.set(ip, recentRequests);
  return { allowed: true, retryAfterSeconds: 0 };
}

function jsonError(
  message: string,
  code: string,
  status: number,
  headers?: HeadersInit,
) {
  return NextResponse.json(
    { ok: false, error: message, code },
    { status, headers },
  );
}

function submissionKey(enquiry: {
  email: string;
  service: string;
  message: string;
}): string {
  return `${enquiry.email.trim().toLowerCase()}|${enquiry.service}|${enquiry.message
    .trim()
    .toLowerCase()}`;
}

export async function POST(request: Request) {
  if (!(request.headers.get("content-type") ?? "").includes("application/json")) {
    return jsonError(
      "Unsupported request format.",
      "UNSUPPORTED_MEDIA_TYPE",
      415,
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return jsonError("The submitted enquiry is too large.", "TOO_LARGE", 413);
  }

  const rateLimit = checkRateLimit(getClientIp(request));
  if (!rateLimit.allowed) {
    return jsonError(
      "You’ve sent several enquiries in a short time. Please wait a few minutes or call us directly.",
      "RATE_LIMITED",
      429,
      { "Retry-After": String(rateLimit.retryAfterSeconds) },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError("The enquiry could not be read.", "INVALID_JSON", 400);
  }

  const parsed = contactRequestSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(
      "Please check the highlighted fields and try again.",
      "VALIDATION_ERROR",
      400,
    );
  }

  const enquiry = parsed.data;

  // Honeypot: legitimate visitors never see or complete this field.
  if (enquiry.companyWebsite && enquiry.companyWebsite.length > 0) {
    return jsonError("The enquiry could not be processed.", "SPAM_REJECTED", 400);
  }

  // Duplicate-submission protection (best-effort, single process).
  const key = submissionKey(enquiry);
  const now = Date.now();
  const previous = recentSubmissions.get(key);
  if (previous && now - previous < DUPLICATE_WINDOW_MS) {
    return jsonError(
      "This enquiry looks like a duplicate. Please wait a moment before sending again.",
      "DUPLICATE_SUBMISSION",
      409,
    );
  }
  recentSubmissions.set(key, now);

  try {
    const result = await sendContactEmail(enquiry);

    if (result === "not-configured") {
      recentSubmissions.delete(key);
      return jsonError(
        "The enquiry form is not connected to the email service yet.",
        "NOT_CONFIGURED",
        503,
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    recentSubmissions.delete(key);

    const code =
      error instanceof ContactEmailError
        ? error.code
        : error instanceof Error
          ? error.message
          : "UNKNOWN_PROVIDER_ERROR";
    const retryAfter =
      error instanceof ContactEmailError ? error.retryAfterSeconds : undefined;

    if (code === "GRAPH_RATE_LIMITED") {
      return jsonError(
        "The email service is temporarily busy. Please try again shortly.",
        "GRAPH_RATE_LIMITED",
        429,
        { "Retry-After": String(retryAfter ?? 60) },
      );
    }

    if (code === "GRAPH_TIMEOUT") {
      return jsonError(
        "The email service took too long to respond. Please try again.",
        "GRAPH_TIMEOUT",
        504,
      );
    }

    if (
      code === "AUTH_FAILED" ||
      code === "PERMISSION_DENIED" ||
      code === "MAILBOX_NOT_FOUND" ||
      code === "MAILBOX_ACCESS_DENIED"
    ) {
      console.error(`[contact] Microsoft Graph configuration/permission error: ${code}.`);
      return jsonError(
        "The email service is not available right now. Please try again later or call us directly.",
        code,
        503,
      );
    }

    if (
      code === "GRAPH_UNAVAILABLE" ||
      code === "EMAIL_PROVIDER_ERROR" ||
      code === "EMAIL_PROVIDER_UNAVAILABLE"
    ) {
      return jsonError(
        "The email service could not accept your enquiry right now. Please try again, or call us directly.",
        "EMAIL_DELIVERY_FAILED",
        502,
      );
    }

    console.error(
      "[contact] Unexpected error while processing an enquiry.",
      error instanceof Error ? `${error.name}: ${error.message}\n${error.stack ?? ""}` : String(error),
    );
    return jsonError(
      "Something went wrong while sending your enquiry. Please try again, or call us directly.",
      "UNEXPECTED_ERROR",
      500,
    );
  }
}
