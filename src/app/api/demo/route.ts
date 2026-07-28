import { z } from "zod";

const DemoSchema = z.object({
  business: z.string().trim().min(3, "Tell me a bit more").max(300),
});

// Same in-memory sliding-window limiter shape as api/contact/route.ts -
// a soft deterrent against casual abuse of a metered API key, not a hard
// guarantee. See that file's comment for the full caveat.
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 5;
const MAX_TRACKED_KEYS = 5_000;
const hits = new Map<string, number[]>();

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  recent.push(now);
  hits.set(key, recent);

  if (hits.size > MAX_TRACKED_KEYS) {
    for (const [k, times] of hits) {
      if (times.every((t) => now - t >= RATE_LIMIT_WINDOW_MS)) hits.delete(k);
    }
  }

  return recent.length > RATE_LIMIT_MAX;
}

const MAX_BODY_BYTES = 2_000;

type AdPair = { headline: string; body: string };

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown";

  if (isRateLimited(ip)) {
    return Response.json(
      { error: "Too many requests. Try again in a minute." },
      { status: 429 }
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return Response.json({ error: "That's too long." }, { status: 413 });
  }

  const body = await request.json().catch(() => null);
  const parsed = DemoSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "not_configured" },
      { status: 503 }
    );
  }

  const prompt = `You write short, punchy ad copy for small businesses. Given a one-line business description, generate exactly 3 ad concepts (a headline under 8 words, and a body under 25 words each). Vary the angle across the 3 (e.g. direct offer, social proof, urgency).

Business: ${parsed.data.business}

Respond ONLY with a JSON array, no markdown fences, no commentary:
[{"headline": "...", "body": "..."}, {"headline": "...", "body": "..."}, {"headline": "...", "body": "..."}]`;

  try {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-5",
        max_tokens: 500,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: AbortSignal.timeout(20_000),
    });

    if (!res.ok) {
      console.error("[demo] Anthropic API error:", res.status, await res.text().catch(() => ""));
      return Response.json(
        { error: "Generation failed. Try again in a moment." },
        { status: 502 }
      );
    }

    const json = (await res.json()) as {
      content?: Array<{ type: string; text?: string }>;
    };
    const raw = json.content?.find((c) => c.type === "text")?.text ?? "";
    const match = raw.match(/\[[\s\S]*\]/);
    if (!match) {
      return Response.json(
        { error: "Couldn't parse a result. Try rephrasing." },
        { status: 502 }
      );
    }

    const parsedAds = JSON.parse(match[0]) as unknown;
    if (!Array.isArray(parsedAds)) {
      return Response.json({ error: "Unexpected response." }, { status: 502 });
    }

    const ads: AdPair[] = parsedAds
      .filter(
        (a): a is AdPair =>
          typeof a === "object" &&
          a !== null &&
          typeof (a as AdPair).headline === "string" &&
          typeof (a as AdPair).body === "string"
      )
      .slice(0, 3);

    if (ads.length === 0) {
      return Response.json({ error: "Couldn't generate ads for that." }, { status: 502 });
    }

    return Response.json({ ads });
  } catch (error) {
    console.error("[demo] generation threw:", error);
    return Response.json(
      { error: "Generation failed. Try again in a moment." },
      { status: 502 }
    );
  }
}
