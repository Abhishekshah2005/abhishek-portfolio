'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib';
import { Icon, type LucideIcon } from '@/icons';

export const chipVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm select-none ' +
    'transition-[background-color,border-color,color] duration-200 ease-signal ' +
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)] ' +
    'disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      selected: {
        true: 'bg-flux/15 border-flux/50 text-flux',
        false: 'bg-transparent border-line text-fog hover:text-signal hover:border-line-strong',
      },
    },
    defaultVariants: { selected: false },
  },
);

export interface ChipProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof chipVariants> {
  icon?: LucideIcon;
}

/**
 * Interactive, selectable chip (filters/toggles). Reports state via
 * `aria-pressed` for accessibility.
 */
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(function Chip(
  { selected, icon, className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-pressed={selected ?? false}
      className={cn(chipVariants({ selected }), className)}
      {...props}
    >
      {icon && <Icon icon={icon} size="xs" />}
      {children}
    </button>
  );
});
