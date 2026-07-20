'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib';
import { Icon, type LucideIcon, type IconSize } from '@/icons';

export const iconButtonVariants = cva(
  'inline-flex items-center justify-center rounded-full select-none ' +
    'transition-[transform,background-color,box-shadow,color,border-color] duration-200 ease-signal ' +
    'active:scale-90 disabled:pointer-events-none disabled:opacity-40 ' +
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]',
  {
    variants: {
      intent: {
        solid: 'bg-graphite text-signal hover:bg-slate',
        ghost: 'bg-transparent text-fog hover:text-signal hover:bg-white/5',
        outline: 'border border-line text-fog hover:text-signal hover:border-line-strong',
        accent: 'bg-flux/15 text-flux hover:bg-flux/25 hover:shadow-glow-flux',
      },
      size: {
        sm: 'h-8 w-8',
        md: 'h-10 w-10',
        lg: 'h-12 w-12',
      },
    },
    defaultVariants: { intent: 'ghost', size: 'md' },
  },
);

const ICON_FOR_SIZE: Record<NonNullable<VariantProps<typeof iconButtonVariants>['size']>, IconSize> = {
  sm: 'sm',
  md: 'sm',
  lg: 'md',
};

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  icon: LucideIcon;
  /** Required for accessibility — icon-only controls must be labelled. */
  label: string;
}

/**
 * Icon-only control. Enforces an accessible `label` (there is no visible text),
 * and sizes the glyph to the button automatically.
 */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { icon, label, intent, size = 'md', className, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      type="button"
      aria-label={label}
      title={label}
      className={cn(iconButtonVariants({ intent, size }), className)}
      {...props}
    >
      <Icon icon={icon} size={ICON_FOR_SIZE[size ?? 'md']} />
    </button>
  );
});
