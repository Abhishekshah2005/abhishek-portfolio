/**
 * Programmatic token mirror.
 *
 * `globals.css` `@theme` is the canonical source (it drives every Tailwind
 * utility). This file mirrors the values needed by TypeScript and Three.js
 * (which cannot read CSS variables at module scope). Keep the two in sync —
 * any change here must match `globals.css`.
 */

export const COLORS = {
  void: '#FBFAF8', // page paper
  obsidian: '#FFFFFF', // surface
  graphite: '#F4F2ED', // subtle fill
  slate: '#ECE8E0', // deeper fill
  fog: '#6B6862', // secondary text
  fogDim: '#9A958C', // muted
  signal: '#14131A', // ink
  flux: '#4338CA', // accent (deep indigo)
  flux2: '#6366F1', // brighter accent
  ember: '#4338CA', // alias → accent
  rare: '#4338CA', // alias → accent
  gold: '#4338CA', // alias → accent
  danger: '#DC2626',
  dark: '#0B0B10', // dark feature-section base
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
  flux: '#5B4FE0',
  flux2: '#8B8CF7',
  ember: '#5B4FE0',
  rare: '#8B8CF7',
} as const;
