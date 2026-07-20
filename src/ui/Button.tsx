'use client';

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib';
import { Icon, IconLoader } from '@/icons';

export const buttonVariants = cva(
  'relative inline-flex items-center justify-center gap-2 font-sans font-medium select-none rounded-md ' +
    'transition-[transform,background-color,box-shadow,color,border-color] duration-200 ease-signal ' +
    'active:scale-[0.98] disabled:pointer-events-none disabled:opacity-40 ' +
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-focus)]',
  {
    variants: {
      intent: {
        primary: 'bg-ember text-void hover:shadow-glow-ember',
        secondary: 'bg-graphite text-signal border border-line hover:border-line-strong',
        ghost: 'bg-transparent text-fog hover:text-signal hover:bg-white/5',
        outline: 'border border-flux/40 text-flux hover:bg-flux/10 hover:border-flux/70',
        danger: 'bg-danger text-void hover:brightness-110',
      },
      size: {
        sm: 'h-9 px-4 text-sm',
        md: 'h-11 px-6 text-sm',
        lg: 'h-14 px-8 text-base',
      },
      fullWidth: { true: 'w-full', false: '' },
    },
    defaultVariants: { intent: 'primary', size: 'md', fullWidth: false },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Shows a spinner and disables interaction. */
  loading?: boolean;
}

/**
 * The primary action primitive. Token-driven variants, keyboard-native
 * (`<button>`), accessible focus ring, and a built-in loading state. Wrap in
 * `<Magnetic>` for the signature magnetic pull where appropriate.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { intent, size, fullWidth, loading, disabled, className, children, ...props },
  ref,
) {
  return (
    <button
      ref={ref}
      className={cn(buttonVariants({ intent, size, fullWidth }), className)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <Icon icon={IconLoader} size="sm" className="animate-spin" />}
      {children}
    </button>
  );
});
