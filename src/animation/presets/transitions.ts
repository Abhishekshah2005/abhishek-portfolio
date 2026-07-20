import { gsap } from 'gsap';
import { EASING } from '../core/easings';

export interface TransitionOptions {
  duration?: number;
  ease?: string;
  reducedMotion?: boolean;
}

const dur = (o?: TransitionOptions, fallback = 0.8) =>
  o?.reducedMotion ? 0 : (o?.duration ?? fallback);

/** Fade + rise the incoming page/route into view. */
export function pageEnter(root: gsap.TweenTarget, options?: TransitionOptions): gsap.core.Tween {
  return gsap.fromTo(
    root,
    { autoAlpha: 0, y: 24 },
    { autoAlpha: 1, y: 0, duration: dur(options), ease: options?.ease ?? EASING.smooth },
  );
}

/** Fade + drop the outgoing page/route away. */
export function pageLeave(root: gsap.TweenTarget, options?: TransitionOptions): gsap.core.Tween {
  return gsap.to(root, {
    autoAlpha: 0,
    y: -24,
    duration: dur(options, 0.5),
    ease: options?.ease ?? EASING.smoothInOut,
  });
}

/** Full-bleed overlay wipe used to cover route swaps. */
export function overlayWipe(
  overlay: gsap.TweenTarget,
  phase: 'in' | 'out',
  options?: TransitionOptions,
): gsap.core.Tween {
  if (phase === 'in') {
    return gsap.fromTo(
      overlay,
      { scaleY: 0, transformOrigin: 'bottom' },
      { scaleY: 1, duration: dur(options, 0.6), ease: EASING.snap },
    );
  }
  return gsap.fromTo(
    overlay,
    { scaleY: 1, transformOrigin: 'top' },
    { scaleY: 0, duration: dur(options, 0.6), ease: EASING.snap },
  );
}

/** Section enters as its scroll trigger fires. */
export function sectionEnter(
  target: gsap.TweenTarget,
  options?: TransitionOptions,
): gsap.core.Tween {
  return gsap.fromTo(
    target,
    { autoAlpha: 0, y: 60 },
    { autoAlpha: 1, y: 0, duration: dur(options, 1), ease: options?.ease ?? EASING.smooth },
  );
}
