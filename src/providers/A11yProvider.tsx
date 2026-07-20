'use client';

import { createContext, useCallback, useContext, useRef, type ReactNode } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface A11yContextValue {
  /** Announce a message to screen readers via an ARIA live region. */
  announce: (message: string, assertive?: boolean) => void;
  reducedMotion: boolean;
}

const A11yContext = createContext<A11yContextValue>({
  announce: () => {},
  reducedMotion: false,
});

/**
 * Accessibility backbone. Provides two ARIA live regions (polite + assertive)
 * and an imperative `announce()` so any system (achievements, route changes,
 * load completion) can speak to assistive tech, plus a shared reduced-motion
 * signal.
 */
export function A11yProvider({ children }: { children: ReactNode }) {
  const politeRef = useRef<HTMLDivElement>(null);
  const assertiveRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const announce = useCallback((message: string, assertive = false) => {
    const region = assertive ? assertiveRef.current : politeRef.current;
    if (!region) return;
    // Clear then set so repeated identical messages are re-announced.
    region.textContent = '';
    window.setTimeout(() => {
      region.textContent = message;
    }, 60);
  }, []);

  return (
    <A11yContext.Provider value={{ announce, reducedMotion }}>
      {children}
      <div ref={politeRef} className="sr-only" role="status" aria-live="polite" aria-atomic="true" />
      <div
        ref={assertiveRef}
        className="sr-only"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      />
    </A11yContext.Provider>
  );
}

export function useA11y(): A11yContextValue {
  return useContext(A11yContext);
}

/** Convenience: just the announcer. */
export function useAnnounce() {
  return useA11y().announce;
}
