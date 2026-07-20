import { Manager, type EngineContext } from '../core/Manager';
import type { Cleanup } from '@/types';
import type { AnimationManager } from './AnimationManager';

export interface ScrubTimelineOptions {
  trigger: Element | string;
  start?: string;
  end?: string;
  /** `true` for smooth catch-up scrubbing, or a number of seconds. */
  scrub?: boolean | number;
  pin?: boolean | Element | string;
  markers?: boolean;
}

/**
 * A registry and factory for GSAP timelines.
 *
 * Named timelines can be created, retrieved, played and composed — this is
 * the composition seam future phases use to assemble section and camera
 * choreography. Scroll-scrubbed timelines are first-class so section reveals
 * bind directly to scroll position via ScrollTrigger.
 */
export class TimelineManager extends Manager {
  private readonly timelines = new Map<string, gsap.core.Timeline>();

  constructor(
    ctx: EngineContext,
    private readonly animation: AnimationManager,
  ) {
    super(ctx);
  }

  /** Create (or replace) a named timeline. */
  create(name: string, vars?: gsap.TimelineVars): gsap.core.Timeline {
    this.timelines.get(name)?.kill();
    const tl = this.animation.gsap.timeline({ paused: true, ...vars });
    this.timelines.set(name, tl);
    return tl;
  }

  /**
   * Create a scroll-scrubbed timeline bound to a trigger element. Returns the
   * timeline plus a cleanup that kills it and its ScrollTrigger.
   */
  createScrub(
    name: string,
    options: ScrubTimelineOptions,
  ): { timeline: gsap.core.Timeline; cleanup: Cleanup } {
    this.timelines.get(name)?.kill();
    const timeline = this.animation.gsap.timeline({
      scrollTrigger: {
        trigger: options.trigger,
        start: options.start ?? 'top top',
        end: options.end ?? 'bottom bottom',
        scrub: options.scrub ?? true,
        pin: options.pin ?? false,
        markers: options.markers ?? false,
      },
    });
    this.timelines.set(name, timeline);

    const cleanup = () => {
      timeline.scrollTrigger?.kill();
      timeline.kill();
      this.timelines.delete(name);
    };
    return { timeline, cleanup };
  }

  get(name: string): gsap.core.Timeline | undefined {
    return this.timelines.get(name);
  }

  has(name: string): boolean {
    return this.timelines.has(name);
  }

  play(name: string): void {
    this.timelines.get(name)?.play();
  }

  reverse(name: string): void {
    this.timelines.get(name)?.reverse();
  }

  seek(name: string, position: number | string): void {
    this.timelines.get(name)?.seek(position);
  }

  kill(name: string): void {
    const tl = this.timelines.get(name);
    if (!tl) return;
    tl.scrollTrigger?.kill();
    tl.kill();
    this.timelines.delete(name);
  }

  protected override onDispose(): void {
    for (const tl of this.timelines.values()) {
      tl.scrollTrigger?.kill();
      tl.kill();
    }
    this.timelines.clear();
  }
}
