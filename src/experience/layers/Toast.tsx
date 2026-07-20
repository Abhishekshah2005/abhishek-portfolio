'use client';

import { cn } from '@/lib';
import { Icon, IconClose } from '@/icons';
import { Text } from '@/ui';
import type { ToastItem, ToastTone } from '@/providers/OverlayProvider';

const TONE_ACCENT: Record<ToastTone, string> = {
  neutral: 'before:bg-fog',
  flux: 'before:bg-flux',
  ember: 'before:bg-ember',
  rare: 'before:bg-rare',
  gold: 'before:bg-gold',
  danger: 'before:bg-danger',
};

const TONE_ICON: Record<ToastTone, string> = {
  neutral: 'text-fog',
  flux: 'text-flux',
  ember: 'text-ember',
  rare: 'text-rare',
  gold: 'text-gold',
  danger: 'text-danger',
};

/**
 * A single notification. Achievements are just a `gold` toast with a trophy
 * icon — one component, many uses. Styled from tokens; accent hairline keyed to
 * tone.
 */
export function Toast({ item, onDismiss }: { item: ToastItem; onDismiss: (id: string) => void }) {
  const tone = item.tone ?? 'neutral';
  return (
    <div
      role="status"
      className={cn(
        'pointer-events-auto relative flex w-80 max-w-[calc(100vw-2rem)] items-start gap-3 overflow-hidden',
        'rounded-lg border border-line bg-[var(--surface-glass)] p-4 pr-9 shadow-elev-3 backdrop-blur-glass',
        'animate-scale-in',
        "before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:content-['']",
        TONE_ACCENT[tone],
      )}
    >
      {item.icon && <Icon icon={item.icon} size="sm" className={cn('mt-0.5', TONE_ICON[tone])} />}
      <div className="min-w-0 flex-1">
        {item.title && (
          <Text variant="label" className="block truncate">
            {item.title}
          </Text>
        )}
        {item.description && (
          <Text variant="caption" tone="secondary" className="mt-0.5 block">
            {item.description}
          </Text>
        )}
      </div>
      <button
        type="button"
        aria-label="Dismiss notification"
        onClick={() => onDismiss(item.id)}
        className="absolute right-2.5 top-2.5 rounded-full p-1 text-fog transition-colors hover:bg-white/5 hover:text-signal focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
      >
        <Icon icon={IconClose} size="xs" />
      </button>
    </div>
  );
}
