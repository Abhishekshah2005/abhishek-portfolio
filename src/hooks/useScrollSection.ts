'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { useEngineOptional } from './useEngine';
import { TickPriority } from '@/types';

export interface UseInViewOptions {
  /** Visible fraction required to count as in view (0–1). */
  amount?: number;
  /** Latch true after first entry. */
  once?: boolean;
  rootMargin?: string;
}

/** IntersectionObserver-based visibility flag (re-renders only on change). */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {},
): { ref: RefObject<T | null>; inView: boolean } {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        } else if (!options.once) {
          setInView(false);
        }
      },
      { threshold: options.amount ?? 0, rootMargin: options.rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [options.amount, options.once, options.rootMargin]);

  return { ref, inView };
}

/**
 * Per-section scroll progress. `progress` (0→1 as the section travels through
 * the viewport) is written to a ref every engine frame — read it inside your
 * own tick/animation to avoid per-frame React re-renders. `inView` is reactive.
 */
export function useScrollSection<T extends HTMLElement = HTMLElement>(
  onProgress?: (progress: number) => void,
): { ref: RefObject<T | null>; progress: RefObject<number>; inView: boolean } {
  const engine = useEngineOptional();
  const ref = useRef<T | null>(null);
  const progress = useRef(0);
  const [inView, setInView] = useState(false);
  const cb = useRef(onProgress);
  cb.current = onProgress;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0 });
    io.observe(el);

    const compute = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 when the section's top hits the bottom of the viewport,
      // 1 when its bottom leaves the top.
      const p = (vh - rect.top) / (vh + rect.height);
      progress.current = Math.max(0, Math.min(1, p));
      cb.current?.(progress.current);
    };

    let removeTick: (() => void) | undefined;
    if (engine) removeTick = engine.ticker.add(compute, TickPriority.Scroll);
    else {
      window.addEventListener('scroll', compute, { passive: true });
      compute();
    }

    return () => {
      io.disconnect();
      removeTick?.();
      window.removeEventListener('scroll', compute);
    };
  }, [engine]);

  return { ref, progress, inView };
}
