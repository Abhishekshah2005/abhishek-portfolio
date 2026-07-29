"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

/** useLayoutEffect that doesn't warn during SSR. */
export const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/**
 * Live `prefers-reduced-motion`. Starts `true` so the very first client render
 * matches the server and never plays a frame of motion we'd have to undo.
 */
export function useReducedMotion() {
  const [reduced, setReduced] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return reduced;
}

/** True when the device has a real pointer (mouse/trackpad). */
export function useFinePointer() {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const apply = () => setFine(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return fine;
}

/**
 * Intersection flag used to park expensive WebGL chapters when they're
 * nowhere near the viewport.
 */
export function useInView<T extends HTMLElement>(rootMargin = "200px") {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return { ref, inView };
}

/** Coarse device tier so heavy scenes can scale themselves down. */
export function useDeviceTier(): "low" | "mid" | "high" {
  const [tier, setTier] = useState<"low" | "mid" | "high">("mid");

  useEffect(() => {
    const cores = navigator.hardwareConcurrency ?? 4;
    const mem = (navigator as Navigator & { deviceMemory?: number })
      .deviceMemory;
    const coarse = window.matchMedia("(pointer: coarse)").matches;

    if (coarse || cores <= 4 || (mem !== undefined && mem <= 4)) setTier("low");
    else if (cores >= 8) setTier("high");
    else setTier("mid");
  }, []);

  return tier;
}
