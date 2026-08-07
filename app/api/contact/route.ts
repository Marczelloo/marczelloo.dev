import { NextResponse } from "next/server";
import { Resend } from "resend";
import dns from "node:dns/promises";

export const dynamic = "force-dynamic";

/* ── Env (lazy – avoid crash at build time when vars are absent) ── */
let _resend: Resend | null = null;
function getResend() {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY);
  return _resend;
}
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL ?? "";
const RECIPIENT_EMAIL = "moskwamarcel@gmail.com";

/* ── Simple in-memory rate limiter (per IP, 3 req / min) ── */
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 3;
const RATE_WINDOW_MS = 60_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return false;
  }

  entry.count += 1;
  return entry.count > RATE_LIMIT;
}

/* ── Validation helpers ── */
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

interface ContactPayload {
  name: string;
  email: string;
  message: string;
}

function validate(body: unknown): { ok: true; data: ContactPayload } | { ok: false; error: string } {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body." };
  }

  const { name, email, message } = body as Record<string, unknown>;

  if (typeof name !== "string" || name.trim().length < 2 || name.trim().length > 100) {
    return { ok: false, error: "Name must be between 2 and 100 characters." };
  }

  if (typeof email !== "string" || !EMAIL_REGEX.test(email.trim()) || email.trim().length > 320) {
    return { ok: false, error: "Please provide a valid email address." };
  }

  if (typeof message !== "string" || message.trim().length < 5 || message.trim().length > 5000) {
    return { ok: false, error: "Message must be between 5 and 5000 characters." };
  }

  // Basic honeypot / spam patterns
  const lowerMsg = message.toLowerCase();
  const spamPatterns = ["<script", "javascript:", "onclick=", "onerror="];
  if (spamPatterns.some((p) => lowerMsg.includes(p))) {
    return { ok: false, error: "Message contains disallowed content." };
  }

  return {
    ok: true,
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      message: message.trim(),
    },
  };
}

/* ── Sanitize for Discord embed (strip potential mentions / links) ── */
function sanitize(text: string, maxLen = 1024): string {
  return text
    .replace(/@everyone/g, "")
    .replace(/@here/g, "")
    .slice(0, maxLen);
}

/* ── Discord webhook ── */
async function notifyDiscord(data: ContactPayload): Promise<void> {
  if (!DISCORD_WEBHOOK_URL) return;

  const payload = {
    embeds: [
      {
        title: "📬 New Portfolio Contact",
        color: 0x7c47e6,
        fields: [
          { name: "Name", value: sanitize(data.name, 100), inline: true },
          { name: "Email", value: sanitize(data.email, 320), inline: true },
          { name: "Message", value: sanitize(data.message) },
        ],
        timestamp: new Date().toISOString(),
      },
    ],
  };

  try {
    await fetch(DISCORD_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
  } catch {
    // Discord notification is best-effort — don't fail the request
    console.error("[contact] Discord webhook failed");
  }
}

/* ── POST handler ── */
export async function POST(request: Request) {
  try {
    /* Rate limit */
    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() ?? "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    /* Parse & validate */
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON." }, { status: 400 });
    }

    const result = validate(body);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const { data } = result;

    /* Verify the email domain has MX records (real mail server) */
    const domain = data.email.split("@")[1];
    try {
      const mxRecords = await dns.resolveMx(domain);
      if (!mxRecords || mxRecords.length === 0) {
        return NextResponse.json(
          { error: "This email domain doesn't appear to accept mail. Please use a valid email." },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Could not verify your email domain. Please check for typos." },
        { status: 400 }
      );
    }

    /* Send email via Resend */
    const { error: resendError } = await getResend().emails.send({
      from: "Portfolio Contact <onboarding@resend.dev>",
      to: RECIPIENT_EMAIL,
      replyTo: `${data.name} <${data.email}>`,
      subject: `Portfolio message from ${data.name}`,
      text: [`Name: ${data.name}`, `Email: ${data.email}`, "", "Message:", data.message].join("\n"),
    });

    if (resendError) {
      console.error("[contact] Resend error:", resendError);
      return NextResponse.json({ error: "Failed to send email. Please try again later." }, { status: 500 });
    }

    /* Notify Discord (fire-and-forget) */
    void notifyDiscord(data);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("[contact] Unexpected error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
