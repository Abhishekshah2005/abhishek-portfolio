'use client';

import { useEffect, useMemo } from 'react';
import { useEngineStore } from '@/hooks/useEngineStore';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useEngineFrame } from '@/three/hooks/useEngineFrame';
import { createParticleField } from '@/three/particles';
import { COLORS } from '@/design/tokens';
import { TickPriority } from '@/types';
import { HERO_PARTICLES } from './heroConfig';

/**
 * Ambient procedural particle field for depth and life — density scales with
 * the performance tier. Reuses the engine's particle system and advances it on
 * the shared ticker.
 */
export function ParticleAtmosphere() {
  const tier = useEngineStore((s) => s.tier);
  const reduced = useReducedMotion();

  const field = useMemo(
    () =>
      createParticleField({
        count: HERO_PARTICLES[tier],
        radius: 14,
        size: 5,
        color: COLORS.flux,
        speed: 0.35,
      }),
    [tier],
  );

  useEffect(() => () => field.dispose(), [field]);

  useEngineFrame((_, tick) => {
    if (!reduced) field.update(tick.delta);
  }, TickPriority.Animation);

  return <primitive object={field.points} />;
}
