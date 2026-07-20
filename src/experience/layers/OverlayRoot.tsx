'use client';

import { useOverlay } from '@/providers/OverlayProvider';
import { Toast } from './Toast';

/**
 * The overlay host layer. Renders the toast/notification viewport and a stable
 * portal mount (`#atlas-overlay-root`) that future overlays — HUD, menus,
 * terminal, game panels — can portal into, all above content but below the
 * cursor. Dialogs use the design-system `Modal` (its own portal).
 */
export function OverlayRoot() {
  const { toasts, dismiss } = useOverlay();

  return (
    <>
      {/* Portal mount for future overlays (menus, terminal, HUD panels). */}
      <div id="atlas-overlay-root" className="pointer-events-none fixed inset-0 z-[var(--z-overlay)]" />

      {/* Notification / achievement viewport. */}
      <div
        className="pointer-events-none fixed bottom-0 right-0 z-[var(--z-toast)] flex flex-col items-end gap-3 p-4"
        style={{ paddingBottom: 'calc(1rem + var(--safe-bottom))', paddingRight: 'calc(1rem + var(--safe-right))' }}
      >
        {toasts.map((item) => (
          <Toast key={item.id} item={item} onDismiss={dismiss} />
        ))}
      </div>
    </>
  );
}
