'use client';

import { MagneticButton } from './MagneticButton';

/**
 * Masthead — restrained editorial header. Wordmark + one consultation link,
 * ink on paper. No nav clutter; the composition carries the weight.
 */
export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-[var(--z-nav)]">
      <div className="mx-auto flex h-20 w-full max-w-[1240px] items-center justify-between px-6 md:px-10">
        <a
          href="#top"
          className="font-sans text-sm font-medium tracking-tight text-signal transition-opacity duration-300 hover:opacity-60"
        >
          Abhishek Shah
        </a>
        <MagneticButton
          href="#contact"
          intent="ghost"
          size="sm"
          className="!px-0 font-mono text-2xs uppercase tracking-[0.24em] text-fog hover:text-signal hover:!bg-transparent"
        >
          Contact
        </MagneticButton>
      </div>
    </header>
  );
}
