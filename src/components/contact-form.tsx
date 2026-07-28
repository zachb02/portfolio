"use client";

import { useState, type FormEvent } from "react";
import { PaperPlaneTilt, CheckCircle, WarningCircle } from "@phosphor-icons/react";

type Status = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const form = event.currentTarget;
    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") ?? ""),
      email: String(data.get("email") ?? ""),
      message: String(data.get("message") ?? ""),
      company: String(data.get("company") ?? ""),
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMessage(json.error ?? "Something went wrong. Try again.");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Try again in a moment.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-start gap-3 rounded-2xl border border-accent/30 bg-accent/5 px-6 py-8">
        <CheckCircle size={24} weight="fill" className="mt-0.5 shrink-0 text-accent" />
        <div>
          <p className="text-lg font-medium text-foreground">Message sent.</p>
          <p className="mt-1 text-sm text-foreground-muted">
            Thanks for reaching out - I&apos;ll get back to you soon.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className="text-sm font-medium text-foreground">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={100}
          autoComplete="name"
          className="rounded-xl border border-border bg-background-elevated px-4 py-3 text-foreground placeholder:text-foreground-muted outline-none transition-colors focus:border-accent"
          placeholder="Jane Rivera"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className="text-sm font-medium text-foreground">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={200}
          autoComplete="email"
          className="rounded-xl border border-border bg-background-elevated px-4 py-3 text-foreground placeholder:text-foreground-muted outline-none transition-colors focus:border-accent"
          placeholder="jane@company.com"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="message" className="text-sm font-medium text-foreground">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          maxLength={1000}
          rows={5}
          className="resize-none rounded-xl border border-border bg-background-elevated px-4 py-3 text-foreground placeholder:text-foreground-muted outline-none transition-colors focus:border-accent"
          placeholder="What are you working on?"
        />
      </div>

      {/* Honeypot - visually hidden from sighted users, still in the tab/DOM
          order for bots that fill every field programmatically. */}
      <div className="absolute -left-[9999px]" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input
          id="company"
          name="company"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {status === "error" ? (
        <div className="flex items-start gap-2 text-sm text-red-400">
          <WarningCircle size={18} weight="fill" className="mt-0.5 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      ) : null}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-accent px-6 py-3 text-sm font-medium text-[#00181c] transition-transform hover:-translate-y-0.5 disabled:opacity-60 disabled:hover:translate-y-0"
      >
        {status === "submitting" ? "Sending..." : "Send message"}
        <PaperPlaneTilt size={16} weight="bold" />
      </button>
    </form>
  );
}
