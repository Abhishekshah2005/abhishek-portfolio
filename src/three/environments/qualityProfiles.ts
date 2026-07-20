import type { QualityTier } from '@/types';

export interface QualityProfile {
  /** Device-pixel-ratio ceiling for the renderer. */
  dpr: [number, number];
  antialias: boolean;
  shadows: boolean;
  /** Suggested particle budget for this tier. */
  particles: number;
  /** Whether post-processing passes should be enabled. */
  postprocessing: boolean;
  /** Anisotropic filtering level for textures. */
  anisotropy: number;
}

/**
 * Maps each performance tier to concrete 3D quality settings.
 *
 * A single source of truth so every scene, the Canvas and the particle
 * systems scale consistently when the {@link PerformanceManager} shifts tiers.
 */
export const QUALITY_PROFILES: Record<QualityTier, QualityProfile> = {
  low: { dpr: [1, 1], antialias: false, shadows: false, particles: 200, postprocessing: false, anisotropy: 1 },
  medium: { dpr: [1, 1.5], antialias: true, shadows: false, particles: 500, postprocessing: false, anisotropy: 2 },
  high: { dpr: [1, 2], antialias: true, shadows: true, particles: 1200, postprocessing: true, anisotropy: 4 },
  ultra: { dpr: [1, 2], antialias: true, shadows: true, particles: 2500, postprocessing: true, anisotropy: 8 },
};

export const getQualityProfile = (tier: QualityTier): QualityProfile => QUALITY_PROFILES[tier];
