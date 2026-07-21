'use client';

import { MagneticButton } from './MagneticButton';

/**
 * Minimal header for the cinematic stage — wordmark + one understated link.
 * Nothing/Apple restraint; light on the dark hero.
 */
export function SiteHeader() {
  return (
    <header className="fixed inset-x-0 top-0 z-[var(--z-nav)]">
      <div className="mx-auto flex h-20 w-full max-w-[1200px] items-center justify-between px-6 md:px-10">
        <a
          href="#top"
          className="font-display text-sm font-medium tracking-tight text-[#F4F1EA] transition-opacity duration-300 hover:opacity-70"
        >
          Abhishek Shah
        </a>
        <MagneticButton
          href="#contact"
          intent="ghost"
          size="sm"
          className="!px-0 text-2xs uppercase tracking-[0.24em] text-white/70 hover:text-white hover:!bg-transparent"
        >
          Contact
        </MagneticButton>
      </div>
    </header>
  );
}
