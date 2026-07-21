'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useTick } from '@/hooks/useTick';
import { useScrollFrame } from '@/hooks/useScroll';
import { useEngineOptional } from '@/hooks/useEngine';
import { PosterCard } from './PosterCard';
import { ChapterDetail } from './ChapterDetail';
import { CHAPTERS } from './content';
import { useTraverse } from './traverse';

const CARD_W = 260;
const SCROLL_FACTOR = 3.4; // scroll length per card (pacing)

/**
 * The traverse engine — the reference's sliding poster carousel.
 *
 * Desktop: one pinned section; vertical scroll scrubs a horizontal track of
 * poster cards over the held world. The card at centre fades and scales away so
 * the CenterStage headline reads through it (the card "opens"); neighbours flank
 * it. Directional velocity-gated snap settles on each card; fast travel adds
 * motion blur. Mobile / reduced-motion: chapters stack vertically as centred
 * detail blocks.
 */
export function TraverseEngine() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { setActive } = useTraverse();
  const engine = useEngineOptional();
  const horizontal = isDesktop && !reduced;

  const blur = useRef({ v: 0, cur: 0 });
  const snapTimer = useRef(0);
  const dir = useRef(1);

  useScrollFrame((p) => {
    blur.current.v = Math.min(9, Math.abs(p.velocity) * 0.12);
    if (p.direction !== 0) dir.current = p.direction;
    if (!horizontal || !engine) return;
    window.clearTimeout(snapTimer.current);
    if (Math.abs(p.velocity) > 0.06) return;
    snapTimer.current = window.setTimeout(() => {
      const N = CHAPTERS.length;
      const exact = p.progress * (N - 1);
      const base = Math.floor(exact + 1e-4);
      const frac = exact - base;
      let idx = dir.current > 0 ? (frac > 0.12 ? base + 1 : base) : frac < 0.88 ? base : base + 1;
      idx = Math.max(0, Math.min(N - 1, idx));
      const target = (idx / (N - 1)) * p.limit;
      if (Math.abs(target - p.scroll) > 6) engine.scroll.scrollTo(target, { duration: 0.7 });
    }, 90);
  });

  // Per-frame: motion blur, card fade/scale by distance to centre, and the
  // CenterStage gate (visible only when a card is centred).
  useTick(() => {
    if (!horizontal) return;
    const track = trackRef.current;
    if (!track) return;
    const b = blur.current;
    b.cur += (b.v - b.cur) * 0.18;
    b.v *= 0.82;
    track.style.filter = b.cur > 0.12 ? `blur(${b.cur.toFixed(2)}px)` : '';

    const w = window.innerWidth;
    const cx = w / 2;
    let nearOp = 1;
    let minD = Infinity;
    const cards = track.querySelectorAll<HTMLElement>('[data-card]');
    cards.forEach((card) => {
      const r = card.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - cx);
      const t = Math.min(1, d / (w * 0.42));
      const op = t * t * (3 - 2 * t);
      card.style.opacity = String(op);
      card.style.transform = `scale(${(0.84 + 0.16 * op).toFixed(3)})`;
      if (d < minD) {
        minD = d;
        nearOp = op;
      }
    });
    const cs = document.querySelector<HTMLElement>('[data-centerstage]');
    if (cs) cs.style.opacity = String(1 - nearOp);
  });

  // Desktop: pinned horizontal scrub.
  useIsomorphicLayoutEffect(() => {
    if (!horizontal) return;
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;
    gsap.registerPlugin(ScrollTrigger);
    const N = CHAPTERS.length;

    const ctx = gsap.context(() => {
      const distance = () => track.scrollWidth - window.innerWidth;
      gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: root,
          start: 'top top',
          end: () => `+=${distance() * SCROLL_FACTOR}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setActive(Math.round(self.progress * (N - 1))),
        },
      });
    }, root);

    const refresh = () => ScrollTrigger.refresh();
    const raf = requestAnimationFrame(() => requestAnimationFrame(refresh));
    document.fonts?.ready?.then(refresh).catch(() => {});
    window.addEventListener('load', refresh);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('load', refresh);
      ctx.revert();
      track.style.filter = '';
    };
  }, [horizontal, setActive]);

  // Vertical fallback: track which chapter is centred + reveal on scroll.
  useIsomorphicLayoutEffect(() => {
    if (horizontal) return;
    const root = rootRef.current;
    if (!root) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray<HTMLElement>('[data-vpanel]', root);
      panels.forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          start: 'top center',
          end: 'bottom center',
          onToggle: (self) => self.isActive && setActive(i),
        });
        if (!reduced) {
          gsap.from(panel.querySelectorAll('[data-d]'), {
            y: 28,
            autoAlpha: 0,
            duration: 0.7,
            ease: 'expo.out',
            stagger: 0.06,
            scrollTrigger: { trigger: panel, start: 'top 72%' },
          });
        }
      });
    }, root);
    return () => ctx.revert();
  }, [horizontal, reduced, setActive]);

  if (!horizontal) {
    // Mobile / reduced-motion: vertical stack of centred detail blocks.
    return (
      <div ref={rootRef} className="relative">
        {CHAPTERS.map((chapter) => (
          <section
            key={chapter.id}
            data-vpanel
            className="flex min-h-screen w-full items-center justify-center px-6 py-24"
          >
            <ChapterDetail chapter={chapter} />
          </section>
        ))}
      </div>
    );
  }

  return (
    <div ref={rootRef} className="relative flex h-screen items-center overflow-hidden">
      <div
        ref={trackRef}
        className="flex items-center gap-6 will-change-transform"
        style={{
          paddingLeft: `calc(50vw - ${CARD_W / 2}px)`,
          paddingRight: `calc(50vw - ${CARD_W / 2}px)`,
        }}
      >
        {CHAPTERS.map((chapter, i) => (
          <PosterCard key={chapter.id} chapter={chapter} index={i} />
        ))}
      </div>
    </div>
  );
}
