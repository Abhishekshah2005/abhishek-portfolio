'use client';

import { useEngineOptional } from './useEngine';
import { usePerformance, type PerformanceReadout } from './usePerformance';
import { useEngineStore } from './useEngineStore';
import { useViewport, type ViewportState } from '@/providers/ViewportProvider';
import { useTheme } from '@/providers/ThemeProvider';
import { useA11y } from '@/providers/A11yProvider';
import { useOverlay } from '@/providers/OverlayProvider';
import { useTransition } from '@/providers/TransitionProvider';
import type { Engine } from '@/engine';

/**
 * Convenience aggregate over the whole experience layer for occasional,
 * top-level consumers. Deliberately excludes per-frame scroll values (use
 * `useScroll` for those) so components using this don't re-render every frame.
 */
export function useExperience() {
  const engine: Engine | null = useEngineOptional();
  const viewport: ViewportState = useViewport();
  const theme = useTheme();
  const a11y = useA11y();
  const overlay = useOverlay();
  const transition = useTransition();
  const performance: PerformanceReadout = usePerformance();

  const ready = useEngineStore((s) => s.ready);
  const loading = useEngineStore((s) => s.loading);
  const progress = useEngineStore((s) => s.progress);

  return {
    engine,
    viewport,
    theme,
    overlay,
    transition,
    performance,
    announce: a11y.announce,
    reducedMotion: a11y.reducedMotion,
    lifecycle: { ready, loading, progress },
  };
}
