'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useTick } from '@/hooks/useTick';
import { useScrollFrame } from '@/hooks/useScroll';
import { ChapterPanel } from './ChapterPanel';
import { CHAPTERS } from './content';
import { useTraverse } from './traverse';

/**
 * The traverse engine — the reference's "continuous horizontal journey".
 *
 * Desktop: one pinned section; vertical scroll scrubs a horizontal track of
 * full-viewport chapter panels over the held world. Each panel's headline
 * mask-reveals (SplitText lines) as it reaches centre; fast travel adds
 * velocity-driven motion blur. Mobile / reduced-motion: panels stack vertically
 * with the same reveal language and no pin.
 */
export function TraverseEngine() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { setActive } = useTraverse();
  const horizontal = isDesktop && !reduced;

  // Motion-blur state (desktop only), eased toward scroll velocity.
  const blur = useRef({ v: 0, cur: 0 });
  useScrollFrame((p) => {
    blur.current.v = Math.min(9, Math.abs(p.velocity) * 0.12);
  });
  useTick(() => {
    if (!horizontal) return;
    const el = trackRef.current;
    if (!el) return;
    const b = blur.current;
    b.cur += (b.v - b.cur) * 0.18;
    b.v *= 0.82; // decay so it settles to 0 when the scroll stops
    el.style.filter = b.cur > 0.12 ? `blur(${b.cur.toFixed(2)}px)` : '';
  });

  // Desktop: pinned horizontal scrub + per-panel reveals.
  useIsomorphicLayoutEffect(() => {
    if (!horizontal) return;
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;
    gsap.registerPlugin(ScrollTrigger, SplitText);
    const N = CHAPTERS.length;

    const ctx = gsap.context(() => {
      const distance = () => track.scrollWidth - window.innerWidth;

      const scrub = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setActive(Math.round(self.progress * (N - 1))),
        },
      });

      const panels = gsap.utils.toArray<HTMLElement>('[data-panel]', track);
      panels.forEach((panel) => {
        const h = panel.querySelector<HTMLElement>('[data-headline]');
        let split: SplitText | null = null;
        if (h) {
          split = new SplitText(h, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
          gsap.set(split.lines, { yPercent: 115 });
        }
        const reveals = panel.querySelectorAll<HTMLElement>('[data-reveal]');
        gsap.set(reveals, { y: 42, autoAlpha: 0 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: panel,
            containerAnimation: scrub,
            start: 'left 68%',
            end: 'left 24%',
            toggleActions: 'play none none reverse',
          },
        });
        if (split) {
          tl.to(split.lines, { yPercent: 0, duration: 1, ease: 'expo.out', stagger: 0.12 }, 0);
        }
        tl.to(
          reveals,
          { y: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out', stagger: 0.08 },
          0.12,
        );
      });

      ScrollTrigger.refresh();
    }, root);

    return () => ctx.revert();
  }, [horizontal, setActive]);

  // Vertical fallback: track which panel is centred (drives the HUD) + reveals.
  useIsomorphicLayoutEffect(() => {
    if (horizontal) return;
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('[data-panel]', root);
      panels.forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => self.isActive && setActive(i),
        });
        if (!reduced) {
          gsap.from(panel.querySelectorAll('[data-reveal], [data-headline]'), {
            y: 30,
            autoAlpha: 0,
            duration: 0.8,
            ease: 'expo.out',
            stagger: 0.07,
            scrollTrigger: { trigger: panel, start: 'top 75%' },
          });
        }
      });
    }, root);
    return () => ctx.revert();
  }, [horizontal, reduced, setActive]);

  return (
    <div ref={rootRef} className={horizontal ? 'relative h-screen overflow-hidden' : 'relative'}>
      <div
        ref={trackRef}
        className={
          horizontal ? 'flex h-screen w-max flex-nowrap will-change-transform' : 'flex flex-col'
        }
      >
        {CHAPTERS.map((chapter) => (
          <ChapterPanel key={chapter.id} chapter={chapter} />
        ))}
      </div>
    </div>
  );
}
