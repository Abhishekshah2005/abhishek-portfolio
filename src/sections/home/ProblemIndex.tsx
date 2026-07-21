'use client';

import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib';
import { PROBLEMS, GROUPS, type Discipline, type Problem } from './problems';

function Tag({ label }: { label: Discipline }) {
  const accent = label !== 'Business';
  return (
    <span
      className={cn(
        'rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]',
        accent ? 'border-flux/35 text-flux' : 'border-line text-fog',
      )}
    >
      {label}
    </span>
  );
}

function Row({
  problem,
  index,
  open,
  onToggle,
  panelRef,
}: {
  problem: Problem;
  index: number;
  open: boolean;
  onToggle: () => void;
  panelRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div data-row className="border-t border-line">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="group flex w-full items-center gap-5 py-6 text-left md:gap-8 md:py-7"
      >
        <span className="w-6 shrink-0 font-mono text-2xs tabular-nums text-fog-dim">
          {String(index + 1).padStart(2, '0')}
        </span>
        <span className="flex-1 font-display text-xl font-medium tracking-tight text-signal transition-colors duration-300 group-hover:text-flux md:text-3xl">
          {problem.problem}
        </span>
        <span className="hidden shrink-0 items-center gap-2 md:flex">
          {problem.disciplines.map((d) => (
            <Tag key={d} label={d} />
          ))}
        </span>
        <span
          className={cn(
            'shrink-0 font-mono text-lg text-fog transition-all duration-300 group-hover:text-flux',
            open && 'rotate-45',
          )}
          aria-hidden
        >
          +
        </span>
      </button>

      <div ref={panelRef} className="h-0 overflow-hidden opacity-0">
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 pb-8 pl-11 pr-2 md:grid-cols-12 md:pl-14">
          <p className="text-base leading-relaxed text-fog md:col-span-7 md:text-lg">
            {problem.solution}
          </p>
          <div className="flex flex-col gap-4 md:col-span-5 md:items-end md:text-right">
            <span className="font-display text-lg font-medium text-flux md:text-xl">{problem.proof}</span>
            <span className="flex gap-2 md:hidden">
              {problem.disciplines.map((d) => (
                <Tag key={d} label={d} />
              ))}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * THE INDEX — the homepage. A confident, scannable index of the business
 * problems Abhishek solves, grouped and tagged by discipline (Finance /
 * Software / AI), each opening to its solution + a proof figure. Problem-first,
 * so a visitor recognises their own pain immediately. Accordion via animated
 * height (siblings flow naturally); rows reveal on scroll; reduced-motion safe.
 */
export function ProblemIndex() {
  const rootRef = useRef<HTMLElement>(null);
  const panels = useRef<Record<string, HTMLDivElement | null>>({});
  const [openId, setOpenId] = useState<string | null>(null);
  const reduced = useReducedMotion();

  // Drive the accordion: the open panel expands, all others collapse.
  useIsomorphicLayoutEffect(() => {
    Object.entries(panels.current).forEach(([id, el]) => {
      if (!el) return;
      const isOpen = id === openId;
      if (reduced) {
        gsap.set(el, { height: isOpen ? 'auto' : 0, autoAlpha: isOpen ? 1 : 0 });
        return;
      }
      gsap.to(el, {
        height: isOpen ? 'auto' : 0,
        autoAlpha: isOpen ? 1 : 0,
        duration: 0.55,
        ease: 'power3.inOut',
        overwrite: true,
      });
    });
  }, [openId, reduced]);

  // Rows reveal as the index scrolls into view.
  useIsomorphicLayoutEffect(() => {
    const el = rootRef.current;
    if (!el || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from('[data-row]', {
        autoAlpha: 0,
        y: 20,
        duration: 0.7,
        ease: 'expo.out',
        stagger: 0.06,
        scrollTrigger: { trigger: el, start: 'top 78%' },
      });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  let counter = 0;

  return (
    <section ref={rootRef} className="px-6 pt-28 md:px-10 md:pt-40">
      <div className="mx-auto max-w-[1240px]">
        <div className="mb-4 flex items-end justify-between">
          <span className="font-mono text-2xs uppercase tracking-[0.28em] text-fog">
            The problems I solve
          </span>
          <span className="font-mono text-2xs tabular-nums text-fog-dim">
            {String(PROBLEMS.length).padStart(2, '0')} — solved
          </span>
        </div>

        {GROUPS.map((group) => (
          <div key={group} className="mt-14 first:mt-0">
            <h2 className="mb-1 font-mono text-2xs uppercase tracking-[0.28em] text-flux">{group}</h2>
            <div>
              {PROBLEMS.filter((p) => p.group === group).map((problem) => {
                const index = counter++;
                return (
                  <Row
                    key={problem.id}
                    problem={problem}
                    index={index}
                    open={openId === problem.id}
                    onToggle={() => setOpenId((o) => (o === problem.id ? null : problem.id))}
                    panelRef={(el) => {
                      panels.current[problem.id] = el;
                    }}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
