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
import { useEngineOptional } from '@/hooks/useEngine';
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
  const engine = useEngineOptional();
  const horizontal = isDesktop && !reduced;

  // Motion-blur state (desktop only), eased toward scroll velocity.
  const blur = useRef({ v: 0, cur: 0 });
  // Debounced Lenis-native snap: settle on a chapter when scrolling pauses
  // (ScrollTrigger's own snap fights Lenis, so we drive Lenis directly). The
  // snap is DIRECTIONAL — a modest push in a direction advances one chapter
  // rather than pulling back to the nearest — so it never feels sticky.
  const snapTimer = useRef(0);
  const dir = useRef(1); // last non-zero scroll direction
  useScrollFrame((p) => {
    blur.current.v = Math.min(9, Math.abs(p.velocity) * 0.12);
    if (p.direction !== 0) dir.current = p.direction;
    if (!horizontal || !engine) return;
    // Only schedule a snap once motion has essentially stopped — otherwise the
    // debounce would fire between wheel ticks and yank back mid-gesture.
    window.clearTimeout(snapTimer.current);
    if (Math.abs(p.velocity) > 0.06) return;
    snapTimer.current = window.setTimeout(() => {
      const N = CHAPTERS.length;
      const exact = p.progress * (N - 1);
      const base = Math.floor(exact + 1e-4);
      const frac = exact - base;
      // Forward: cross ~12% of the gap to advance. Backward: symmetric.
      let idx = dir.current > 0 ? (frac > 0.12 ? base + 1 : base) : frac < 0.88 ? base : base + 1;
      idx = Math.max(0, Math.min(N - 1, idx));
      const target = (idx / (N - 1)) * p.limit;
      if (Math.abs(target - p.scroll) > 6) engine.scroll.scrollTo(target, { duration: 0.7 });
    }, 90);
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
      panels.forEach((panel, i) => {
        const h = panel.querySelector<HTMLElement>('[data-headline]');
        let split: SplitText | null = null;
        if (h) {
          split = new SplitText(h, { type: 'lines', mask: 'lines', linesClass: 'split-line' });
          gsap.set(split.lines, { yPercent: 115 });
        }
        const reveals = panel.querySelectorAll<HTMLElement>('[data-reveal]');
        gsap.set(reveals, { y: 42, autoAlpha: 0 });

        const build = (tl: gsap.core.Timeline) => {
          if (split) {
            tl.to(split.lines, { yPercent: 0, duration: 1, ease: 'expo.out', stagger: 0.12 }, 0);
          }
          tl.to(reveals, { y: 0, autoAlpha: 1, duration: 0.9, ease: 'expo.out', stagger: 0.08 }, 0.12);
        };

        if (i === 0) {
          // Panel 0 is centre-stage at load — play its reveal directly (a
          // containerAnimation trigger only fires once the track scrolls).
          build(gsap.timeline({ delay: 0.35 }));
        } else {
          build(
            gsap.timeline({
              scrollTrigger: {
                trigger: panel,
                containerAnimation: scrub,
                start: 'left 68%',
                end: 'left 24%',
                toggleActions: 'play none none reverse',
              },
            }),
          );
        }
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
