'use client';

import type { MouseEvent, ReactNode } from 'react';
import type { VariantProps } from 'class-variance-authority';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react';
import { buttonVariants } from '@/ui';
import { cn } from '@/lib';

export interface MagneticButtonProps extends VariantProps<typeof buttonVariants> {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
  /** Pull factor 0–1. */
  strength?: number;
  'aria-label'?: string;
}

/**
 * Premium magnetic CTA built on Motion.dev — the button eases toward the cursor
 * (spring physics) and snaps back on leave. No engine dependency (SSR-safe,
 * works before boot); honours reduced motion. Reuses the design-system button
 * styles so every CTA stays consistent.
 */
export function MagneticButton({
  children,
  href,
  onClick,
  intent,
  size,
  className,
  strength = 0.4,
  'aria-label': ariaLabel,
}: MagneticButtonProps) {
  const reduced = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 });

  const handleMove = (e: MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
    if (reduced) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const classes = cn(buttonVariants({ intent, size }), className);
  const style = { x: sx, y: sy };

  if (href) {
    return (
      <motion.a
        href={href}
        aria-label={ariaLabel}
        onMouseMove={handleMove}
        onMouseLeave={reset}
        style={style}
        className={classes}
      >
        {children}
      </motion.a>
    );
  }
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={style}
      className={classes}
    >
      {children}
    </motion.button>
  );
}
