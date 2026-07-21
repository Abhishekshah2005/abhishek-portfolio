'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/**
 * The opening statement — what he does, in one line, above the Index. Restrained
 * grotesk; the discipline phrase carries the single accent. Quiet load reveal.
 */
export function Statement() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from('[data-kicker]', { autoAlpha: 0, y: 10, duration: 0.6 })
        .from('[data-line]', { yPercent: 115, duration: 1.1, stagger: 0.1 }, '-=0.3')
        .from('[data-sub]', { autoAlpha: 0, y: 14, duration: 0.8 }, '-=0.6');
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={ref} id="top" className="px-6 pt-36 md:px-10 md:pt-48">
      <div className="mx-auto max-w-[1240px]">
        <div data-kicker className="mb-8 flex items-center gap-4">
          <span className="block h-px w-14 bg-signal" />
          <span className="font-mono text-2xs uppercase tracking-[0.28em] text-fog">What I do</span>
        </div>
        <h1 className="max-w-[19ch] font-display text-[clamp(2.2rem,5.6vw,4.75rem)] font-medium leading-[1.05] tracking-[-0.03em] text-signal">
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-line className="block">
              I fix what slows businesses down —
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-line className="block text-flux">
              with finance, software &amp; AI.
            </span>
          </span>
        </h1>
        <p data-sub className="mt-8 max-w-xl text-base leading-relaxed text-fog md:text-lg">
          Accounting, CFO strategy and audit across the UK, UAE and India — with the automation, AI,
          CRM, apps and software that turn financial clarity into growth.
        </p>
      </div>
    </section>
  );
}
