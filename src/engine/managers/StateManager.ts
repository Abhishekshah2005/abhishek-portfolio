import { Manager } from '../core/Manager';
import { engineStore, initialEngineState, type EngineState } from '@/state/engineStore';

/**
 * The bridge between the engine's event bus and the reactive Zustand store.
 *
 * Managers stay dumb about React; this manager listens to the event bus and
 * projects the relevant signals into the store that the UI subscribes to.
 * It also throttles high-frequency signals (scroll) so React never thrashes.
 */
export class StateManager extends Manager {
  readonly store = engineStore;

  override init(): void {
    this.set({ booted: true });

    this.track(
      this.events.on('load:start', () => this.set({ loading: true, progress: 0 })),
    );
    this.track(
      this.events.on('load:progress', ({ progress }) => this.set({ progress })),
    );
    this.track(
      this.events.on('load:complete', () => this.set({ loading: false, progress: 1 })),
    );

    this.track(
      this.events.on('scroll', (payload) => {
        // Push scroll progress every frame (cheap number), but it is a
        // shallow set so subscribers using selectors stay efficient.
        this.set({
          scrollProgress: payload.progress,
          scrollVelocity: payload.velocity,
          scrollDirection: payload.direction,
        });
      }),
    );

    this.track(this.events.on('perf:tier', ({ tier }) => this.set({ tier })));
    this.track(this.events.on('perf:fps', ({ fps }) => this.set({ fps })));
    this.track(this.events.on('perf:memory', ({ usedMB }) => this.set({ memoryMB: usedMB })));
    this.track(this.events.on('perf:dropped', ({ dropped }) => this.set({ droppedFrames: dropped })));
    this.track(this.events.on('audio:mute', ({ muted }) => this.set({ audioMuted: muted })));
    this.track(this.events.on('engine:ready', () => this.set({ ready: true })));
  }

  /** Typed, shallow store update. */
  set(partial: Partial<EngineState>): void {
    this.store.setState(partial);
  }

  get(): EngineState {
    return this.store.getState();
  }

  setCursorVariant(variant: EngineState['cursorVariant']): void {
    this.set({ cursorVariant: variant });
  }

  setCurrentScene(scene: string | null): void {
    this.set({ currentScene: scene });
  }

  setReducedMotion(reducedMotion: boolean): void {
    this.set({ reducedMotion });
  }

  setDevice(device: EngineState['device']): void {
    this.set({ device });
  }

  protected override onDispose(): void {
    this.store.setState({ ...initialEngineState }, true);
  }
}
