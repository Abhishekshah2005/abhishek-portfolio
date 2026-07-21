'use client';

import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

interface TraverseApi {
  /** Index of the chapter currently at centre stage. */
  active: number;
  setActive: (i: number) => void;
}

const TraverseCtx = createContext<TraverseApi | null>(null);

/**
 * Shares the active chapter index between the traverse engine and the HUD.
 * Only the integer index lives here (it changes rarely), so the HUD morphs on
 * chapter change without re-rendering every scroll frame.
 */
export function TraverseProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(0);
  const api = useMemo<TraverseApi>(() => ({ active, setActive }), [active]);
  return <TraverseCtx.Provider value={api}>{children}</TraverseCtx.Provider>;
}

export function useTraverse(): TraverseApi {
  const ctx = useContext(TraverseCtx);
  if (!ctx) throw new Error('useTraverse must be used within TraverseProvider');
  return ctx;
}
