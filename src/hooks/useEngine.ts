'use client';

import { useContext } from 'react';
import { EngineContext } from '@/providers/EngineProvider';
import type { Engine } from '@/engine';

/**
 * Access the live engine. Throws if called outside an `<EngineProvider>` or
 * before the engine has booted — descendants of a non-eager provider are only
 * mounted once the engine exists, so this is safe there.
 */
export function useEngine(): Engine {
  const engine = useContext(EngineContext);
  if (!engine) {
    throw new Error('useEngine must be used within a booted <EngineProvider>.');
  }
  return engine;
}

/** Non-throwing variant for components that may render before boot. */
export function useEngineOptional(): Engine | null {
  return useContext(EngineContext);
}
