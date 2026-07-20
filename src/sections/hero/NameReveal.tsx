'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ScrambleText } from '@/experience/boot';
import { CapabilityChips } from './CapabilityChips';

const NAME = 'Abhishek';

/**
 * The name does not fade in — it *assembles*. Letters rise + rotate out of a
 * mask (GSAP), while the eyebrow and tagline decode via scramble. Plays once
 * the boot dissolves (`active`). Reduced motion shows it instantly; the h1 is
 * labelled so screen readers read the whole name, not per letter.
 */
export function NameReveal({ active }: { active: boolean }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const charRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const reduced = useReducedMotion();

  useIsomorphicLayoutEffect(() => {
    const el = rootRef.current;
    if (!el || !active) return;
    if (reduced) {
      gsap.set(el, { autoAlpha: 1 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.set(el, { autoAlpha: 1 });
      gsap.from(charRefs.current.filter(Boolean), {
        yPercent: 120,
        autoAlpha: 0,
        rotateX: -50,
        transformOrigin: '50% 100%',
        duration: 0.9,
        ease: 'expo.out',
        stagger: 0.05,
      });
    }, el);
    return () => ctx.revert();
  }, [active, reduced]);

  return (
    <div ref={rootRef} className="pointer-events-none absolute bottom-[15vh] left-6 opacity-0 md:left-10">
      <p className="mb-4 font-mono text-2xs uppercase tracking-[0.3em] text-flux">
        {active && <ScrambleText text="operator // creative technologist" duration={0.8} />}
      </p>
      <h1
        aria-label={NAME}
        style={{ textShadow: '0 0 60px color-mix(in oklab, var(--color-flux) 28%, transparent)' }}
        className="flex font-display text-[clamp(3rem,10vw,7rem)] font-semibold leading-[0.9] tracking-tight text-signal"
      >
        {NAME.split('').map((ch, i) => (
          <span key={i} aria-hidden className="inline-block overflow-hidden pb-[0.08em]">
            <span
              ref={(el) => {
                charRefs.current[i] = el;
              }}
              className="inline-block"
            >
              {ch}
            </span>
          </span>
        ))}
      </h1>
      <p className="mt-5 max-w-md font-sans text-lg text-fog">
        {active && <ScrambleText text="I engineer complete digital products." duration={1.1} />}
      </p>
      <CapabilityChips active={active} />
    </div>
  );
}
