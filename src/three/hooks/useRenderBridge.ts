'use client';

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useEngine } from '@/hooks/useEngine';
import { TickPriority } from '@/types';

/**
 * Folds React Three Fiber's render loop into the engine's single ticker.
 *
 * Requires the Canvas to be configured with `frameloop="never"`; this hook
 * then calls R3F's `advance()` once per engine frame at Render priority — so
 * Three, GSAP and Lenis all render on one RAF. Call once inside the Canvas.
 */
export function useRenderBridge(): void {
  const engine = useEngine();
  const advance = useThree((s) => s.advance);

  useEffect(() => {
    return engine.ticker.add((state) => {
      advance(state.timestamp);
    }, TickPriority.Render);
  }, [engine, advance]);
}
