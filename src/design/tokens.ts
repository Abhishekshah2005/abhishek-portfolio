/**
 * Programmatic token mirror.
 *
 * `globals.css` `@theme` is the canonical source (it drives every Tailwind
 * utility). This file mirrors the values needed by TypeScript and Three.js
 * (which cannot read CSS variables at module scope). Keep the two in sync —
 * any change here must match `globals.css`.
 */

export const COLORS = {
  void: '#08080A', // deepest cinematic charcoal (page bg)
  obsidian: '#0E0E12', // raised surface
  graphite: '#14141A', // subtle fill
  slate: '#1C1C24', // deeper fill / wells
  fog: '#8E8A82', // secondary text (warm stone)
  fogDim: '#5C5952', // muted
  signal: '#F3F0E9', // primary text (warm off-white)
  flux: '#E4B063', // accent (warm gold)
  flux2: '#F3D08A', // bright gold (glow core)
  ember: '#E4B063', // alias → accent
  rare: '#E4B063', // alias → accent
  gold: '#E4B063', // alias → accent
  danger: '#C2603F', // warm terracotta
  glowWarm: '#F0B45E', // horizon glow core
  glowWarm2: '#E07A4E', // horizon glow coral edge
  light: '#F4F1EA', // optional bright-chapter base
} as const;

export type ColorToken = keyof typeof COLORS;

/** Semantic aliases (names, resolve via CSS var at runtime for DOM). */
export const SEMANTIC = {
  bgBase: 'var(--bg-base)',
  bgSurface: 'var(--bg-surface)',
  bgElevated: 'var(--bg-elevated)',
  bgOverlay: 'var(--bg-overlay)',
  textPrimary: 'var(--text-primary)',
  textSecondary: 'var(--text-secondary)',
  textMuted: 'var(--text-muted)',
} as const;

export const RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  '2xl': 32,
  '3xl': 44,
  full: 9999,
} as const;

export const Z_INDEX = {
  canvas: 0,
  content: 10,
  nav: 30,
  hud: 40,
  cursor: 50,
  overlay: 60,
  toast: 70,
} as const;

export const OPACITY = {
  disabled: 0.4,
  muted: 0.6,
  hover: 0.85,
} as const;

export const BLUR = {
  glass: 16,
  heavy: 40,
} as const;

/** Matches Tailwind's default breakpoints (kept explicit for JS media logic). */
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

export type Breakpoint = keyof typeof BREAKPOINTS;

/**
 * HDR/emissive color values for Three.js bloom (slightly hotter than the DOM
 * palette so post-processing bloom reads correctly).
 */
export const EMISSIVE = {
  flux: '#FFC873', // hotter gold for bloom
  flux2: '#FFE0A6',
  ember: '#FFB25E',
  rare: '#FF9A5A', // warm coral for the horizon bloom
} as const;
