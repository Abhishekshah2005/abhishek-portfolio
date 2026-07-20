'use client';

import { useEffect, useMemo, useRef } from 'react';
import { useEngine } from './useEngine';
import { Spring, SPRING_PRESETS, type SpringConfig, type SpringPreset } from '@/engine/physics';
import { TickPriority } from '@/types';

export interface UseSpringOptions {
  preset?: SpringPreset;
  config?: Partial<SpringConfig>;
  /** Called every frame with the current spring value (off the render loop). */
  onChange?: (value: number) => void;
}

export interface SpringHandle {
  /** The underlying spring — read `.value` inside a tick callback. */
  spring: Spring;
  /** Set a new target value. */
  set: (target: number) => void;
  /** Jump instantly to a value. */
  jump: (value: number) => void;
}

/**
 * Drive a {@link Spring} on the engine ticker. Returns a stable handle so
 * imperative code can update the target without triggering React re-renders.
 */
export function useSpring(initial = 0, options: UseSpringOptions = {}): SpringHandle {
  const engine = useEngine();
  const onChangeRef = useRef(options.onChange);
  onChangeRef.current = options.onChange;

  const spring = useMemo(() => {
    const base = SPRING_PRESETS[options.preset ?? 'default'];
    return new Spring(initial, { ...base, ...options.config });
    // Recreate only when the preset identity changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [options.preset]);

  useEffect(() => {
    return engine.ticker.add((state) => {
      const previous = spring.value;
      const next = spring.update(state.delta);
      if (next !== previous) onChangeRef.current?.(next);
    }, TickPriority.Animation);
  }, [engine, spring]);

  return useMemo(
    () => ({
      spring,
      set: (target: number) => spring.setTarget(target),
      jump: (value: number) => spring.set(value),
    }),
    [spring],
  );
}
