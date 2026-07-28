"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Code,
  Stack,
  Robot,
  Wrench,
  PuzzlePiece,
  type IconProps,
} from "@phosphor-icons/react";
import { skillGroups } from "@/lib/resume-data";

gsap.registerPlugin(ScrollTrigger);

const GROUP_ICONS: Record<string, React.ComponentType<IconProps>> = {
  Languages: Code,
  Frameworks: Stack,
  "AI & APIs": Robot,
  "Tools & Platforms": Wrench,
  Other: PuzzlePiece,
};

export function SkillsGrid() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!rootRef.current) return;

    if (reduceMotion) {
      gsap.set(".capability-card", { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.batch(".capability-card", {
        start: "top 90%",
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
    <section id="skills" ref={rootRef} className="relative px-6 py-32">
      <div className="mx-auto max-w-6xl">
        <h2 className="max-w-2xl text-3xl font-medium tracking-tight sm:text-4xl">
          The toolkit behind the story.
        </h2>

        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => {
            const Icon = GROUP_ICONS[group.label] ?? Code;
            return (
              <div
                key={group.label}
                className="capability-card translate-y-4 rounded-2xl border border-border bg-background-elevated p-6 opacity-0 transition-colors hover:border-accent/30"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex size-9 items-center justify-center rounded-lg border border-accent/30 bg-accent/5">
                    <Icon size={18} weight="light" className="text-accent" />
                  </span>
                  <h3 className="font-mono-label text-xs text-foreground-muted">
                    {group.label}
                  </h3>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
