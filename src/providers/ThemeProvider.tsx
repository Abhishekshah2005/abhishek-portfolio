'use client';

import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react';
import { engineStore, type ThemeMode } from '@/state/engineStore';

const STORAGE_KEY = 'atlas.theme.v1';

interface ThemeContextValue {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  toggle: () => void;
  /** Light mode is architected but not enabled yet. */
  readonly canToggle: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  setTheme: () => {},
  toggle: () => {},
  canToggle: false,
});

/**
 * Global theme authority. Dark-only today, but fully light-ready: it stamps
 * `data-theme` on `<html>` (so token overrides can key off it), persists the
 * choice, and mirrors it into the engine store. Flip `ENABLE_LIGHT` when the
 * light token set lands.
 */
const ENABLE_LIGHT = false;

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
}: {
  children: ReactNode;
  defaultTheme?: ThemeMode;
}) {
  const [theme, setThemeState] = useState<ThemeMode>(defaultTheme);

  const setTheme = useCallback((next: ThemeMode) => {
    const resolved: ThemeMode = ENABLE_LIGHT ? next : 'dark';
    setThemeState(resolved);
    document.documentElement.dataset.theme = resolved;
    engineStore.setState({ theme: resolved });
    try {
      localStorage.setItem(STORAGE_KEY, resolved);
    } catch {
      /* storage unavailable — non-fatal */
    }
  }, []);

  useEffect(() => {
    let initial: ThemeMode = defaultTheme;
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (stored) initial = stored;
    } catch {
      /* ignore */
    }
    setTheme(initial);
  }, [defaultTheme, setTheme]);

  const toggle = useCallback(() => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  }, [theme, setTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggle, canToggle: ENABLE_LIGHT }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  return useContext(ThemeContext);
}
