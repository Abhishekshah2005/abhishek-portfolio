'use client';

import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib';
import {
  PROBLEMS,
  GROUPS,
  LENSES,
  matchesLens,
  type Discipline,
  type LensId,
  type Problem,
} from './problems';

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
 * THE INDEX — the homepage. It opens with "Diagnose": the visitor picks where
 * it hurts (Finance / Software / AI) and the Index filters to the problems
 * Abhishek solves there — the signature, useful moment. Below, a scannable index
 * grouped by outcome, each row opening to its solution + proof.
 *
 * Three independent motion layers, each on its own element so they never fight:
 *   - filter    → outer [data-rowwrap] / [data-grouphead] collapse & expand
 *   - reveal    → inner [data-row] slides in on first scroll
 *   - accordion → the solution panel height
 */
export function ProblemIndex() {
  const rootRef = useRef<HTMLElement>(null);
  const panels = useRef<Record<string, HTMLDivElement | null>>({});
  const rowWraps = useRef<Record<string, HTMLDivElement | null>>({});
  const groupHeads = useRef<Record<string, HTMLDivElement | null>>({});
  const didFilter = useRef(false);
  const [lens, setLens] = useState<LensId>('all');
  const [openId, setOpenId] = useState<string | null>(null);
  const reduced = useReducedMotion();

  const activeLens = LENSES.find((l) => l.id === lens) ?? LENSES[0];
  const matchCount = PROBLEMS.filter((p) => matchesLens(p, activeLens)).length;

  // Diagnose filter — collapse the rows (and empty group headers) that don't
  // match the chosen lens; expand the ones that do. Skips the first run so the
  // scroll reveal owns the entrance.
  useIsomorphicLayoutEffect(() => {
    const animate = didFilter.current;
    didFilter.current = true;

    const apply = (el: HTMLElement | null, show: boolean) => {
      if (!el) return;
      const to = { height: show ? 'auto' : 0, autoAlpha: show ? 1 : 0 };
      if (!animate || reduced) gsap.set(el, to);
      else gsap.to(el, { ...to, duration: 0.5, ease: 'power3.inOut', overwrite: true });
    };

    // Close the open row if the lens filters it away.
    if (openId) {
      const openProblem = PROBLEMS.find((p) => p.id === openId);
      if (openProblem && !matchesLens(openProblem, activeLens)) setOpenId(null);
    }

    GROUPS.forEach((group) => {
      const groupProblems = PROBLEMS.filter((p) => p.group === group);
      const anyMatch = groupProblems.some((p) => matchesLens(p, activeLens));
      apply(groupHeads.current[group], anyMatch);
      groupProblems.forEach((p) => apply(rowWraps.current[p.id], matchesLens(p, activeLens)));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lens, reduced]);

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

  // The diagnose header and rows reveal as the index scrolls into view.
  useIsomorphicLayoutEffect(() => {
    const el = rootRef.current;
    if (!el || reduced) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.from('[data-diagnose]', {
        autoAlpha: 0,
        y: 16,
        duration: 0.8,
        ease: 'expo.out',
        stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 82%' },
      });
      gsap.from('[data-row]', {
        autoAlpha: 0,
        y: 20,
        duration: 0.7,
        ease: 'expo.out',
        stagger: 0.06,
        scrollTrigger: { trigger: '[data-index-list]', start: 'top 80%' },
      });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  let counter = 0;

  return (
    <section ref={rootRef} className="px-6 pt-28 md:px-10 md:pt-40">
      <div className="mx-auto max-w-[1240px]">
        {/* Diagnose — the signature moment */}
        <div className="mb-4 max-w-[42ch]">
          <span data-diagnose className="font-mono text-2xs uppercase tracking-[0.28em] text-fog">
            Start here
          </span>
          <h2
            data-diagnose
            className="mt-3 font-display text-[clamp(1.5rem,3.2vw,2.4rem)] font-medium leading-[1.1] tracking-[-0.02em] text-signal"
          >
            What’s slowing your business down?
          </h2>
        </div>

        <div data-diagnose className="flex flex-wrap items-center gap-2">
          {LENSES.map((l) => {
            const active = l.id === lens;
            return (
              <button
                key={l.id}
                type="button"
                onClick={() => setLens(l.id)}
                aria-pressed={active}
                className={cn(
                  'rounded-full border px-4 py-2 font-mono text-2xs uppercase tracking-[0.16em] transition-colors duration-300',
                  active
                    ? 'border-flux bg-flux text-void'
                    : 'border-line text-fog hover:border-fog hover:text-signal',
                )}
              >
                {l.label}
              </button>
            );
          })}
        </div>

        <p
          data-diagnose
          aria-live="polite"
          className="mt-5 flex items-center gap-3 font-mono text-2xs uppercase tracking-[0.2em] text-fog-dim"
        >
          <span className="tabular-nums text-flux">{String(matchCount).padStart(2, '0')}</span>
          <span>{lens === 'all' ? 'problems I solve — pick where it hurts' : `ways I help with ${activeLens.label.toLowerCase()}`}</span>
        </p>

        {/* The Index */}
        <div data-index-list className="mt-14">
          {GROUPS.map((group, gi) => (
            <div key={group}>
              <div
                ref={(el) => {
                  groupHeads.current[group] = el;
                }}
                className="overflow-hidden"
              >
                <h3
                  className={cn(
                    'mb-1 font-mono text-2xs uppercase tracking-[0.28em] text-flux',
                    gi > 0 && 'pt-14',
                  )}
                >
                  {group}
                </h3>
              </div>
              {PROBLEMS.filter((p) => p.group === group).map((problem) => {
                const index = counter++;
                return (
                  <div
                    key={problem.id}
                    ref={(el) => {
                      rowWraps.current[problem.id] = el;
                    }}
                    className="overflow-hidden"
                  >
                    <Row
                      problem={problem}
                      index={index}
                      open={openId === problem.id}
                      onToggle={() => setOpenId((o) => (o === problem.id ? null : problem.id))}
                      panelRef={(el) => {
                        panels.current[problem.id] = el;
                      }}
                    />
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
