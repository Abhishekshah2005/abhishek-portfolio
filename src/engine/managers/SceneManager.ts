import { Manager } from '../core/Manager';
import type { Cleanup } from '@/types';

export interface SceneDescriptor {
  id: string;
  /** Called when the scene becomes active. May be async (assets, intro). */
  onEnter?: () => void | Promise<void>;
  /** Called when the scene is deactivated. May be async (outro). */
  onLeave?: () => void | Promise<void>;
  /** Optional metadata for tooling / debug overlays. */
  meta?: Record<string, unknown>;
}

type SceneChangeListener = (next: string | null, previous: string | null) => void;

/**
 * A logical scene registry — not a Three.Scene.
 *
 * Portfolio "scenes" are experience states (intro, world, project focus…).
 * This manager owns which one is active and orchestrates async enter/leave
 * transitions, guaranteeing only one transition runs at a time. The actual
 * 3D/DOM content for each scene is mounted by React based on `current`.
 */
export class SceneManager extends Manager {
  private readonly scenes = new Map<string, SceneDescriptor>();
  private readonly listeners = new Set<SceneChangeListener>();
  private _current: string | null = null;
  private transitioning = false;

  register(scene: SceneDescriptor): Cleanup {
    this.scenes.set(scene.id, scene);
    return () => this.unregister(scene.id);
  }

  unregister(id: string): void {
    this.scenes.delete(id);
    if (this._current === id) this._current = null;
  }

  has(id: string): boolean {
    return this.scenes.has(id);
  }

  get current(): string | null {
    return this._current;
  }

  get isTransitioning(): boolean {
    return this.transitioning;
  }

  list(): string[] {
    return [...this.scenes.keys()];
  }

  /** Subscribe to active-scene changes. Returns an unsubscribe function. */
  onChange(listener: SceneChangeListener): Cleanup {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  /**
   * Activate a scene, running the previous scene's `onLeave` and the next
   * scene's `onEnter`. No-ops if the scene is already active or unknown.
   */
  async activate(id: string): Promise<void> {
    if (this.transitioning || id === this._current) return;
    const next = this.scenes.get(id);
    if (!next) {
      if (this.config.debug) console.warn(`[SceneManager] unknown scene "${id}"`);
      return;
    }

    this.transitioning = true;
    const previousId = this._current;
    const previous = previousId ? this.scenes.get(previousId) : undefined;

    try {
      await previous?.onLeave?.();
      this._current = id;
      this.emitChange(id, previousId);
      await next.onEnter?.();
    } finally {
      this.transitioning = false;
    }
  }

  private emitChange(next: string | null, previous: string | null): void {
    for (const listener of [...this.listeners]) listener(next, previous);
  }

  protected override onDispose(): void {
    this.scenes.clear();
    this.listeners.clear();
    this._current = null;
  }
}
