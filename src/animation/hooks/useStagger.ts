'use client';

import { useRef } from 'react';
import { useEngine } from '@/hooks/useEngine';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { cardReveal, revealUp, type RevealOptions } from '../presets/reveal';

export interface UseStaggerOptions extends RevealOptions {
  /** Child selector to stagger. Defaults to direct children. */
  selector?: string;
  /** Entrance style. */
  variant?: 'up' | 'card';
  start?: string;
  once?: boolean;
}

/**
 * Reveal a group of child elements with a stagger as the container scrolls
 * into view — grids, lists, nav items. Scoped in a GSAP context; reduced
 * motion collapses it to the end state.
 */
export function useStagger<T extends HTMLElement = HTMLDivElement>(
  options: UseStaggerOptions = {},
) {
  const engine = useEngine();
  const ref = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { gsap, ScrollTrigger, reducedMotion } = engine.animation;
    const children = options.selector
      ? el.querySelectorAll(options.selector)
      : Array.from(el.children);

    const ctx = gsap.context(() => {
      const factory = options.variant === 'card' ? cardReveal : revealUp;
      const tween = factory(children as gsap.TweenTarget, {
        stagger: engine.config.animation.stagger,
        ...options,
        reducedMotion,
      });
      tween.pause();
      ScrollTrigger.create({
        trigger: el,
        start: options.start ?? 'top 80%',
        once: options.once ?? true,
        animation: tween,
        toggleActions: 'play none none none',
      });
    }, el);

    return () => ctx.revert();
  }, [engine]);

  return ref;
}
