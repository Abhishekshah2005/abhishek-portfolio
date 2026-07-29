"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { pointer } from "@/lib/pointer";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";

type CursorState = { scale: number; label: string };

/**
 * The site cursor: a precise dot plus a soft ring that trails behind it.
 *
 * Elements opt in by declaring `data-cursor` — either on its own (a plain
 * grow) or with a value that becomes the label inside the ring, e.g.
 * `data-cursor="view"`. `data-cursor-scale` overrides the ring size.
 */
export function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [state, setState] = useState<CursorState>({ scale: 1, label: "" });

  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;

  /**
   * The native cursor is hidden only once ours is actually on screen and
   * positioned. If anything here fails, the visitor keeps a real cursor
   * instead of being left with nothing to aim.
   */
  useEffect(() => {
    if (!enabled || !live) return;
    document.documentElement.classList.add("has-custom-cursor");
    return () => document.documentElement.classList.remove("has-custom-cursor");
  }, [enabled, live]);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let xTo: ((v: number) => void) | null = null;
    let yTo: ((v: number) => void) | null = null;
    let ringXTo: ((v: number) => void) | null = null;
    let ringYTo: ((v: number) => void) | null = null;

    // Wait for a real pointer position before showing anything, otherwise
    // the cursor visibly flies in from the top-left corner on load.
    const start = (e: PointerEvent) => {
      gsap.set([dot, ring], { x: e.clientX, y: e.clientY });

      xTo = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
      yTo = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
      ringXTo = gsap.quickTo(ring, "x", { duration: 0.5, ease: "power3.out" });
      ringYTo = gsap.quickTo(ring, "y", { duration: 0.5, ease: "power3.out" });

      setLive(true);
      window.removeEventListener("pointermove", start);
    };
    window.addEventListener("pointermove", start);

    const tick = () => {
      if (!xTo) return;
      xTo(pointer.x);
      yTo?.(pointer.y);
      ringXTo?.(pointer.x);
      ringYTo?.(pointer.y);
    };
    gsap.ticker.add(tick);

    const onOver = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest?.(
        "[data-cursor], a, button, input, textarea, select, [role='button']",
      ) as HTMLElement | null;

      if (!target) {
        setState({ scale: 1, label: "" });
        return;
      }
      const raw = target.getAttribute("data-cursor");
      const scaleAttr = target.getAttribute("data-cursor-scale");
      setState({
        scale: scaleAttr ? Number(scaleAttr) : raw ? 2.6 : 1.9,
        label: raw && raw !== "true" ? raw : "",
      });
    };

    // `scale` and `x`/`y` are separate transform channels, so "auto"
    // overwrite here can't disturb the position tweens above.
    const onDown = () =>
      gsap.to(ring, { scale: 0.82, duration: 0.2, overwrite: "auto" });
    const onUp = () =>
      gsap.to(ring, { scale: 1, duration: 0.35, overwrite: "auto" });

    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", start);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
      gsap.killTweensOf([dot, ring]);
    };
  }, [enabled]);

  // Ring size and label are React's business; position is not.
  useEffect(() => {
    if (!enabled || !ringRef.current) return;
    gsap.to(ringRef.current, {
      width: 36 * state.scale,
      height: 36 * state.scale,
      marginLeft: -18 * state.scale,
      marginTop: -18 * state.scale,
      duration: 0.5,
      ease: "expo.out",
      overwrite: "auto",
    });
  }, [state.scale, enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-[100] hidden transition-opacity duration-300 md:block ${
        live ? "opacity-100" : "opacity-0"
      }`}
    >
      <div
        ref={ringRef}
        className="absolute top-0 left-0 flex h-9 w-9 items-center justify-center rounded-full border border-ink/40 bg-paper/10 backdrop-blur-[1px] will-change-transform"
        style={{ marginLeft: "-18px", marginTop: "-18px" }}
      >
        <span className="font-sans text-[10px] font-medium tracking-[0.08em] text-ink uppercase">
          {state.label}
        </span>
      </div>
      <div
        ref={dotRef}
        className="absolute top-0 left-0 h-2 w-2 rounded-full bg-blue will-change-transform"
        style={{ marginLeft: "-4px", marginTop: "-4px" }}
      />
    </div>
  );
}
