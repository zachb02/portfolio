"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import {
  ArrowUpRight,
  MagnifyingGlass,
  Sparkle,
  PaperPlaneTilt,
  ShieldCheck,
} from "@phosphor-icons/react";
import { caseStudy } from "@/lib/resume-data";

gsap.registerPlugin(ScrollTrigger);

const ARCHITECTURE_ICONS = {
  MagnifyingGlass,
  Sparkle,
  PaperPlaneTilt,
  ShieldCheck,
} as const;

export function FlagshipWork() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!rootRef.current) return;

    if (reduceMotion) {
      gsap.set(".flagship-reveal", { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.batch(".flagship-reveal", {
        start: "top 85%",
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
            overwrite: true,
          }),
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={rootRef} className="px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <span className="flagship-reveal font-mono-label translate-y-3 text-xs text-accent opacity-0">
          Flagship Work
        </span>

        <div className="mt-4 grid gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          {/* Left: narrative */}
          <div className="flagship-reveal translate-y-3 opacity-0">
            <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <h2 className="text-3xl font-medium tracking-tight sm:text-4xl">
                {caseStudy.role}
              </h2>
              <a
                href={caseStudy.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xl text-accent transition-colors hover:text-foreground"
              >
                {caseStudy.company}
                <ArrowUpRight size={18} weight="bold" />
              </a>
            </div>

            <p className="mt-6 text-lg leading-relaxed text-foreground-muted">
              {caseStudy.summary}
            </p>

            <div className="mt-8 flex flex-col gap-5">
              {caseStudy.highlights.map((h) => (
                <div key={h.title}>
                  <h3 className="text-sm font-semibold text-foreground">
                    {h.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-foreground-muted">
                    {h.body}
                  </p>
                </div>
              ))}
            </div>

            {/* Architecture strip */}
            <div className="mt-10 flex flex-wrap items-center gap-2">
              {caseStudy.architecture.map((node, i) => {
                const Icon =
                  ARCHITECTURE_ICONS[
                    node.icon as keyof typeof ARCHITECTURE_ICONS
                  ];
                return (
                  <div key={node.label} className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 rounded-full border border-border bg-background-elevated px-3 py-1.5">
                      <Icon size={14} weight="light" className="text-accent" />
                      <span className="text-xs text-foreground">
                        {node.label}
                      </span>
                      {node.note ? (
                        <span className="font-mono text-[10px] text-foreground-muted">
                          ({node.note})
                        </span>
                      ) : null}
                    </div>
                    {i < caseStudy.architecture.length - 1 ? (
                      <span className="text-foreground-muted/50">
                        &rarr;
                      </span>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: real product screenshots */}
          <div className="flagship-reveal translate-y-3 opacity-0">
            <div className="overflow-hidden rounded-2xl border border-border bg-background-elevated shadow-2xl shadow-black/40">
              <div className="flex items-center gap-1.5 border-b border-border px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-foreground-muted/30" />
                <span className="h-2.5 w-2.5 rounded-full bg-foreground-muted/30" />
                <span className="h-2.5 w-2.5 rounded-full bg-foreground-muted/30" />
                <span className="ml-2 font-mono text-[11px] text-foreground-muted">
                  gomagnet.ai
                </span>
              </div>
              <Image
                src={caseStudy.screenshots[active].src}
                alt={`Magnet AI - ${caseStudy.screenshots[active].label}`}
                width={1440}
                height={900}
                className="w-full"
                priority={active === 0}
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {caseStudy.screenshots.map((shot, i) => (
                <button
                  key={shot.label}
                  type="button"
                  onClick={() => setActive(i)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                    active === i
                      ? "border-accent/50 bg-accent/10 text-white"
                      : "border-border bg-background-elevated text-foreground-muted hover:text-foreground"
                  }`}
                >
                  {shot.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
