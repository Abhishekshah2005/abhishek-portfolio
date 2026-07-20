import { forwardRef, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib';

export const panelVariants = cva('rounded-xl border border-line bg-obsidian/80 shadow-elev-2', {
  variants: {
    padding: {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
    elevation: {
      low: 'shadow-elev-1',
      mid: 'shadow-elev-2',
      high: 'shadow-elev-3',
    },
  },
  defaultVariants: { padding: 'md', elevation: 'mid' },
});

export interface PanelProps extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof panelVariants> {}

/** Structural elevated container (HUD panels, groupings). */
export const Panel = forwardRef<HTMLDivElement, PanelProps>(function Panel(
  { padding, elevation, className, ...props },
  ref,
) {
  return <div ref={ref} className={cn(panelVariants({ padding, elevation }), className)} {...props} />;
});
