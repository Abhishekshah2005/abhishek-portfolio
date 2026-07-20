'use client';

import type { ReactNode } from 'react';
import { useReveal, type UseRevealOptions } from '@/animation/hooks/useReveal';

export interface RevealProps extends UseRevealOptions {
  children: ReactNode;
  className?: string;
}

/**
 * Declarative scroll "reveal up" wrapper over `useReveal`. Drop around any
 * block to have it rise + fade in on scroll (reduced-motion safe). Must render
 * inside `<EngineProvider>`.
 */
export function Reveal({ children, className, ...options }: RevealProps) {
  const ref = useReveal<HTMLDivElement>(options);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
