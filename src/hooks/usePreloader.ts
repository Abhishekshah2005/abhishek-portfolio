'use client';

import { useEffect, useRef, useState } from 'react';
import { useEngineStore } from './useEngineStore';

export interface PreloaderState {
  /** Displayed progress 0–1 (snaps to 1 once ready). */
  progress: number;
  /** True while the preloader should remain visible. */
  active: boolean;
  /** True once ready and the minimum display time has elapsed. */
  done: boolean;
}

/**
 * Drives a premium preloader from real engine load state. Guarantees a minimum
 * on-screen time so the intro never flashes, and resolves `done` once assets +
 * engine are ready — the signal a `<Preloader>` uses to exit.
 */
export function usePreloader(minDuration = 1200): PreloaderState {
  const ready = useEngineStore((s) => s.ready);
  const loading = useEngineStore((s) => s.loading);
  const progress = useEngineStore((s) => s.progress);
  const start = useRef<number>(Date.now());
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done || !ready || loading) return;
    const elapsed = Date.now() - start.current;
    const remaining = Math.max(0, minDuration - elapsed);
    const t = window.setTimeout(() => setDone(true), remaining);
    return () => window.clearTimeout(t);
  }, [ready, loading, minDuration, done]);

  return {
    progress: ready ? 1 : progress,
    active: !done,
    done,
  };
}
