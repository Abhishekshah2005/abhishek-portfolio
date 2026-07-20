'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { gsap } from 'gsap';
import { overlayWipe } from '@/animation/presets';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface TransitionContextValue {
  /** Cover the screen, navigate, then reveal — the cinematic route change. */
  navigate: (href: string) => void;
  isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextValue>({
  navigate: () => {},
  isTransitioning: false,
});

/**
 * Global route-transition engine. Renders a full-bleed mask overlay and drives
 * a cover → navigate → reveal wipe with GSAP. Programmatic `navigate()` gives
 * every link a consistent cinematic swap; direct URL loads simply reveal. The
 * mask element is the reusable seam for fancier wipe shapes later.
 */
export function TransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const overlayRef = useRef<HTMLDivElement>(null);
  const pendingHref = useRef<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const navigate = useCallback(
    (href: string) => {
      const overlay = overlayRef.current;
      if (!overlay || href === pathname) return;
      setIsTransitioning(true);
      pendingHref.current = href;
      overlay.style.pointerEvents = 'auto';
      overlayWipe(overlay, 'in', { reducedMotion }).eventCallback('onComplete', () => {
        router.push(href);
      });
    },
    [pathname, reducedMotion, router, setIsTransitioning],
  );

  // When the route actually changes after a programmatic navigate, reveal.
  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay || pendingHref.current !== pathname) return;
    pendingHref.current = null;
    overlayWipe(overlay, 'out', { reducedMotion }).eventCallback('onComplete', () => {
      overlay.style.pointerEvents = 'none';
      setIsTransitioning(false);
    });
  }, [pathname, reducedMotion]);

  // Ensure the overlay starts hidden.
  useEffect(() => {
    if (overlayRef.current) gsap.set(overlayRef.current, { scaleY: 0, transformOrigin: 'bottom' });
  }, []);

  return (
    <TransitionContext.Provider value={{ navigate, isTransitioning }}>
      {children}
      <div
        ref={overlayRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[var(--z-overlay)] origin-bottom scale-y-0 bg-void"
      />
    </TransitionContext.Provider>
  );
}

export function useTransition(): TransitionContextValue {
  return useContext(TransitionContext);
}
