'use client';

import { useEffect, useRef, useState } from 'react';
import { useEngineOptional } from '@/hooks/useEngine';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { TickPriority } from '@/types';
import { COLORS } from '@/design/tokens';
import type { CursorVariant } from '@/engine/managers/CursorManager';

const TRAIL = 3;

/** Accent color per variant (used for the ring border + glow). */
const VARIANT_COLOR: Record<CursorVariant, string> = {
  default: COLORS.signal,
  hover: COLORS.flux,
  button: COLORS.flux,
  interactive: COLORS.flux,
  magnetic: COLORS.flux2,
  view: COLORS.flux,
  drag: COLORS.ember,
  text: COLORS.signal,
  loading: COLORS.flux,
  disabled: COLORS.fogDim,
  hidden: COLORS.signal,
};

/**
 * Renders the custom ATLAS reticle, driven imperatively from the engine's
 * `CursorManager` on the shared ticker — it never re-renders per frame (writes
 * straight to refs). Adds glow, a velocity-aligned squash/stretch, press
 * scaling, a lagging trail, a loading spin and contextual labels. Shown only on
 * fine pointers; collapses to a plain dot under reduced motion.
 */
export function CursorLayer() {
  const engine = useEngineOptional();
  const reduced = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);
  const trailRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [finePointer, setFinePointer] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    const update = () => setFinePointer(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    if (!engine || !finePointer) return;
    const root = rootRef.current;
    const ring = ringRef.current;
    const dot = dotRef.current;
    const label = labelRef.current;
    if (!root || !ring || !dot) return;

    const trail = Array.from({ length: TRAIL }, () => ({ x: 0, y: 0 }));
    let spin = 0;

    return engine.ticker.add((tick) => {
      const c = engine.cursor.state;
      const color = VARIANT_COLOR[c.variant];

      root.style.transform = `translate3d(${c.x}px, ${c.y}px, 0)`;
      root.style.opacity = c.visible ? '1' : '0';
      root.style.mixBlendMode = c.variant === 'default' ? 'difference' : 'normal';

      const press = c.pressed ? 0.8 : 1;
      const d = c.radius * 2;
      ring.style.width = `${d}px`;
      ring.style.height = `${d}px`;
      ring.style.borderColor = color;

      if (c.variant === 'loading') {
        spin += tick.delta * 540;
        ring.style.borderStyle = 'dashed';
        ring.style.transform = `translate(-50%, -50%) rotate(${spin}deg) scale(${press})`;
      } else {
        ring.style.borderStyle = 'solid';
        // Velocity-aligned squash & stretch (disabled under reduced motion).
        const stretch = reduced ? 0 : Math.min(c.speed * 0.02, 0.4);
        const deg = (c.angle * 180) / Math.PI;
        const sx = (1 + stretch) * press;
        const sy = (1 - stretch * 0.5) * press;
        ring.style.transform = `translate(-50%, -50%) rotate(${deg}deg) scale(${sx.toFixed(3)}, ${sy.toFixed(3)})`;
      }

      // Glow scales with motion + expanded variants.
      const glow = reduced ? 0 : Math.min(6 + c.speed * 1.5, 28);
      ring.style.boxShadow = c.variant === 'default' ? 'none' : `0 0 ${glow}px ${color}`;
      ring.style.opacity = c.variant === 'disabled' ? '0.5' : '1';

      dot.style.backgroundColor = color;
      dot.style.transform = `translate(-50%, -50%) scale(${press})`;
      dot.style.opacity = c.variant === 'text' ? '0' : '1';

      if (label) {
        label.textContent = c.label ?? '';
        label.style.opacity = c.label ? '1' : '0';
      }

      // Lagging trail chain (skipped under reduced motion).
      if (!reduced) {
        let px = c.x;
        let py = c.y;
        for (let i = 0; i < TRAIL; i++) {
          const t = trail[i];
          t.x += (px - t.x) * (0.35 - i * 0.08);
          t.y += (py - t.y) * (0.35 - i * 0.08);
          const el = trailRefs.current[i];
          if (el) {
            el.style.transform = `translate3d(${t.x - c.x}px, ${t.y - c.y}px, 0)`;
            el.style.opacity = c.visible ? `${0.18 - i * 0.05}` : '0';
            el.style.backgroundColor = color;
          }
          px = t.x;
          py = t.y;
        }
      }
    }, TickPriority.PostRender);
  }, [engine, finePointer, reduced]);

  if (!finePointer) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden
      className="pointer-events-none fixed left-0 top-0 z-[var(--z-cursor)] opacity-0"
      style={{ willChange: 'transform, opacity' }}
    >
      {/* Trail dots (behind the reticle). */}
      {!reduced &&
        Array.from({ length: TRAIL }).map((_, i) => (
          <div
            key={i}
            ref={(el) => {
              trailRefs.current[i] = el;
            }}
            className="absolute left-0 top-0 size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full"
          />
        ))}

      {/* Ring. */}
      <div
        ref={ringRef}
        className="absolute left-0 top-0 rounded-full border"
        style={{ willChange: 'transform', transition: 'width 0.2s var(--ease-signal), height 0.2s var(--ease-signal)' }}
      />

      {/* Center dot. */}
      <div ref={dotRef} className="absolute left-0 top-0 size-1 rounded-full" />

      {/* Contextual label. */}
      <span
        ref={labelRef}
        className="absolute left-4 top-4 whitespace-nowrap font-mono text-2xs uppercase tracking-[0.2em] text-signal opacity-0"
      />
    </div>
  );
}
