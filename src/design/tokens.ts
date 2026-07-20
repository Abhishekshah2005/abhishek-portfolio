/**
 * Programmatic token mirror.
 *
 * `globals.css` `@theme` is the canonical source (it drives every Tailwind
 * utility). This file mirrors the values needed by TypeScript and Three.js
 * (which cannot read CSS variables at module scope). Keep the two in sync —
 * any change here must match `globals.css`.
 */

export const COLORS = {
  void: '#05050A',
  obsidian: '#0B0D14',
  graphite: '#14161F',
  slate: '#1B1E2A',
  fog: '#8A93A6',
  fogDim: '#5A6172',
  signal: '#F4F4F8',
  flux: '#5B8CFF',
  flux2: '#00E5C4',
  ember: '#FF6A3D',
  rare: '#A16BFF',
  gold: '#FFC24B',
  danger: '#FF3B4E',
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
  flux: '#7BA4FF',
  flux2: '#3BF2D6',
  ember: '#FF8258',
  rare: '#B98CFF',
} as const;
