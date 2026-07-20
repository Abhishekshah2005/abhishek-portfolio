/**
 * Central engine configuration.
 *
 * Every tunable constant that shapes runtime behaviour lives here so that
 * managers stay free of magic numbers and the whole experience can be
 * re-tuned from a single place.
 */

export const ENGINE_CONFIG = {
  /** Global debug switch. Toggled by `?debug` query param at runtime. */
  debug: false,

  ticker: {
    /** Clamp delta time to avoid huge jumps after tab-out (seconds). */
    maxDelta: 1 / 15,
    /** Rolling window used to smooth the reported FPS. */
    fpsSampleSize: 60,
  },

  scroll: {
    /** Lenis smoothing — higher lerp = snappier, lower = floatier. */
    lerp: 0.1,
    /** Duration-based easing fallback when `smoothWheel` uses duration mode. */
    duration: 1.2,
    /** Multiplier applied to wheel deltas. */
    wheelMultiplier: 1,
    /** Multiplier applied to touch deltas. */
    touchMultiplier: 1.5,
    /** Enable smoothing for touch devices (usually false for native feel). */
    smoothTouch: false,
    /** Orientation of the primary scroll axis. */
    orientation: 'vertical' as 'vertical' | 'horizontal',
    /** Velocity above this (px/frame) is considered a "fast" flick. */
    fastVelocityThreshold: 40,
  },

  camera: {
    fov: 35,
    near: 0.1,
    far: 100,
    position: [0, 0, 10] as [number, number, number],
    /** Default damping for camera rig follow behaviour. */
    damping: 0.08,
  },

  performance: {
    /** Device pixel ratio is clamped to this ceiling for perf. */
    maxPixelRatio: 2,
    /** FPS below this for `degradeAfter` frames triggers a tier downgrade. */
    lowFpsThreshold: 45,
    /** Consecutive low-FPS frames required before downgrading a tier. */
    degradeAfterFrames: 90,
    /** FPS above this for `upgradeAfter` frames allows a tier upgrade. */
    highFpsThreshold: 58,
    upgradeAfterFrames: 300,
  },

  cursor: {
    /** Follow smoothing for the custom cursor. */
    lerp: 0.15,
    /** Default cursor radius in pixels. */
    radius: 8,
    /** Radius when hovering an interactive element. */
    hoverRadius: 28,
  },

  interaction: {
    /** Raycaster throttle in ms — pointer picks are expensive. */
    raycastThrottle: 1000 / 30,
    /** Strength of magnetic pull for magnetic elements (0-1). */
    magneticStrength: 0.4,
    /** Max tilt angle in degrees for tilt interactions. */
    maxTilt: 12,
  },

  audio: {
    /** Master volume 0-1. */
    masterVolume: 0.6,
    /** Whether audio is muted by default (respect user gesture policies). */
    mutedByDefault: true,
    /** Crossfade duration between audio states (seconds). */
    crossfade: 0.8,
  },

  animation: {
    /** Default easing used across reveal/transition presets. */
    ease: 'power3.out',
    /** Default reveal duration (seconds). */
    duration: 1,
    /** Default stagger between grouped elements (seconds). */
    stagger: 0.08,
  },
};

export type EngineConfig = typeof ENGINE_CONFIG;
