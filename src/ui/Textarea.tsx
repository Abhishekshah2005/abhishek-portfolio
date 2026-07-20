import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  invalid?: boolean;
}

/** Multiline text input, matching `Input`'s visual language. */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { invalid, className, rows = 4, ...props },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(
        'w-full resize-y rounded-md border border-line bg-obsidian px-4 py-3 text-sm text-signal ' +
          'placeholder:text-fog-dim outline-none transition-[border-color,box-shadow] duration-200 ease-signal ' +
          'focus-visible:border-flux focus-visible:shadow-glow-flux disabled:opacity-40 disabled:pointer-events-none ' +
          'aria-[invalid=true]:border-danger',
        className,
      )}
      {...props}
    />
  );
});
