import { createElement, forwardRef, type ElementType, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib';

export const sectionContainerVariants = cva('mx-auto w-full px-6 md:px-10', {
  variants: {
    width: {
      narrow: 'max-w-[48rem]',
      default: 'max-w-[80rem]',
      wide: 'max-w-[96rem]',
      full: 'max-w-none',
    },
  },
  defaultVariants: { width: 'default' },
});

export interface SectionContainerProps
  extends HTMLAttributes<HTMLElement>,
    VariantProps<typeof sectionContainerVariants> {
  as?: ElementType;
}

/**
 * Responsive layout container with consistent gutters and max-widths. The
 * horizontal rhythm primitive for every DOM section (content lives on top of
 * the fixed canvas layer).
 */
export const SectionContainer = forwardRef<HTMLElement, SectionContainerProps>(function SectionContainer(
  { as, width, className, children, ...props },
  ref,
) {
  const Comp = (as ?? 'section') as ElementType;
  return createElement(
    Comp,
    { ref, className: cn(sectionContainerVariants({ width }), className), ...props },
    children,
  );
});
