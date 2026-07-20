'use client';

import { useRef, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { gsap } from 'gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { pageEnter } from '@/animation/presets';

/**
 * Per-route enter animation. Drop this in a route `template.tsx` (which React
 * remounts on every navigation) to fade + rise fresh content into view. Pairs
 * with `TransitionProvider`'s mask wipe for the full cinematic swap. Reduced
 * motion collapses it to an instant show.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      pageEnter(el, { reducedMotion: reduced });
    }, el);
    return () => ctx.revert();
    // Re-run on route change.
  }, [pathname, reduced]);

  return <div ref={ref}>{children}</div>;
}
