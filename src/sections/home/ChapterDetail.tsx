'use client';

import { cn } from '@/lib';
import { Cta } from './Cta';
import type { Chapter } from './content';

/**
 * A chapter's content, centred on the horizon — the reference's "detail" state
 * (a big headline announced on the glowing line, with concise supporting
 * content). Reused by CenterStage (desktop, one at a time) and the mobile
 * vertical stack. Headline is a light grotesk with one bold accent word,
 * matching the reference.
 */
export function ChapterDetail({ chapter, className }: { chapter: Chapter; className?: string }) {
  const { variant } = chapter;
  return (
    <div className={cn('flex flex-col items-center text-center', className)}>
      <span
        data-d
        className="mb-5 flex items-center gap-3 font-mono text-2xs uppercase tracking-[0.3em] text-fog"
      >
        <span className="text-flux">{chapter.n}</span>
        <span className="h-px w-8 bg-line-strong" />
        <span>{chapter.kicker}</span>
      </span>

      <h2
        data-d
        data-headline
        className="max-w-[20ch] font-sans text-[clamp(2rem,5.4vw,4.75rem)] font-light leading-[1.04] tracking-[-0.02em] text-signal"
      >
        {chapter.headline.lead}
        <span className="font-semibold text-flux text-glow-accent">{chapter.headline.accent}</span>
        {chapter.headline.tail}
      </h2>

      {chapter.body && variant !== 'quote' && (
        <p data-d className="mt-7 max-w-xl text-base leading-relaxed text-fog md:text-lg">
          {chapter.body}
        </p>
      )}

      {(variant === 'opening' || variant === 'statement') && chapter.points && (
        <ul data-d className="mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-x-7 gap-y-2">
          {chapter.points.map((p) => (
            <li key={p} className="flex items-center gap-2 text-sm text-fog">
              <span className="size-1 rounded-full bg-flux" aria-hidden />
              {p}
            </li>
          ))}
        </ul>
      )}

      {variant === 'projects' && (
        <div data-d className="mt-9 grid w-full max-w-4xl grid-cols-2 gap-3 lg:grid-cols-4">
          {chapter.projects?.map((p) => (
            <div
              key={p.title}
              className="rounded-lg border border-line bg-[var(--surface-glass)] p-4 text-left backdrop-blur-[var(--blur-glass)]"
            >
              <span className="font-mono text-2xs uppercase tracking-[0.16em] text-flux">{p.tag}</span>
              <p className="mt-2 text-sm font-medium leading-snug text-signal">{p.title}</p>
            </div>
          ))}
        </div>
      )}

      {variant === 'services' && (
        <ul data-d className="mt-8 flex max-w-3xl flex-wrap items-center justify-center gap-2.5">
          {chapter.services?.map((s) => (
            <li
              key={s}
              className="rounded-full border border-line bg-[var(--surface-glass)] px-4 py-2 text-sm text-signal backdrop-blur-[var(--blur-glass)]"
            >
              {s}
            </li>
          ))}
        </ul>
      )}

      {variant === 'process' && (
        <div data-d className="mt-9 grid w-full max-w-4xl grid-cols-2 gap-6 lg:grid-cols-4">
          {chapter.steps?.map((s) => (
            <div key={s.n} className="flex flex-col items-center gap-2">
              <span className="font-mono text-2xs tabular-nums text-flux">{s.n}</span>
              <span className="font-sans text-lg font-medium text-signal">{s.t}</span>
              <span className="text-xs leading-relaxed text-fog">{s.d}</span>
            </div>
          ))}
        </div>
      )}

      {variant === 'quote' && chapter.quote && (
        <>
          <blockquote data-d className="mt-8 max-w-3xl font-sans text-[clamp(1.15rem,2.2vw,1.7rem)] font-light leading-[1.35] text-signal">
            “{chapter.quote.text}”
          </blockquote>
          <div data-d className="mt-5 font-mono text-2xs uppercase tracking-[0.24em] text-fog">
            — {chapter.quote.by}
          </div>
          {chapter.body && <p data-d className="mt-4 text-xs text-fog-dim">{chapter.body}</p>}
        </>
      )}

      {variant === 'contact' && chapter.cta && (
        <div data-d className="pointer-events-auto mt-9">
          <Cta href={chapter.cta.href}>{chapter.cta.label}</Cta>
        </div>
      )}
    </div>
  );
}
