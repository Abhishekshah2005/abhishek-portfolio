/** State handed to every ticker subscriber on each frame. */
export interface TickState {
  /** Seconds elapsed since the ticker started. */
  elapsed: number;
  /** Seconds since the previous frame (clamped). */
  delta: number;
  /** Raw, unclamped delta — useful for diagnostics. */
  rawDelta: number;
  /** Smoothed frames-per-second. */
  fps: number;
  /** Monotonic frame counter. */
  frame: number;
  /** High-res timestamp of this frame (ms). */
  timestamp: number;
}

/** A prioritised per-frame callback. */
export type TickCallback = (state: TickState) => void;

/**
 * Priority buckets for ticker callbacks. Lower numbers run first so that,
 * e.g., input is sampled before physics, which runs before rendering.
 */
export enum TickPriority {
  Input = 0,
  Scroll = 10,
  Physics = 20,
  Animation = 30,
  Camera = 40,
  Render = 50,
  PostRender = 60,
}

/**
 * A pluggable loop source. The engine uses a single driver so that GSAP,
 * Lenis and Three all advance from one `requestAnimationFrame`.
 */
export interface RAFDriver {
  start(loop: (timeMs: number) => void): void;
  stop(): void;
}
