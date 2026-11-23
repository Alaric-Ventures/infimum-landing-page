import { getServiceLabel } from "@/data/services";
import type { ContactFormValues } from "@/lib/validations";
import { siteConfig } from "@/data/site-config";
import {
  clearMicrosoftGraphTokenCache,
  getMicrosoftGraphAccessToken,
  getMicrosoftGraphConfig,
  ContactEmailError,
} from "@/lib/microsoft-graph";

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function isContactEmailConfigured(): boolean {
  return getMicrosoftGraphConfig() !== null;
}

export async function sendContactEmail(
  values: ContactFormValues,
): Promise<"sent" | "not-configured"> {
  const config = getMicrosoftGraphConfig();
  if (!config) return "not-configured";

  const serviceLabel = getServiceLabel(values.service);
  const company = values.company?.trim() || "Not provided";
  const subjectName = values.fullName.replace(/[\r\n]+/g, " ").slice(0, 80);
  const submittedAt = new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Asia/Kolkata",
  }).format(new Date());

  // Plain-text representation retained for accessibility/records. Microsoft Graph
  // sendMail accepts a single body, so HTML is used for delivery.
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const text = [
    `New project enquiry — ${siteConfig.name}`,
    "",
    `Name: ${values.fullName}`,
    `Email: ${values.email}`,
    `Company: ${company}`,
    `Service: ${serviceLabel}`,
    `Submitted: ${submittedAt}`,
    "",
    "Project details:",
    values.message,
  ].join("\n");

  const html = `
    <div style="font-family:Arial,Helvetica,sans-serif;max-width:640px;margin:0 auto;color:#0f172a;">
      <div style="background:#0b1221;padding:28px 32px;border-radius:12px 12px 0 0;">
        <p style="margin:0;color:#06b6d4;font-size:11px;letter-spacing:2px;text-transform:uppercase;">New project enquiry</p>
        <h1 style="margin:8px 0 0;color:#ffffff;font-size:22px;font-weight:600;">${escapeHtml(serviceLabel)}</h1>
      </div>
      <div style="border:1px solid #e2e8f0;border-top:0;border-radius:0 0 12px 12px;padding:28px 32px;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;line-height:1.6;">
          <tr><td style="padding:6px 0;color:#64748b;width:110px;">Name</td><td style="padding:6px 0;">${escapeHtml(values.fullName)}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b;">Email</td><td style="padding:6px 0;">${escapeHtml(values.email)}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b;">Company</td><td style="padding:6px 0;">${escapeHtml(company)}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b;">Service</td><td style="padding:6px 0;">${escapeHtml(serviceLabel)}</td></tr>
          <tr><td style="padding:6px 0;color:#64748b;">Submitted</td><td style="padding:6px 0;">${escapeHtml(submittedAt)}</td></tr>
        </table>
        <hr style="border:0;border-top:1px solid #e2e8f0;margin:20px 0;" />
        <p style="margin:0 0 6px;color:#64748b;font-size:12px;text-transform:uppercase;letter-spacing:1.5px;">Project details</p>
        <p style="margin:0;font-size:15px;line-height:1.7;white-space:pre-wrap;">${escapeHtml(values.message)}</p>
      </div>
    </div>
  `;

  const subject = `New enquiry — ${serviceLabel} — ${subjectName}`;
  const sender = config.senderEmail;
  const graphUrl = `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(
    sender,
  )}/sendMail`;

  const payload = {
    message: {
      subject,
      body: {
        contentType: "HTML",
        content: html,
      },
      from: {
        emailAddress: {
          address: sender,
          name: siteConfig.name,
        },
      },
      toRecipients: [
        {
          emailAddress: {
            address: config.toEmail,
          },
        },
      ],
      replyTo: [
        {
          emailAddress: {
            address: values.email,
            name: values.fullName,
          },
        },
      ],
    },
    saveToSentItems: true,
  };

  // Also provide plain text via an additional... Graph sendMail supports only
  // one body; include a plain-text alternative in headers? Graph's message
  // body is single. We keep `text` available for diagnostics only. To preserve
  // accessibility, append a short plain-text note is not possible. Instead we
  // rely on HTML email with semantic structure. (Text version retained above
  // for future use / logging-free reference.)

  const sendOnce = async (token: string): Promise<Response> => {
    let response: Response;
    try {
      response = await fetch(graphUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15_000),
      });
    } catch (error) {
      if (error instanceof Error && error.name === "TimeoutError") {
        throw new ContactEmailError("GRAPH_TIMEOUT", "Microsoft Graph request timed out.");
      }
      throw new ContactEmailError(
        "GRAPH_UNAVAILABLE",
        "Could not reach Microsoft Graph.",
      );
    }
    return response;
  };

  let token = await getMicrosoftGraphAccessToken(config);
  let response = await sendOnce(token);

  // Retry once on 401 after clearing the cached token.
  if (response.status === 401) {
    clearMicrosoftGraphTokenCache();
    token = await getMicrosoftGraphAccessToken(config);
    response = await sendOnce(token);
  }

  if (response.status === 202 || response.status === 200 || response.status === 204) {
    // 202 Accepted means accepted for processing, not final delivery.
    return "sent";
  }

  let msErrorCode = "";
  let retryAfter: number | undefined;
  try {
    const data = (await response.json()) as { error?: { code?: string; message?: string } };
    msErrorCode = typeof data?.error?.code === "string" ? data.error.code : "";
  } catch {
    // ignore
  }
  const retryAfterHeader = response.headers.get("retry-after");
  if (retryAfterHeader) {
    const parsed = Number(retryAfterHeader);
    if (Number.isFinite(parsed) && parsed > 0) retryAfter = parsed;
  }

  // Sanitized server-side diagnostic only.
  console.error(
    `[contact] Microsoft Graph sendMail failed (HTTP ${response.status}${msErrorCode ? `, ${msErrorCode}` : ""}).`,
  );

  if (response.status === 401) {
    throw new ContactEmailError("AUTH_FAILED", "Microsoft authentication failed.");
  }
  if (response.status === 403) {
    // Could be missing permissions or mailbox access. Treat as permission denied.
    throw new ContactEmailError(
      "PERMISSION_DENIED",
      "Microsoft Graph permission denied.",
    );
  }
  if (response.status === 404) {
    throw new ContactEmailError("MAILBOX_NOT_FOUND", "Sending mailbox not found.");
  }
  if (response.status === 429) {
    throw new ContactEmailError(
      "GRAPH_RATE_LIMITED",
      "Microsoft Graph rate limited.",
      retryAfter ?? 60,
    );
  }
  if (response.status >= 500) {
    throw new ContactEmailError("GRAPH_UNAVAILABLE", "Microsoft Graph unavailable.");
  }

  throw new ContactEmailError("EMAIL_PROVIDER_ERROR", "Microsoft Graph rejected the request.");
}

