'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib';
import { useTilt, type UseTiltOptions } from '@/animation/hooks/useTilt';

export interface TiltProps extends UseTiltOptions {
  children: ReactNode;
  className?: string;
}

/**
 * 3D pointer-tilt wrapper (over `useTilt`) — the interaction for project cards.
 * Auto-disabled under reduced motion. Must render inside `<EngineProvider>`.
 */
export function Tilt({ children, className, ...options }: TiltProps) {
  const ref = useTilt<HTMLDivElement>(options);
  return (
    <div ref={ref} className={cn('will-change-transform', className)}>
      {children}
    </div>
  );
}
