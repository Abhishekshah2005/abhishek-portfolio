'use client';

import { Suspense, useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { SplitText } from 'gsap/SplitText';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useSceneContent } from '@/providers/SceneProvider';
import { useChapter } from '@/story';
import { cn } from '@/lib';
import { MagneticButton } from './MagneticButton';

const HomeHeroSceneLazy = dynamic(() => import('@/three/scenes').then((m) => m.HomeHeroScene), {
  ssr: false,
});

const WORDS = ['Finance', 'Technology', 'Intelligence'];
const WORD_SIZE = 'clamp(2.75rem, 11vw, 10rem)';

/**
 * The opening experience. A living intelligence network breathes behind a
 * colossal word that morphs — Finance → Technology → Intelligence — as you
 * scroll (SplitText, pinned scrub), resolving into the Finance × Technology × AI
 * lockup. A persistent value proposition + magnetic CTA keep the lead-gen intent
 * clear throughout. Fully SSR'd; reduced-motion shows a calm resolved state.
 */
export function Hero() {
  useSceneContent(
    <Suspense fallback={null}>
      <HomeHeroSceneLazy />
    </Suspense>,
  );

  const sectionRef = useRef<HTMLElement>(null);
  const wordRefs = useRef<Array<HTMLDivElement | null>>([]);
  const lockupRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  useChapter(sectionRef, 0, 'Arrival');

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    gsap.registerPlugin(SplitText, ScrollTrigger);

    const splits = wordRefs.current.map((el) => {
      const target = el?.querySelector<HTMLElement>('.hero-word');
      return target ? new SplitText(target, { type: 'chars' }) : null;
    });
    const chars = splits.map((s) => s?.chars ?? []);

    const ctx = gsap.context(() => {
      const wordEls = wordRefs.current.filter((el): el is HTMLDivElement => Boolean(el));

      if (reduced) {
        gsap.set(wordEls, { autoAlpha: 0 });
        gsap.set(lockupRef.current, { autoAlpha: 1, yPercent: 0 });
        return;
      }

      // Reveal word containers; hide chars of words 2 & 3 until their turn.
      gsap.set(wordEls, { autoAlpha: 1 });
      gsap.set([...chars[1], ...chars[2]], { yPercent: 120, autoAlpha: 0 });
      gsap.set(lockupRef.current, { autoAlpha: 0, yPercent: 40 });

      // Intro (autoplay): chrome + first word assemble.
      const intro = gsap.timeline({ defaults: { ease: 'expo.out' } });
      intro
        .from('[data-eyebrow]', { autoAlpha: 0, y: 10, duration: 0.6, stagger: 0.1 })
        .from(chars[0], { yPercent: 120, autoAlpha: 0, duration: 0.9, stagger: 0.03 }, 0.1)
        .from('[data-value]', { autoAlpha: 0, y: 18, duration: 0.8 }, '-=0.5')
        .from('[data-cta]', { autoAlpha: 0, y: 14, duration: 0.7, stagger: 0.1 }, '-=0.5');

      // Scrubbed morph across the pinned section. Explicit fromTo +
      // immediateRender:false so words never flash out of sequence.
      const st = gsap.timeline({
        scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 1 },
        defaults: { immediateRender: false, stagger: { amount: 0.25 } },
      });
      st.fromTo(chars[0], { yPercent: 0, autoAlpha: 1 }, { yPercent: -120, autoAlpha: 0, ease: 'power2.in' }, 0.0)
        .fromTo(chars[1], { yPercent: 120, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, ease: 'power2.out' }, 0.14)
        .fromTo(chars[1], { yPercent: 0, autoAlpha: 1 }, { yPercent: -120, autoAlpha: 0, ease: 'power2.in' }, 0.42)
        .fromTo(chars[2], { yPercent: 120, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, ease: 'power2.out' }, 0.56)
        .fromTo(chars[2], { yPercent: 0, autoAlpha: 1 }, { yPercent: -120, autoAlpha: 0, ease: 'power2.in' }, 0.82)
        .fromTo(
          lockupRef.current,
          { autoAlpha: 0, yPercent: 40 },
          { autoAlpha: 1, yPercent: 0, ease: 'power2.out' },
          0.86,
        );

    }, section);

    return () => {
      ctx.revert();
      splits.forEach((s) => s?.revert());
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className={cn('relative', reduced ? 'min-h-screen' : 'h-[320vh]')}
      aria-label="Abhishek Shah — Finance, Technology and AI"
    >
      <div className="sticky top-0 flex h-screen w-full flex-col overflow-hidden">
        {/* Eyebrow + index */}
        <p
          data-eyebrow
          className="absolute left-6 top-28 flex items-center gap-2.5 font-mono text-2xs uppercase tracking-[0.28em] text-fog md:left-10 md:top-32"
        >
          <span className="size-1.5 rounded-full bg-flux" />
          Abhishek Shah
        </p>
        <p
          data-eyebrow
          className="absolute right-6 top-28 font-mono text-2xs uppercase tracking-[0.28em] text-fog-dim md:right-10 md:top-32"
        >
          Finance × Tech × AI
        </p>

        {/* Colossal morphing word + resolved lockup */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          {WORDS.map((word, i) => (
            <div
              key={word}
              ref={(el) => {
                wordRefs.current[i] = el;
              }}
              className={cn('absolute inset-0 flex items-center justify-center px-4', i > 0 && 'opacity-0')}
            >
              <span className="inline-block overflow-hidden pb-[0.14em] leading-none">
                <span
                  className="hero-word inline-block whitespace-nowrap font-display font-semibold tracking-[-0.04em] text-signal"
                  style={{ fontSize: WORD_SIZE }}
                >
                  {word}
                </span>
              </span>
            </div>
          ))}
          <div ref={lockupRef} className="absolute inset-0 flex items-center justify-center px-6 opacity-0">
            <span className="text-center font-display text-2xl font-medium tracking-tight text-signal md:text-4xl">
              Finance <span className="text-flux">×</span> Technology <span className="text-flux">×</span> AI
            </span>
          </div>
        </div>

        {/* Persistent value proposition + CTA */}
        <div className="absolute bottom-[11vh] left-6 max-w-md md:left-10">
          <p data-value className="text-lg text-fog md:text-xl">
            I build, automate &amp; scale businesses — where{' '}
            <span className="text-signal">finance meets AI</span>.
          </p>
          <div className="mt-6 flex items-center gap-5">
            <span data-cta className="inline-flex">
              <MagneticButton href="#contact" intent="primary" size="lg">
                Book a strategy call
              </MagneticButton>
            </span>
            <a
              data-cta
              data-cursor
              href="#work"
              className="group inline-flex items-center gap-2 text-sm font-medium text-signal transition-colors hover:text-flux"
            >
              See the work
              <span className="transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
            </a>
          </div>
        </div>

      </div>
    </section>
  );
}
