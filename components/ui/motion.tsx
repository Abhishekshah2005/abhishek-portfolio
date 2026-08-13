"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";

/* ------------------------------------------------------------------
   Shared motion kit — the reel's rhythm section. Every chapter pulls
   from here so the whole site moves as one instrument.
------------------------------------------------------------------ */

/**
 * Mask-reveals each line of a heading as it scrolls into view — slides up
 * out of its mask while pulling into focus (blur + a touch of scale settle
 * out). `filter`/`transform` only, deliberately: no colour is involved in
 * this tween, which matters in this codebase specifically — see the
 * Manifesto fix in git history for why a GSAP colour tween reading an
 * oklab() value (which is what Tailwind's arbitrary-opacity utilities
 * compile to in v4) silently does nothing.
 *
 * `masked = false` skips SplitText's overflow-hidden wrapper around each
 * line. Needed for any heading containing an AccentShimmer child: that
 * component's `display: inline-block` makes SplitText's line-box
 * measurement land a few px narrower than the text actually renders — fine
 * normally, but AccentShimmer's own moving background then gets clipped at
 * that edge permanently (confirmed live: an isolated single word like
 * "email" was still ~8px clipped). The reveal itself doesn't depend on the
 * mask — it's a transform+blur tween, not a wipe — so dropping it trades a
 * very slightly less clean ~1s intro for correct shimmer rendering for the
 * rest of the page's life.
 */
export function useLineReveal<T extends HTMLElement>(start = "top 82%", masked = true) {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      // No `ignore` here, deliberately: unlike word-level splitting (see
      // Hero.tsx), line-level splitting already preserves a nested
      // AccentShimmer intact without it — verified live. Adding `ignore`
      // was tried and made things worse: for line-only splitting it
      // unwraps the ignored element and merges its text as plain string
      // content instead of preserving the element, silently discarding the
      // shimmer entirely (confirmed live: "Companies" rendered as
      // plain text, its `<span>` gone from the DOM).
      split = new SplitText(el, masked ? { type: "lines", mask: "lines" } : { type: "lines" });
      gsap.from(split.lines, {
        yPercent: 112,
        scale: 1.045,
        filter: "blur(14px)",
        transformOrigin: "left bottom",
        duration: 1.25,
        stagger: 0.09,
        ease: "expo.out",
        // Replays every time this heading crosses into view, in either
        // scroll direction — a one-shot reveal is invisible the second
        // time you pass it, which reads as "nothing happening" on a scan.
        scrollTrigger: { trigger: el, start, toggleActions: "restart none restart reverse" },
      });
    }, el);

    return () => {
      split?.revert();
      ctx.revert();
    };
  }, [reduced, start, masked]);

  return ref;
}

/**
 * A short hairline that draws itself in (scaleX 0 → 1) as it scrolls into
 * view — the "chapter mark" that now sits beside every "0N — Label" kicker,
 * echoing the same tick shape the chapter rail uses for its active dot.
 */
export function useLineDraw<T extends HTMLElement>(start = "top 88%") {
  const ref = useRef<T>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { scaleX: 0 },
        {
          scaleX: 1,
          duration: 0.8,
          ease: "expo.out",
          scrollTrigger: { trigger: el, start, toggleActions: "restart none restart reverse" },
        },
      );
    });

    return () => ctx.revert();
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

/** Hairline page-progress bar, blue, pinned to the very top. */
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
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-lime shadow-[0_0_12px_1px_rgba(63,208,255,0.65)]"
      style={{ transform: "scaleX(0)" }}
    />
  );
}
