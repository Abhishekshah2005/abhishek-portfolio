import { gsap } from 'gsap';
import { ENGINE_CONFIG, type EngineConfig } from '@/config';
import type { EngineEventMap, Cleanup } from '@/types';
import { EventEmitter, Ticker, createGsapDriver, type EngineContext } from './core';
import {
  LoadingManager,
  AssetManager,
  ScrollManager,
  AnimationManager,
  CameraManager,
  SceneManager,
  InteractionManager,
  CursorManager,
  AudioManager,
  PerformanceManager,
  TimelineManager,
  StateManager,
} from './managers';
import type { Manager } from './core';

export interface EngineOptions {
  debug?: boolean;
}

/**
 * The orchestrator.
 *
 * Owns the shared event bus and ticker, constructs every manager with its
 * dependencies, boots them in order and tears them all down cleanly. This is
 * the single object the React layer instantiates once and threads through
 * context — nothing else in the app calls `new` on a manager.
 */
export class Engine {
  readonly events = new EventEmitter<EngineEventMap>();
  readonly ticker: Ticker;
  readonly config: EngineConfig;
  private readonly context: EngineContext;

  readonly loading: LoadingManager;
  readonly assets: AssetManager;
  readonly scroll: ScrollManager;
  readonly animation: AnimationManager;
  readonly camera: CameraManager;
  readonly scenes: SceneManager;
  readonly interaction: InteractionManager;
  readonly cursor: CursorManager;
  readonly audio: AudioManager;
  readonly performance: PerformanceManager;
  readonly timeline: TimelineManager;
  readonly state: StateManager;

  private readonly managers: Manager[];
  private readonly cleanups: Cleanup[] = [];
  private booted = false;
  private disposed = false;

  constructor(options: EngineOptions = {}) {
    this.config = { ...ENGINE_CONFIG, debug: options.debug ?? ENGINE_CONFIG.debug };
    const isBrowser = typeof window !== 'undefined';

    // In the browser, GSAP's ticker is the single loop that drives everything.
    this.ticker = new Ticker(isBrowser ? createGsapDriver(gsap) : undefined);

    this.context = {
      events: this.events,
      ticker: this.ticker,
      config: this.config,
      isBrowser,
    };

    // Construct managers (dependencies injected explicitly — an acyclic tree).
    this.loading = new LoadingManager(this.context);
    this.assets = new AssetManager(this.context, this.loading);
    this.animation = new AnimationManager(this.context);
    this.scroll = new ScrollManager(this.context);
    this.camera = new CameraManager(this.context);
    this.scenes = new SceneManager(this.context);
    this.interaction = new InteractionManager(this.context);
    this.cursor = new CursorManager(this.context, this.interaction);
    this.audio = new AudioManager(this.context);
    this.performance = new PerformanceManager(this.context);
    this.timeline = new TimelineManager(this.context, this.animation);
    this.state = new StateManager(this.context);

    // Boot order: state first (captures events), then the rest.
    this.managers = [
      this.state,
      this.loading,
      this.performance,
      this.animation,
      this.assets,
      this.scroll,
      this.camera,
      this.scenes,
      this.interaction,
      this.cursor,
      this.audio,
      this.timeline,
    ];
  }

  /** Boot the engine. Idempotent; safe to call once per lifecycle. */
  async boot(): Promise<void> {
    if (this.booted || this.disposed) return;
    this.booted = true;

    for (const manager of this.managers) {
      await manager.init();
    }

    if (this.context.isBrowser) {
      this.bindViewport();
      this.ticker.start();
    }

    // Seed the store with initial device/perf/motion values.
    this.state.setDevice(this.performance.device);
    this.state.set({ tier: this.performance.tier });
    this.state.setReducedMotion(this.animation.reducedMotion);

    this.events.emit('engine:ready', undefined);
  }

  private bindViewport(): void {
    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => {
        this.events.emit('resize', {
          width: window.innerWidth,
          height: window.innerHeight,
          dpr: Math.min(window.devicePixelRatio || 1, this.config.performance.maxPixelRatio),
        });
      }, 150);
    };

    const onVisibility = () => {
      this.events.emit('visibility', { visible: !document.hidden });
    };

    window.addEventListener('resize', onResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    this.cleanups.push(() => window.removeEventListener('resize', onResize));
    this.cleanups.push(() => document.removeEventListener('visibilitychange', onVisibility));
    this.cleanups.push(() => window.clearTimeout(resizeTimer));
  }

  pause(): void {
    this.ticker.stop();
    this.events.emit('engine:pause', undefined);
  }

  resume(): void {
    this.ticker.start();
    this.events.emit('engine:resume', undefined);
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    this.events.emit('engine:dispose', undefined);

    for (const cleanup of this.cleanups) cleanup();
    this.cleanups.length = 0;

    // Dispose managers in reverse boot order.
    for (let i = this.managers.length - 1; i >= 0; i--) {
      this.managers[i].dispose();
    }

    this.ticker.dispose();
    this.events.clear();
  }
}
