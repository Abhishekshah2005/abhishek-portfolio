'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useChapter } from '@/story';
import { cn } from '@/lib';

const CENTER = { x: 400, y: 250 };
const NODES = [
  { x: 170, y: 150, label: 'Finance' },
  { x: 630, y: 150, label: 'Technology & AI' },
  { x: 400, y: 415, label: 'Business' },
];
const HEADING = ['Three disciplines.', 'One operator.', 'Complete products.'];

/**
 * Scene 01 — The Combination. The Hero's network collapses to a point, then the
 * Through-Line draws a diagram: three disciplines wired to one central "your
 * business" node. Pinned + scrub: the heading rises, the centre ignites, the
 * lines draw outward, the nodes pop. Nothing appears — it draws itself in.
 */
export function Combination() {
  const sectionRef = useRef<HTMLElement>(null);
  const lineRefs = useRef<Array<SVGLineElement | null>>([]);
  const nodeRefs = useRef<Array<SVGGElement | null>>([]);
  const centerRef = useRef<SVGGElement>(null);
  const reduced = useReducedMotion();
  useChapter(sectionRef, 1, 'The Combination');

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const lines = lineRefs.current.filter((l): l is SVGLineElement => Boolean(l));
      const nodes = nodeRefs.current.filter((n): n is SVGGElement => Boolean(n));
      const scalers = [centerRef.current, ...nodes].filter((el): el is SVGGElement => Boolean(el));
      const headingLines = gsap.utils.toArray<HTMLElement>('[data-cline]');

      lines.forEach((l) => {
        const len = l.getTotalLength();
        gsap.set(l, { strokeDasharray: len, strokeDashoffset: len });
      });

      if (reduced) {
        gsap.set(lines, { strokeDashoffset: 0 });
        gsap.set(scalers, { scale: 1, autoAlpha: 1 });
        gsap.set(headingLines, { yPercent: 0 });
        return;
      }

      gsap.set(scalers, { scale: 0, autoAlpha: 0, transformOrigin: 'center center' });
      gsap.set(headingLines, { yPercent: 120 });

      gsap
        .timeline({
          scrollTrigger: { trigger: section, start: 'top top', end: 'bottom bottom', scrub: 1 },
          defaults: { ease: 'power2.out' },
        })
        .to(headingLines, { yPercent: 0, stagger: 0.1, ease: 'expo.out' }, 0)
        .to(centerRef.current, { scale: 1, autoAlpha: 1 }, 0.15)
        .to(lines, { strokeDashoffset: 0, stagger: 0.12, ease: 'none' }, 0.2)
        .to(nodes, { scale: 1, autoAlpha: 1, stagger: 0.12, ease: 'back.out(1.6)' }, 0.38);
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="combination"
      className={cn('relative', reduced ? 'min-h-screen' : 'h-[200vh]')}
      aria-label="One operator. Three disciplines. Complete products."
    >
      <div className="sticky top-0 flex h-screen w-full flex-col items-center justify-center gap-12 overflow-hidden px-6">
        <div className="text-center">
          {HEADING.map((line, i) => (
            <div key={line} className="overflow-hidden pb-[0.08em]">
              <div
                data-cline
                className={cn(
                  'font-display text-3xl font-semibold tracking-tight md:text-5xl',
                  i === 1 ? 'text-flux' : 'text-signal',
                )}
              >
                {line}
              </div>
            </div>
          ))}
        </div>

        <svg viewBox="0 0 800 500" className="h-auto w-full max-w-3xl" fill="none" aria-hidden>
          {NODES.map((n, i) => (
            <line
              key={n.label}
              ref={(el) => {
                lineRefs.current[i] = el;
              }}
              x1={CENTER.x}
              y1={CENTER.y}
              x2={n.x}
              y2={n.y}
              className="stroke-flux"
              strokeWidth={1.5}
              opacity={0.5}
            />
          ))}

          <g ref={centerRef}>
            <circle cx={CENTER.x} cy={CENTER.y} r={9} className="fill-flux" />
            <circle cx={CENTER.x} cy={CENTER.y} r={22} className="stroke-flux" strokeWidth={1} opacity={0.4} />
            <text
              x={CENTER.x}
              y={CENTER.y + 44}
              textAnchor="middle"
              className="fill-fog font-mono"
              fontSize={12}
              style={{ letterSpacing: '0.2em' }}
            >
              YOUR BUSINESS
            </text>
          </g>

          {NODES.map((n, i) => (
            <g
              key={n.label}
              ref={(el) => {
                nodeRefs.current[i] = el;
              }}
            >
              <circle cx={n.x} cy={n.y} r={7} className="fill-signal" />
              <text
                x={n.x}
                y={n.y - 16}
                textAnchor="middle"
                className="fill-signal font-display"
                fontSize={18}
                fontWeight={600}
              >
                {n.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
    </section>
  );
}
