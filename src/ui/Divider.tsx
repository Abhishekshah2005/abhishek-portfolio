import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib';

export interface DividerProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  /** Optional centered label (horizontal only). */
  label?: string;
}

/** Hairline separator, optionally with a centered label. */
export const Divider = forwardRef<HTMLDivElement, DividerProps>(function Divider(
  { orientation = 'horizontal', label, className, ...props },
  ref,
) {
  if (orientation === 'vertical') {
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation="vertical"
        className={cn('w-px self-stretch bg-line', className)}
        {...props}
      />
    );
  }

  if (label) {
    return (
      <div
        ref={ref}
        role="separator"
        className={cn('flex items-center gap-4 text-fog-dim', className)}
        {...props}
      >
        <span className="h-px flex-1 bg-line" />
        <span className="font-mono text-2xs uppercase tracking-[0.2em]">{label}</span>
        <span className="h-px flex-1 bg-line" />
      </div>
    );
  }

  return (
    <div
      ref={ref}
      role="separator"
      aria-orientation="horizontal"
      className={cn('h-px w-full bg-line', className)}
      {...props}
    />
  );
});
