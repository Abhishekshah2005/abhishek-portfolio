'use client';

import { useRef } from 'react';
import { useEngine } from '@/hooks/useEngine';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { TickPriority } from '@/types';

export interface UseParallaxOptions {
  /** Positive = moves slower than scroll, negative = faster/opposite. */
  speed?: number;
  /** Axis to translate along. */
  axis?: 'x' | 'y';
}

/**
 * Depth parallax — translates an element relative to its distance from the
 * viewport centre. Runs on the ticker (reading a cached scroll offset) so it
 * stays in sync with Lenis' smoothing. Collapses to static under reduced
 * motion.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(
  options: UseParallaxOptions = {},
) {
  const engine = useEngine();
  const ref = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || engine.animation.reducedMotion) return;

    const speed = options.speed ?? 0.2;
    const axis = options.axis ?? 'y';

    const removeTick = engine.ticker.add(() => {
      const rect = el.getBoundingClientRect();
      const viewport = axis === 'y' ? window.innerHeight : window.innerWidth;
      const center = axis === 'y' ? rect.top + rect.height / 2 : rect.left + rect.width / 2;
      const offset = (center - viewport / 2) * -speed;
      el.style.transform =
        axis === 'y'
          ? `translate3d(0, ${offset.toFixed(2)}px, 0)`
          : `translate3d(${offset.toFixed(2)}px, 0, 0)`;
    }, TickPriority.Animation);

    return () => {
      removeTick();
      el.style.transform = '';
    };
  }, [engine, options.speed, options.axis]);

  return ref;
}
