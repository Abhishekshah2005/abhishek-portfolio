'use client';

import { cn } from '@/lib';
import { Cta } from './Cta';
import type { Chapter } from './content';

function Meta({ n, kicker }: { n: string; kicker: string }) {
  return (
    <div
      data-reveal
      className="mb-7 flex items-center gap-4 font-mono text-2xs uppercase tracking-[0.28em] text-fog"
    >
      <span className="text-flux">{n}</span>
      <span className="h-px w-10 bg-line-strong" />
      <span>{kicker}</span>
    </div>
  );
}

function Headline({ headline }: { headline: Chapter['headline'] }) {
  return (
    <h2
      data-headline
      className="max-w-[18ch] font-display text-[clamp(2.1rem,5.6vw,5.25rem)] font-light leading-[1.03] tracking-[-0.02em] text-signal"
    >
      {headline.lead}
      <span className="text-glow-accent italic text-flux">{headline.accent}</span>
      {headline.tail}
    </h2>
  );
}

function Points({ points }: { points: string[] }) {
  return (
    <ul data-reveal className="mt-9 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
      {points.map((p) => (
        <li key={p} className="flex items-start gap-3 text-sm text-fog md:text-base">
          <span className="mt-2 size-1 shrink-0 rounded-full bg-flux" aria-hidden />
          <span>{p}</span>
        </li>
      ))}
    </ul>
  );
}

function Body({ body, className }: { body: string; className?: string }) {
  return (
    <p
      data-reveal
      className={cn('mt-8 max-w-xl text-base leading-relaxed text-fog md:text-lg', className)}
    >
      {body}
    </p>
  );
}

/** One chapter as a full-viewport panel, transparent over the persistent world. */
export function ChapterPanel({ chapter }: { chapter: Chapter }) {
  const { variant } = chapter;

  return (
    <section
      data-panel
      data-chapter={chapter.id}
      className="relative flex min-h-screen w-screen shrink-0 flex-col justify-center px-[8vw] md:px-[7vw]"
    >
      <div className="relative w-full max-w-5xl pt-[8vh]">
        <Meta n={chapter.n} kicker={chapter.kicker} />
        <Headline headline={chapter.headline} />

        {(variant === 'opening' || variant === 'statement') && (
          <>
            {chapter.body && <Body body={chapter.body} />}
            {chapter.points && <Points points={chapter.points} />}
          </>
        )}

        {variant === 'projects' && (
          <>
            {chapter.body && <Body body={chapter.body} />}
            <div className="group/cards mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {chapter.projects?.map((p) => (
                <article
                  key={p.title}
                  data-reveal
                  data-cursor="card"
                  className="group flex flex-col gap-3 rounded-xl border border-line bg-[var(--surface-glass)] p-5 backdrop-blur-[var(--blur-glass)] transition-[transform,opacity,filter,border-color,background-color] duration-500 ease-out will-change-transform hover:!opacity-100 hover:!blur-0 hover:-translate-y-1.5 hover:border-flux/40 hover:bg-[var(--surface-glass-strong)] group-hover/cards:opacity-40 group-hover/cards:blur-[2px]"
                >
                  <span className="font-mono text-2xs uppercase tracking-[0.18em] text-flux">
                    {p.tag}
                  </span>
                  <h3 className="font-display text-lg font-normal leading-snug text-signal">
                    {p.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-fog">{p.desc}</p>
                </article>
              ))}
            </div>
          </>
        )}

        {variant === 'services' && (
          <ul
            data-reveal
            className="group/rows mt-10 grid max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-xl border border-line sm:grid-cols-2"
          >
            {chapter.services?.map((s, i) => (
              <li
                key={s}
                data-cursor="row"
                className="flex items-center gap-4 bg-[var(--surface-glass)] px-5 py-4 backdrop-blur-[var(--blur-glass)] transition-[opacity,background-color] duration-300 hover:!opacity-100 hover:bg-[var(--surface-glass-strong)] group-hover/rows:opacity-50"
              >
                <span className="font-mono text-2xs tabular-nums text-fog-dim">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-sm text-signal md:text-base">{s}</span>
              </li>
            ))}
          </ul>
        )}

        {variant === 'process' && (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {chapter.steps?.map((s) => (
              <div key={s.n} data-reveal className="flex flex-col gap-3">
                <span className="font-mono text-2xs tabular-nums text-flux">{s.n}</span>
                <span className="h-px w-full bg-line-strong" />
                <h3 className="font-display text-xl font-normal text-signal">{s.t}</h3>
                <p className="text-sm leading-relaxed text-fog">{s.d}</p>
              </div>
            ))}
          </div>
        )}

        {variant === 'quote' && chapter.quote && (
          <>
            <blockquote
              data-reveal
              className="mt-10 max-w-3xl font-display text-[clamp(1.4rem,3vw,2.4rem)] font-light leading-[1.25] text-signal"
            >
              “{chapter.quote.text}”
            </blockquote>
            <div data-reveal className="mt-6 flex items-center gap-3 font-mono text-2xs uppercase tracking-[0.24em] text-fog">
              <span className="h-px w-8 bg-flux" />
              {chapter.quote.by}
            </div>
            {chapter.body && (
              <p data-reveal className="mt-6 text-sm text-fog-dim">
                {chapter.body}
              </p>
            )}
          </>
        )}

        {variant === 'contact' && (
          <>
            {chapter.body && <Body body={chapter.body} />}
            {chapter.cta && (
              <div data-reveal className="mt-10">
                <Cta href={chapter.cta.href}>{chapter.cta.label}</Cta>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
