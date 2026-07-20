'use client';

import { forwardRef, type ComponentPropsWithoutRef, type ElementRef, type ReactNode } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '@/lib';
import { Icon, IconClose } from '@/icons';

/** Re-skinned Radix Dialog. Accessible (focus trap, Esc, aria) by construction. */
export const Modal = Dialog.Root;
export const ModalTrigger = Dialog.Trigger;
export const ModalClose = Dialog.Close;
export const ModalTitle = Dialog.Title;
export const ModalDescription = Dialog.Description;

export interface ModalContentProps extends ComponentPropsWithoutRef<typeof Dialog.Content> {
  /** Hide the built-in close button (provide your own). */
  hideClose?: boolean;
  children: ReactNode;
}

export const ModalContent = forwardRef<ElementRef<typeof Dialog.Content>, ModalContentProps>(
  function ModalContent({ hideClose, className, children, ...props }, ref) {
    return (
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-[var(--z-overlay)] bg-[var(--bg-overlay)] backdrop-blur-sm data-[state=open]:animate-fade-in"
        />
        <Dialog.Content
          ref={ref}
          className={cn(
            'fixed left-1/2 top-1/2 z-[var(--z-overlay)] w-[92vw] max-w-lg -translate-x-1/2 -translate-y-1/2',
            'overflow-hidden rounded-xl border border-line bg-[var(--surface-glass)] p-6 shadow-elev-4 backdrop-blur-glass',
            'data-[state=open]:animate-scale-in focus:outline-none',
            className,
          )}
          {...props}
        >
          {children}
          {!hideClose && (
            <Dialog.Close
              aria-label="Close"
              className="absolute right-4 top-4 rounded-full p-1.5 text-fog transition-colors hover:bg-white/5 hover:text-signal focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
            >
              <Icon icon={IconClose} size="sm" />
            </Dialog.Close>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    );
  },
);
