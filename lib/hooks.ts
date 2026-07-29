"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore } from "react";

/** useLayoutEffect that doesn't warn during SSR. */
export const useIsoLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

/** Subscribe a component to a media query without setState-in-effect. */
function useMediaQuery(query: string, serverValue: boolean) {
  const subscribe = (onChange: () => void) => {
    const mq = window.matchMedia(query);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  };

  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => serverValue,
  );
}

/**
 * Live `prefers-reduced-motion`. Defaults to `true` on the server so the
 * first paint never commits to a frame of motion we'd have to undo.
 */
export function useReducedMotion() {
  return useMediaQuery("(prefers-reduced-motion: reduce)", true);
}

/** True when the device has a real pointer (mouse/trackpad). */
export function useFinePointer() {
  return useMediaQuery("(pointer: fine)", false);
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

/**
 * Coarse device tier so heavy scenes can scale themselves down.
 *
 * Computed once and cached: the answer can't change during a session, and a
 * stable snapshot is what useSyncExternalStore requires.
 */
type Tier = "low" | "mid" | "high";
let cachedTier: Tier | null = null;

function readTier(): Tier {
  if (cachedTier) return cachedTier;

  const cores = navigator.hardwareConcurrency ?? 4;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory;
  const coarse = window.matchMedia("(pointer: coarse)").matches;

  if (coarse || cores <= 4 || (mem !== undefined && mem <= 4)) cachedTier = "low";
  else if (cores >= 8) cachedTier = "high";
  else cachedTier = "mid";

  return cachedTier;
}

const noopSubscribe = () => () => {};

export function useDeviceTier(): Tier {
  return useSyncExternalStore(noopSubscribe, readTier, () => "mid");
}
