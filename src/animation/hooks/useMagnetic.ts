'use client';

import { useRef } from 'react';
import { useEngine } from '@/hooks/useEngine';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { Spring, SPRING_PRESETS } from '@/engine/physics';
import { TickPriority } from '@/types';

export interface UseMagneticOptions {
  /** Pull factor 0-1 (fraction of the cursor offset the element follows). */
  strength?: number;
  /** Extra padding around the element that still triggers the pull (px). */
  padding?: number;
}

/**
 * Magnetic hover — the element springs toward the cursor while it is near,
 * and snaps back on leave. Motion runs on the engine ticker with a spring for
 * organic, framerate-independent feel. Disabled under reduced-motion.
 */
export function useMagnetic<T extends HTMLElement = HTMLButtonElement>(
  options: UseMagneticOptions = {},
) {
  const engine = useEngine();
  const ref = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || engine.animation.reducedMotion) return;

    const strength = options.strength ?? engine.config.interaction.magneticStrength;
    const padding = options.padding ?? 0;
    const springX = new Spring(0, SPRING_PRESETS.stiff);
    const springY = new Spring(0, SPRING_PRESETS.stiff);

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const withinX = Math.abs(e.clientX - cx) < rect.width / 2 + padding;
      const withinY = Math.abs(e.clientY - cy) < rect.height / 2 + padding;
      if (withinX && withinY) {
        springX.setTarget((e.clientX - cx) * strength);
        springY.setTarget((e.clientY - cy) * strength);
      } else {
        springX.setTarget(0);
        springY.setTarget(0);
      }
    };

    const onLeave = () => {
      springX.setTarget(0);
      springY.setTarget(0);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave);

    const removeTick = engine.ticker.add((state) => {
      const x = springX.update(state.delta);
      const y = springY.update(state.delta);
      el.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0)`;
    }, TickPriority.Animation);

    return () => {
      window.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      removeTick();
      el.style.transform = '';
    };
  }, [engine, options.strength, options.padding]);

  return ref;
}
