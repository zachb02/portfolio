"use client";

import { useState, type FormEvent } from "react";
import { Sparkle, WarningCircle } from "@phosphor-icons/react";

type AdPair = { headline: string; body: string };
type Status = "idle" | "loading" | "success" | "error" | "not_configured";

const EXAMPLES = [
  "A mobile dog-grooming service in Austin",
  "Small-batch cold brew coffee subscription",
  "A local bakery that ships nationwide",
];

export function AdDemo() {
  const [business, setBusiness] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [ads, setAds] = useState<AdPair[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!business.trim()) return;
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/demo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ business }),
      });
      const json = await res.json();

      if (res.status === 503 && json.error === "not_configured") {
        setStatus("not_configured");
        return;
      }
      if (!res.ok) {
        setStatus("error");
        setErrorMessage(json.error ?? "Something went wrong.");
        return;
      }
      setAds(json.ads ?? []);
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Try again.");
    }
  }

  return (
    <section className="px-6 py-32">
      <div className="mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
            This is what Magnet AI does. Try it.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-lg leading-relaxed text-foreground-muted">
            Describe a business in one line. This calls the Anthropic API
            live, right now, and writes real ad concepts back.
          </p>
        </div>

        <div className="rounded-2xl border border-border bg-background-elevated p-6 sm:p-8">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <textarea
              value={business}
              onChange={(e) => setBusiness(e.target.value)}
              maxLength={300}
              rows={2}
              placeholder="e.g. A mobile dog-grooming service in Austin"
              className="resize-none rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-foreground-muted outline-none transition-colors focus:border-accent"
            />
            <div className="flex flex-wrap items-center gap-2">
              {EXAMPLES.map((ex) => (
                <button
                  key={ex}
                  type="button"
                  onClick={() => setBusiness(ex)}
                  className="rounded-full border border-border px-3 py-1 text-xs text-foreground-muted transition-colors hover:border-accent/40 hover:text-foreground"
                >
                  {ex}
                </button>
              ))}
              <button
                type="submit"
                disabled={status === "loading" || !business.trim()}
                className="ml-auto inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-[#00181c] transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {status === "loading" ? "Generating..." : "Generate ads"}
                <Sparkle size={16} weight="bold" />
              </button>
            </div>
          </form>

          {status === "not_configured" ? (
            <div className="mt-6 flex items-start gap-2 rounded-xl border border-accent/30 bg-accent/5 p-4 text-sm text-foreground-muted">
              <WarningCircle size={18} weight="fill" className="mt-0.5 shrink-0 text-accent" />
              <span>
                This demo calls the Anthropic API directly and needs an{" "}
                <code className="font-mono text-xs text-foreground">
                  ANTHROPIC_API_KEY
                </code>{" "}
                configured server-side to go live - it&apos;s not wired up
                in this environment yet.
              </span>
            </div>
          ) : null}

          {status === "error" ? (
            <div className="mt-6 flex items-start gap-2 text-sm text-red-400">
              <WarningCircle size={18} weight="fill" className="mt-0.5 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          ) : null}

          {status === "success" && ads.length > 0 ? (
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {ads.map((ad, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-border bg-background p-4"
                >
                  <p className="text-sm font-semibold leading-snug text-foreground">
                    {ad.headline}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-foreground-muted">
                    {ad.body}
                  </p>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        <p className="mt-4 text-center font-mono text-xs text-foreground-muted">
          A real API call, not a canned response - rate-limited to keep it honest.
        </p>
      </div>
    </section>
  );
}
