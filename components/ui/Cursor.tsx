"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { pointer } from "@/lib/pointer";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";

/**
 * The reel cursor: a single dot in difference blend, so it inverts whatever
 * it crosses — cream on the black stage, black over lime. Grows over
 * anything interactive (`a`, `button`, or an explicit `data-cursor`).
 *
 * One element, one blend mode, no labels — on a dark site the cursor should
 * behave like a light meter, not a tooltip.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;

  // The native cursor is hidden only once ours is live and positioned —
  // if anything here fails, the visitor keeps a real cursor.
  useEffect(() => {
    if (!enabled || !live) return;
    document.documentElement.classList.add("has-custom-cursor");
    return () => document.documentElement.classList.remove("has-custom-cursor");
  }, [enabled, live]);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    if (!dot) return;

    let xTo: ((v: number) => void) | null = null;
    let yTo: ((v: number) => void) | null = null;

    // Wait for a real pointer position before showing anything.
    const start = (e: PointerEvent) => {
      gsap.set(dot, { x: e.clientX, y: e.clientY });
      xTo = gsap.quickTo(dot, "x", { duration: 0.16, ease: "power3.out" });
      yTo = gsap.quickTo(dot, "y", { duration: 0.16, ease: "power3.out" });
      setLive(true);
      window.removeEventListener("pointermove", start);
    };
    window.addEventListener("pointermove", start);

    const tick = () => {
      xTo?.(pointer.x);
      yTo?.(pointer.y);
    };
    gsap.ticker.add(tick);

    const onOver = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest?.(
        "[data-cursor], a, button, input, textarea, select, [role='button']",
      );
      // Scale and position are separate transform channels — "auto"
      // overwrite here can never kill the position tweens.
      gsap.to(dot, {
        scale: target ? 4.5 : 1,
        duration: 0.45,
        ease: "expo.out",
        overwrite: "auto",
      });
    };

    const onDown = () =>
      gsap.to(dot, { scale: 0.7, duration: 0.18, overwrite: "auto" });
    const onUp = () =>
      gsap.to(dot, { scale: 1, duration: 0.3, overwrite: "auto" });

    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", start);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      gsap.killTweensOf(dot);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[100] hidden mix-blend-difference transition-opacity duration-300 md:block ${
        live ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        ref={dotRef}
        className="absolute top-0 left-0 h-3 w-3 rounded-full bg-white will-change-transform"
        style={{ marginLeft: "-6px", marginTop: "-6px" }}
      />
    </div>
  );
}
