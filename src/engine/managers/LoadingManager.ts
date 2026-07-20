import { LoadingManager as ThreeLoadingManager } from 'three';
import { Manager } from '../core/Manager';

/**
 * Tracks the progress of every asset flowing through the engine.
 *
 * Wraps a `THREE.LoadingManager` (so it plugs straight into every Three
 * loader) and re-broadcasts progress on the engine event bus. Also exposes a
 * promise that resolves when the current batch has finished — perfect for a
 * preloader gate.
 */
export class LoadingManager extends Manager {
  readonly three = new ThreeLoadingManager();

  private loaded = 0;
  private total = 0;
  private settle?: () => void;
  private ready: Promise<void> = Promise.resolve();
  private active = false;

  override init(): void {
    this.three.onStart = (url, itemsLoaded, itemsTotal) => {
      if (!this.active) {
        this.active = true;
        this.ready = new Promise((resolve) => (this.settle = resolve));
        this.events.emit('load:start', undefined);
      }
      this.loaded = itemsLoaded;
      this.total = itemsTotal;
      this.emitProgress(url);
    };

    this.three.onProgress = (url, itemsLoaded, itemsTotal) => {
      this.loaded = itemsLoaded;
      this.total = itemsTotal;
      this.emitProgress(url);
    };

    this.three.onLoad = () => {
      this.active = false;
      this.events.emit('load:complete', undefined);
      this.settle?.();
      this.settle = undefined;
    };

    this.three.onError = (url) => {
      this.events.emit('load:error', { url, error: new Error(`Failed to load ${url}`) });
    };
  }

  private emitProgress(url: string): void {
    const progress = this.total > 0 ? this.loaded / this.total : 0;
    this.events.emit('load:progress', {
      loaded: this.loaded,
      total: this.total,
      progress,
      url,
    });
  }

  /** Resolves when the in-flight batch of assets has fully loaded. */
  whenReady(): Promise<void> {
    return this.ready;
  }

  get progress(): number {
    return this.total > 0 ? this.loaded / this.total : this.active ? 0 : 1;
  }

  get isLoading(): boolean {
    return this.active;
  }

  protected override onDispose(): void {
    const noop = () => {};
    this.three.onStart = noop;
    this.three.onProgress = noop;
    this.three.onLoad = noop;
    this.three.onError = noop;
  }
}
