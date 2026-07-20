'use client';

import { useEffect, useRef } from 'react';
import { useEngine } from './useEngine';
import type { EngineEventMap, EngineEventKey } from '@/types';

/**
 * Subscribe to an engine event for the lifetime of the component. The handler
 * is stored in a ref so callers can pass inline functions without re-binding
 * the listener every render.
 */
export function useEngineEvent<K extends EngineEventKey>(
  event: K,
  handler: (payload: EngineEventMap[K]) => void,
): void {
  const engine = useEngine();
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    const off = engine.events.on(event, (payload) => handlerRef.current(payload));
    return off;
  }, [engine, event]);
}
