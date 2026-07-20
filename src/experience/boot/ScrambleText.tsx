'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib';

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\<>=*+-·:';

export interface ScrambleTextProps {
  text: string;
  className?: string;
  /** Decode duration in seconds. */
  duration?: number;
}

/**
 * Decodes text from random glyphs to its final value — the "OS decrypting"
 * effect. Driven by a GSAP tween (the engine's single loop), so no extra rAF.
 * SSR-renders the real string (accessible, no layout shift); the scramble runs
 * on mount / when `text` changes. Reduced motion skips straight to the value.
 */
export function ScrambleText({ text, className, duration = 0.6 }: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (reduced) {
      el.textContent = text;
      return;
    }

    const state = { p: 0 };
    const tween = gsap.to(state, {
      p: 1,
      duration,
      ease: 'none',
      onUpdate: () => {
        const revealed = Math.floor(state.p * text.length);
        let out = '';
        for (let i = 0; i < text.length; i++) {
          if (i < revealed || text[i] === ' ') out += text[i];
          else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
        }
        el.textContent = out;
      },
      onComplete: () => {
        el.textContent = text;
      },
    });

    return () => {
      tween.kill();
      if (el) el.textContent = text;
    };
  }, [text, duration, reduced]);

  return (
    <span ref={ref} className={cn('tabular-nums', className)} aria-label={text}>
      {text}
    </span>
  );
}
