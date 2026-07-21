'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { MagneticButton } from './MagneticButton';

/**
 * The close — a calm, deliberate invitation. The one strong accent moment of
 * the page (the consultation button). Reveals as it enters view.
 */
export function Invitation() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from('[data-invite]', {
        autoAlpha: 0,
        y: 20,
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: 'top 75%' },
      });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={ref}
      id="contact"
      className="mt-28 border-t border-line px-6 py-28 md:mt-40 md:px-10 md:py-44"
    >
      <div className="mx-auto max-w-[1240px]">
        <h2
          data-invite
          className="max-w-[16ch] font-display text-[clamp(2rem,5vw,4rem)] font-medium leading-[1.05] tracking-[-0.03em] text-signal"
        >
          Recognise any of these? <span className="text-flux">Let’s solve yours.</span>
        </h2>
        <div data-invite className="mt-10">
          <MagneticButton href="mailto:abhishekrathod630@gmail.com" intent="primary" size="lg">
            Request a consultation
          </MagneticButton>
        </div>
        <p data-invite className="mt-10 font-mono text-2xs uppercase tracking-[0.24em] text-fog-dim">
          Abhishek Shah — UK · UAE · India — remote worldwide
        </p>
      </div>
    </section>
  );
}
