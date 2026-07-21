'use client';

import { useRef } from 'react';
import { useTick } from '@/hooks/useTick';
import { useScrollFrame } from '@/hooks/useScroll';
import { HORIZON } from './WorldCanvas';

/**
 * The glowing horizon seam — the reference's anchor line. A fine bright core
 * with a warm bloom, fixed on the horizon behind the chapter type. It swells
 * and brightens as chapters travel (scroll velocity), then settles calm — the
 * reference's horizon that blooms during each transition.
 */
export function AnchorLine() {
  const ref = useRef<HTMLDivElement>(null);
  const bloom = useRef({ v: 0, cur: 0 });

  useScrollFrame((p) => {
    bloom.current.v = Math.min(1, Math.abs(p.velocity) * 0.02);
  });

  useTick(() => {
    const el = ref.current;
    if (!el) return;
    const b = bloom.current;
    b.cur += (b.v - b.cur) * 0.12;
    b.v *= 0.9;
    const g = b.cur;
    el.style.opacity = String(0.55 + g * 0.45);
    el.style.transform = `scaleY(${1 + g * 2.4})`;
    el.style.boxShadow = `0 0 ${60 + g * 90}px ${5 + g * 10}px color-mix(in oklab, var(--glow-warm) ${18 + g * 46}%, transparent)`;
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 z-[5]"
      style={{ top: `${HORIZON * 100}vh` }}
    >
      <div
        ref={ref}
        className="mx-auto origin-center"
        style={{
          height: '1px',
          willChange: 'transform, opacity',
          background:
            'linear-gradient(90deg, transparent 0%, color-mix(in oklab, var(--glow-warm) 55%, transparent) 50%, transparent 100%)',
          boxShadow: '0 0 60px 5px color-mix(in oklab, var(--glow-warm) 18%, transparent)',
        }}
      />
    </div>
  );
}
