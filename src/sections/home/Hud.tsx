'use client';

import { useRef } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { useScrollFrame } from '@/hooks/useScroll';
import { cn } from '@/lib';
import { CHAPTERS, CONTACT_EMAIL } from './content';
import { useTraverse } from './traverse';

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] as const },
};

/**
 * The persistent HUD chrome — the reference's live interface. Wordmark + the
 * current chapter, a chapter counter and a calm CTA, a morphing readout that
 * swaps per chapter, and a thin scroll-progress seam. Fixed above everything;
 * only the interactive pieces receive pointer events.
 */
export function Hud() {
  const { active } = useTraverse();
  const chapter = CHAPTERS[active] ?? CHAPTERS[0];
  const barRef = useRef<HTMLDivElement>(null);

  useScrollFrame((p) => {
    const el = barRef.current;
    if (el) el.style.transform = `scaleX(${Math.max(0, Math.min(1, p.progress))})`;
  });

  return (
    <header className="pointer-events-none fixed inset-0 z-[var(--z-hud)]">
      {/* — Top bar — */}
      <div className="flex items-start justify-between px-[6vw] pt-6 md:px-[7vw] md:pt-7">
        <div>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="pointer-events-auto font-display text-base font-normal tracking-tight text-signal transition-colors hover:text-flux"
          >
            Abhishek <span className="italic text-flux">Shah</span>
          </a>
          <div className="mt-1 h-4 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.p
                key={chapter.id}
                {...fade}
                className="font-mono text-2xs uppercase tracking-[0.28em] text-fog"
              >
                {chapter.label}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-5">
          <span className="font-mono text-2xs tabular-nums tracking-[0.2em] text-fog-dim">
            <span className="text-flux">{chapter.n}</span>
            <span className="mx-1">/</span>
            {String(CHAPTERS.length).padStart(2, '0')}
          </span>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            data-cursor="cta"
            className="rounded-full border border-line-strong px-4 py-2 font-mono text-2xs uppercase tracking-[0.18em] text-signal transition-colors duration-300 hover:border-flux hover:text-flux"
          >
            Let’s talk
          </a>
        </div>
      </div>

      {/* — Bottom bar — */}
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-6 px-[6vw] pb-7 md:px-[7vw]">
        <div className="hidden h-9 overflow-hidden md:block">
          <AnimatePresence mode="wait">
            <motion.div
              key={chapter.id}
              {...fade}
              className="flex flex-wrap items-center gap-x-8 gap-y-1"
            >
              {chapter.readout.map((r) => (
                <span key={r.label} className="flex items-baseline gap-2">
                  <span className="font-mono text-2xs uppercase tracking-[0.2em] text-fog-dim">
                    {r.label}
                  </span>
                  <span className="font-mono text-2xs uppercase tracking-[0.14em] text-signal">
                    {r.value}
                  </span>
                </span>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        <span className="hidden font-mono text-2xs uppercase tracking-[0.24em] text-fog-dim md:inline">
          Scroll to traverse
        </span>
      </div>

      {/* — Chapter tracker (centre) — the reference's centre motif — */}
      <div className="absolute inset-x-0 bottom-8 hidden items-center justify-center gap-1.5 md:flex">
        {CHAPTERS.map((c, i) => (
          <span
            key={c.id}
            className={cn(
              'h-1 rounded-full transition-all duration-500 ease-out',
              i === active ? 'w-6 bg-flux' : 'w-1 bg-fog/35',
            )}
          />
        ))}
      </div>

      {/* — Scroll-progress seam — */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-line">
        <div
          ref={barRef}
          className="h-full origin-left bg-flux"
          style={{ transform: 'scaleX(0)' }}
        />
      </div>
    </header>
  );
}
