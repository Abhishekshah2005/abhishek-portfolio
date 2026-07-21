'use client';

import { useRef } from 'react';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { useTick } from '@/hooks/useTick';
import { useScrollFrame } from '@/hooks/useScroll';
import { usePerformance } from '@/hooks/usePerformance';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useTraverse } from './traverse';

/** The horizon sits here (fraction of viewport height). Shared with AnchorLine. */
export const HORIZON = 0.62;

/**
 * Per-chapter horizon mood — subtle warmth/intensity shifts as you traverse
 * (inner glow rgb, outer coral rgb, intensity). All within one warm family so
 * it reads cohesive, never a rainbow. Index matches CHAPTERS order.
 */
const MOODS: [number, number, number][][] = [
  [[240, 180, 94], [224, 122, 78]], // 01 arrival — gold
  [[232, 168, 96], [200, 106, 80]], // 02 operator
  [[216, 154, 88], [184, 94, 72]], //  03 problems — muted (tension)
  [[230, 179, 106], [201, 122, 85]], // 04 finance — cool gold (trust)
  [[242, 190, 110], [224, 128, 80]], // 05 tech — brighter
  [[238, 178, 98], [218, 122, 78]], //  06 proof
  [[232, 172, 96], [206, 116, 78]], //  07 services
  [[236, 176, 100], [216, 120, 78]], // 08 process
  [[234, 174, 98], [208, 114, 76]], //  09 standard
  [[248, 198, 122], [238, 136, 88]], // 10 contact — warmest (inviting)
];
const MOOD_INTENSITY = [1, 0.92, 0.85, 0.96, 1.06, 1, 0.96, 1, 0.92, 1.22];

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
  const { active } = useTraverse();

  const dust = useRef<Dust[]>([]);
  const size = useRef({ w: 0, h: 0, dpr: 1 });
  const scroll = useRef({ progress: 0, velocity: 0 });
  const pointer = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 });
  const glow = useRef(0.55); // eased bloom intensity
  // Eased horizon mood (inner rgb, outer rgb, intensity) — lerps per chapter.
  const mood = useRef({ inr: 240, ing: 180, inb: 94, our: 224, oug: 122, oub: 78, i: 1 });
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

      const m = mood.current;
      const g = glow.current * m.i;
      const cx = w * (0.5 + (pointer.current.x - 0.5) * 0.04);
      const H = HORIZON - prog * 0.05;

      // — Sky: deep indigo night, warming to purple toward the horizon —
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#080814');
      sky.addColorStop(0.34, '#0d0c1e');
      sky.addColorStop(Math.max(0.02, H - 0.05), '#1b1433');
      sky.addColorStop(H, '#2a1e3a');
      sky.addColorStop(Math.min(0.999, H + 0.015), '#0c0a12');
      sky.addColorStop(1, '#070610');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // — Horizon bloom: wide warm glow centered on the line (mood-tinted) —
      const grad = ctx.createRadialGradient(cx, horizonY, 0, cx, horizonY, w * 0.78);
      grad.addColorStop(0, `rgba(${m.inr | 0},${m.ing | 0},${m.inb | 0},${0.26 * g})`);
      grad.addColorStop(0.18, `rgba(${m.our | 0},${m.oug | 0},${m.oub | 0},${0.16 * g})`);
      grad.addColorStop(0.5, `rgba(120,60,70,${0.05 * g})`);
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.ellipse(cx, horizonY, w * 0.78, h * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // — Stars/dust: confined to the sky above the horizon —
      const px = pointer.current.x - 0.5;
      const py = pointer.current.y - 0.5;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (const d of dust.current) {
        const depth = 0.3 + d.z * 0.7;
        const driftY = (((d.y * 0.8 - prog * (0.1 + d.z * 0.4)) % 1) + 1) % 1;
        const x = d.x * w + px * 40 * depth;
        const y = driftY * horizonY + py * 22 * depth;
        const tw = reduced ? 1 : 0.65 + 0.35 * Math.sin(time * 0.0012 + d.p);
        const vertFade = Math.max(0, 1 - y / horizonY);
        ctx.globalAlpha = d.a * tw * (0.35 + vertFade * 0.65);
        ctx.fillStyle = d.z > 0.6 ? '#fff4e0' : '#cfd6e6';
        ctx.beginPath();
        ctx.arc(x, y, d.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // — The road: perspective trapezoid receding to the vanishing point —
      const vpx = cx;
      const vpy = horizonY;
      const half = w * 0.36;
      ctx.beginPath();
      ctx.moveTo(vpx - 1.5, vpy);
      ctx.lineTo(vpx - half, h);
      ctx.lineTo(vpx + half, h);
      ctx.lineTo(vpx + 1.5, vpy);
      ctx.closePath();
      const road = ctx.createLinearGradient(0, vpy, 0, h);
      road.addColorStop(0, 'rgba(42,40,54,0)');
      road.addColorStop(0.12, 'rgba(32,30,42,0.6)');
      road.addColorStop(1, 'rgba(18,17,26,0.92)');
      ctx.fillStyle = road;
      ctx.fill();
      // warm reflection where the road meets the glow (path still set)
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const refl = ctx.createLinearGradient(0, vpy, 0, vpy + h * 0.18);
      refl.addColorStop(0, `rgba(${m.our | 0},${m.oug | 0},${m.oub | 0},${0.18 * g})`);
      refl.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = refl;
      ctx.fill();
      ctx.restore();

      // — Center-line dashes (perspective-spaced) —
      ctx.fillStyle = `rgba(${m.inr | 0},${m.ing | 0},${m.inb | 0},1)`;
      const dashes = 8;
      for (let i = 0; i < dashes; i++) {
        const t = (i / dashes) * (i / dashes); // bunch toward horizon
        const y = vpy + (h - vpy) * (0.06 + t * 0.94);
        const s = (y - vpy) / (h - vpy);
        const dw = 1 + s * 5;
        const dh = 3 + s * 20;
        ctx.globalAlpha = (0.12 + s * 0.22) * (reduced ? 1 : 1);
        ctx.fillRect(vpx - dw / 2, y - dh, dw, dh);
      }
      ctx.globalAlpha = 1;

      // — The lone figure, standing on the road, facing the horizon —
      const figH = Math.max(26, h * 0.062);
      const fx = vpx + px * 6;
      const fy = vpy + h * 0.016;
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const halo = ctx.createRadialGradient(fx, fy - figH * 0.5, 0, fx, fy - figH * 0.5, figH);
      halo.addColorStop(0, `rgba(${m.our | 0},${m.oug | 0},${m.oub | 0},${0.28 * g})`);
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(fx, fy - figH * 0.5, figH, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = 'rgba(5,5,9,0.97)';
      ctx.beginPath(); // head
      ctx.arc(fx, fy - figH * 0.84, figH * 0.12, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath(); // torso (tapered)
      ctx.moveTo(fx - figH * 0.14, fy - figH * 0.68);
      ctx.lineTo(fx + figH * 0.14, fy - figH * 0.68);
      ctx.lineTo(fx + figH * 0.09, fy - figH * 0.3);
      ctx.lineTo(fx - figH * 0.09, fy - figH * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(fx - figH * 0.085, fy - figH * 0.32, figH * 0.062, figH * 0.32); // left leg
      ctx.fillRect(fx + figH * 0.023, fy - figH * 0.32, figH * 0.062, figH * 0.32); // right leg
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
    // ease the horizon mood toward the active chapter's palette
    const idx = Math.max(0, Math.min(MOODS.length - 1, active));
    const [inn, out] = MOODS[idx];
    const m = mood.current;
    const k = 0.04;
    m.inr += (inn[0] - m.inr) * k;
    m.ing += (inn[1] - m.ing) * k;
    m.inb += (inn[2] - m.inb) * k;
    m.our += (out[0] - m.our) * k;
    m.oug += (out[1] - m.oug) * k;
    m.oub += (out[2] - m.oub) * k;
    m.i += (MOOD_INTENSITY[idx] - m.i) * k;
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
