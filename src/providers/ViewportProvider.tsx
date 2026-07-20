'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { BREAKPOINTS, type Breakpoint } from '@/design/tokens';

export interface ViewportState {
  width: number;
  height: number;
  dpr: number;
  orientation: 'portrait' | 'landscape';
  breakpoint: Breakpoint | 'xs';
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isTouch: boolean;
}

const DEFAULT: ViewportState = {
  width: 0,
  height: 0,
  dpr: 1,
  orientation: 'landscape',
  breakpoint: 'lg',
  isMobile: false,
  isTablet: false,
  isDesktop: true,
  isTouch: false,
};

const ViewportContext = createContext<ViewportState>(DEFAULT);

function resolveBreakpoint(width: number): ViewportState['breakpoint'] {
  if (width >= BREAKPOINTS['2xl']) return '2xl';
  if (width >= BREAKPOINTS.xl) return 'xl';
  if (width >= BREAKPOINTS.lg) return 'lg';
  if (width >= BREAKPOINTS.md) return 'md';
  if (width >= BREAKPOINTS.sm) return 'sm';
  return 'xs';
}

/**
 * Single source of viewport truth: size, DPR, orientation, breakpoint and
 * device class. One debounced resize listener feeds the whole app (components
 * read via `useViewport`) instead of each attaching its own.
 */
export function ViewportProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<ViewportState>(DEFAULT);

  useEffect(() => {
    const touch = window.matchMedia('(pointer: coarse)').matches;

    const read = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const breakpoint = resolveBreakpoint(width);
      setState({
        width,
        height,
        dpr: window.devicePixelRatio || 1,
        orientation: height >= width ? 'portrait' : 'landscape',
        breakpoint,
        isMobile: breakpoint === 'xs' || breakpoint === 'sm',
        isTablet: breakpoint === 'md',
        isDesktop: breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl',
        isTouch: touch,
      });
    };

    let timer = 0;
    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(read, 150);
    };

    read();
    window.addEventListener('resize', onResize, { passive: true });
    window.addEventListener('orientationchange', read);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', read);
    };
  }, []);

  return <ViewportContext.Provider value={state}>{children}</ViewportContext.Provider>;
}

export function useViewport(): ViewportState {
  return useContext(ViewportContext);
}

export function useBreakpoint(): ViewportState['breakpoint'] {
  return useViewport().breakpoint;
}

/** True when the viewport is at or above the given breakpoint. */
export function useBreakpointUp(bp: Breakpoint): boolean {
  const { width } = useViewport();
  return useMemo(() => width >= BREAKPOINTS[bp], [width, bp]);
}
