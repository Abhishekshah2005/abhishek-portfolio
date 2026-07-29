"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap } from "@/lib/gsap";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";

type Props = {
  children: ReactNode;
  /** How hard the element is pulled toward the cursor. */
  strength?: number;
  /** Distance in px around the element that counts as "near". */
  radius?: number;
  className?: string;
};

/**
 * Pulls its child toward the cursor when the cursor is near, then springs
 * back. The pull is clamped so the element never runs away from the click.
 *
 * Renders its own inline-block wrapper rather than cloning the child, so it
 * composes with anything and never fights over refs.
 */
export function Magnetic({
  children,
  strength = 0.32,
  radius = 120,
  className = "",
}: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !fine || reduced) return;

    const xTo = gsap.quickTo(el, "x", {
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });
    const yTo = gsap.quickTo(el, "y", {
      duration: 0.6,
      ease: "elastic.out(1, 0.4)",
    });

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;

      if (Math.hypot(dx, dy) > Math.max(r.width, r.height) / 2 + radius) {
        xTo(0);
        yTo(0);
        return;
      }
      xTo(dx * strength);
      yTo(dy * strength);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      gsap.killTweensOf(el);
    };
  }, [fine, reduced, strength, radius]);

  return (
    <span ref={ref} className={`inline-block will-change-transform ${className}`}>
      {children}
    </span>
  );
}
