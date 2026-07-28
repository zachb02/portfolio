import { z } from "zod";
import twilio from "twilio";

// Personal cell number this form texts. Hardcoded per explicit request -
// override with CONTACT_DESTINATION_NUMBER if it ever needs to change.
const DESTINATION_NUMBER =
  process.env.CONTACT_DESTINATION_NUMBER || "+18183005533";

const ContactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Enter a valid email").max(200),
  message: z.string().trim().min(1, "Message is required").max(1000),
  // Honeypot: real users never see or fill this field. Deliberately
  // permissive here (no max/empty constraint) so a filled-in value
  // still parses successfully - the actual check happens after parsing,
  // so we can silently pretend success instead of leaking a validation
  // error that would tip off a bot.
  company: z.string().optional(),
});

// In-memory sliding-window limiter. Resets on cold start and isn't shared
// across serverless instances, so it's a soft deterrent, not a hard
// guarantee - fine for a personal contact form, not sufficient at scale.
// For a harder guarantee, put Upstash Redis or Vercel KV behind this.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3;
const hits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  recent.push(now);
  hits.set(key, recent);
  return recent.length > RATE_LIMIT_MAX;
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  if (isRateLimited(ip)) {
    return Response.json(
      { error: "Too many messages. Try again in a minute." },
      { status: 429 }
    );
  }

  const body = await request.json().catch(() => null);
  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const { name, email, message, company } = parsed.data;

  // Honeypot tripped - pretend success, drop silently.
  if (company) {
    return Response.json({ ok: true });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const fromNumber = process.env.TWILIO_FROM_NUMBER;

  if (!accountSid || !authToken || !fromNumber) {
    console.error(
      "[contact] Twilio env vars missing - message not sent:",
      { name, email, message }
    );
    return Response.json(
      { error: "Contact form isn't configured yet. Email me directly instead." },
      { status: 503 }
    );
  }

  try {
    const client = twilio(accountSid, authToken);
    await client.messages.create({
      to: DESTINATION_NUMBER,
      from: fromNumber,
      body: `New portfolio contact from ${name} (${email}):\n\n${message.slice(0, 700)}`,
    });
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[contact] Twilio send failed:", error);
    return Response.json(
      { error: "Couldn't send that just now. Try emailing me directly." },
      { status: 502 }
    );
  }
}
