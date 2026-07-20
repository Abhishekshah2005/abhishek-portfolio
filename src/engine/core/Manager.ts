import type { EngineEventMap } from '@/types';
import type { Cleanup, IDisposable } from '@/types';
import type { EventEmitter } from './EventEmitter';
import type { Ticker } from './Ticker';
import type { EngineConfig } from '@/config';

/**
 * The services every manager is handed at construction. Passing a context
 * (rather than the concrete Engine) keeps managers decoupled from each other
 * and from the orchestrator — the dependency graph stays a tree.
 */
export interface EngineContext {
  readonly events: EventEmitter<EngineEventMap>;
  readonly ticker: Ticker;
  readonly config: EngineConfig;
  /** True once the engine is running in the browser. */
  readonly isBrowser: boolean;
}

/**
 * Base class for all engine managers.
 *
 * Handles cleanup bookkeeping so subclasses simply register teardown logic
 * via `track()` and never leak listeners, RAF subscriptions or observers.
 */
export abstract class Manager implements IDisposable {
  protected readonly ctx: EngineContext;
  private readonly cleanups: Cleanup[] = [];
  private disposed = false;

  constructor(ctx: EngineContext) {
    this.ctx = ctx;
  }

  /** Convenience accessors. */
  protected get events() {
    return this.ctx.events;
  }
  protected get ticker() {
    return this.ctx.ticker;
  }
  protected get config() {
    return this.ctx.config;
  }

  /**
   * Called once during engine boot. Override for async setup (asset
   * registration, listener binding, etc.). The default is a no-op.
   */
  init(): void | Promise<void> {}

  /** Register a teardown callback to be run on `dispose`. */
  protected track(cleanup: Cleanup): Cleanup {
    this.cleanups.push(cleanup);
    return cleanup;
  }

  get isDisposed(): boolean {
    return this.disposed;
  }

  dispose(): void {
    if (this.disposed) return;
    this.disposed = true;
    // Run cleanups in reverse (LIFO) so dependencies unwind correctly.
    for (let i = this.cleanups.length - 1; i >= 0; i--) {
      this.cleanups[i]();
    }
    this.cleanups.length = 0;
    this.onDispose();
  }

  /** Hook for subclass-specific teardown beyond tracked cleanups. */
  protected onDispose(): void {}
}
