import type { Metadata } from "next";
import { EnvelopeSimple } from "@phosphor-icons/react/dist/ssr";
import { Nav } from "@/components/nav";
import { ContactForm } from "@/components/contact-form";
import { profile } from "@/lib/resume-data";

export const metadata: Metadata = {
  title: `Contact - ${profile.name}`,
  description: "Get in touch about a role, a project, or a hard problem.",
};

export default function ContactPage() {
  return (
    <>
      <Nav />
      <main className="relative flex min-h-[100dvh] items-center px-6 pt-24 pb-16">
        <div
          className="pointer-events-none absolute -top-40 right-0 h-[480px] w-[480px] rounded-full bg-accent/10 blur-[140px]"
          aria-hidden="true"
        />
        <div className="relative mx-auto grid max-w-5xl gap-16 lg:grid-cols-[1fr_1.1fr] lg:items-start">
          <div>
            <h1 className="text-4xl font-medium tracking-tight sm:text-5xl">
              Let&apos;s talk.
            </h1>
            <p className="mt-6 max-w-sm text-lg leading-relaxed text-foreground-muted">
              Send a message and it lands directly on my phone. I read
              everything and reply to real ones fast.
            </p>
            <a
              href={`mailto:${profile.email}`}
              className="mt-8 inline-flex items-center gap-2 font-mono text-sm text-accent transition-colors hover:text-foreground"
            >
              <EnvelopeSimple size={16} weight="light" />
              {profile.email}
            </a>
          </div>

          <div className="relative rounded-3xl border border-border bg-background-elevated p-8 sm:p-10">
            <ContactForm />
          </div>
        </div>
      </main>
    </>
  );
}
