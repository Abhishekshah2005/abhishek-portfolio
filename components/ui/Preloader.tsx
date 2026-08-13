"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks";
import { person } from "@/lib/content";

/**
 * Opening: black frame, a counter, then a blue flash-wipe that hands the
 * screen to the hero. Under two seconds — a title card, not a wait.
 */
export function Preloader({ onDone }: { onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const [gone, setGone] = useState(false);
  const reduced = useReducedMotion();

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

    // The timeline runs on animation frames, which a background tab
    // suspends outright. Wall-clock is the backstop: nothing gets to
    // leave someone staring at a black rectangle.
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
      duration: 1.3,
      ease: "power2.inOut",
      onUpdate: () => {
        count.textContent = String(Math.round(progress.value)).padStart(3, "0");
      },
    })
      // Blue slams up over the black…
      .to("[data-pre-flash]", {
        scaleY: 1,
        duration: 0.45,
        ease: "expo.inOut",
      })
      // …then the whole card lifts away, revealing the hero.
      .to(root, { yPercent: -100, duration: 0.7, ease: "expo.inOut" }, "+=0.05");

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
      className="fixed inset-0 z-[1000] overflow-hidden bg-coal"
      aria-hidden
    >
      <div
        data-pre-flash
        className="absolute inset-0 origin-bottom scale-y-0 bg-lime"
      />
      <div className="relative flex h-full w-full flex-col justify-between p-6 md:p-10">
        <span className="font-mono text-[11px] tracking-[0.24em] text-cream-2 uppercase">
          {person.name} — portfolio
        </span>
        <span className="self-end font-display text-[20vw] leading-[0.8] font-semibold text-cream md:text-[10vw]">
          <span ref={countRef}>000</span>
        </span>
      </div>
    </div>
  );
}
