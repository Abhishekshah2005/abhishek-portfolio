"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks";

/**
 * A huge outlined chapter numeral parked in the top-right of a section,
 * drifting slowly against scroll for a sense of depth behind the content.
 * Mount as the first child of a `relative overflow-hidden` section — normal-
 * flow siblings always paint over a negative-z-index child regardless of
 * DOM order, so it never needs to sit *after* the real content to stay
 * behind it.
 *
 * Position only, never colour: the parallax tween's FROM/TO state is a
 * plain transform, not a CSS custom-property colour GSAP's tween parser
 * would choke on (see the Manifesto fix in git history for why that matters
 * in this codebase specifically).
 */
export function SectionNumeral({ n }: { n: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    const section = el?.closest("section");
    if (!el || !section || reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { yPercent: 10 },
        {
          yPercent: -10,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.6,
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
      className="pointer-events-none absolute top-0 right-0 -z-10 hidden -translate-y-[6%] translate-x-[8%] font-display text-[26vw] leading-none font-bold tracking-[-0.05em] text-transparent select-none sm:block md:text-[16vw]"
      style={{ WebkitTextStroke: "1.5px rgba(242,241,236,0.07)" }}
    >
      {n}
    </span>
  );
}
