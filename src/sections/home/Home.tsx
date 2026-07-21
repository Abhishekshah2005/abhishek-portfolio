'use client';

import { PremiumCursor } from '@/cursor';
import { TraverseProvider } from './traverse';
import { WorldCanvas } from './WorldCanvas';
import { AnchorLine } from './AnchorLine';
import { Hud } from './Hud';
import { TraverseEngine } from './TraverseEngine';

/**
 * The homepage — one continuous cinematic traverse. A persistent world and
 * glowing horizon are held behind every chapter; the HUD lives above; the
 * chapters choreograph across the middle. Everything shares the active-chapter
 * context so the interface morphs as you move.
 */
export function Home() {
  return (
    <TraverseProvider>
      <WorldCanvas />
      <AnchorLine />

      {/* Fine film grain over the world (behind the content). */}
      <div
        aria-hidden
        className="grain pointer-events-none fixed inset-0 z-[6] opacity-[0.04] mix-blend-soft-light"
      />

      <div className="relative z-[var(--z-content)]">
        <TraverseEngine />
      </div>

      <Hud />
      <PremiumCursor />
    </TraverseProvider>
  );
}
