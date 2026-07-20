import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib';

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /** Optional leading dot color token (e.g. a tech-category color). */
  dot?: string;
}

/** Non-interactive metadata label (e.g. tech stack entries). */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(function Tag(
  { dot, className, children, ...props },
  ref,
) {
  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-md border border-line px-2.5 py-1 text-xs text-fog',
        className,
      )}
      {...props}
    >
      {dot && <span className="size-1.5 rounded-full" style={{ backgroundColor: dot }} aria-hidden />}
      {children}
    </span>
  );
});
