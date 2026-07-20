import { forwardRef, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib';

export const badgeVariants = cva(
  'inline-flex items-center rounded-sm font-mono uppercase tracking-[0.12em] leading-none',
  {
    variants: {
      tone: {
        neutral: 'bg-white/8 text-fog',
        flux: 'bg-flux/15 text-flux',
        ember: 'bg-ember/15 text-ember',
        rare: 'bg-rare/15 text-rare',
        gold: 'bg-gold/15 text-gold',
        danger: 'bg-danger/15 text-danger',
      },
      size: {
        sm: 'text-2xs px-1.5 py-0.5',
        md: 'text-xs px-2 py-1',
      },
    },
    defaultVariants: { tone: 'neutral', size: 'sm' },
  },
);

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

/** Tiny non-interactive status label (e.g. "AI", "NEW"). */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { tone, size, className, ...props },
  ref,
) {
  return <span ref={ref} className={cn(badgeVariants({ tone, size }), className)} {...props} />;
});
