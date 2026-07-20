import { forwardRef, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib';

export const cardVariants = cva('rounded-lg border bg-graphite text-signal', {
  variants: {
    tone: {
      default: 'border-line',
      accent: 'border-flux/30',
      action: 'border-ember/30',
    },
    padding: {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
    interactive: {
      true: 'transition-[transform,border-color,box-shadow] duration-300 ease-signal hover:-translate-y-0.5 hover:border-line-strong hover:shadow-elev-2',
      false: '',
    },
  },
  defaultVariants: { tone: 'default', padding: 'md', interactive: false },
});

export interface CardProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

/** Base content surface. Pure/presentational — RSC-compatible. */
export const Card = forwardRef<HTMLDivElement, CardProps>(function Card(
  { tone, padding, interactive, className, ...props },
  ref,
) {
  return <div ref={ref} className={cn(cardVariants({ tone, padding, interactive }), className)} {...props} />;
});
