'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';

export interface Chapter {
  index: number;
  label: string;
}

interface StoryValue {
  active: Chapter;
  setActive: (chapter: Chapter) => void;
}

const StoryContext = createContext<StoryValue | null>(null);

/**
 * The Scroll Storytelling director's context. Tracks the currently-active
 * chapter (scene) so navigation/indicators can react to story progress, while
 * scene components own their own scrubbed timelines. One provider wraps the film.
 */
export function StoryProvider({ children }: { children: ReactNode }) {
  const [active, setActiveState] = useState<Chapter>({ index: 0, label: 'Arrival' });
  const setActive = useCallback((chapter: Chapter) => {
    setActiveState((prev) => (prev.index === chapter.index ? prev : chapter));
  }, []);
  const value = useMemo<StoryValue>(() => ({ active, setActive }), [active, setActive]);
  return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>;
}

export function useStory(): StoryValue {
  const ctx = useContext(StoryContext);
  if (!ctx) throw new Error('useStory must be used within <StoryProvider>.');
  return ctx;
}
