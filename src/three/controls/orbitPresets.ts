/**
 * Declarative presets for damped camera controls.
 *
 * Framework-agnostic plain objects spread onto drei's `<OrbitControls />` (or
 * any equivalent) so interaction feel stays consistent across scenes. No
 * control instance is created here — scenes own that.
 */
export interface OrbitPreset {
  enableDamping: boolean;
  dampingFactor: number;
  enablePan: boolean;
  enableZoom: boolean;
  rotateSpeed: number;
  minPolarAngle: number;
  maxPolarAngle: number;
  autoRotate: boolean;
  autoRotateSpeed: number;
}

export const ORBIT_PRESETS = {
  /** Gentle showcase orbit — no pan/zoom, soft auto-rotate. */
  showcase: {
    enableDamping: true,
    dampingFactor: 0.06,
    enablePan: false,
    enableZoom: false,
    rotateSpeed: 0.5,
    minPolarAngle: Math.PI * 0.25,
    maxPolarAngle: Math.PI * 0.75,
    autoRotate: true,
    autoRotateSpeed: 0.6,
  },
  /** Free inspection — pan/zoom enabled, no auto-rotate. */
  inspect: {
    enableDamping: true,
    dampingFactor: 0.1,
    enablePan: true,
    enableZoom: true,
    rotateSpeed: 0.8,
    minPolarAngle: 0,
    maxPolarAngle: Math.PI,
    autoRotate: false,
    autoRotateSpeed: 0,
  },
} as const satisfies Record<string, OrbitPreset>;

export type OrbitPresetName = keyof typeof ORBIT_PRESETS;
