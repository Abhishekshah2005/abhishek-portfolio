'use client';

import { Suspense, useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useSceneContent } from '@/providers/SceneProvider';
import { cn } from '@/lib';
import { MagneticButton } from './MagneticButton';

// Subtle abstract WebGL aura — lazy + client-only so Three stays out of the
// initial bundle and the server render.
const HeroAuraLazy = dynamic(() => import('@/three/scenes').then((m) => m.HeroAura), { ssr: false });

const HEADLINE = ['Build.', 'Automate.', 'Scale.'];
const TAGS = [
  'UK · Dubai · India Accounting',
  'CFO Strategy',
  'AI Agents',
  'Automation',
  'SaaS & Web',
  'CRM',
  'Custom Software',
];

/**
 * Home hero — the strongest premium first impression. Editorial typography with
 * a masked word reveal, magnetic CTAs, a restrained abstract aura behind, and a
 * clear lead-gen value proposition (Finance × Technology × AI). Fully SSR'd for
 * SEO; entrance animated with GSAP; reduced-motion shows the final state.
 */
export function Hero() {
  useSceneContent(
    <Suspense fallback={null}>
      <HeroAuraLazy />
    </Suspense>,
  );
  const rootRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (reduced) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
      tl.from('[data-eyebrow]', { autoAlpha: 0, y: 12, duration: 0.7 })
        .from('[data-word]', { yPercent: 120, duration: 0.9, stagger: 0.09 }, '-=0.3')
        .from('[data-sub]', { autoAlpha: 0, y: 16, duration: 0.8 }, '-=0.5')
        .from('[data-cta]', { autoAlpha: 0, y: 14, duration: 0.7, stagger: 0.1 }, '-=0.5')
        .from('[data-trust]', { autoAlpha: 0, y: 12, duration: 0.7 }, '-=0.4');
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section id="top" ref={rootRef} className="relative flex min-h-[100svh] items-center overflow-hidden">
      <div className="mx-auto w-full max-w-[1200px] px-6 pb-24 pt-36 md:px-10 md:pt-44">
        <div className="max-w-4xl">
          <p
            data-eyebrow
            className="mb-6 flex items-center gap-2.5 font-mono text-2xs uppercase tracking-[0.28em] text-fog"
          >
            <span className="size-1.5 rounded-full bg-flux" />
            Abhishek Shah — Finance × Technology × AI
          </p>

          <h1 className="font-display font-semibold text-signal text-display">
            {HEADLINE.map((word, i) => (
              <span key={word} className="block overflow-hidden pb-[0.05em]">
                <span data-word className={cn('inline-block', i === 2 && 'text-flux')}>
                  {word}
                </span>
              </span>
            ))}
          </h1>

          <p data-sub className="mt-8 max-w-xl text-lg text-fog md:text-xl">
            The rare blend of CFO-grade finance and AI-native engineering. I build the systems,
            agents, and automations that turn your operations into growth.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <span data-cta className="inline-flex">
              <MagneticButton href="#contact" intent="primary" size="lg">
                Book a strategy call
              </MagneticButton>
            </span>
            <span data-cta className="inline-flex">
              <MagneticButton href="#work" intent="secondary" size="lg">
                Explore my work
              </MagneticButton>
            </span>
          </div>

          <div data-trust className="mt-16 flex flex-wrap items-center gap-x-2.5 gap-y-2">
            {TAGS.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-line bg-obsidian px-3 py-1.5 text-xs text-fog"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
