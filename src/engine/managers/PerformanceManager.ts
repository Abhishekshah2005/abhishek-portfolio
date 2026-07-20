import { Manager } from '../core/Manager';
import { TickPriority } from '@/types';
import type { DeviceType, QualityTier, TickState } from '@/types';

interface PerformanceMemory {
  usedJSHeapSize: number;
  jsHeapSizeLimit: number;
}

const TIER_ORDER: QualityTier[] = ['low', 'medium', 'high', 'ultra'];

/**
 * Adaptive quality governor.
 *
 * Picks an initial tier from device capabilities, then watches the smoothed
 * FPS from the ticker and downgrades (or cautiously upgrades) with hysteresis
 * so the experience self-tunes on weak hardware. Every 3D system reads the
 * current tier to scale particle counts, DPR, post-processing, etc.
 */
export class PerformanceManager extends Manager {
  private _tier: QualityTier = 'high';
  private _device: DeviceType = 'desktop';
  private _dpr = 1;

  private lowFrames = 0;
  private highFrames = 0;
  private fpsEmitAccumulator = 0;
  private memoryAccumulator = 0;
  private _memoryMB: number | null = null;
  private _dropped = 0;
  private droppedInWindow = 0;

  get tier(): QualityTier {
    return this._tier;
  }
  get device(): DeviceType {
    return this._device;
  }
  get dpr(): number {
    return this._dpr;
  }
  /** Used JS heap in MB (Chromium only; `null` elsewhere). */
  get memoryMB(): number | null {
    return this._memoryMB;
  }
  /** Cumulative dropped-frame count since boot. */
  get droppedFrames(): number {
    return this._dropped;
  }

  override init(): void {
    if (!this.ctx.isBrowser) return;

    this._device = this.detectDevice();
    this._dpr = Math.min(window.devicePixelRatio || 1, this.config.performance.maxPixelRatio);
    this._tier = this.detectInitialTier();

    this.track(this.ticker.add((s) => this.monitor(s), TickPriority.PostRender));
  }

  private detectDevice(): DeviceType {
    const width = window.innerWidth;
    const coarse = window.matchMedia('(pointer: coarse)').matches;
    if (width < 768 && coarse) return 'mobile';
    if (width < 1024 && coarse) return 'tablet';
    return 'desktop';
  }

  private detectInitialTier(): QualityTier {
    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 4;

    if (this._device === 'mobile') return cores >= 6 && memory >= 4 ? 'medium' : 'low';
    if (this._device === 'tablet') return cores >= 6 ? 'high' : 'medium';
    if (cores >= 8 && memory >= 8) return 'ultra';
    if (cores >= 4) return 'high';
    return 'medium';
  }

  private monitor(state: TickState): void {
    // A frame that took markedly longer than the budget is a dropped frame.
    if (state.frame > 90 && state.rawDelta > 1 / 30) {
      this._dropped += 1;
      this.droppedInWindow += 1;
    }

    // Sample heap memory (~1Hz, Chromium only) and emit.
    this.memoryAccumulator += state.delta;
    if (this.memoryAccumulator >= 1) {
      this.memoryAccumulator = 0;
      const mem = (performance as Performance & { memory?: PerformanceMemory }).memory;
      if (mem) {
        this._memoryMB = Math.round(mem.usedJSHeapSize / 1048576);
        this.events.emit('perf:memory', {
          usedMB: this._memoryMB,
          limitMB: Math.round(mem.jsHeapSizeLimit / 1048576),
        });
      }
    }

    // Give the FPS sampler time to stabilise after boot.
    if (state.frame < 90) return;

    const { lowFpsThreshold, highFpsThreshold, degradeAfterFrames, upgradeAfterFrames } =
      this.config.performance;

    if (state.fps < lowFpsThreshold) {
      this.lowFrames += 1;
      this.highFrames = 0;
      if (this.lowFrames >= degradeAfterFrames) {
        this.shiftTier(-1);
        this.lowFrames = 0;
      }
    } else if (state.fps > highFpsThreshold) {
      this.highFrames += 1;
      this.lowFrames = 0;
      if (this.highFrames >= upgradeAfterFrames) {
        this.shiftTier(1);
        this.highFrames = 0;
      }
    } else {
      this.lowFrames = 0;
      this.highFrames = 0;
    }

    // Emit FPS + dropped count at ~2Hz for HUDs without spamming the bus.
    this.fpsEmitAccumulator += state.delta;
    if (this.fpsEmitAccumulator >= 0.5) {
      this.fpsEmitAccumulator = 0;
      this.events.emit('perf:fps', { fps: Math.round(state.fps) });
      if (this.droppedInWindow > 0) {
        this.events.emit('perf:dropped', { dropped: this._dropped });
        this.droppedInWindow = 0;
      }
    }
  }

  private shiftTier(direction: 1 | -1): void {
    const index = TIER_ORDER.indexOf(this._tier);
    const nextIndex = Math.max(0, Math.min(TIER_ORDER.length - 1, index + direction));
    if (nextIndex === index) return;
    const previous = this._tier;
    this._tier = TIER_ORDER[nextIndex];
    this.events.emit('perf:tier', { tier: this._tier, previous });
  }

  /** Force a tier (e.g. from a user quality toggle). */
  setTier(tier: QualityTier): void {
    if (tier === this._tier) return;
    const previous = this._tier;
    this._tier = tier;
    this.events.emit('perf:tier', { tier, previous });
  }
}
