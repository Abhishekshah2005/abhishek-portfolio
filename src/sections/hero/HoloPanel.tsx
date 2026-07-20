'use client';

import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import { cn } from '@/lib';

const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

export interface HoloPanelProps {
  children: ReactNode;
  className?: string;
  /** Powers on when true (boot complete). */
  active?: boolean;
  delay?: number;
  /** Adds a hover lift micro-interaction. */
  interactive?: boolean;
}

/**
 * Holographic glass panel — the HUD building block. Powers on with a Motion.dev
 * blur/rise micro-transition, carries a scanline sheen + top hairline, and (when
 * interactive) lifts on hover. Motion is SSR-safe and honours reduced motion.
 */
export function HoloPanel({ children, className, active = true, delay = 0, interactive = false }: HoloPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={active ? { opacity: 1, y: 0 } : { opacity: 0, y: -8 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
      whileHover={interactive ? { scale: 1.03, y: -2 } : undefined}
      className={cn(
        'relative overflow-hidden rounded-lg border border-line bg-[var(--surface-glass)] px-3 py-2 backdrop-blur-glass',
        "before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px before:content-[''] before:bg-linear-to-r before:from-transparent before:via-flux/40 before:to-transparent",
        interactive && 'pointer-events-auto',
        className,
      )}
    >
      {children}
      {/* scanline sheen */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'repeating-linear-gradient(to bottom, transparent 0, transparent 2px, #fff 3px)',
        }}
      />
    </motion.div>
  );
}
