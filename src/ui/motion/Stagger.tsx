'use client';

import type { ReactNode } from 'react';
import { useStagger, type UseStaggerOptions } from '@/animation/hooks/useStagger';

export interface StaggerProps extends UseStaggerOptions {
  children: ReactNode;
  className?: string;
}

/**
 * Reveals child elements with a stagger as the container scrolls into view
 * (over `useStagger`). Wrap a list/grid; direct children (or `selector`)
 * animate in sequence.
 */
export function Stagger({ children, className, ...options }: StaggerProps) {
  const ref = useStagger<HTMLDivElement>(options);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
