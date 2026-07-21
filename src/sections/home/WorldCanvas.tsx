'use client';

import { useRef } from 'react';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { useTick } from '@/hooks/useTick';
import { useScrollFrame } from '@/hooks/useScroll';
import { usePerformance } from '@/hooks/usePerformance';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/** The horizon sits here (fraction of viewport height). Shared with AnchorLine. */
export const HORIZON = 0.62;

interface Dust {
  x: number; // 0..1 across width
  y: number; // 0..1 across height
  z: number; // depth 0(near)..1(far)
  r: number; // radius px
  a: number; // base alpha
  p: number; // twinkle phase
}

/**
 * The persistent cinematic world — a fixed, full-viewport canvas held behind
 * every chapter (the reference's "camera that never cuts"). Deep charcoal sky,
 * a warm gold/coral horizon glow that blooms on fast scroll, and depth dust
 * that parallaxes with scroll + pointer. One RAF (engine ticker); correct
 * static first paint; reduced-motion renders a calm still frame.
 */
export function WorldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { tier } = usePerformance();
  const reduced = useReducedMotion();

  const dust = useRef<Dust[]>([]);
  const size = useRef({ w: 0, h: 0, dpr: 1 });
  const scroll = useRef({ progress: 0, velocity: 0 });
  const pointer = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 });
  const glow = useRef(0.55); // eased bloom intensity
  const renderRef = useRef<((time: number) => void) | null>(null);

  useScrollFrame((p) => {
    scroll.current.progress = p.progress;
    scroll.current.velocity = p.velocity;
  });

  // Setup: size the canvas, seed the dust field, paint one static frame.
  useIsomorphicLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const count = tier === 'low' ? 40 : tier === 'medium' ? 90 : 150;
    const seed = () => {
      const arr: Dust[] = [];
      for (let i = 0; i < count; i++) {
        // Deterministic-ish spread (no Math.random dependency for SSR calm).
        const x = (Math.sin(i * 12.9898) * 43758.5453) % 1;
        const y = (Math.sin(i * 78.233) * 12543.223) % 1;
        const z = (Math.sin(i * 3.14) * 9271.11) % 1;
        arr.push({
          x: Math.abs(x),
          y: Math.abs(y) * 0.9,
          z: Math.abs(z),
          r: 0.4 + Math.abs(z) * 1.6,
          a: 0.12 + Math.abs(z) * 0.5,
          p: Math.abs(x) * Math.PI * 2,
        });
      }
      return arr;
    };
    dust.current = seed();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
      const w = window.innerWidth;
      const h = window.innerHeight;
      size.current = { w, h, dpr };
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      render(0);
    };

    const onMove = (e: PointerEvent) => {
      pointer.current.tx = e.clientX / window.innerWidth;
      pointer.current.ty = e.clientY / window.innerHeight;
    };

    const render = (time: number) => {
      const { w, h } = size.current;
      if (!w || !h) return;
      const prog = scroll.current.progress;
      const horizonY = h * (HORIZON - prog * 0.05);

      // — Sky: deep vertical gradient, warming toward the horizon —
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#070709');
      sky.addColorStop(0.45, '#0a0a0f');
      sky.addColorStop(Math.min(0.98, HORIZON - prog * 0.05 - 0.02), '#141019');
      sky.addColorStop(HORIZON - prog * 0.05, '#241826');
      sky.addColorStop(Math.min(1, HORIZON - prog * 0.05 + 0.02), '#0c0a0f');
      sky.addColorStop(1, '#070708');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // — Horizon bloom: wide warm glow centered on the line —
      const g = glow.current;
      const cx = w * (0.5 + (pointer.current.x - 0.5) * 0.04);
      const grad = ctx.createRadialGradient(cx, horizonY, 0, cx, horizonY, w * 0.75);
      grad.addColorStop(0, `rgba(240,180,94,${0.22 * g})`);
      grad.addColorStop(0.18, `rgba(224,122,78,${0.14 * g})`);
      grad.addColorStop(0.5, `rgba(120,60,60,${0.05 * g})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(cx, horizonY, w * 0.75, h * 0.42, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // — Depth dust: parallax by scroll + pointer, subtle twinkle —
      const px = (pointer.current.x - 0.5);
      const py = (pointer.current.y - 0.5);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (const d of dust.current) {
        const depth = 0.3 + d.z * 0.7;
        const driftY = ((d.y - prog * (0.15 + d.z * 0.5)) % 1 + 1) % 1;
        const x = d.x * w + px * 40 * depth;
        const y = driftY * h + py * 24 * depth;
        const tw = reduced ? 1 : 0.65 + 0.35 * Math.sin(time * 0.0012 + d.p);
        // fade dust near/under the horizon so the glow reads clean
        const vertFade = y > horizonY ? Math.max(0, 1 - (y - horizonY) / (h * 0.3)) : 1;
        ctx.globalAlpha = d.a * tw * vertFade;
        ctx.fillStyle = d.z > 0.6 ? '#fff4e0' : '#cfd6e6';
        ctx.beginPath();
        ctx.arc(x, y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    // expose render for the ticker
    renderRef.current = render;

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onMove);
      renderRef.current = null;
    };
  }, [tier, reduced]);

  useTick((state) => {
    // ease pointer + glow toward targets (bloom rises with scroll velocity)
    const p = pointer.current;
    p.x += (p.tx - p.x) * 0.06;
    p.y += (p.ty - p.y) * 0.06;
    const targetGlow = 0.5 + Math.min(0.5, Math.abs(scroll.current.velocity) * 0.03);
    glow.current += (targetGlow - glow.current) * 0.08;
    renderRef.current?.(state.timestamp);
  });

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 z-[var(--z-canvas)] size-full"
    />
  );
}
