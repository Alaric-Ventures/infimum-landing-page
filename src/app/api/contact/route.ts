import { NextResponse } from "next/server";

import { sendContactEmail } from "@/lib/email";
import { contactRequestSchema } from "@/lib/validations";

export const runtime = "nodejs";

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const MAX_BODY_BYTES = 25_000;

/**
 * Best-effort rate limiting for a single Node process. This is sufficient for
 * a small brochure site, but on multi-instance/serverless hosting it should be
 * replaced with a shared store (for example Upstash Redis or Vercel KV).
 */
const requestLog = new Map<string, number[]>();

function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const forwardedIp = forwardedFor?.split(",")[0]?.trim();
  return forwardedIp || request.headers.get("x-real-ip") || "unknown";
}

function checkRateLimit(ip: string): {
  allowed: boolean;
  retryAfterSeconds: number;
} {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;

  for (const [key, timestamps] of requestLog.entries()) {
    const recent = timestamps.filter((timestamp) => timestamp > cutoff);
    if (recent.length === 0) {
      requestLog.delete(key);
    } else {
      requestLog.set(key, recent);
    }
  }

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

  try {
    const result = await sendContactEmail(enquiry);

    if (result === "not-configured") {
      return jsonError(
        "The enquiry form is not connected to the email service yet. Please call us on +61 405 364 625.",
        "NOT_CONFIGURED",
        503,
      );
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error) {
    const code =
      error instanceof Error ? error.message : "UNKNOWN_PROVIDER_ERROR";

    if (
      code === "EMAIL_PROVIDER_ERROR" ||
      code === "EMAIL_PROVIDER_UNAVAILABLE"
    ) {
      return jsonError(
        "The email service could not accept your enquiry right now. Please try again, or call us directly.",
        "EMAIL_DELIVERY_FAILED",
        502,
      );
    }

    console.error("[contact] Unexpected error while processing an enquiry.");
    return jsonError(
      "Something went wrong while sending your enquiry. Please try again, or call us directly.",
      "UNEXPECTED_ERROR",
      500,
    );
  }
}
