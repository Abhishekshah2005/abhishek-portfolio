'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { usePreloader } from '@/hooks/usePreloader';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { ProgressRing, Text } from '@/ui';
import { LogoMark } from '@/icons';

export interface PreloaderProps {
  /** Minimum time the intro stays on screen (ms). */
  minDuration?: number;
}

/**
 * Premium boot screen driven by real engine load progress (`usePreloader`).
 * Styled as a reactor charge; exits with a fade once assets + engine are ready
 * and the minimum display time has elapsed. Fully removed from the DOM after
 * exit so it never intercepts events.
 */
export function Preloader({ minDuration = 1400 }: PreloaderProps) {
  const { progress, done } = usePreloader(minDuration);
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    if (!done || !rootRef.current) return;
    const tween = gsap.to(rootRef.current, {
      autoAlpha: 0,
      duration: reduced ? 0 : 0.6,
      ease: 'power2.inOut',
      onComplete: () => setRemoved(true),
    });
    return () => {
      tween.kill();
    };
  }, [done, reduced]);

  if (removed) return null;

  const pct = Math.round(progress * 100);

  return (
    <div
      ref={rootRef}
      className="fixed inset-0 z-[var(--z-toast)] grid place-items-center bg-void"
      role="progressbar"
      aria-label="Loading experience"
      aria-valuenow={pct}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="flex flex-col items-center gap-8">
        <LogoMark size={40} className="text-flux [animation:atlas-pulse_2s_ease-in-out_infinite]" />
        <ProgressRing value={progress} size={96} strokeWidth={3} showLabel />
        <Text variant="overline" tone="secondary" className="tabular-nums">
          ATLAS // establishing operator link
        </Text>
      </div>
    </div>
  );
}
