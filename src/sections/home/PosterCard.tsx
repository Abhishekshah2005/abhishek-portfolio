'use client';

import type { Chapter } from './content';

/**
 * A poster card in the sliding carousel — the reference's destination cards.
 * A muted premium gradient "poster", the chapter number, its name, and a meta
 * line. The engine fades/scales each card by its distance from centre so the
 * one at centre dissolves into the CenterStage headline.
 */

// Muted, premium gradients — cool + warm, one per chapter (never neon).
const GRADIENTS = [
  'linear-gradient(155deg,#2b3358,#7d5382)',
  'linear-gradient(155deg,#6d4463,#d0805a)',
  'linear-gradient(155deg,#334f63,#6a97b4)',
  'linear-gradient(155deg,#4c3f66,#b8895f)',
  'linear-gradient(155deg,#2f5057,#57a89b)',
  'linear-gradient(155deg,#6a3550,#d69a63)',
  'linear-gradient(155deg,#354565,#8a63a0)',
  'linear-gradient(155deg,#565436,#b3a15f)',
  'linear-gradient(155deg,#453764,#a5627f)',
  'linear-gradient(155deg,#6f4536,#d9a95f)',
];

export function PosterCard({ chapter, index }: { chapter: Chapter; index: number }) {
  return (
    <article
      data-card
      className="relative aspect-[3/4] w-[260px] shrink-0 overflow-hidden rounded-2xl border border-white/10 shadow-elev-3 will-change-[opacity,transform]"
    >
      <div className="absolute inset-0" style={{ background: GRADIENTS[index % GRADIENTS.length] }} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-black/25" />
      <div className="relative flex h-full flex-col justify-between p-5">
        <div className="flex items-start justify-between">
          <span className="font-mono text-2xs tabular-nums tracking-[0.2em] text-white/85">
            {chapter.n}
          </span>
          <span className="size-3 rounded-full border border-white/50" aria-hidden />
        </div>
        <div>
          <span className="font-mono text-2xs uppercase tracking-[0.22em] text-white/70">
            {chapter.kicker}
          </span>
          <h3 className="mt-1.5 font-display text-2xl font-medium leading-tight tracking-tight text-white">
            {chapter.label}
          </h3>
          <span className="mt-2 block font-mono text-2xs uppercase tracking-[0.14em] text-white/60">
            {chapter.readout[0]?.value}
          </span>
        </div>
      </div>
    </article>
  );
}
