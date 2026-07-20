'use client';

import { useEffect, useRef } from 'react';

export type KeyBindings = Record<string, (event: KeyboardEvent) => void>;

export interface UseKeyboardOptions {
  enabled?: boolean;
  /** Also fire while typing in inputs/textareas (default false). */
  allowInInputs?: boolean;
}

/**
 * Global keyboard shortcut binder. Keys are matched against `event.key`
 * (case-insensitive), ignoring form fields by default. Handlers are held in a
 * ref so inline functions don't rebind the listener each render.
 */
export function useKeyboard(bindings: KeyBindings, options: UseKeyboardOptions = {}): void {
  const ref = useRef(bindings);
  ref.current = bindings;
  const { enabled = true, allowInInputs = false } = options;

  useEffect(() => {
    if (!enabled) return;
    const onKey = (event: KeyboardEvent) => {
      if (!allowInInputs) {
        const target = event.target as HTMLElement | null;
        if (
          target &&
          (target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.isContentEditable)
        ) {
          return;
        }
      }
      const handler = ref.current[event.key] ?? ref.current[event.key.toLowerCase()];
      handler?.(event);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled, allowInInputs]);
}
