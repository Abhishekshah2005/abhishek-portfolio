'use client';

import { useRef } from 'react';
import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';
import { useTick } from '@/hooks/useTick';
import { useScrollFrame } from '@/hooks/useScroll';
import { usePerformance } from '@/hooks/usePerformance';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export const HORIZON = 0.68;

interface Star {
  x: number;
  y: number;
  z: number;
  r: number;
  a: number;
  p: number;
}

/**
 * The cinematic 2D world — a photographic-style sunset composite matching the
 * reference: deep indigo starfield, a layered glowing sun on the horizon with
 * god-ray streaks, atmospheric haze, a perspective road with a warm reflection,
 * and a lone figure facing the light. Pure 2D canvas so it renders on first
 * paint (verifiable), driven by the engine ticker for subtle life.
 */
export function WorldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { tier } = usePerformance();
  const reduced = useReducedMotion();

  const stars = useRef<Star[]>([]);
  const size = useRef({ w: 0, h: 0, dpr: 1 });
  const scroll = useRef({ progress: 0, velocity: 0 });
  const pointer = useRef({ x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 });
  const glow = useRef(1);
  const renderRef = useRef<((t: number) => void) | null>(null);

  useScrollFrame((p) => {
    scroll.current.progress = p.progress;
    scroll.current.velocity = p.velocity;
  });

  useIsomorphicLayoutEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const count = tier === 'low' ? 70 : tier === 'medium' ? 140 : 220;
    stars.current = Array.from({ length: count }, (_, i) => {
      const x = Math.abs((Math.sin(i * 12.9898) * 43758.5453) % 1);
      const y = Math.abs((Math.sin(i * 78.233) * 12543.223) % 1);
      const z = Math.abs((Math.sin(i * 3.14) * 9271.11) % 1);
      return { x, y, z, r: 0.35 + z * 1.5, a: 0.15 + z * 0.6, p: x * Math.PI * 2 };
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
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
      const hy = h * (HORIZON - prog * 0.04); // horizon Y
      const sunX = w * (0.5 + (pointer.current.x - 0.5) * 0.05);
      const g = glow.current;

      // — Sky: rich sunset gradient (indigo night → magenta → warm band) —
      const sky = ctx.createLinearGradient(0, 0, 0, h);
      sky.addColorStop(0, '#080614');
      sky.addColorStop(0.3, '#120c26');
      sky.addColorStop(0.52, '#2a1638');
      sky.addColorStop(Math.max(0.02, HORIZON - prog * 0.04 - 0.08), '#5a234a');
      sky.addColorStop(Math.max(0.03, HORIZON - prog * 0.04 - 0.02), '#b5464a');
      sky.addColorStop(HORIZON - prog * 0.04, '#f0894e');
      sky.addColorStop(Math.min(1, HORIZON - prog * 0.04 + 0.006), '#1a0e18');
      sky.addColorStop(1, '#070510');
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, w, h);

      // — Stars in the upper sky —
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (const s of stars.current) {
        const y = s.y * hy * 0.92;
        const x = s.x * w + (pointer.current.x - 0.5) * 26 * s.z;
        const tw = reduced ? 1 : 0.6 + 0.4 * Math.sin(time * 0.0013 + s.p);
        const fade = Math.max(0, 1 - y / (hy * 0.98));
        ctx.globalAlpha = s.a * tw * (0.3 + fade * 0.7);
        ctx.fillStyle = s.z > 0.6 ? '#fff3dc' : '#dbe0f0';
        ctx.beginPath();
        ctx.arc(x, y, s.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // — The sun: layered warm glow blooming on the horizon —
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const halo = ctx.createRadialGradient(sunX, hy, 0, sunX, hy, w * 0.62);
      halo.addColorStop(0, `rgba(255,236,190,${0.5 * g})`);
      halo.addColorStop(0.12, `rgba(255,180,110,${0.34 * g})`);
      halo.addColorStop(0.34, `rgba(224,96,96,${0.14 * g})`);
      halo.addColorStop(0.7, `rgba(120,40,90,${0.05 * g})`);
      halo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.ellipse(sunX, hy, w * 0.62, h * 0.44, 0, 0, Math.PI * 2);
      ctx.fill();
      // bright core disc just above the horizon
      const core = ctx.createRadialGradient(sunX, hy - h * 0.02, 0, sunX, hy - h * 0.02, w * 0.09);
      core.addColorStop(0, `rgba(255,247,224,${0.95 * g})`);
      core.addColorStop(0.5, `rgba(255,206,138,${0.7 * g})`);
      core.addColorStop(1, 'rgba(255,170,110,0)');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.arc(sunX, hy - h * 0.02, w * 0.09, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // — God-ray streaks fanning up from the sun —
      if (!reduced) {
        ctx.save();
        ctx.globalCompositeOperation = 'screen';
        ctx.translate(sunX, hy);
        const rays = 7;
        for (let i = 0; i < rays; i++) {
          const ang = -Math.PI / 2 + (i - (rays - 1) / 2) * 0.26 + Math.sin(time * 0.0004 + i) * 0.02;
          ctx.save();
          ctx.rotate(ang);
          const rg = ctx.createLinearGradient(0, 0, 0, -h * 0.7);
          rg.addColorStop(0, `rgba(255,210,150,${0.09 * g})`);
          rg.addColorStop(1, 'rgba(255,210,150,0)');
          ctx.fillStyle = rg;
          ctx.beginPath();
          ctx.moveTo(-w * 0.02, 0);
          ctx.lineTo(w * 0.02, 0);
          ctx.lineTo(w * 0.05, -h * 0.7);
          ctx.lineTo(-w * 0.05, -h * 0.7);
          ctx.closePath();
          ctx.fill();
          ctx.restore();
        }
        ctx.restore();
      }

      // — Atmospheric haze band on the horizon —
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const haze = ctx.createLinearGradient(0, hy - h * 0.06, 0, hy + h * 0.02);
      haze.addColorStop(0, 'rgba(255,150,110,0)');
      haze.addColorStop(0.6, `rgba(240,130,110,${0.12 * g})`);
      haze.addColorStop(1, 'rgba(255,150,110,0)');
      ctx.fillStyle = haze;
      ctx.fillRect(0, hy - h * 0.06, w, h * 0.08);
      ctx.restore();

      // — Ground / road: dark plane with a warm reflection of the sun —
      ctx.fillStyle = '#080610';
      ctx.fillRect(0, hy, w, h - hy);
      // reflected sunlight on the ground
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const refl = ctx.createLinearGradient(0, hy, 0, h);
      refl.addColorStop(0, `rgba(240,130,90,${0.22 * g})`);
      refl.addColorStop(0.5, `rgba(150,60,80,${0.06 * g})`);
      refl.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = refl;
      ctx.beginPath();
      ctx.moveTo(sunX - w * 0.06, hy);
      ctx.lineTo(sunX + w * 0.06, hy);
      ctx.lineTo(sunX + w * 0.32, h);
      ctx.lineTo(sunX - w * 0.32, h);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // road surface (perspective trapezoid)
      const half = w * 0.34;
      ctx.beginPath();
      ctx.moveTo(sunX - 1.5, hy);
      ctx.lineTo(sunX - half, h);
      ctx.lineTo(sunX + half, h);
      ctx.lineTo(sunX + 1.5, hy);
      ctx.closePath();
      const road = ctx.createLinearGradient(0, hy, 0, h);
      road.addColorStop(0, 'rgba(38,30,44,0)');
      road.addColorStop(0.14, 'rgba(30,24,36,0.55)');
      road.addColorStop(1, 'rgba(16,13,22,0.92)');
      ctx.fillStyle = road;
      ctx.fill();
      // center dashes
      ctx.fillStyle = 'rgba(240,180,130,0.5)';
      for (let i = 0; i < 8; i++) {
        const t = (i / 8) * (i / 8);
        const y = hy + (h - hy) * (0.06 + t * 0.94);
        const s = (y - hy) / (h - hy);
        ctx.globalAlpha = 0.1 + s * 0.22;
        ctx.fillRect(sunX - (1 + s * 4) / 2, y - (3 + s * 20), 1 + s * 4, 3 + s * 20);
      }
      ctx.globalAlpha = 1;

      // — Figure silhouette on the road, facing the light —
      const figH = Math.max(28, h * 0.07);
      const fx = sunX + (pointer.current.x - 0.5) * 6;
      const fy = hy + h * 0.02;
      ctx.save();
      ctx.globalCompositeOperation = 'screen';
      const fhalo = ctx.createRadialGradient(fx, fy - figH * 0.5, 0, fx, fy - figH * 0.5, figH * 1.1);
      fhalo.addColorStop(0, `rgba(255,180,120,${0.3 * g})`);
      fhalo.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = fhalo;
      ctx.beginPath();
      ctx.arc(fx, fy - figH * 0.5, figH * 1.1, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      ctx.fillStyle = 'rgba(4,4,8,0.98)';
      ctx.beginPath();
      ctx.arc(fx, fy - figH * 0.84, figH * 0.11, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(fx - figH * 0.13, fy - figH * 0.68);
      ctx.lineTo(fx + figH * 0.13, fy - figH * 0.68);
      ctx.lineTo(fx + figH * 0.08, fy - figH * 0.3);
      ctx.lineTo(fx - figH * 0.08, fy - figH * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.fillRect(fx - figH * 0.08, fy - figH * 0.32, figH * 0.058, figH * 0.32);
      ctx.fillRect(fx + figH * 0.022, fy - figH * 0.32, figH * 0.058, figH * 0.32);
    };

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
    const p = pointer.current;
    p.x += (p.tx - p.x) * 0.06;
    p.y += (p.ty - p.y) * 0.06;
    const target = 1 + Math.min(0.5, Math.abs(scroll.current.velocity) * 0.02);
    glow.current += (target - glow.current) * 0.08;
    renderRef.current?.(state.timestamp);
  });

  return <canvas ref={canvasRef} aria-hidden className="fixed inset-0 z-[var(--z-canvas)] size-full" />;
}
