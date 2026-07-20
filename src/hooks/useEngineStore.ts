'use client';

import { useStore } from 'zustand';
import { engineStore, type EngineState } from '@/state/engineStore';

/**
 * Subscribe to a slice of the engine's global state with a selector so a
 * component only re-renders when the selected value changes.
 *
 * @example
 * const progress = useEngineStore((s) => s.scrollProgress);
 */
export function useEngineStore<T>(selector: (state: EngineState) => T): T {
  return useStore(engineStore, selector);
}

/** Read the whole engine state object (re-renders on any change). */
export function useEngineState(): EngineState {
  return useStore(engineStore, (s) => s);
}
