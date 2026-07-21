'use client';

import { useEffect, useRef } from 'react';
import { useEngineOptional } from './useEngine';
import { TickPriority, type TickState } from '@/types';

/**
 * Run a callback on the engine's single ticker. The callback runs off the
 * React render loop (no re-renders) and is automatically unsubscribed on
 * unmount — the idiomatic way to animate imperatively (refs, materials, etc.).
 *
 * SSR-safe: no-ops until the engine exists (server + first client render under
 * an eager provider), then subscribes once it boots.
 */
export function useTick(
  callback: (state: TickState) => void,
  priority: number = TickPriority.Animation,
): void {
  const engine = useEngineOptional();
  const ref = useRef(callback);
  ref.current = callback;

  useEffect(() => {
    if (!engine) return;
    return engine.ticker.add((state) => ref.current(state), priority);
  }, [engine, priority]);
}
