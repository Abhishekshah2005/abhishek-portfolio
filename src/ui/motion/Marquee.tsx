'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib';
import { useMarquee, type UseMarqueeOptions } from '@/animation/hooks/useMarquee';

export interface MarqueeProps extends UseMarqueeOptions {
  children: ReactNode;
  className?: string;
}

/**
 * Infinite, velocity-reactive marquee (over `useMarquee`). Duplicate the
 * children so the track wraps seamlessly at half-width. Must render inside
 * `<EngineProvider>`.
 */
export function Marquee({ children, className, ...options }: MarqueeProps) {
  const ref = useMarquee<HTMLDivElement>(options);
  return (
    <div className={cn('overflow-hidden', className)}>
      <div ref={ref} className="flex w-max will-change-transform">
        {children}
      </div>
    </div>
  );
}
