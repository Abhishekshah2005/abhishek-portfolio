'use client';

import { useRef } from 'react';
import { useEngine } from '@/hooks/useEngine';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { Spring, SPRING_PRESETS } from '@/engine/physics';
import { TickPriority } from '@/types';

export interface UseTiltOptions {
  /** Max tilt angle in degrees. */
  max?: number;
  /** Perspective distance in px. */
  perspective?: number;
  /** Scale applied while hovering. */
  scale?: number;
}

/**
 * 3D pointer tilt — the element rotates toward the cursor on two axes with a
 * spring, returning to flat on leave. Ideal for project cards. No-op under
 * reduced-motion.
 */
export function useTilt<T extends HTMLElement = HTMLDivElement>(options: UseTiltOptions = {}) {
  const engine = useEngine();
  const ref = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || engine.animation.reducedMotion) return;

    const max = options.max ?? engine.config.interaction.maxTilt;
    const perspective = options.perspective ?? 800;
    const targetScale = options.scale ?? 1.02;

    const rotX = new Spring(0, SPRING_PRESETS.gentle);
    const rotY = new Spring(0, SPRING_PRESETS.gentle);
    const scale = new Spring(1, SPRING_PRESETS.gentle);

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      rotY.setTarget(px * max);
      rotX.setTarget(-py * max);
    };

    const onEnter = () => scale.setTarget(targetScale);
    const onLeave = () => {
      rotX.setTarget(0);
      rotY.setTarget(0);
      scale.setTarget(1);
    };

    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);

    const removeTick = engine.ticker.add((state) => {
      const rx = rotX.update(state.delta);
      const ry = rotY.update(state.delta);
      const s = scale.update(state.delta);
      el.style.transform = `perspective(${perspective}px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg) scale(${s.toFixed(3)})`;
    }, TickPriority.Animation);

    return () => {
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
      removeTick();
      el.style.transform = '';
    };
  }, [engine, options.max, options.perspective, options.scale]);

  return ref;
}
