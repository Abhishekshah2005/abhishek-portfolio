"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { pointer } from "@/lib/pointer";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";

type CursorState = { scale: number; label: string; invert: boolean };

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
  const [state, setState] = useState<CursorState>({
    scale: 1,
    label: "",
    invert: false,
  });

  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const enabled = fine && !reduced;

  useEffect(() => {
    if (!enabled) return;
    document.documentElement.classList.add("has-custom-cursor");
    return () => document.documentElement.classList.remove("has-custom-cursor");
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // quickTo interpolates internally, so we can feed it raw values every
    // frame without stacking tweens.
    const dotX = gsap.quickTo(dot, "x", { duration: 0.12, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.12, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.55, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.55, ease: "power3.out" });

    const tick = () => {
      dotX(pointer.x);
      dotY(pointer.y);
      ringX(pointer.x);
      ringY(pointer.y);
    };
    gsap.ticker.add(tick);

    // Reveal only once the pointer has actually moved, so the cursor never
    // sits parked in the top-left corner on load.
    const reveal = () => {
      gsap.to([dot, ring], { autoAlpha: 1, duration: 0.4, overwrite: true });
      window.removeEventListener("pointermove", reveal);
    };
    window.addEventListener("pointermove", reveal);

    const onOver = (e: PointerEvent) => {
      const target = (e.target as Element | null)?.closest?.(
        "[data-cursor], a, button, input, textarea, select, [role='button']",
      ) as HTMLElement | null;

      if (!target) {
        setState({ scale: 1, label: "", invert: false });
        return;
      }
      const raw = target.getAttribute("data-cursor");
      const scaleAttr = target.getAttribute("data-cursor-scale");
      setState({
        scale: scaleAttr ? Number(scaleAttr) : raw ? 2.6 : 1.9,
        label: raw && raw !== "true" ? raw : "",
        invert: target.hasAttribute("data-cursor-invert"),
      });
    };

    const onDown = () => gsap.to(ring, { scale: 0.82, duration: 0.2, overwrite: "auto" });
    const onUp = () => gsap.to(ring, { scale: 1, duration: 0.35, overwrite: "auto" });

    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", reveal);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [enabled]);

  // Ring size/label changes are a React concern; position is not.
  useEffect(() => {
    if (!enabled || !ringRef.current) return;
    gsap.to(ringRef.current, {
      width: 34 * state.scale,
      height: 34 * state.scale,
      duration: 0.5,
      ease: "expo.out",
      overwrite: "auto",
    });
  }, [state.scale, enabled]);

  if (!enabled) return null;

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[100] hidden md:block"
    >
      <div
        ref={ringRef}
        className="invisible absolute top-0 left-0 flex h-[34px] w-[34px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-ink/25 backdrop-blur-[1px] will-change-transform"
        style={{ marginLeft: "-17px", marginTop: "-17px" }}
      >
        <span className="font-sans text-[10px] font-medium tracking-[0.08em] text-ink uppercase">
          {state.label}
        </span>
      </div>
      <div
        ref={dotRef}
        className="invisible absolute top-0 left-0 h-[6px] w-[6px] rounded-full bg-blue will-change-transform"
        style={{ marginLeft: "-3px", marginTop: "-3px" }}
      />
    </div>
  );
}
