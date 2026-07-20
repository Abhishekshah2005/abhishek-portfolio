import type { Vec2, QualityTier, PointerType } from './common';
import type { TickState } from './ticker';

/**
 * The canonical map of engine-level events.
 *
 * Managers emit through the shared {@link EventEmitter} using these keys so
 * that cross-cutting systems can subscribe without importing each other —
 * this is the seam that keeps the module graph acyclic.
 */
export interface EngineEventMap {
  // Lifecycle
  'engine:ready': void;
  'engine:start': void;
  'engine:pause': void;
  'engine:resume': void;
  'engine:dispose': void;

  // Ticker
  'tick': TickState;
  'tick:slow': TickState;

  // Loading
  'load:start': void;
  'load:progress': { loaded: number; total: number; progress: number; url: string };
  'load:complete': void;
  'load:error': { url: string; error: unknown };

  // Scroll
  'scroll': ScrollEventPayload;
  'scroll:start': void;
  'scroll:stop': void;
  'scroll:direction': 1 | -1;

  // Resize
  'resize': { width: number; height: number; dpr: number };

  // Pointer / interaction
  'pointer:move': { position: Vec2; normalized: Vec2; type: PointerType };
  'pointer:down': { position: Vec2; type: PointerType };
  'pointer:up': { position: Vec2; type: PointerType };
  'interaction:hover': { id: string | null };
  'interaction:click': { id: string };

  // Performance
  'perf:tier': { tier: QualityTier; previous: QualityTier };
  'perf:fps': { fps: number };
  'perf:memory': { usedMB: number; limitMB: number };
  'perf:dropped': { dropped: number };

  // Audio
  'audio:mute': { muted: boolean };
  'audio:volume': { volume: number };

  // Visibility
  'visibility': { visible: boolean };
}

export interface ScrollEventPayload {
  /** Absolute scroll offset in pixels. */
  scroll: number;
  /** Normalised progress across the scrollable range (0-1). */
  progress: number;
  /** Instantaneous velocity in px/frame. */
  velocity: number;
  /** Direction of travel: 1 = forward, -1 = backward, 0 = idle. */
  direction: 1 | -1 | 0;
  /** Total scrollable limit in pixels. */
  limit: number;
}

export type EngineEventKey = keyof EngineEventMap;
