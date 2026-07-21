'use client';

import { Suspense, useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useSceneContent } from '@/providers/SceneProvider';
import { MagneticButton } from './MagneticButton';

// The object is lazy + client-only (Three stays out of the server render).
const HeroObjectLazy = dynamic(() => import('@/three/scenes').then((m) => m.HeroObject), { ssr: false });

/**
 * The Hero — the object is the hero, not the words. A black cinematic stage
 * (rendered by the canvas), one restrained sentence, immense negative space. The
 * first scroll changes perspective: the object rotates and swells while the
 * words recede. Premium before animated.
 */
export function Hero() {
  useSceneContent(
    <Suspense fallback={null}>
      <HeroObjectLazy />
    </Suspense>,
  );
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = sectionRef.current;
    if (!el || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'expo.out' } })
        .from('[data-line]', { yPercent: 120, duration: 1.1, stagger: 0.14 }, 0.25)
        .from('[data-fade]', { autoAlpha: 0, y: 14, duration: 0.9, stagger: 0.12 }, '-=0.55');

      gsap.to('[data-hero-copy]', {
        autoAlpha: 0,
        y: -48,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: '45% top', scrub: true },
      });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section ref={sectionRef} id="top" className="relative h-[160vh]">
      <div className="sticky top-0 flex h-screen w-full flex-col justify-end overflow-hidden">
        {/* Cinematic vignette (darkens the frame edges over the object). */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(125% 95% at 50% 32%, transparent 52%, rgba(0,0,0,0.55) 100%)' }}
        />

        <div data-hero-copy className="relative z-10 mx-auto w-full max-w-[1200px] px-6 pb-[15vh] md:px-10">
          <h1 className="max-w-2xl font-display text-[1.9rem] font-medium leading-[1.16] tracking-tight text-[#F4F1EA] md:text-5xl">
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-line className="block">
                The rigour of finance.
              </span>
            </span>
            <span className="block overflow-hidden pb-[0.06em]">
              <span data-line className="block text-white/55">
                The craft of technology.
              </span>
            </span>
          </h1>

          <div data-fade className="mt-9">
            <MagneticButton
              href="#contact"
              intent="ghost"
              size="md"
              className="!px-0 text-[#F4F1EA] hover:text-white hover:!bg-transparent"
            >
              Start a conversation&nbsp;→
            </MagneticButton>
          </div>
        </div>

        {/* Scroll hint */}
        <div
          data-fade
          className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-white/40"
        >
          <span className="font-mono text-2xs uppercase tracking-[0.3em]">Scroll</span>
          <span className="h-8 w-px bg-white/20" />
        </div>
      </div>
    </section>
  );
}
