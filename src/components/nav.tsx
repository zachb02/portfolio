import Link from "next/link";
import { profile } from "@/lib/resume-data";

export function Nav() {
  return (
    <header className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/70 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          className="font-mono text-sm font-medium tracking-tight text-foreground transition-colors hover:text-accent"
        >
          {profile.name}
        </Link>
        <div className="flex items-center gap-6">
          <Link
            href="/#work"
            className="hidden text-sm text-foreground-muted transition-colors hover:text-foreground sm:inline-block"
          >
            Work
          </Link>
          <Link
            href="/#skills"
            className="hidden text-sm text-foreground-muted transition-colors hover:text-foreground sm:inline-block"
          >
            Skills
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-accent/40 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent transition-colors hover:bg-accent/20"
          >
            Contact
          </Link>
        </div>
      </nav>
    </header>
  );
}
