import { getServiceLabel } from "@/data/services";
import type { ContactFormValues } from "@/lib/validations";
import { siteConfig } from "@/data/site-config";

type EmailConfig = {
  apiKey: string;
  to: string;
  from: string;
};

function getEmailConfig(): EmailConfig | null {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim();
  const from = process.env.CONTACT_FROM_EMAIL?.trim();

  if (!apiKey || !to || !from) return null;
  return { apiKey, to, from };
}

export function isContactEmailConfigured(): boolean {
  return getEmailConfig() !== null;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export async function sendContactEmail(
  values: ContactFormValues,
): Promise<"sent" | "not-configured"> {
  const config = getEmailConfig();
  if (!config) return "not-configured";

  const serviceLabel = getServiceLabel(values.service);
  const company = values.company?.trim() || "Not provided";
  const subjectName = values.fullName.replace(/[\r\n]+/g, " ").slice(0, 80);
  const submittedAt = new Intl.DateTimeFormat("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Australia/Sydney",
    timeZoneName: "short",
  }).format(new Date());

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

  let response: Response;
  try {
    response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: config.from,
        to: [config.to],
        reply_to: values.email,
        subject: `New enquiry — ${serviceLabel} — ${subjectName}`,
        text,
        html,
      }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch {
    console.error("[contact] Email provider request failed (network or timeout).");
    throw new Error("EMAIL_PROVIDER_UNAVAILABLE");
  }

  if (!response.ok) {
    // Do not log the provider response body or the enquiry contents.
    console.error(`[contact] Email provider returned HTTP ${response.status}.`);
    throw new Error("EMAIL_PROVIDER_ERROR");
  }

  return "sent";
}
