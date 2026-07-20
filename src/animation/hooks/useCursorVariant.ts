'use client';

import { useRef } from 'react';
import { useEngine } from '@/hooks/useEngine';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import type { CursorVariant } from '@/engine/managers/CursorManager';

export interface UseCursorVariantOptions {
  variant?: CursorVariant;
  label?: string;
}

/**
 * Switch the custom cursor to a variant while hovering an element, restoring
 * the default on leave. Also mirrors hover state into the InteractionManager
 * so audio/analytics can react to the same signal.
 */
export function useCursorVariant<T extends HTMLElement = HTMLElement>(
  options: UseCursorVariantOptions = {},
) {
  const engine = useEngine();
  const ref = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const variant = options.variant ?? 'hover';
    const id = el.id || `cursor-${Math.round(el.getBoundingClientRect().width)}`;

    const onEnter = () => {
      engine.cursor.setVariant(variant, options.label ?? null);
      engine.interaction.setHovered(id);
    };
    const onLeave = () => {
      engine.cursor.setVariant('default');
      engine.interaction.setHovered(null);
    };

    el.addEventListener('pointerenter', onEnter);
    el.addEventListener('pointerleave', onLeave);
    return () => {
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointerleave', onLeave);
    };
  }, [engine, options.variant, options.label]);

  return ref;
}
