'use client';

import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useSceneContent } from '@/providers/SceneProvider';
import { useEngineStore } from '@/hooks/useEngineStore';
import { HeroHud } from './HeroHud';
import { NameReveal } from './NameReveal';
import { ScrollCue } from './ScrollCue';

// The 3D scene is lazy + client-only so Three never enters the initial bundle
// or the server render.
const HeroSceneLazy = dynamic(() => import('@/three/levels/hero').then((m) => m.HeroScene), {
  ssr: false,
});

/**
 * The Hero World — the opening level.
 *
 * Mounts the 3D scene into the persistent canvas via the scene slot, and layers
 * the DOM experience (HUD, assembling name, scroll cue) on top. A tall scroll
 * track drives the camera path / choreography via the engine's scroll → camera
 * waypoints. All content powers on once the boot dissolves.
 */
export function HeroWorld() {
  useSceneContent(
    <Suspense fallback={null}>
      <HeroSceneLazy />
    </Suspense>,
  );
  const active = useEngineStore((s) => s.bootComplete);

  return (
    <section aria-label="ATLAS — Hero World" className="relative h-[260vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        <HeroHud active={active} />
        <NameReveal active={active} />
        <ScrollCue active={active} />
      </div>
    </section>
  );
}
