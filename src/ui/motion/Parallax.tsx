'use client';

import type { ReactNode } from 'react';
import { useParallax, type UseParallaxOptions } from '@/animation/hooks/useParallax';

export interface ParallaxProps extends UseParallaxOptions {
  children: ReactNode;
  className?: string;
}

/**
 * Depth-parallax wrapper (over `useParallax`) synced to the engine ticker /
 * Lenis. Auto-disabled under reduced motion. Must render inside
 * `<EngineProvider>`.
 */
export function Parallax({ children, className, ...options }: ParallaxProps) {
  const ref = useParallax<HTMLDivElement>(options);
  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
