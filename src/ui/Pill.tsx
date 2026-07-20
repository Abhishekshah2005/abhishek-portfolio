import { forwardRef, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib';

export const pillVariants = cva(
  'inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm',
  {
    variants: {
      tone: {
        neutral: 'border-line bg-graphite text-signal',
        glass: 'border-line bg-[var(--surface-glass)] backdrop-blur-glass text-signal',
        accent: 'border-flux/40 bg-flux/10 text-flux',
      },
    },
    defaultVariants: { tone: 'neutral' },
  },
);

export interface PillProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof pillVariants> {}

/** Rounded container for compact status / count / label groupings. */
export const Pill = forwardRef<HTMLDivElement, PillProps>(function Pill(
  { tone, className, ...props },
  ref,
) {
  return <div ref={ref} className={cn(pillVariants({ tone }), className)} {...props} />;
});
