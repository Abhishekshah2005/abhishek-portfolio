"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";

/* ------------------------------------------------------------------
   Shared motion kit — the reel's rhythm section. Every chapter pulls
   from here so the whole site moves as one instrument.
------------------------------------------------------------------ */

/** Mask-reveals each line of a heading as it scrolls into view. */
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
 * Scroll-velocity smear: the element skews with how hard you're scrolling
 * and settles when you stop. Attach to big type or the reel track.
 */
export function useVelocitySkew<T extends HTMLElement>(factor = 0.55, max = 8) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();
  const { velocity } = useSmoothScroll();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const setSkew = gsap.quickSetter(el, "skewY", "deg");
    let current = 0;

    const tick = () => {
      const target = gsap.utils.clamp(-max, max, velocity() * factor);
      current += (target - current) * 0.11;
      setSkew(current);
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      gsap.set(el, { skewY: 0 });
    };
  }, [reduced, factor, max, velocity]);

  return ref;
}

/**
 * Infinite type band riding the scroll: velocity feeds its speed and skew,
 * and scrolling upward runs it backwards.
 */
export function Marquee({
  text,
  className = "",
  speed = 90,
  outline = false,
}: {
  text: string;
  className?: string;
  speed?: number;
  outline?: boolean;
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
      const boost = gsap.utils.clamp(-340, 560, v * 28);
      x -= ((speed + boost) * deltaTime) / 1000;

      const half = track.scrollWidth / 2;
      if (half > 0) {
        while (x <= -half) x += half;
        while (x > 0) x -= half;
      }
      setX(x);
      setSkew(gsap.utils.clamp(-10, 10, v * 0.85));
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
    };
  }, [reduced, speed, velocity]);

  const copy = Array.from({ length: 6 }, () => text).join("  ");
  const lineClass = `shrink-0 pr-12 font-display text-5xl font-semibold tracking-[-0.02em] whitespace-nowrap uppercase md:text-7xl ${
    outline ? "text-outline" : "text-cream"
  }`;

  if (reduced) {
    return (
      <div
        className={`overflow-hidden border-y border-[var(--line)] py-5 md:py-7 ${className}`}
      >
        <p className={`${lineClass} truncate`}>{text}</p>
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className={`overflow-hidden border-y border-[var(--line)] py-5 md:py-7 ${className}`}
    >
      <div ref={trackRef} className="flex w-max will-change-transform">
        <span className={lineClass}>{copy}</span>
        <span className={lineClass}>{copy}</span>
      </div>
    </div>
  );
}

/** Hairline page-progress bar, lime, pinned to the very top. */
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
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-lime"
      style={{ transform: "scaleX(0)" }}
    />
  );
}
