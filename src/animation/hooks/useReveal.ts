'use client';

import { useRef } from 'react';
import { useEngine } from '@/hooks/useEngine';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { revealUp, type RevealOptions } from '../presets/reveal';

export interface UseRevealOptions extends RevealOptions {
  /** ScrollTrigger start position. */
  start?: string;
  /** Only play once (default true). */
  once?: boolean;
  /** Optional child selector to stagger instead of the root element. */
  targets?: string;
}

/**
 * Attach a scroll-triggered "reveal up" entrance to an element ref.
 *
 * Built on the shared `revealUp` preset + ScrollTrigger, scoped in a GSAP
 * context so it reverts cleanly on unmount. Respects reduced-motion by
 * collapsing the animation to its end state.
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseRevealOptions = {},
) {
  const engine = useEngine();
  const ref = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { gsap, ScrollTrigger, reducedMotion } = engine.animation;
    const targets = options.targets ? el.querySelectorAll(options.targets) : el;

    const ctx = gsap.context(() => {
      const tween = revealUp(targets, { ...options, reducedMotion });
      tween.pause();
      ScrollTrigger.create({
        trigger: el,
        start: options.start ?? 'top 85%',
        once: options.once ?? true,
        animation: tween,
        toggleActions: 'play none none none',
      });
    }, el);

    return () => ctx.revert();
    // Options are read once at mount — this is entrance configuration.
  }, [engine]);

  return ref;
}
