"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight } from "@phosphor-icons/react";
import { roles } from "@/lib/resume-data";

gsap.registerPlugin(ScrollTrigger);

export function StoryTimeline() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!rootRef.current || reduceMotion) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>(".story-card");

      cards.forEach((card, i) => {
        // Number + progress fill count in as each chapter arrives.
        gsap.from(card.querySelector(".story-fill"), {
          scaleX: 0,
          transformOrigin: "left center",
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top 75%",
            end: "top 25%",
            scrub: true,
          },
        });
        gsap.from(card.querySelector(".story-copy"), {
          opacity: 0,
          y: 32,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });

        if (i === cards.length - 1) return;

        // Each chapter pins at the top and unpins exactly when the next one
        // arrives - a clean one-at-a-time swap, not an ever-growing stack of
        // pinned cards sitting underneath (that pattern piles up all prior
        // cards until the very last one, which is both a performance cost
        // and a visible seam at each transition).
        ScrollTrigger.create({
          trigger: card,
          start: "top top",
          endTrigger: cards[i + 1],
          end: "top top",
          pin: true,
          pinSpacing: false,
        });
        gsap.to(card, {
          scale: 0.94,
          opacity: 0.35,
          ease: "none",
          scrollTrigger: {
            trigger: cards[i + 1],
            start: "top bottom",
            end: "top top",
            scrub: true,
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative px-6 py-32">
      <div className="mx-auto mb-20 max-w-6xl">
        <h2 className="max-w-2xl text-3xl font-medium tracking-tight sm:text-4xl">
          Six roles, one thread. Teaching people to think in code,
          then teaching machines to do the same.
        </h2>
      </div>

      <div className="relative mx-auto max-w-6xl">
        {roles.map((role, i) => (
          <div
            key={role.id}
            className="story-card relative min-h-[100dvh] w-full origin-top rounded-3xl border border-border bg-background-elevated"
            style={{ marginBottom: i === roles.length - 1 ? 0 : "2rem" }}
          >
            <div className="story-fill absolute inset-x-0 top-0 h-1 rounded-t-3xl bg-accent" />
            <div className="story-copy flex h-full flex-col justify-center gap-8 px-8 py-16 sm:px-14 lg:flex-row lg:items-start lg:gap-16">
              <div className="flex shrink-0 flex-col gap-2 lg:w-64">
                <span className="font-mono text-xs text-accent">
                  {String(i + 1).padStart(2, "0")} / {String(roles.length).padStart(2, "0")}
                </span>
                <span className="font-mono text-xs text-foreground-muted">
                  {role.timeframe}
                </span>
              </div>

              <div className="max-w-2xl">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h3 className="text-2xl font-medium tracking-tight sm:text-3xl">
                    {role.title}
                  </h3>
                  {role.companyUrl ? (
                    <a
                      href={role.companyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-lg text-accent transition-colors hover:text-foreground"
                    >
                      {role.company}
                      <ArrowUpRight size={16} weight="bold" />
                    </a>
                  ) : (
                    <span className="text-lg text-foreground-muted">
                      {role.company}
                    </span>
                  )}
                </div>
                {role.location ? (
                  <p className="mt-1 font-mono text-xs text-foreground-muted">
                    {role.location}
                  </p>
                ) : null}

                <p className="mt-6 text-lg leading-relaxed text-foreground-muted">
                  {role.summary}
                </p>

                <ul className="mt-6 space-y-3">
                  {role.highlights.map((point) => (
                    <li
                      key={point}
                      className="flex gap-3 text-sm leading-relaxed text-foreground-muted"
                    >
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
