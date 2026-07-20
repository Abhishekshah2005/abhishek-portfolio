import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Manager } from '../core/Manager';

/**
 * Central authority over GSAP.
 *
 * - Registers plugins exactly once, in the browser only.
 * - Bridges the engine scroll bus to `ScrollTrigger.update` so triggers stay
 *   perfectly in sync with Lenis' smoothed position.
 * - Owns a global reduced-motion flag that every preset consults.
 * - Exposes `context()` for scoped, auto-cleaning animation batches.
 */
export class AnimationManager extends Manager {
  readonly gsap = gsap;
  readonly ScrollTrigger = ScrollTrigger;

  private _reducedMotion = false;

  get reducedMotion(): boolean {
    return this._reducedMotion;
  }

  override init(): void {
    if (!this.ctx.isBrowser) return;

    gsap.registerPlugin(ScrollTrigger);

    // Keep ScrollTrigger in lockstep with Lenis' smoothed scroll.
    this.track(
      this.events.on('scroll', () => {
        ScrollTrigger.update();
      }),
    );

    // Refresh trigger measurements after a resize settles.
    this.track(
      this.events.on('resize', () => {
        ScrollTrigger.refresh();
      }),
    );

    // Respect the user's motion preference.
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => {
      this._reducedMotion = query.matches;
      // Collapse durations globally when reduced motion is requested.
      gsap.globalTimeline.timeScale(query.matches ? 100 : 1);
    };
    apply();
    query.addEventListener('change', apply);
    this.track(() => query.removeEventListener('change', apply));

    this.track(() => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    });
  }

  /**
   * Create a scoped GSAP context. Everything created inside is reverted when
   * the returned cleanup runs — the primary tool for leak-free React effects.
   */
  context(fn: (self: gsap.Context) => void, scope?: Element | string): gsap.Context {
    return gsap.context(fn, scope);
  }

  /** Convenience passthroughs used by presets/hooks. */
  to: typeof gsap.to = (...args: Parameters<typeof gsap.to>) => gsap.to(...args);
  from: typeof gsap.from = (...args: Parameters<typeof gsap.from>) => gsap.from(...args);
  timeline: typeof gsap.timeline = (vars?) => gsap.timeline(vars);
}
