"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";

/* ------------------------------------------------------------------
   Shared motion primitives. Every chapter pulls from this kit so the
   whole site moves to one rhythm instead of five different ones.
------------------------------------------------------------------ */

/**
 * Mask-reveals each line of a heading as it scrolls into view.
 * Attach the returned ref to the element whose text should split.
 */
export function useLineReveal<T extends HTMLElement>(start = "top 82%") {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      split = new SplitText(el, { type: "lines", mask: "lines" });
      gsap.from(split.lines, {
        yPercent: 112,
        duration: 1.25,
        stagger: 0.09,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start },
      });
    }, el);

    return () => {
      split?.revert();
      ctx.revert();
    };
  }, [reduced, start]);

  return ref;
}

/**
 * Scroll-scrubbed "card zoom": the block arrives slightly small with
 * rounded corners and grows to full bleed as it takes the screen.
 * The classic dark-section entrance on award sites.
 */
export function useScaleIn<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scale: 0.93, borderRadius: 40 },
        {
          scale: 1,
          borderRadius: 0,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top 95%",
            end: "top 30%",
            scrub: true,
          },
        },
      );
    }, el);

    return () => ctx.revert();
  }, [reduced]);

  return ref;
}

/**
 * Giant chapter numeral drifting behind a section on scroll — depth
 * without adding a single WebGL context.
 */
export function GhostIndex({ n, dark = false }: { n: string; dark?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const parent = el.parentElement;
    if (!parent) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: 26 },
        {
          yPercent: -26,
          ease: "none",
          scrollTrigger: {
            trigger: parent,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        },
      );
    });

    return () => ctx.revert();
  }, [reduced]);

  return (
    <span
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute top-0 right-[-2vw] z-0 font-display text-[26vw] leading-[0.8] font-medium select-none ${
        dark ? "text-paper/[0.05]" : "text-ink/[0.05]"
      }`}
    >
      {n}
    </span>
  );
}

/**
 * Infinite text band that rides the scroll: your scroll velocity feeds
 * its speed and skew, and scrolling upward runs it backwards.
 */
export function Marquee({
  text,
  className = "",
  speed = 80,
}: {
  text: string;
  className?: string;
  speed?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { velocity } = useSmoothScroll();

  useEffect(() => {
    const track = trackRef.current;
    if (!track || reduced) return;

    const setX = gsap.quickSetter(track, "x", "px");
    const setSkew = gsap.quickSetter(track, "skewX", "deg");
    let x = 0;

    const tick = (_time: number, deltaTime: number) => {
      const v = velocity();
      // Scrolling down accelerates the band; scrolling up reverses it.
      const boost = gsap.utils.clamp(-320, 520, v * 26);
      x -= ((speed + boost) * deltaTime) / 1000;

      const half = track.scrollWidth / 2;
      if (half > 0) {
        while (x <= -half) x += half;
        while (x > 0) x -= half;
      }
      setX(x);
      setSkew(gsap.utils.clamp(-9, 9, v * 0.8));
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
    };
  }, [reduced, speed, velocity]);

  const copy = Array.from({ length: 6 }, () => text).join("  ");
  const lineClass =
    "shrink-0 pr-10 font-display text-3xl font-medium tracking-[-0.02em] whitespace-nowrap uppercase md:text-5xl";

  if (reduced) {
    return (
      <div
        className={`overflow-hidden border-y border-[var(--line)] py-4 md:py-6 ${className}`}
      >
        <p className={`${lineClass} truncate`}>{text}</p>
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className={`overflow-hidden border-y border-[var(--line)] py-4 md:py-6 ${className}`}
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        <span className={lineClass}>{copy}</span>
        <span className={lineClass}>{copy}</span>
      </div>
    </div>
  );
}

/** Hairline progress bar pinned to the top of the viewport. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        gsap.set(el, { scaleX: self.progress });
      },
    });
    return () => st.kill();
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-blue"
      style={{ transform: "scaleX(0)" }}
    />
  );
}
