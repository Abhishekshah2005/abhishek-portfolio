'use client';

import { useEngineStore } from './useEngineStore';
import { useEngine } from './useEngine';
import { useEngineEvent } from './useEngineEvent';
import type { ScrollEventPayload } from '@/types';

export interface ScrollReadout {
  progress: number;
  velocity: number;
  direction: 1 | -1 | 0;
}

/** Reactive scroll readout (re-renders on change). Cheap via store selectors. */
export function useScroll(): ScrollReadout {
  const progress = useEngineStore((s) => s.scrollProgress);
  const velocity = useEngineStore((s) => s.scrollVelocity);
  const direction = useEngineStore((s) => s.scrollDirection);
  return { progress, velocity, direction };
}

/**
 * Imperative scroll subscription — fires on every scroll frame without
 * re-rendering. Use for animating refs directly from scroll.
 */
export function useScrollFrame(handler: (payload: ScrollEventPayload) => void): void {
  useEngineEvent('scroll', handler);
}

/** Programmatic smooth scrolling via the engine's Lenis instance. */
export function useScrollTo() {
  const engine = useEngine();
  return (target: number | string | HTMLElement, options?: { offset?: number; duration?: number }) =>
    engine.scroll.scrollTo(target, options);
}
