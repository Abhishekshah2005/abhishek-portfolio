'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useEngineStore } from '@/hooks/useEngineStore';
import { engineStore } from '@/state/engineStore';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { useKeyboard } from '@/hooks/useKeyboard';
import { cn } from '@/lib';
import { LogoMark } from '@/icons';
import { ScrambleText } from './ScrambleText';
import { useBootAudio } from './useBootAudio';
import { BOOT_PHASES, BOOT_HOLD_INDEX, BOOT_VERSION, BOOT_TIMING } from './bootConfig';

const RING_R = 54;
const RING_C = 2 * Math.PI * RING_R;
const PARTICLES = 16;

export interface BootSequenceProps {
  /** Fired once the sequence has fully dissolved (world reveal hook). */
  onComplete?: () => void;
}

/**
 * The cinematic ATLAS boot — a premium OS cold-start, not a spinner.
 *
 * A single GSAP timeline choreographs: reactor ignition → subsystem log
 * (scramble-decoded) → real progress → a hold on "synchronizing" until the
 * engine is genuinely ready → operator-link resolve → welcome → flash →
 * dissolve. DOM/CSS/SVG only (no WebGL), so it paints instantly and never
 * blocks. Skippable, reduced-motion aware, SSR-safe, with audio trigger points
 * wired (audio itself lands later).
 */
export function BootSequence({ onComplete }: BootSequenceProps) {
  const ready = useEngineStore((s) => s.ready);
  const reduced = useReducedMotion();
  const { cue } = useBootAudio();

  const [activePhase, setActivePhase] = useState(-1);
  const [removed, setRemoved] = useState(false);
  const [skipReady, setSkipReady] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const reactorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<SVGCircleElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const welcomeRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const readyRef = useRef(false);
  const reachedHoldRef = useRef(false);
  const resumedRef = useRef(false);
  const finishedRef = useRef(false);
  const skippingRef = useRef(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    engineStore.setState({ bootComplete: true });
    setRemoved(true);
    onComplete?.();
  }, [onComplete]);

  const writeProgress = useCallback((v: number) => {
    const pct = Math.round(v * 100);
    if (percentRef.current) percentRef.current.textContent = String(pct).padStart(2, '0');
    if (ringRef.current) ringRef.current.style.strokeDashoffset = String(RING_C * (1 - v));
    if (barRef.current) barRef.current.style.transform = `scaleX(${v})`;
    rootRef.current?.setAttribute('aria-valuenow', String(pct));
  }, []);

  const maybeResume = useCallback(() => {
    if (resumedRef.current) return;
    if (reachedHoldRef.current && readyRef.current) {
      resumedRef.current = true;
      tlRef.current?.play();
    }
  }, []);

  // Track real engine readiness → try to release the hold.
  useEffect(() => {
    readyRef.current = ready;
    maybeResume();
  }, [ready, maybeResume]);

  // Reveal the skip affordance shortly after boot begins.
  useEffect(() => {
    const t = window.setTimeout(() => setSkipReady(true), BOOT_TIMING.skipHintDelayMs);
    return () => window.clearTimeout(t);
  }, []);

  // Safety net: never trap the user if something stalls.
  useEffect(() => {
    const t = window.setTimeout(finish, BOOT_TIMING.safetyTimeoutMs);
    return () => window.clearTimeout(t);
  }, [finish]);

  // Reduced-motion path: static screen that fades once ready.
  useEffect(() => {
    if (!reduced) return;
    setActivePhase(BOOT_PHASES.length - 1);
    writeProgress(1);
    if (!ready) return;
    const t = window.setTimeout(finish, 400);
    return () => window.clearTimeout(t);
  }, [reduced, ready, finish, writeProgress]);

  // Main choreographed timeline.
  useIsomorphicLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const tl = gsap.timeline();
      tlRef.current = tl;

      gsap.set(reactorRef.current, { autoAlpha: 0, scale: 0.85 });
      gsap.set(welcomeRef.current, { autoAlpha: 0, yPercent: 120 });
      gsap.set(flashRef.current, { autoAlpha: 0 });

      const startAt = BOOT_TIMING.intro * 0.6;
      const pre = BOOT_PHASES.slice(0, BOOT_HOLD_INDEX + 1);
      const holdProgress = BOOT_PHASES[BOOT_HOLD_INDEX].progress;

      // Reactor ignition.
      tl.to(reactorRef.current, { autoAlpha: 1, scale: 1, duration: BOOT_TIMING.intro, ease: 'expo.out' });

      // Progress climbs across the pre-hold phases.
      const prog = { v: 0 };
      tl.to(
        prog,
        { v: holdProgress, duration: pre.length * BOOT_TIMING.step, ease: 'none', onUpdate: () => writeProgress(prog.v) },
        startAt,
      );

      // Reveal each subsystem log line + fire its (future) audio cue.
      pre.forEach((phase, i) => {
        tl.add(() => {
          setActivePhase(i);
          cue(phase.cue);
        }, startAt + i * BOOT_TIMING.step);
      });

      // Hold on "synchronizing" until the engine reports ready.
      tl.addPause('+=0.15', () => {
        reachedHoldRef.current = true;
        cue('sync');
        maybeResume();
      });

      // Post-hold: complete progress, establish the link.
      tl.to(prog, { v: 1, duration: 0.6, ease: 'power2.out', onUpdate: () => writeProgress(prog.v) });
      tl.add(() => {
        setActivePhase(BOOT_PHASES.length - 1);
        cue('link');
      });

      // Welcome beat.
      tl.to(welcomeRef.current, { autoAlpha: 1, yPercent: 0, duration: 0.7, ease: 'expo.out' }, '+=0.15');
      tl.add(() => cue('welcome'), '<');

      // Flash + dissolve into the world.
      tl.to(flashRef.current, { autoAlpha: 0.85, duration: 0.12, ease: 'power2.in' }, '+=0.5');
      tl.add(() => cue('launch'), '<');
      tl.to(flashRef.current, { autoAlpha: 0, duration: 0.45 });
      tl.to(rootRef.current, { autoAlpha: 0, duration: 0.7, ease: 'power2.inOut' }, '<0.1');
      tl.add(finish);
    }, rootRef);

    return () => ctx.revert();
  }, [reduced]);

  // Skip → kill the timeline and dissolve quickly.
  const skip = useCallback(() => {
    if (finishedRef.current || skippingRef.current || !skipReady) return;
    skippingRef.current = true;
    cue('launch');
    tlRef.current?.kill();
    const el = rootRef.current;
    if (!el) return finish();
    gsap.to(el, { autoAlpha: 0, duration: reduced ? 0 : 0.4, ease: 'power2.inOut', onComplete: finish });
  }, [skipReady, reduced, cue, finish]);

  useKeyboard({ Enter: skip, Escape: skip, ' ': skip });

  if (removed) return null;

  const status = BOOT_PHASES[Math.max(0, activePhase)]?.status ?? 'COLD START';

  return (
    <div
      ref={rootRef}
      role="progressbar"
      aria-label="Booting ATLAS"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
      onClick={skip}
      className="fixed inset-0 z-[100] overflow-hidden bg-void text-signal [animation:atlas-flicker_6s_ease-in-out_infinite]"
    >
      {/* Noise */}
      <svg className="pointer-events-none absolute inset-0 size-full opacity-[0.05] mix-blend-overlay" aria-hidden>
        <filter id="boot-noise">
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
        </filter>
        <rect width="100%" height="100%" filter="url(#boot-noise)" />
      </svg>

      {/* Scanlines */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-40 [animation:atlas-scanlines_0.6s_linear_infinite]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(to bottom, transparent 0, transparent 2px, rgba(0,0,0,0.35) 3px)',
        }}
      />

      {/* Vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.7) 100%)' }}
      />

      {/* Ambient particles (deterministic positions → SSR-safe) */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {Array.from({ length: PARTICLES }).map((_, i) => (
          <span
            key={i}
            className="absolute size-0.5 rounded-full bg-flux"
            style={{
              left: `${(i * 61) % 100}%`,
              bottom: `${(i * 29) % 60}%`,
              animation: `atlas-drift ${6 + (i % 5)}s ease-in-out ${i * 0.4}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Top HUD bar */}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between px-6 py-5 font-mono text-2xs uppercase tracking-[0.2em] text-fog">
        <div className="flex items-center gap-2">
          <LogoMark size={16} className="text-flux" />
          <span>ATLAS // operator link</span>
        </div>
        <ScrambleText key={status} text={status} className="text-flux" duration={0.4} />
      </div>

      {/* Center reactor */}
      <div className="absolute inset-0 grid place-items-center">
        <div ref={reactorRef} className="relative grid place-items-center">
          {/* glow */}
          <div
            aria-hidden
            className="absolute size-72 rounded-full blur-[var(--blur-heavy)]"
            style={{ background: 'radial-gradient(circle, color-mix(in oklab, var(--color-flux) 40%, transparent), transparent 70%)' }}
          />
          {/* ring */}
          <svg width={128} height={128} viewBox="0 0 128 128" className="-rotate-90">
            <circle cx="64" cy="64" r={RING_R} fill="none" stroke="var(--color-line)" strokeWidth={2} />
            <circle
              ref={ringRef}
              cx="64"
              cy="64"
              r={RING_R}
              fill="none"
              stroke="var(--color-flux)"
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray={RING_C}
              strokeDashoffset={RING_C}
            />
          </svg>
          {/* logo + percent */}
          <div className="absolute flex flex-col items-center gap-2">
            <LogoMark size={28} className="text-signal" />
            <div className="font-mono text-sm tabular-nums text-flux">
              <span ref={percentRef}>00</span>
              <span className="text-fog-dim">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Boot log */}
      <div className="absolute bottom-16 left-6 flex max-w-[80vw] flex-col gap-1.5 font-mono text-2xs text-fog">
        {BOOT_PHASES.slice(0, activePhase + 1).map((phase, i) => {
          const isNewest = i === activePhase;
          return (
            <div key={phase.id} className={cn('flex items-center gap-2', !isNewest && 'opacity-40')}>
              <span className={cn('size-1 rounded-full', i === BOOT_PHASES.length - 1 ? 'bg-gold' : 'bg-flux')} />
              <ScrambleText text={phase.label} className="uppercase tracking-[0.12em]" duration={0.5} />
              {isNewest && (
                <span className="ml-0.5 inline-block h-3 w-[2px] bg-flux [animation:atlas-caret_1s_step-end_infinite]" />
              )}
            </div>
          );
        })}
      </div>

      {/* Welcome */}
      <div
        ref={welcomeRef}
        className="pointer-events-none absolute inset-x-0 bottom-1/2 translate-y-1/2 text-center font-display text-2xl font-semibold tracking-tight text-signal opacity-0"
      >
        Welcome, Operator
      </div>

      {/* Bottom bar + progress line */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="flex items-center justify-between px-6 pb-4 font-mono text-2xs uppercase tracking-[0.2em] text-fog-dim">
          <span>{BOOT_VERSION}</span>
          {skipReady && (
            <button
              type="button"
              onClick={skip}
              className="pointer-events-auto text-fog transition-colors hover:text-signal focus-visible:outline-2 focus-visible:outline-[var(--color-focus)]"
            >
              press any key to skip →
            </button>
          )}
        </div>
        <div className="h-px w-full bg-line">
          <div ref={barRef} className="h-full w-full origin-left bg-flux" style={{ transform: 'scaleX(0)' }} />
        </div>
      </div>

      {/* Flash */}
      <div ref={flashRef} aria-hidden className="pointer-events-none absolute inset-0 bg-signal opacity-0" />
    </div>
  );
}
