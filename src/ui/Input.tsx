import { forwardRef, type InputHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib';

export const inputVariants = cva(
  'w-full rounded-md border bg-obsidian text-signal placeholder:text-fog-dim ' +
    'transition-[border-color,box-shadow] duration-200 ease-signal outline-none ' +
    'focus-visible:border-flux focus-visible:shadow-glow-flux ' +
    'disabled:opacity-40 disabled:pointer-events-none ' +
    'aria-[invalid=true]:border-danger aria-[invalid=true]:focus-visible:shadow-none',
  {
    variants: {
      inputSize: {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-4 text-sm',
        lg: 'h-12 px-4 text-base',
      },
    },
    defaultVariants: { inputSize: 'md' },
  },
);

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  invalid?: boolean;
}

/** Text input primitive. `border-line` default, flux focus glow, danger invalid state. */
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { inputSize, invalid, className, ...props },
  ref,
) {
  return (
    <input
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(inputVariants({ inputSize }), 'border-line', className)}
      {...props}
    />
  );
});
