'use client';

import { useRef } from 'react';
import { useEngine } from '@/hooks/useEngine';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { TickPriority } from '@/types';

export interface UseMarqueeOptions {
  /** Base speed in px/second. */
  speed?: number;
  /** Direction: 1 = left, -1 = right. */
  direction?: 1 | -1;
  /** Add scroll velocity into the marquee speed for a reactive feel. */
  reactive?: boolean;
}

/**
 * Infinite marquee driven by the engine ticker.
 *
 * Wrap a track containing duplicated content; this translates it and wraps
 * seamlessly at half-width. When `reactive`, the current scroll velocity is
 * folded into the speed so the marquee reacts to scrolling — a signature
 * award-site touch.
 */
export function useMarquee<T extends HTMLElement = HTMLDivElement>(
  options: UseMarqueeOptions = {},
) {
  const engine = useEngine();
  const ref = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const baseSpeed = options.speed ?? 60;
    const direction = options.direction ?? 1;
    const reactive = options.reactive ?? true;
    let offset = 0;

    const removeTick = engine.ticker.add((state) => {
      const half = el.scrollWidth / 2 || 1;
      const boost = reactive ? Math.abs(engine.scroll.velocity) * 4 : 0;
      offset -= (baseSpeed + boost) * direction * state.delta;
      // Wrap seamlessly.
      offset = ((offset % half) + half) % half;
      el.style.transform = `translate3d(${-offset.toFixed(2)}px, 0, 0)`;
    }, TickPriority.Animation);

    return () => {
      removeTick();
      el.style.transform = '';
    };
  }, [engine, options.speed, options.direction, options.reactive]);

  return ref;
}
