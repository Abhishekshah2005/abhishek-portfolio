"use client";

import { cloneElement, useEffect, useRef, type ReactElement } from "react";
import { gsap } from "@/lib/gsap";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";

type Props = {
  children: ReactElement<{ ref?: React.Ref<HTMLElement> }>;
  /** How far the element is allowed to be pulled, as a fraction of its size. */
  strength?: number;
  /** Distance in px around the element that counts as "near". */
  radius?: number;
};

/**
 * Pulls its child toward the cursor when the cursor is near, then springs back.
 *
 * The pull is clamped so the element never leaves its own hit box — otherwise
 * you get the classic bug where the button runs away from the click.
 */
export function Magnetic({ children, strength = 0.32, radius = 120 }: Props) {
  const ref = useRef<HTMLElement>(null);
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

    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    el.addEventListener("pointerleave", onLeave);

    return () => {
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(el);
    };
  }, [fine, reduced, strength, radius]);

  return cloneElement(children, { ref });
}
