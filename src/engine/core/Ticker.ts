import { ENGINE_CONFIG } from '@/config';
import type { Cleanup, RAFDriver, TickCallback, TickState } from '@/types';
import { TickPriority } from '@/types';
import { createRAFDriver } from './drivers';

interface Subscriber {
  id: number;
  priority: number;
  callback: TickCallback;
}

/**
 * The single, centralised animation clock for the entire engine.
 *
 * - One driver (RAF or GSAP) advances the whole app — no duplicate loops.
 * - Subscribers run in ascending priority order every frame.
 * - Delta is clamped so a backgrounded tab never causes a physics explosion.
 * - FPS is smoothed across a rolling window for stable perf decisions.
 */
export class Ticker {
  private driver: RAFDriver;
  private subscribers: Subscriber[] = [];
  private nextId = 0;

  private running = false;
  private startTime = 0;
  private lastTime = 0;
  private readonly fpsSamples: number[] = [];

  private readonly state: TickState = {
    elapsed: 0,
    delta: 0,
    rawDelta: 0,
    fps: 60,
    frame: 0,
    timestamp: 0,
  };

  constructor(driver: RAFDriver = createRAFDriver()) {
    this.driver = driver;
    this.loop = this.loop.bind(this);
  }

  /** Swap the loop source (e.g. from RAF to GSAP) — safe while stopped. */
  setDriver(driver: RAFDriver): void {
    const wasRunning = this.running;
    if (wasRunning) this.stop();
    this.driver = driver;
    if (wasRunning) this.start();
  }

  /** Add a per-frame callback. Returns an unsubscribe function. */
  add(callback: TickCallback, priority: number = TickPriority.Animation): Cleanup {
    const subscriber: Subscriber = { id: this.nextId++, priority, callback };
    this.subscribers.push(subscriber);
    // Keep subscribers sorted so the loop never sorts on the hot path.
    this.subscribers.sort((a, b) => a.priority - b.priority);
    return () => this.remove(subscriber.id);
  }

  private remove(id: number): void {
    const index = this.subscribers.findIndex((s) => s.id === id);
    if (index !== -1) this.subscribers.splice(index, 1);
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.startTime = 0;
    this.lastTime = 0;
    this.driver.start(this.loop);
  }

  stop(): void {
    if (!this.running) return;
    this.running = false;
    this.driver.stop();
  }

  /** Read-only snapshot of the current frame state. */
  get snapshot(): Readonly<TickState> {
    return this.state;
  }

  private loop(timeMs: number): void {
    if (this.startTime === 0) {
      this.startTime = timeMs;
      this.lastTime = timeMs;
    }

    const rawDelta = (timeMs - this.lastTime) / 1000;
    const delta = Math.min(rawDelta, ENGINE_CONFIG.ticker.maxDelta);
    this.lastTime = timeMs;

    this.state.timestamp = timeMs;
    this.state.elapsed = (timeMs - this.startTime) / 1000;
    this.state.rawDelta = rawDelta;
    this.state.delta = delta;
    this.state.frame += 1;
    this.state.fps = this.sampleFps(rawDelta);

    for (const subscriber of this.subscribers) {
      subscriber.callback(this.state);
    }
  }

  private sampleFps(rawDelta: number): number {
    if (rawDelta <= 0) return this.state.fps;
    const instant = 1 / rawDelta;
    this.fpsSamples.push(instant);
    if (this.fpsSamples.length > ENGINE_CONFIG.ticker.fpsSampleSize) {
      this.fpsSamples.shift();
    }
    const sum = this.fpsSamples.reduce((acc, v) => acc + v, 0);
    return sum / this.fpsSamples.length;
  }

  dispose(): void {
    this.stop();
    this.subscribers = [];
    this.fpsSamples.length = 0;
  }
}
