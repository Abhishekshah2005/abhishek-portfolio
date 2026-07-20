'use client';

import { createContext, useEffect, useState, type ReactNode } from 'react';
import { Engine } from '@/engine';

export const EngineContext = createContext<Engine | null>(null);

export interface EngineProviderProps {
  children: ReactNode;
  debug?: boolean;
  /**
   * Render children before the engine has booted. Defaults to `false` so
   * descendants can safely assume a live engine via `useEngine()`. The server
   * and first client render both produce `null`, so there is no hydration
   * mismatch.
   */
  eager?: boolean;
}

/**
 * Instantiates the single {@link Engine} for the app and manages its
 * lifecycle.
 *
 * The engine is created *inside* the mount effect so React StrictMode's
 * mount → unmount → mount cycle yields a fresh, fully-booted engine each time
 * and disposes the previous one — no disposed instance is ever reused and no
 * listeners leak.
 */
export function EngineProvider({ children, debug, eager = false }: EngineProviderProps) {
  const [engine, setEngine] = useState<Engine | null>(null);

  useEffect(() => {
    const instance = new Engine({ debug });
    setEngine(instance);
    void instance.boot();

    return () => {
      instance.dispose();
      setEngine(null);
    };
  }, [debug]);

  return (
    <EngineContext.Provider value={engine}>
      {engine || eager ? children : null}
    </EngineContext.Provider>
  );
}
