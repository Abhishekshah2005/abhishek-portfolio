'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from 'react';
import * as RadixTooltip from '@radix-ui/react-tooltip';
import { cn } from '@/lib';

/** Provider — mount once near the app root to share timing across tooltips. */
export const TooltipProvider = RadixTooltip.Provider;

export interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  side?: RadixTooltip.TooltipContentProps['side'];
  align?: RadixTooltip.TooltipContentProps['align'];
  delayDuration?: number;
}

/**
 * Re-skinned Radix Tooltip. Convenience wrapper: pass `content` + the trigger as
 * children. Accessible, keyboard-focusable, and dismiss-on-escape by default.
 */
export function Tooltip({ content, children, side = 'top', align = 'center', delayDuration = 200 }: TooltipProps) {
  return (
    <RadixTooltip.Root delayDuration={delayDuration}>
      <RadixTooltip.Trigger asChild>{children}</RadixTooltip.Trigger>
      <TooltipContent side={side} align={align}>
        {content}
      </TooltipContent>
    </RadixTooltip.Root>
  );
}

export const TooltipContent = forwardRef<
  ElementRef<typeof RadixTooltip.Content>,
  ComponentPropsWithoutRef<typeof RadixTooltip.Content>
>(function TooltipContent({ className, sideOffset = 8, children, ...props }, ref) {
  return (
    <RadixTooltip.Portal>
      <RadixTooltip.Content
        ref={ref}
        sideOffset={sideOffset}
        className={cn(
          'z-[var(--z-overlay)] rounded-md border border-line bg-graphite px-2.5 py-1.5 font-mono text-2xs uppercase tracking-[0.12em] text-signal shadow-elev-3 data-[state=delayed-open]:animate-fade-in',
          className,
        )}
        {...props}
      >
        {children}
      </RadixTooltip.Content>
    </RadixTooltip.Portal>
  );
});
