'use client';

import { useRef } from 'react';
import { useEngine } from '@/hooks/useEngine';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

export interface UseSpotlightOptions {
  /** CSS custom property names to write the pointer position into. */
  varX?: string;
  varY?: string;
}

/**
 * Writes the pointer's position (relative to the element, as 0-1 and px) into
 * CSS custom properties so a radial-gradient spotlight can follow the cursor
 * purely in CSS. Updates only while the pointer is over the element.
 */
export function useSpotlight<T extends HTMLElement = HTMLDivElement>(
  options: UseSpotlightOptions = {},
) {
  const engine = useEngine();
  const ref = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const varX = options.varX ?? '--spot-x';
    const varY = options.varY ?? '--spot-y';

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      el.style.setProperty(varX, `${x}px`);
      el.style.setProperty(varY, `${y}px`);
      el.style.setProperty(`${varX}-pct`, `${(x / rect.width) * 100}%`);
      el.style.setProperty(`${varY}-pct`, `${(y / rect.height) * 100}%`);
    };

    el.addEventListener('pointermove', onMove, { passive: true });
    return () => el.removeEventListener('pointermove', onMove);
  }, [engine, options.varX, options.varY]);

  return ref;
}
