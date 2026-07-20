/**
 * Typographic variants — the type ramp expressed as token-driven utility
 * classes. Consumed by the `<Text>` primitive. Display + headings use the
 * display family; body uses sans; data/code/overline use mono.
 */
export const TEXT_VARIANTS = {
  display: 'font-display text-display font-semibold tracking-tight',
  h1: 'font-display text-4xl font-semibold tracking-tight',
  h2: 'font-display text-3xl font-semibold tracking-tight',
  h3: 'font-display text-2xl font-medium tracking-tight',
  h4: 'font-display text-xl font-medium',
  'body-lg': 'font-sans text-lg leading-relaxed',
  body: 'font-sans text-base',
  'body-sm': 'font-sans text-sm',
  label: 'font-sans text-sm font-medium',
  caption: 'font-sans text-xs',
  overline: 'font-mono text-2xs uppercase tracking-[0.2em]',
  code: 'font-mono text-sm',
} as const;

export type TextVariant = keyof typeof TEXT_VARIANTS;

/** Sensible default HTML element for each variant (polymorphic override via `as`). */
export const TEXT_DEFAULT_ELEMENT: Record<TextVariant, string> = {
  display: 'h1',
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  'body-lg': 'p',
  body: 'p',
  'body-sm': 'p',
  label: 'span',
  caption: 'span',
  overline: 'span',
  code: 'code',
};

/** Tone maps to semantic text colors. */
export const TEXT_TONES = {
  primary: 'text-signal',
  secondary: 'text-fog',
  muted: 'text-fog-dim',
  accent: 'text-flux',
  action: 'text-ember',
  inherit: '',
} as const;

export type TextTone = keyof typeof TEXT_TONES;
