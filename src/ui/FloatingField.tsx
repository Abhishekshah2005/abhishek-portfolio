import { forwardRef, useId, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib';

export interface FloatingFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'placeholder'> {
  label: string;
  invalid?: boolean;
  /** Helper or error text shown beneath the field. */
  hint?: ReactNode;
}

/**
 * Input with a floating label that animates from placeholder position to the
 * top border on focus/fill (pure CSS via the `peer` + `placeholder-shown`
 * trick — no JS). Labelled and hinted for accessibility.
 */
export const FloatingField = forwardRef<HTMLInputElement, FloatingFieldProps>(function FloatingField(
  { label, invalid, hint, id, className, ...props },
  ref,
) {
  const autoId = useId();
  const fieldId = id ?? autoId;
  const hintId = hint ? `${fieldId}-hint` : undefined;

  return (
    <div className={cn('relative', className)}>
      <input
        ref={ref}
        id={fieldId}
        placeholder=" "
        aria-invalid={invalid || undefined}
        aria-describedby={hintId}
        className={cn(
          'peer h-14 w-full rounded-md border border-line bg-obsidian px-4 pt-4 text-sm text-signal ' +
            'outline-none transition-[border-color,box-shadow] duration-200 ease-signal ' +
            'focus-visible:border-flux focus-visible:shadow-glow-flux ' +
            'aria-[invalid=true]:border-danger disabled:opacity-40',
        )}
        {...props}
      />
      <label
        htmlFor={fieldId}
        className={cn(
          'pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 font-sans text-sm text-fog ' +
            'transition-all duration-200 ease-signal ' +
            'peer-focus:top-3.5 peer-focus:text-2xs peer-focus:text-flux ' +
            'peer-[:not(:placeholder-shown)]:top-3.5 peer-[:not(:placeholder-shown)]:text-2xs',
        )}
      >
        {label}
      </label>
      {hint && (
        <p id={hintId} className={cn('mt-1.5 text-xs', invalid ? 'text-danger' : 'text-fog-dim')}>
          {hint}
        </p>
      )}
    </div>
  );
});
