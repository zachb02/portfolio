"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { skillGroups } from "@/lib/resume-data";

gsap.registerPlugin(ScrollTrigger);

export function SkillsGrid() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!rootRef.current) return;

    if (reduceMotion) {
      gsap.set(".skill-tag", { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      ScrollTrigger.batch(".skill-tag", {
        start: "top 90%",
        onEnter: (batch) =>
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.04,
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

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {skillGroups.map((group) => (
            <div key={group.label}>
              <h3 className="font-mono-label text-xs text-accent">
                {group.label}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.skills.map((skill) => (
                  <span
                    key={skill}
                    className="skill-tag translate-y-3 rounded-lg border border-border bg-background-elevated px-3 py-1.5 text-sm text-foreground opacity-0 transition-colors hover:border-accent/40"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
