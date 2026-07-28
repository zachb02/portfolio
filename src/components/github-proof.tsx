import Image from "next/image";
import { ArrowUpRight, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { githubHandle, featuredRepos } from "@/lib/resume-data";

export function GithubProof() {
  return (
    <section className="px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-center gap-4">
          <Image
            src="https://avatars.githubusercontent.com/u/212614734?v=4"
            alt={`${githubHandle} on GitHub`}
            width={56}
            height={56}
            className="rounded-full border border-border"
          />
          <div>
            <h2 className="text-2xl font-medium tracking-tight sm:text-3xl">
              The actual commits.
            </h2>
            <a
              href={`https://github.com/${githubHandle}`}
              target="_blank"
              rel="noreferrer"
              className="mt-1 inline-flex items-center gap-1.5 font-mono text-sm text-accent transition-colors hover:text-foreground"
            >
              <GithubLogo size={15} weight="fill" />
              github.com/{githubHandle}
            </a>
          </div>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {featuredRepos.map((repo) => (
            <a
              key={repo.name}
              href={repo.url}
              target="_blank"
              rel="noreferrer"
              className="group rounded-2xl border border-border bg-background-elevated p-6 transition-colors hover:border-accent/30"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-mono text-sm font-medium text-foreground">
                  {repo.name}
                </h3>
                <ArrowUpRight
                  size={16}
                  weight="bold"
                  className="mt-0.5 shrink-0 text-foreground-muted transition-colors group-hover:text-accent"
                />
              </div>
              <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
                {repo.description}
              </p>
              <span className="mt-4 inline-block rounded-full border border-border px-2.5 py-1 text-xs text-foreground-muted">
                {repo.language}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
