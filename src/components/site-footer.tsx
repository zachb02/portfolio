import Link from "next/link";
import { EnvelopeSimple, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { profile } from "@/lib/resume-data";

export function SiteFooter() {
  return (
    <footer className="border-t border-border px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="max-w-md text-3xl font-medium tracking-tight sm:text-4xl">
              Got a role, a project, or a hard problem?
            </h2>
            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-medium text-[#00181c] transition-transform hover:-translate-y-0.5"
            >
              Contact
              <ArrowUpRight size={16} weight="bold" />
            </Link>
          </div>

          <div className="flex flex-col gap-3 font-mono text-sm text-foreground-muted">
            <a
              href={`mailto:${profile.email}`}
              className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
            >
              <EnvelopeSimple size={16} weight="light" />
              {profile.email}
            </a>
            <a
              href="https://gomagnet.ai"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 transition-colors hover:text-foreground"
            >
              <ArrowUpRight size={16} weight="light" />
              gomagnet.ai
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-border pt-6 text-xs text-foreground-muted sm:flex-row sm:items-center sm:justify-between">
          <span>
            {profile.name} - {profile.location}
          </span>
          <span>Built with Next.js and GSAP</span>
        </div>
      </div>
    </footer>
  );
}
