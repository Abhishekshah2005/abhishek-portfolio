import { cn } from '@/lib';
import { Icon, IconLoader } from '@/icons';

export interface LoadingIndicatorProps {
  variant?: 'spinner' | 'bar' | 'dots';
  className?: string;
  label?: string;
}

/**
 * Generic loading affordance in three flavours. `label` is announced to screen
 * readers; the visual is `aria-hidden`. Respects reduced-motion (animations are
 * globally neutralised there).
 */
export function LoadingIndicator({ variant = 'spinner', className, label = 'Loading' }: LoadingIndicatorProps) {
  return (
    <span role="status" aria-label={label} className={cn('inline-flex items-center', className)}>
      {variant === 'spinner' && <Icon icon={IconLoader} size="md" className="animate-spin text-flux" />}

      {variant === 'bar' && (
        <span aria-hidden className="relative h-0.5 w-24 overflow-hidden rounded-full bg-line">
          <span className="absolute inset-y-0 left-0 w-1/3 rounded-full bg-flux [animation:atlas-bar_1.2s_ease-in-out_infinite]" />
        </span>
      )}

      {variant === 'dots' && (
        <span aria-hidden className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="size-1.5 rounded-full bg-flux [animation:atlas-pulse_1s_ease-in-out_infinite]"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </span>
      )}
    </span>
  );
}
