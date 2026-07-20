import { forwardRef, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib';

export const glassPanelVariants = cva(
  'relative overflow-hidden rounded-xl border border-line bg-[var(--surface-glass)] ' +
    'shadow-elev-2 before:pointer-events-none before:absolute before:inset-x-0 before:top-0 before:h-px ' +
    "before:content-[''] before:bg-linear-to-r before:from-transparent before:via-white/15 before:to-transparent",
  {
    variants: {
      blur: {
        glass: 'backdrop-blur-glass',
        heavy: 'backdrop-blur-[var(--blur-heavy)]',
      },
      padding: {
        none: 'p-0',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: { blur: 'glass', padding: 'md' },
  },
);

export interface GlassPanelProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glassPanelVariants> {}

/**
 * Frosted glass surface for HUD chrome and overlays. A hairline top-highlight
 * gives the "milled glass" edge from the Art Bible. Structural, not decorative.
 */
export const GlassPanel = forwardRef<HTMLDivElement, GlassPanelProps>(function GlassPanel(
  { blur, padding, className, ...props },
  ref,
) {
  return <div ref={ref} className={cn(glassPanelVariants({ blur, padding }), className)} {...props} />;
});
