import { createStore } from 'zustand/vanilla';
import type { QualityTier, DeviceType } from '@/types';
import type { CursorVariant } from '@/engine/managers/CursorManager';

export type ThemeMode = 'dark' | 'light';

/**
 * The engine's global reactive state.
 *
 * A framework-agnostic Zustand vanilla store so both the engine (writer) and
 * React (reader, via `useEngineStore`) share one source of truth without the
 * engine ever importing React.
 */
export interface EngineState {
  // Lifecycle
  booted: boolean;
  ready: boolean;
  /** True once the cinematic boot sequence has fully dissolved. */
  bootComplete: boolean;

  // Loading
  loading: boolean;
  progress: number;

  // Scene
  currentScene: string | null;

  // Scroll
  scrollProgress: number;
  scrollVelocity: number;
  scrollDirection: 1 | -1 | 0;

  // Performance
  tier: QualityTier;
  device: DeviceType;
  fps: number;
  memoryMB: number | null;
  droppedFrames: number;

  // Cursor
  cursorVariant: CursorVariant;

  // Audio
  audioMuted: boolean;

  // Theme
  theme: ThemeMode;

  // Accessibility
  reducedMotion: boolean;
}

export const initialEngineState: EngineState = {
  booted: false,
  ready: false,
  bootComplete: false,
  loading: false,
  progress: 0,
  currentScene: null,
  scrollProgress: 0,
  scrollVelocity: 0,
  scrollDirection: 0,
  tier: 'high',
  device: 'desktop',
  fps: 60,
  memoryMB: null,
  droppedFrames: 0,
  cursorVariant: 'default',
  audioMuted: true,
  theme: 'dark',
  reducedMotion: false,
};

export const engineStore = createStore<EngineState>()(() => ({ ...initialEngineState }));

export type EngineStore = typeof engineStore;
