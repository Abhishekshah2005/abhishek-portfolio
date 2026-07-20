'use client';

import { useEngineStore } from '@/hooks/useEngineStore';

/**
 * A thin film-progress bar across the very top — the whole story's scrubbable
 * timeline. Driven by the engine's smoothed scroll progress (Lenis, single RAF).
 */
export function ProgressRail() {
  const progress = useEngineStore((s) => s.scrollProgress);
  return (
    <div className="pointer-events-none fixed inset-x-0 top-0 z-[var(--z-toast)] h-0.5">
      <div className="h-full w-full origin-left bg-flux" style={{ transform: `scaleX(${progress})` }} />
    </div>
  );
}
