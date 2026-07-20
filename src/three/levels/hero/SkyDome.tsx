'use client';

import { useEffect, useMemo } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useEngineFrame } from '@/three/hooks/useEngineFrame';
import { createGradientMaterial } from '@/three/materials';
import { TickPriority } from '@/types';
import { HERO_COLORS } from './heroConfig';

/**
 * Layered gradient sky dome (never a flat background) with a slow grain drift
 * for depth. Reuses the engine's gradient material.
 */
export function SkyDome() {
  const reduced = useReducedMotion();
  const material = useMemo(
    () => createGradientMaterial({ colorTop: HERO_COLORS.skyTop, colorBottom: HERO_COLORS.skyBottom, grain: 0.025 }),
    [],
  );

  useEffect(() => () => material.dispose(), [material]);

  useEngineFrame((_, tick) => {
    material.uniforms.uTime.value = reduced ? 0 : tick.elapsed;
  }, TickPriority.Animation);

  return (
    <mesh material={material}>
      <sphereGeometry args={[42, 32, 32]} />
    </mesh>
  );
}
