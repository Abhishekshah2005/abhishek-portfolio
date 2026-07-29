"use client";

/**
 * One global pointer listener for the entire site.
 *
 * The cursor, the magnetic buttons, the glass blob, the light source and the
 * sticker physics all need the mouse position every frame. Registering a
 * listener per consumer would mean a dozen handlers firing on every mousemove;
 * instead everything reads these mutable values.
 */
export const pointer = {
  /** viewport pixels */
  x: 0,
  y: 0,
  /** normalised device coords, -1..1 (y up) */
  nx: 0,
  ny: 0,
  /** eased follower, same units as nx/ny — use for anything that shouldn't snap */
  ex: 0,
  ey: 0,
  /** movement speed in px/frame, eased */
  speed: 0,
  /** false until the user actually moves a pointer */
  active: false,
};

let bound = false;
let lastX = 0;
let lastY = 0;

function onMove(e: PointerEvent) {
  pointer.x = e.clientX;
  pointer.y = e.clientY;
  pointer.nx = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.ny = -((e.clientY / window.innerHeight) * 2 - 1);

  const dx = e.clientX - lastX;
  const dy = e.clientY - lastY;
  const raw = Math.min(Math.hypot(dx, dy), 120);
  pointer.speed += (raw - pointer.speed) * 0.2;
  lastX = e.clientX;
  lastY = e.clientY;

  if (!pointer.active) {
    // Seed the eased values so nothing flies across the screen on first move.
    pointer.ex = pointer.nx;
    pointer.ey = pointer.ny;
    pointer.active = true;
  }
}

export function bindPointer() {
  if (bound || typeof window === "undefined") return () => {};
  bound = true;
  window.addEventListener("pointermove", onMove, { passive: true });
  return () => {
    window.removeEventListener("pointermove", onMove);
    bound = false;
  };
}

/** Called once per frame by the global ticker. */
export function updatePointer(damping = 0.08) {
  pointer.ex += (pointer.nx - pointer.ex) * damping;
  pointer.ey += (pointer.ny - pointer.ey) * damping;
  pointer.speed *= 0.92;
}

/** Linear interpolation helper used all over the motion code. */
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Map a value from one range to another, clamped. */
export const mapRange = (
  v: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number,
) => {
  const t = Math.min(Math.max((v - inMin) / (inMax - inMin), 0), 1);
  return outMin + t * (outMax - outMin);
};
