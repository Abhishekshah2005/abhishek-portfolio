'use client';

import { createElement, type ElementType } from 'react';
import { useTextReveal, type UseTextRevealOptions } from '@/animation/hooks/useTextReveal';

export interface TextRevealProps extends UseTextRevealOptions {
  children: string;
  className?: string;
  /** Heading level / element to render (defaults to h2). */
  as?: ElementType;
}

/**
 * Splits and reveals text per char/word/line on scroll (over `useTextReveal`).
 * Accepts a plain string so the accessible label is preserved during splitting.
 */
export function TextReveal({ children, className, as, ...options }: TextRevealProps) {
  const ref = useTextReveal<HTMLElement>(options);
  const Comp = (as ?? 'h2') as ElementType;
  return createElement(Comp, { ref, className }, children);
}
