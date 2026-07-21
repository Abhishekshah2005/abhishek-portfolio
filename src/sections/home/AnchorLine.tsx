'use client';

import { HORIZON } from './WorldCanvas';

/**
 * The glowing horizon seam — the reference's anchor line. A fine bright core
 * with a warm bloom, fixed on the horizon behind the chapter type. Sits above
 * the world canvas, below the content.
 */
export function AnchorLine() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 z-[5]"
      style={{ top: `${HORIZON * 100}vh` }}
    >
      <div
        data-anchor
        className="mx-auto"
        style={{
          height: '1px',
          background:
            'linear-gradient(90deg, transparent 0%, color-mix(in oklab, var(--glow-warm) 55%, transparent) 50%, transparent 100%)',
          boxShadow: '0 0 60px 5px color-mix(in oklab, var(--glow-warm) 20%, transparent)',
        }}
      />
    </div>
  );
}
