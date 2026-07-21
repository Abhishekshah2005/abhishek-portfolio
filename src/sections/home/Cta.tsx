'use client';

import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { cn } from '@/lib';

export interface CtaProps {
  href: string;
  children: ReactNode;
  variant?: 'solid' | 'ghost';
  className?: string;
}

/**
 * A magnetic call-to-action (Motion.dev spring). The label eases toward the
 * pointer within its bounds, then springs home — the Cuberto-grade micro-
 * interaction, engine-independent and SSR-safe.
 */
export function Cta({ href, children, variant = 'solid', className }: CtaProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 220, damping: 18, mass: 0.4 });
  const y = useSpring(my, { stiffness: 220, damping: 18, mass: 0.4 });

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width - 0.5) * 22);
    my.set(((e.clientY - r.top) / r.height - 0.5) * 16);
  };
  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const isExternal = href.startsWith('http') || href.startsWith('mailto');

  return (
    <motion.a
      ref={ref}
      href={href}
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={reset}
      data-cursor="cta"
      {...(isExternal ? { rel: 'noreferrer' } : {})}
      className={cn(
        'group relative inline-flex items-center gap-3 rounded-full px-7 py-3.5 text-sm font-medium tracking-tight transition-colors duration-300',
        variant === 'solid'
          ? 'bg-flux text-void hover:bg-flux-2'
          : 'border border-line-strong text-signal hover:border-flux hover:text-flux',
        className,
      )}
    >
      <span className="relative z-10">{children}</span>
      <span
        aria-hidden
        className="relative z-10 inline-block transition-transform duration-300 group-hover:translate-x-1"
      >
        →
      </span>
      {variant === 'solid' && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full opacity-0 shadow-glow-flux transition-opacity duration-300 group-hover:opacity-100"
        />
      )}
    </motion.a>
  );
}
