"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { profile } from "@/lib/resume-data";

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (!rootRef.current) return;

    const ctx = gsap.context(() => {
      if (reduceMotion) {
        gsap.set(
          [".hero-badge", ".hero-word", ".hero-sub", ".hero-meta"],
          { opacity: 1, y: 0 }
        );
        return;
      }

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-badge", { opacity: 0, y: 12, duration: 0.6 })
        .from(
          ".hero-word",
          { opacity: 0, y: "1.1em", duration: 0.9, stagger: 0.08 },
          "-=0.3"
        )
        .from(".hero-sub", { opacity: 0, y: 16, duration: 0.7 }, "-=0.5")
        .from(".hero-meta", { opacity: 0, y: 12, duration: 0.6 }, "-=0.4");

      gsap.to(".hero-glow", {
        x: 40,
        y: -30,
        duration: 8,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[100dvh] items-center overflow-hidden px-6 pt-24"
    >
      <div
        className="hero-glow pointer-events-none absolute -top-40 -left-40 h-[520px] w-[520px] rounded-full bg-accent/10 blur-[140px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.15]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(244,244,245,0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(244,244,245,0.15) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "radial-gradient(ellipse 60% 60% at 30% 20%, black, transparent)",
        }}
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-6xl">
        <div className="hero-badge mb-8 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/5 px-4 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:animate-none" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
          </span>
          <span className="font-mono-label text-xs text-accent">
            {profile.availability}
          </span>
        </div>

        <h1 className="max-w-4xl overflow-hidden text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
          <span className="block overflow-hidden">
            <span className="hero-word inline-block">Building</span>{" "}
            <span className="hero-word inline-block">software</span>{" "}
            <span className="hero-word inline-block text-accent">and</span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-word inline-block">the</span>{" "}
            <span className="hero-word inline-block">agents</span>{" "}
            <span className="hero-word inline-block">that</span>{" "}
            <span className="hero-word inline-block">ship</span>{" "}
            <span className="hero-word inline-block">it.</span>
          </span>
        </h1>

        <p className="hero-sub mt-8 max-w-xl text-lg leading-relaxed text-foreground-muted">
          {profile.tagline}
        </p>

        <div className="hero-meta mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-xs text-foreground-muted">
          <span>{profile.location}</span>
          <span className="hidden h-1 w-1 rounded-full bg-foreground-muted/50 sm:block" />
          <span>{profile.education.school}</span>
        </div>
      </div>
    </section>
  );
}
