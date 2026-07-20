import type { ReactNode } from 'react';
import { ExperienceProvider } from '@/providers';
import { PremiumCursor } from '@/cursor';
import { SceneLayer } from './layers/SceneLayer';
import { OverlayRoot } from './layers/OverlayRoot';
import { PerfMonitor } from './PerfMonitor';
import { SkipLink } from './SkipLink';

export interface ExperienceShellProps {
  children: ReactNode;
  debug?: boolean;
}

/**
 * The global application shell — one experience everything mounts inside.
 *
 * Keeps the technical foundation (providers, scene stage, overlays, perf) while
 * staying visually neutral: the premium DOM content is the star, with subtle
 * Three.js accents mounted per-section via the scene slot. Native cursor is
 * preserved for a professional, accessible feel.
 */
export function ExperienceShell({ children, debug }: ExperienceShellProps) {
  return (
    <ExperienceProvider debug={debug}>
      <SkipLink />

      {/* Subtle per-section 3D accents mount here (behind content, pointer-safe). */}
      <SceneLayer />

      {/* DOM content — the scrollable document, above the canvas. */}
      <main id="main-content" className="relative z-[var(--z-content)]">
        {children}
      </main>

      {/* Global overlays, premium cursor + dev perf monitor. */}
      <OverlayRoot />
      <PremiumCursor />
      <PerfMonitor />
    </ExperienceProvider>
  );
}
