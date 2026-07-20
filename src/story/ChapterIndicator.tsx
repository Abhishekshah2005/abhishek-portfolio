'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useStory } from './StoryProvider';

/**
 * Story-progress navigation: the current chapter number + a morphing label that
 * slides through as scenes change — the film's "chapter card". Bottom-centered,
 * quiet, always present.
 */
export function ChapterIndicator() {
  const { active } = useStory();
  return (
    <div className="fixed bottom-6 left-1/2 z-[var(--z-nav)] hidden -translate-x-1/2 items-center gap-3 font-mono text-2xs uppercase tracking-[0.28em] text-fog md:flex">
      <span className="tabular-nums text-signal">{String(active.index).padStart(2, '0')}</span>
      <span className="h-px w-8 bg-line" />
      <span className="relative block h-4 overflow-hidden">
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={active.label}
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '-110%', opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="block whitespace-nowrap"
          >
            {active.label}
          </motion.span>
        </AnimatePresence>
      </span>
    </div>
  );
}
