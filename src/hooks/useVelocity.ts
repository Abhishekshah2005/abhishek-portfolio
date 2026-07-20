'use client';

import { useEffect, useRef, type RefObject } from 'react';
import { useEngine } from './useEngine';
import { TickPriority } from '@/types';

/**
 * Track the rate of change of a numeric signal, sampled on the ticker.
 *
 * Returns a ref whose `.current` holds the latest velocity (units/second).
 * Reading a ref avoids per-frame re-renders — poll it inside another tick or
 * animation callback.
 */
export function useVelocity(getValue: () => number): RefObject<number> {
  const engine = useEngine();
  const velocity = useRef(0);
  const previous = useRef<number | null>(null);
  const getter = useRef(getValue);
  getter.current = getValue;

  useEffect(() => {
    return engine.ticker.add((state) => {
      const value = getter.current();
      if (previous.current === null) {
        previous.current = value;
        return;
      }
      const dt = state.delta || 1 / 60;
      velocity.current = (value - previous.current) / dt;
      previous.current = value;
    }, TickPriority.Input);
  }, [engine]);

  return velocity;
}
