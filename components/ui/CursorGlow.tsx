"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { pointer } from "@/lib/pointer";
import { useFinePointer } from "@/lib/hooks";

/**
 * A soft blue glow that follows the cursor everywhere on the page, screen-
 * blended so it lightens whatever's beneath it rather than sitting on top
 * as a flat shape — on the coal background that reads as ambient light
 * pooling around wherever you're pointing.
 *
 * Deliberately NOT gated behind reduced-motion: everything else that's
 * gated is autoplaying/scroll-triggered decorative motion, which is what
 * that preference is about. This only ever moves in direct 1:1 response to
 * the visitor's own cursor — closer to a hover state than an animation.
 *
 * Written straight to the DOM via setProperty rather than through GSAP:
 * a CSS custom property carrying a raw px value has no ambiguity to
 * misparse, and this runs every frame, so skipping GSAP's own property
 * dispatch here is one less thing to reason about at that frequency.
 */
export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || !fine) return;

    const tick = () => {
      if (!pointer.active) return;
      if (!live) setLive(true);
      el.style.setProperty("--gx", `${pointer.x}px`);
      el.style.setProperty("--gy", `${pointer.y}px`);
    };

    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
    // `live` is intentionally excluded — this loop only ever needs to flip
    // it once, and re-subscribing the ticker on every state change it
    // causes would be pointless churn.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fine]);

  if (!fine) return null;

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none fixed inset-0 z-30 transition-opacity duration-700 ${
        live ? "opacity-100" : "opacity-0"
      }`}
      style={{
        background:
          "radial-gradient(720px circle at var(--gx, 50%) var(--gy, 50%), rgba(63,208,255,0.22), rgba(63,208,255,0.05) 45%, transparent 70%)",
        mixBlendMode: "screen",
      }}
    />
  );
}
