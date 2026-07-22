'use client';

import { PremiumCursor } from '@/cursor';
import { TraverseProvider } from './traverse';
import { WorldCanvas } from './WorldCanvas';
import { Hud } from './Hud';
import { TraverseEngine } from './TraverseEngine';
import { CenterStage } from './CenterStage';

/**
 * The homepage — one continuous cinematic traverse. A persistent cinematic 3D
 * world (glowing sun, reflective floor, lone figure) is held behind every
 * chapter; the HUD lives above; poster cards choreograph across the middle and
 * open into centered headlines. Everything shares the active-chapter context.
 */
export function Home() {
  return (
    <TraverseProvider>
      <WorldCanvas />

      {/* Fine film grain over the world (behind the content). */}
      <div
        aria-hidden
        className="grain pointer-events-none fixed inset-0 z-[6] opacity-[0.05] mix-blend-soft-light"
      />

      <div className="relative z-[var(--z-content)]">
        <TraverseEngine />
      </div>

      <CenterStage />
      <Hud />
      <PremiumCursor />
    </TraverseProvider>
  );
}
