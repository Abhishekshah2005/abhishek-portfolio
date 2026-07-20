'use client';

import type { Tuple3 } from '@/types';

export interface StudioLightsProps {
  intensity?: number;
  color?: string;
  keyPosition?: Tuple3;
  fillPosition?: Tuple3;
  rimPosition?: Tuple3;
  ambient?: number;
  shadows?: boolean;
}

/**
 * A reusable three-point studio lighting rig (key / fill / rim + ambient).
 *
 * A neutral, cinematic default that any future scene can drop in and tune via
 * props — no scene-specific content baked in.
 */
export function StudioLights({
  intensity = 1,
  color = '#ffffff',
  keyPosition = [5, 8, 5],
  fillPosition = [-6, 2, 4],
  rimPosition = [0, 6, -8],
  ambient = 0.25,
  shadows = true,
}: StudioLightsProps) {
  return (
    <>
      <ambientLight intensity={ambient} />
      <directionalLight
        position={keyPosition}
        intensity={intensity}
        color={color}
        castShadow={shadows}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <directionalLight position={fillPosition} intensity={intensity * 0.4} color={color} />
      <directionalLight position={rimPosition} intensity={intensity * 0.8} color={color} />
    </>
  );
}
