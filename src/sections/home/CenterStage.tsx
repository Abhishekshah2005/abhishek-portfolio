'use client';

import { AnimatePresence, motion } from 'motion/react';
import { useTraverse } from './traverse';
import { ChapterDetail } from './ChapterDetail';
import { CHAPTERS } from './content';

const reveal = {
  initial: { opacity: 0, y: 26 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -18 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
};

/**
 * The fixed centre-stage — the active chapter's headline announced on the
 * horizon (the reference's "Traverse the Borealis" moment). The OUTER element's
 * opacity is driven by the engine (visible only when a card is centred, so it
 * reads as the card opening); the INNER content cross-fades on chapter change.
 */
export function CenterStage() {
  const { active } = useTraverse();
  const chapter = CHAPTERS[active] ?? CHAPTERS[0];

  return (
    <div
      data-centerstage
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[15] hidden items-center justify-center px-6 opacity-0 md:flex"
    >
      <div className="w-full max-w-5xl -translate-y-[6vh]">
        <AnimatePresence mode="wait">
          <motion.div key={chapter.id} {...reveal}>
            <ChapterDetail chapter={chapter} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
