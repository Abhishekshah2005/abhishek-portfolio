/**
 * Named easing tokens used across every preset.
 *
 * GSAP-native strings are used where possible; the cubic-bezier tuples are
 * exported for CSS transitions and Web Animations API consumers so the whole
 * app shares one motion vocabulary.
 */
export const EASING = {
  // GSAP string eases
  smooth: 'power3.out',
  smoothInOut: 'power3.inOut',
  snap: 'power4.out',
  expo: 'expo.out',
  expoInOut: 'expo.inOut',
  back: 'back.out(1.7)',
  elastic: 'elastic.out(1, 0.5)',
  circ: 'circ.out',
} as const;

export const CUBIC_BEZIER = {
  smooth: [0.16, 1, 0.3, 1],
  snap: [0.19, 1, 0.22, 1],
  power: [0.77, 0, 0.175, 1],
  soft: [0.25, 0.1, 0.25, 1],
} as const satisfies Record<string, [number, number, number, number]>;

export type EasingToken = keyof typeof EASING;

/** Convert a cubic-bezier tuple to a CSS `cubic-bezier(...)` string. */
export function toCssBezier(tuple: readonly [number, number, number, number]): string {
  return `cubic-bezier(${tuple.join(', ')})`;
}
