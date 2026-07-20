'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib';
import { useMagnetic, type UseMagneticOptions } from '@/animation/hooks/useMagnetic';

export interface MagneticProps extends UseMagneticOptions {
  children: ReactNode;
  className?: string;
}

/**
 * Wraps children with the signature magnetic-pull interaction (over
 * `useMagnetic`). Renders an inline-block wrapper so the transform is isolated.
 * Auto-disabled under reduced motion. Must render inside `<EngineProvider>`.
 */
export function Magnetic({ children, className, ...options }: MagneticProps) {
  const ref = useMagnetic<HTMLDivElement>(options);
  return (
    <div ref={ref} className={cn('inline-block will-change-transform', className)}>
      {children}
    </div>
  );
}
