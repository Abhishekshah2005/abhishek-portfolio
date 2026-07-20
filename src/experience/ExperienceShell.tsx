import type { ReactNode } from 'react';
import { ExperienceProvider } from '@/providers';
import { CursorLayer } from '@/cursor';
import { SceneLayer } from './layers/SceneLayer';
import { OverlayRoot } from './layers/OverlayRoot';
import { BootSequence } from './boot';
import { PerfMonitor } from './PerfMonitor';
import { SkipLink } from './SkipLink';

export interface ExperienceShellProps {
  children: ReactNode;
  debug?: boolean;
}

/**
 * The global application shell — one experience everything mounts inside.
 *
 * Layering (bottom → top): 3D scene → DOM content → overlays/HUD → cursor →
 * preloader. Every future section renders as `children` (SSR content), every
 * future scene mounts inside `<SceneLayer>`, and every future overlay/HUD flows
 * through the overlay system. No portfolio content lives here.
 */
export function ExperienceShell({ children, debug }: ExperienceShellProps) {
  return (
    <ExperienceProvider debug={debug}>
      <SkipLink />

      {/* Persistent 3D stage (behind everything). */}
      <SceneLayer followScroll />

      {/* DOM content — the scrollable document, above the canvas. */}
      <main id="main-content" className="relative z-[var(--z-content)]">
        {children}
      </main>

      {/* Global overlays, cursor, and cinematic boot screen. */}
      <OverlayRoot />
      <CursorLayer />
      <BootSequence />
      <PerfMonitor />
    </ExperienceProvider>
  );
}
