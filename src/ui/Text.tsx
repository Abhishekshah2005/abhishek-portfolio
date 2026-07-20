import { createElement, type CSSProperties, type ElementType, type HTMLAttributes } from 'react';
import { cn } from '@/lib';
import {
  TEXT_VARIANTS,
  TEXT_TONES,
  TEXT_DEFAULT_ELEMENT,
  type TextVariant,
  type TextTone,
} from '@/design/typography';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  tone?: TextTone;
  /** Polymorphic element override (defaults per variant). */
  as?: ElementType;
  /** Clamp to N lines with ellipsis. */
  clamp?: number;
}

/**
 * The typographic primitive. Renders any type ramp entry with the correct
 * family/size/weight and a semantic tone, on a sensible default element you can
 * override via `as`. All type in the system flows through this.
 */
export function Text({
  variant = 'body',
  tone = 'inherit',
  as,
  clamp,
  className,
  style,
  children,
  ...props
}: TextProps) {
  const Comp = (as ?? TEXT_DEFAULT_ELEMENT[variant]) as ElementType;
  const clampStyle: CSSProperties | undefined = clamp
    ? {
        display: '-webkit-box',
        WebkitLineClamp: clamp,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
        ...style,
      }
    : style;

  return createElement(
    Comp,
    { className: cn(TEXT_VARIANTS[variant], TEXT_TONES[tone], className), style: clampStyle, ...props },
    children,
  );
}
