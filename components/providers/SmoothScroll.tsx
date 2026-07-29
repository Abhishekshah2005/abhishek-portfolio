"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { bindPointer, updatePointer } from "@/lib/pointer";
import { useReducedMotion } from "@/lib/hooks";

type ScrollCtx = {
  lenis: Lenis | null;
  /** 0..1 through the whole document */
  progress: () => number;
  /** signed scroll velocity, useful for motion-blur style effects */
  velocity: () => number;
  scrollTo: (target: string | number | HTMLElement, offset?: number) => void;
};

const Ctx = createContext<ScrollCtx>({
  lenis: null,
  progress: () => 0,
  velocity: () => 0,
  scrollTo: () => {},
});

export const useSmoothScroll = () => useContext(Ctx);

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);
  const stateRef = useRef({ progress: 0, velocity: 0 });
  const [, force] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    // Reduced motion: leave native scrolling completely alone.
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
      // Let genuinely-scrollable inner panes (code blocks, overflow lists) win.
      prevent: (node) => node.hasAttribute?.("data-lenis-prevent"),
    });
    lenisRef.current = lenis;
    force((n) => n + 1);

    lenis.on("scroll", (e: Lenis) => {
      stateRef.current.progress = e.progress;
      stateRef.current.velocity = e.velocity;
      ScrollTrigger.update();
    });

    const unbindPointer = bindPointer();

    // ONE requestAnimationFrame for the site. GSAP owns it; Lenis and the
    // pointer easing ride along. Anything else that needs a frame uses
    // gsap.ticker.add too — never its own rAF loop.
    const tick = (time: number) => {
      lenis.raf(time * 1000);
      updatePointer();
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    // ScrollTrigger measures against Lenis rather than the scroll container.
    ScrollTrigger.scrollerProxy(document.documentElement, {
      scrollTop(value) {
        if (arguments.length && typeof value === "number") {
          lenis.scrollTo(value, { immediate: true });
        }
        return lenis.scroll;
      },
      getBoundingClientRect: () => ({
        top: 0,
        left: 0,
        width: window.innerWidth,
        height: window.innerHeight,
      }),
    });

    // Late-loading fonts and images change layout; re-measure when they land.
    const refresh = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("load", refresh);
      unbindPointer();
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [reduced]);

  useEffect(() => {
    if (!reduced) return;
    // Still need pointer data for the cursor even without smooth scroll.
    const unbind = bindPointer();
    const tick = () => updatePointer(0.2);
    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      unbind();
    };
  }, [reduced]);

  const value: ScrollCtx = {
    lenis: lenisRef.current,
    progress: () => stateRef.current.progress,
    velocity: () => stateRef.current.velocity,
    scrollTo: (target, offset = 0) => {
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.scrollTo(target, { offset, duration: 1.4 });
        return;
      }
      const el =
        typeof target === "string" ? document.querySelector(target) : target;
      if (el instanceof HTMLElement) {
        window.scrollTo({ top: el.offsetTop + offset, behavior: "smooth" });
      } else if (typeof target === "number") {
        window.scrollTo({ top: target + offset, behavior: "smooth" });
      }
    },
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}
