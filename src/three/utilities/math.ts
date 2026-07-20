import { MathUtils, type Vector3 } from 'three';

/** Clamp a value to [min, max]. */
export const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

/** Linear interpolation. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Inverse lerp — where does `value` sit between a and b (0-1)? */
export const inverseLerp = (a: number, b: number, value: number) =>
  a === b ? 0 : clamp((value - a) / (b - a), 0, 1);

/** Remap a value from one range to another. */
export const remap = (
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) => lerp(outMin, outMax, inverseLerp(inMin, inMax, value));

/**
 * Framerate-independent damping (à la `THREE.MathUtils.damp`). `lambda` is the
 * smoothing rate; higher = snappier.
 */
export const damp = (current: number, target: number, lambda: number, delta: number) =>
  MathUtils.damp(current, target, lambda, delta);

/** Damp a Vector3 toward a target in place. */
export function dampVector3(
  current: Vector3,
  target: Vector3,
  lambda: number,
  delta: number,
): Vector3 {
  current.x = damp(current.x, target.x, lambda, delta);
  current.y = damp(current.y, target.y, lambda, delta);
  current.z = damp(current.z, target.z, lambda, delta);
  return current;
}

/** Smoothstep between two edges. */
export const smoothstep = (edge0: number, edge1: number, x: number) => {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
};
