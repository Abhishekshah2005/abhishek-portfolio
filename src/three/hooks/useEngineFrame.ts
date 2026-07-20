'use client';

import { useEffect, useRef } from 'react';
import { useThree, type RootState } from '@react-three/fiber';
import { useEngine } from '@/hooks/useEngine';
import { TickPriority, type TickState } from '@/types';

export type EngineFrameCallback = (r3f: RootState, tick: TickState) => void;

/**
 * Like R3F's `useFrame`, but subscribed to the engine ticker so it shares the
 * single loop and the engine's clamped delta. Provides both the R3F root
 * state and the engine tick state each frame; auto-cleans on unmount.
 */
export function useEngineFrame(
  callback: EngineFrameCallback,
  priority: number = TickPriority.Animation,
): void {
  const engine = useEngine();
  const get = useThree((s) => s.get);
  const ref = useRef(callback);
  ref.current = callback;

  useEffect(() => {
    return engine.ticker.add((tick) => ref.current(get(), tick), priority);
  }, [engine, get, priority]);
}
