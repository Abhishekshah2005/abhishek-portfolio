import type { CameraWaypoint } from '@/engine';
import { COLORS, EMISSIVE } from '@/design/tokens';
import type { QualityTier } from '@/types';

/**
 * Tuning for the Hero World level. Central so the whole scene can be re-tuned
 * from one place (camera path, palette, fog, densities).
 */

/** Cinematic camera path sampled by scroll progress (0→1). */
export const HERO_WAYPOINTS: CameraWaypoint[] = [
  { at: 0, position: [0, 0.6, 7.6], lookAt: [0, 0, 0], fov: 42 },
  { at: 0.5, position: [3.4, 1.4, 6.4], lookAt: [0, 0, 0], fov: 39 },
  { at: 1, position: [0, 3.4, 11.5], lookAt: [0, 0.2, 0], fov: 31 },
];

export const HERO_COLORS = {
  coreDark: COLORS.flux,
  coreHot: EMISSIVE.flux2,
  ring: COLORS.flux,
  accent: COLORS.ember,
  grid: COLORS.flux,
  skyTop: COLORS.void,
  skyBottom: '#0e1230',
  fog: COLORS.void,
} as const;

export const HERO_FOG = { color: COLORS.void, near: 5.5, far: 26 } as const;

/** Particle budget per performance tier. */
export const HERO_PARTICLES: Record<QualityTier, number> = {
  low: 250,
  medium: 600,
  high: 1400,
  ultra: 2600,
};

/** Core mesh subdivision per tier (drives displacement smoothness). */
export const HERO_CORE_DETAIL: Record<QualityTier, number> = {
  low: 8,
  medium: 14,
  high: 20,
  ultra: 28,
};

export const HERO_CORE = {
  radius: 1.25,
  amplitude: 0.13,
  frequency: 1.7,
} as const;
