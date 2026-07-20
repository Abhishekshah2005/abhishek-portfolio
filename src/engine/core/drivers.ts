import type { RAFDriver } from '@/types';

/**
 * Default driver backed by `requestAnimationFrame`.
 * Used on the server (as a no-op) and as a fallback when GSAP is absent.
 */
export function createRAFDriver(): RAFDriver {
  let handle = 0;
  let running = false;

  return {
    start(loop) {
      if (running || typeof requestAnimationFrame === 'undefined') return;
      running = true;
      const frame = (time: number) => {
        if (!running) return;
        loop(time);
        handle = requestAnimationFrame(frame);
      };
      handle = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      if (typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(handle);
    },
  };
}

/**
 * Driver backed by GSAP's global ticker.
 *
 * Using GSAP's ticker as the single loop guarantees that our per-frame
 * updates, Lenis' smoothing and every GSAP tween advance on the *same*
 * `requestAnimationFrame` — the "one RAF" guarantee of the engine.
 */
export function createGsapDriver(gsap: typeof import('gsap').gsap): RAFDriver {
  // GSAP delivers time in seconds; the ticker expects milliseconds.
  let wrapped: ((time: number) => void) | null = null;

  return {
    start(loop) {
      // Disable lag smoothing so our own clamp is the single source of truth.
      gsap.ticker.lagSmoothing(0);
      wrapped = (timeSeconds: number) => loop(timeSeconds * 1000);
      gsap.ticker.add(wrapped);
    },
    stop() {
      if (wrapped) {
        gsap.ticker.remove(wrapped);
        wrapped = null;
      }
    },
  };
}
