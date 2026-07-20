'use client';

import { useRef } from 'react';
import { useEngine } from '@/hooks/useEngine';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { splitText, type SplitType } from '../core/splitText';
import { textReveal, type RevealOptions } from '../presets/reveal';

export interface UseTextRevealOptions extends RevealOptions {
  /** Granularity of the reveal. */
  split?: SplitType;
  start?: string;
  once?: boolean;
}

/**
 * Split an element's text and reveal it per-character or per-word on scroll.
 *
 * The split DOM is reverted on unmount (restoring the accessible text), and
 * the whole animation lives in a GSAP context for leak-free teardown.
 */
export function useTextReveal<T extends HTMLElement = HTMLHeadingElement>(
  options: UseTextRevealOptions = {},
) {
  const engine = useEngine();
  const ref = useRef<T>(null);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    const { gsap, ScrollTrigger, reducedMotion } = engine.animation;
    const type: SplitType = options.split ?? 'chars';
    const result = splitText(el, type === 'chars' ? ['chars', 'words'] : [type]);
    const parts = type === 'chars' ? result.chars : type === 'lines' ? result.lines : result.words;

    const ctx = gsap.context(() => {
      const tween = textReveal(parts, { stagger: 0.02, ...options, reducedMotion });
      tween.pause();
      ScrollTrigger.create({
        trigger: el,
        start: options.start ?? 'top 85%',
        once: options.once ?? true,
        animation: tween,
        toggleActions: 'play none none none',
      });
    }, el);

    return () => {
      ctx.revert();
      result.revert();
    };
    // Split configuration is applied once at mount.
  }, [engine]);

  return ref;
}
