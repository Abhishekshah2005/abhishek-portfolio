"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks";
import { person } from "@/lib/content";

/**
 * Opening curtain: a counter runs to 100 while the page settles, then the
 * slats peel away and hand off to the hero reveal.
 *
 * Reduced motion skips it entirely — there's nothing behind it worth waiting
 * for, so making someone sit through a curtain would be pure cost.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);
  const reduced = useReducedMotion();

  // Keep the callback fresh without making it a dependency of the timeline.
  const doneRef = useRef(onDone);
  useEffect(() => {
    doneRef.current = onDone;
  });

  useEffect(() => {
    if (!reduced) return;
    doneRef.current();
  }, [reduced]);

  useEffect(() => {
    if (reduced) return;
    const root = rootRef.current;
    const count = countRef.current;
    if (!root || !count) return;

    document.documentElement.classList.add("lenis-stopped");

    const finish = () => {
      document.documentElement.classList.remove("lenis-stopped");
      setGone(true);
      doneRef.current();
    };

    // The timeline runs on animation frames, which a browser will suspend
    // entirely (background tab, some low-power modes). Wall-clock time is the
    // backstop: nothing can leave someone staring at a curtain.
    const failsafe = window.setTimeout(finish, 5000);

    const progress = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        window.clearTimeout(failsafe);
        finish();
      },
    });

    tl.to(progress, {
      value: 100,
      duration: 1.6,
      ease: "power2.inOut",
      onUpdate: () => {
        count.textContent = String(Math.round(progress.value)).padStart(3, "0");
      },
    })
      .to(
        root.querySelectorAll("[data-pre-fade]"),
        { autoAlpha: 0, y: -14, duration: 0.5, stagger: 0.06 },
        "-=0.15",
      )
      .to(
        root.querySelectorAll("[data-pre-panel]"),
        {
          scaleY: 0,
          duration: 1.1,
          ease: "expo.inOut",
          stagger: { each: 0.07, from: "start" },
        },
        "-=0.2",
      );

    return () => {
      window.clearTimeout(failsafe);
      tl.kill();
      document.documentElement.classList.remove("lenis-stopped");
    };
  }, [reduced]);

  if (gone || reduced) return null;

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[1000] overflow-hidden"
      aria-hidden
    >
      {/* Vertical slats that peel away one after another. */}
      <div className="absolute inset-0 flex">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            data-pre-panel
            className="h-full flex-1 origin-top bg-ink"
          />
        ))}
      </div>

      <div className="relative flex h-full w-full items-end justify-between p-6 md:p-10">
        <span
          data-pre-fade
          className="font-display text-[11px] tracking-[0.22em] text-paper uppercase"
        >
          {person.name}
        </span>
        <span
          data-pre-fade
          className="font-display text-paper text-[18vw] leading-[0.8] tracking-tight md:text-[9vw]"
        >
          <span ref={countRef}>000</span>
        </span>
      </div>
    </div>
  );
}
