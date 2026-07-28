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
// across serverless instances - and the key is a client-suppliable header,
// so it's a soft deterrent against casual abuse, not a hard guarantee (a
// direct attacker rotating x-forwarded-for gets a fresh bucket each time).
// Fine for a personal contact form; for a harder guarantee, put Upstash
// Redis or Vercel KV behind this instead.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 3;
const MAX_TRACKED_KEYS = 5_000; // bound worst-case memory in a long-lived instance
const hits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();

  // Hard cap on tracked keys: if this is a new key and we're already at
  // capacity, evict the oldest-inserted entry (Map preserves insertion
  // order) before adding. Pruning only already-expired entries doesn't
  // bound memory - a flood of fresh spoofed keys never qualifies as
  // "expired," so the map grows unboundedly and every request pays an
  // ever-larger full-scan cost. Oldest-first eviction guarantees the map
  // never exceeds MAX_TRACKED_KEYS regardless of attack pattern.
  if (!hits.has(key) && hits.size >= MAX_TRACKED_KEYS) {
    const oldestKey = hits.keys().next().value;
    if (oldestKey !== undefined) hits.delete(oldestKey);
  }

  const recent = (hits.get(key) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  recent.push(now);
  hits.set(key, recent);

  return recent.length > RATE_LIMIT_MAX;
}

const MAX_BODY_BYTES = 10_000; // generous for a ~1300-char JSON payload

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

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return Response.json({ error: "Message too large." }, { status: 413 });
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

  // Strip control/non-printable characters and collapse runs of newlines
  // so a submitted message can't forge extra lines or odd formatting in
  // the delivered text.
  const clean = (s: string) =>
    s.replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g, "").replace(/\n{3,}/g, "\n\n");
  const safeName = clean(name);
  const safeMessage = clean(message);

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
      body: `New portfolio contact from ${safeName} (${email}):\n\n${safeMessage.slice(0, 700)}`,
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
