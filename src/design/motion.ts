/**
 * Motion tokens — the single vocabulary for every animation in the system.
 *
 * Re-exports the engine's existing easing + spring definitions (no duplication)
 * and layers on design-level durations, delays and semantic timing groups.
 */
import { EASING, CUBIC_BEZIER, toCssBezier } from '@/animation/core/easings';
import { SPRING_PRESETS } from '@/engine/physics';

export { EASING, CUBIC_BEZIER, toCssBezier, SPRING_PRESETS };

/** Durations in seconds (GSAP-native). Mirror of `--dur-*` in globals.css. */
export const DURATION = {
  instant: 0.08,
  fast: 0.14,
  ui: 0.24,
  slow: 0.4,
  reveal: 0.7,
  cinematic: 1.4,
  epic: 3.0,
} as const;

/** Durations in milliseconds (CSS/WAAPI/JS timers). */
export const DURATION_MS = {
  instant: 80,
  fast: 140,
  ui: 240,
  slow: 400,
  reveal: 700,
  cinematic: 1400,
  epic: 3000,
} as const;

export const DELAY = {
  none: 0,
  short: 0.06,
  medium: 0.12,
  long: 0.24,
} as const;

/** Stagger amounts (seconds) — matches engine config granularity. */
export const STAGGER = {
  chars: 0.02,
  words: 0.04,
  lines: 0.06,
  cards: 0.08,
} as const;

/** Semantic timing groups so consumers pick intent, not raw numbers. */
export const TIMING = {
  hover: { duration: DURATION.fast, ease: EASING.smooth },
  press: { duration: DURATION.instant, ease: EASING.smooth },
  reveal: { duration: DURATION.reveal, ease: EASING.expo },
  transition: { duration: DURATION.ui, ease: EASING.smooth },
  camera: { duration: DURATION.cinematic, ease: 'power2.inOut' },
  scroll: { scrub: 1.2 },
} as const;

export type DurationToken = keyof typeof DURATION;
export type SpringPresetName = keyof typeof SPRING_PRESETS;
