import { gsap } from 'gsap';
import { ENGINE_CONFIG } from '@/config';
import { EASING } from '../core/easings';

export interface RevealOptions {
  duration?: number;
  ease?: string;
  stagger?: number;
  delay?: number;
  /** Distance travelled for translate-based reveals (px). */
  distance?: number;
  /** Collapse to an instant state for reduced-motion users. */
  reducedMotion?: boolean;
}

const defaults = (o: RevealOptions = {}) => ({
  duration: o.reducedMotion ? 0 : (o.duration ?? ENGINE_CONFIG.animation.duration),
  ease: o.ease ?? EASING.smooth,
  stagger: o.reducedMotion ? 0 : (o.stagger ?? ENGINE_CONFIG.animation.stagger),
  delay: o.delay ?? 0,
  distance: o.distance ?? 40,
});

/** Simple opacity fade-in. */
export function fadeIn(target: gsap.TweenTarget, options?: RevealOptions): gsap.core.Tween {
  const o = defaults(options);
  return gsap.fromTo(
    target,
    { autoAlpha: 0 },
    { autoAlpha: 1, duration: o.duration, ease: o.ease, delay: o.delay },
  );
}

/** Translate-up + fade reveal — the workhorse entrance. */
export function revealUp(target: gsap.TweenTarget, options?: RevealOptions): gsap.core.Tween {
  const o = defaults(options);
  return gsap.fromTo(
    target,
    { autoAlpha: 0, y: o.distance },
    {
      autoAlpha: 1,
      y: 0,
      duration: o.duration,
      ease: o.ease,
      delay: o.delay,
      stagger: o.stagger,
    },
  );
}

/** Per-character / per-word staggered text reveal. */
export function textReveal(
  parts: gsap.TweenTarget,
  options?: RevealOptions,
): gsap.core.Tween {
  const o = defaults(options);
  return gsap.fromTo(
    parts,
    { yPercent: 120, autoAlpha: 0 },
    {
      yPercent: 0,
      autoAlpha: 1,
      duration: o.duration,
      ease: o.ease,
      delay: o.delay,
      stagger: o.stagger,
    },
  );
}

/** Clip-path image reveal — the image scales down inside an unmasking frame. */
export function imageReveal(
  wrapper: HTMLElement,
  image: HTMLElement,
  options?: RevealOptions,
): gsap.core.Timeline {
  const o = defaults(options);
  const tl = gsap.timeline({ delay: o.delay });
  tl.fromTo(
    wrapper,
    { clipPath: 'inset(100% 0% 0% 0%)' },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: o.duration, ease: o.ease },
  ).fromTo(
    image,
    { scale: 1.4 },
    { scale: 1, duration: o.duration * 1.1, ease: o.ease },
    0,
  );
  return tl;
}

/** Directional mask wipe using clip-path inset. */
export function maskReveal(
  target: gsap.TweenTarget,
  direction: 'up' | 'down' | 'left' | 'right' = 'up',
  options?: RevealOptions,
): gsap.core.Tween {
  const o = defaults(options);
  const from: Record<typeof direction, string> = {
    up: 'inset(100% 0% 0% 0%)',
    down: 'inset(0% 0% 100% 0%)',
    left: 'inset(0% 100% 0% 0%)',
    right: 'inset(0% 0% 0% 100%)',
  };
  return gsap.fromTo(
    target,
    { clipPath: from[direction] },
    { clipPath: 'inset(0% 0% 0% 0%)', duration: o.duration, ease: o.ease, delay: o.delay },
  );
}

/** 3D card reveal — rise, fade and settle from a slight tilt. */
export function cardReveal(target: gsap.TweenTarget, options?: RevealOptions): gsap.core.Tween {
  const o = defaults(options);
  return gsap.fromTo(
    target,
    { autoAlpha: 0, y: o.distance, rotateX: -12, transformPerspective: 800 },
    {
      autoAlpha: 1,
      y: 0,
      rotateX: 0,
      duration: o.duration,
      ease: o.ease,
      delay: o.delay,
      stagger: o.stagger,
    },
  );
}

/** Generic staggered entrance for any set of targets. */
export function staggerReveal(
  targets: gsap.TweenTarget,
  vars: gsap.TweenVars,
  options?: RevealOptions,
): gsap.core.Tween {
  const o = defaults(options);
  return gsap.from(targets, {
    duration: o.duration,
    ease: o.ease,
    stagger: o.stagger,
    delay: o.delay,
    ...vars,
  });
}
