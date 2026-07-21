'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { MagneticButton } from './MagneticButton';

/**
 * Opening composition — "The Ledger". Trust-first, editorial, typography as the
 * hero: a warm-paper spread with a serif statement of practice, an offset
 * standfirst, one restrained consultation link, and a folio. Motion is quiet and
 * purposeful — hairlines draw, lines mask up. No headline-shouting, no graphics.
 */
export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from('[data-rule]', { scaleX: 0, transformOrigin: 'left center', duration: 1, stagger: 0.12 })
        .from('[data-kicker]', { autoAlpha: 0, y: 10, duration: 0.6 }, '-=0.6')
        .from('[data-line]', { yPercent: 115, duration: 1.15, stagger: 0.12 }, '-=0.35')
        .from('[data-stand]', { autoAlpha: 0, y: 16, duration: 0.9 }, '-=0.65')
        .from('[data-cta]', { autoAlpha: 0, y: 12, duration: 0.7 }, '-=0.6')
        .from('[data-folio]', { autoAlpha: 0, y: 8, duration: 0.6 }, '-=0.5');

      // First scroll: the composition drifts up a touch (fuller transform comes
      // once the next composition is in place).
      gsap.to('[data-inner]', {
        y: -48,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={sectionRef} id="top" className="relative min-h-[100svh] w-full">
      <div
        data-inner
        className="mx-auto flex min-h-[100svh] max-w-[1240px] flex-col justify-end px-6 pb-14 pt-32 md:px-10 md:pb-16"
      >
        <div className="grid grid-cols-1 gap-x-10 gap-y-12 md:grid-cols-12 md:items-end">
          {/* Statement */}
          <div className="md:col-span-8">
            <div className="mb-8 flex items-center gap-4">
              <span data-rule className="block h-px w-14 bg-signal" />
              <span data-kicker className="font-mono text-2xs uppercase tracking-[0.28em] text-fog">
                For founders &amp; finance leaders
              </span>
            </div>
            <h1 className="font-display text-[clamp(2.4rem,6.4vw,5.5rem)] font-medium leading-[1.02] tracking-[-0.015em] text-signal">
              <span className="block overflow-hidden pb-[0.06em]">
                <span data-line className="block">
                  I look after the numbers —
                </span>
              </span>
              <span className="block overflow-hidden pb-[0.06em]">
                <span data-line className="block">
                  and build what makes them grow.
                </span>
              </span>
            </h1>
          </div>

          {/* Standfirst + consultation */}
          <div className="md:col-span-4 md:pb-2">
            <p data-stand className="max-w-sm text-base leading-relaxed text-fog md:text-lg">
              Accounting, audit and CFO strategy across the UK, UAE and India — paired with the AI,
              automation, software and systems that turn financial clarity into growth.
            </p>
            <div data-cta className="mt-8">
              <MagneticButton
                href="#contact"
                intent="ghost"
                size="md"
                className="!px-0 font-mono text-2xs uppercase tracking-[0.24em] text-signal hover:text-flux hover:!bg-transparent"
              >
                Request a consultation&nbsp;&rarr;
              </MagneticButton>
            </div>
          </div>
        </div>

        {/* Folio */}
        <div
          data-folio
          className="mt-16 flex items-center justify-between border-t border-line pt-5 font-mono text-2xs uppercase tracking-[0.24em] text-fog-dim"
        >
          <span>Finance &times; Technology</span>
          <span className="hidden md:inline">Abhishek&nbsp;Shah</span>
          <span aria-hidden className="flex items-center gap-2">
            Scroll
            <span data-rule className="block h-px w-8 bg-current" />
          </span>
        </div>
      </div>
    </section>
  );
}
