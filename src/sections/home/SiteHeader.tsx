'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib';
import { MagneticButton } from './MagneticButton';

const NAV = [
  { label: 'Services', href: '#services' },
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
];

/**
 * Minimal premium site header. Transparent over the hero, settling into a
 * translucent glass bar on scroll. Wordmark + primary nav + magnetic CTA.
 */
export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-[var(--z-nav)] transition-[background-color,backdrop-filter,border-color] duration-300',
        scrolled
          ? 'border-b border-line bg-[color-mix(in_oklab,var(--color-void)_78%,transparent)] backdrop-blur-glass'
          : 'border-b border-transparent',
      )}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between px-6 md:h-20 md:px-10">
        <a
          href="#top"
          className="flex items-center gap-2.5 font-display text-lg font-semibold tracking-tight text-signal"
        >
          <span className="grid size-7 place-items-center rounded-md bg-flux text-sm font-bold text-[color:var(--color-void)]">
            A
          </span>
          Abhishek&nbsp;Shah
        </a>

        <nav aria-label="Primary" className="hidden items-center gap-8 md:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="group relative text-sm text-fog transition-colors duration-200 hover:text-signal"
            >
              {n.label}
              <span className="absolute -bottom-1.5 left-0 h-px w-full origin-left scale-x-0 bg-flux transition-transform duration-300 ease-signal group-hover:scale-x-100" />
            </a>
          ))}
        </nav>

        <MagneticButton href="#contact" intent="primary" size="sm">
          Book a call
        </MagneticButton>
      </div>
    </header>
  );
}
