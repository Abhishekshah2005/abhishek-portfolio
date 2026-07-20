import Lenis from 'lenis';
import { Manager } from '../core/Manager';
import { TickPriority } from '@/types';
import type { ScrollOrientation } from '@/types';

/**
 * Smooth-scroll authority for the whole experience.
 *
 * Owns the single Lenis instance and advances it from the engine's shared
 * ticker (never its own RAF). Normalises Lenis' output into the engine's
 * scroll event and tracks velocity/direction so scroll-driven systems
 * (camera, timelines, parallax) can subscribe to one source of truth.
 *
 * Horizontal mode is a first-class config flag so a future horizontal
 * section can flip orientation without touching consumers.
 */
export class ScrollManager extends Manager {
  private lenis?: Lenis;
  private currentDirection: 1 | -1 | 0 = 0;
  private lastVelocity = 0;

  get instance(): Lenis | undefined {
    return this.lenis;
  }

  get orientation(): ScrollOrientation {
    return this.config.scroll.orientation;
  }

  override init(): void {
    if (!this.ctx.isBrowser) return;

    const cfg = this.config.scroll;
    this.lenis = new Lenis({
      lerp: cfg.lerp,
      duration: cfg.duration,
      smoothWheel: true,
      syncTouch: cfg.smoothTouch,
      wheelMultiplier: cfg.wheelMultiplier,
      touchMultiplier: cfg.touchMultiplier,
      orientation: cfg.orientation,
      gestureOrientation: 'vertical',
    });

    this.lenis.on('scroll', (e: Lenis) => {
      const velocity = e.velocity;
      const direction = e.direction;

      if (direction !== 0 && direction !== this.currentDirection) {
        this.currentDirection = direction;
        this.events.emit('scroll:direction', direction);
      }

      this.lastVelocity = velocity;
      this.events.emit('scroll', {
        scroll: e.scroll,
        progress: e.progress,
        velocity,
        direction,
        limit: e.limit,
      });
    });

    // Drive Lenis from the single ticker — this is the "one RAF" contract.
    this.track(
      this.ticker.add((state) => {
        this.lenis?.raf(state.timestamp);
      }, TickPriority.Scroll),
    );

    this.track(() => {
      this.lenis?.destroy();
      this.lenis = undefined;
    });
  }

  /** Programmatic scroll to a target (px, element or selector). */
  scrollTo(
    target: number | string | HTMLElement,
    options?: { offset?: number; duration?: number; immediate?: boolean },
  ): void {
    this.lenis?.scrollTo(target, options);
  }

  stop(): void {
    this.lenis?.stop();
    this.events.emit('scroll:stop', undefined);
  }

  start(): void {
    this.lenis?.start();
    this.events.emit('scroll:start', undefined);
  }

  get velocity(): number {
    return this.lastVelocity;
  }

  get progress(): number {
    return this.lenis?.progress ?? 0;
  }

  get isFastScrolling(): boolean {
    return Math.abs(this.lastVelocity) > this.config.scroll.fastVelocityThreshold;
  }
}
