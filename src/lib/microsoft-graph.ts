/**
 * Microsoft Graph helpers for the contact-form email delivery.
 *
 * All authentication happens server-side using the OAuth 2.0 client
 * credentials flow against Microsoft Entra ID. No credentials are ever
 * exposed to the browser.
 */

export class ContactEmailError extends Error {
  public readonly code: string;
  public readonly retryAfterSeconds?: number;

  constructor(code: string, message?: string, retryAfterSeconds?: number) {
    super(message ?? code);
    this.name = "ContactEmailError";
    this.code = code;
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

export type MicrosoftGraphConfig = {
  tenantId: string;
  clientId: string;
  clientSecret: string;
  senderEmail: string;
  toEmail: string;
};

export function getMicrosoftGraphConfig(): MicrosoftGraphConfig | null {
  const tenantId = process.env.MICROSOFT_TENANT_ID?.trim();
  const clientId = process.env.MICROSOFT_CLIENT_ID?.trim();
  const clientSecret = process.env.MICROSOFT_CLIENT_SECRET?.trim();
  const senderEmail = process.env.MICROSOFT_SENDER_EMAIL?.trim();
  const toEmail = process.env.CONTACT_TO_EMAIL?.trim();

  if (!tenantId || !clientId || !clientSecret || !senderEmail || !toEmail) {
    return null;
  }

  return { tenantId, clientId, clientSecret, senderEmail, toEmail };
}

// In-memory token cache for a single Node process. Across PM2 restarts or
// multiple processes this cache is cold and a fresh token is requested.
let cachedToken: { value: string; expiresAt: number } | null = null;

export function clearMicrosoftGraphTokenCache(): void {
  cachedToken = null;
}

export async function getMicrosoftGraphAccessToken(
  config: MicrosoftGraphConfig,
): Promise<string> {
  const now = Date.now();
  if (cachedToken && cachedToken.expiresAt - 60_000 > now) {
    return cachedToken.value;
  }

  const tokenUrl = `https://login.microsoftonline.com/${encodeURIComponent(
    config.tenantId,
  )}/oauth2/v2.0/token`;

  const body = new URLSearchParams({
    client_id: config.clientId,
    client_secret: config.clientSecret,
    scope: "https://graph.microsoft.com/.default",
    grant_type: "client_credentials",
  });

  let response: Response;
  try {
    response = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    if (error instanceof Error && error.name === "TimeoutError") {
      throw new ContactEmailError("GRAPH_TIMEOUT", "Token request timed out.");
    }
    throw new ContactEmailError(
      "AUTH_FAILED",
      "Could not reach Microsoft Entra ID.",
    );
  }

  if (!response.ok) {
    let msError = "";
    try {
      const data = (await response.json()) as { error?: string };
      msError = typeof data?.error === "string" ? data.error : "";
    } catch {
      // ignore parse errors
    }

    // Sanitized server-side diagnostic only.
    console.error(
      `[contact] Microsoft Entra token request failed (HTTP ${response.status}${msError ? `, ${msError}` : ""}).`,
    );

    if (response.status === 429) {
      throw new ContactEmailError("GRAPH_RATE_LIMITED", "Token rate limited.", 60);
    }
    throw new ContactEmailError("AUTH_FAILED", "Microsoft authentication failed.");
  }

  let data: { access_token?: string; expires_in?: number };
  try {
    data = (await response.json()) as { access_token?: string; expires_in?: number };
  } catch {
    throw new ContactEmailError("AUTH_FAILED", "Invalid token response.");
  }

  if (!data.access_token) {
    throw new ContactEmailError("AUTH_FAILED", "Microsoft authentication failed.");
  }

  const expiresIn = Number.isFinite(data.expires_in)
    ? Number(data.expires_in)
    : 3600;
  cachedToken = {
    value: data.access_token,
    expiresAt: Date.now() + expiresIn * 1000,
  };

  return cachedToken.value;
}
