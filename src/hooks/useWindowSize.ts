'use client';

import { useEffect, useState } from 'react';

export interface WindowSize {
  width: number;
  height: number;
  dpr: number;
}

/** SSR-safe window size that updates (debounced) on resize. */
export function useWindowSize(): WindowSize {
  const [size, setSize] = useState<WindowSize>({ width: 0, height: 0, dpr: 1 });

  useEffect(() => {
    let timer = 0;
    const read = () =>
      setSize({
        width: window.innerWidth,
        height: window.innerHeight,
        dpr: window.devicePixelRatio || 1,
      });

    const onResize = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(read, 150);
    };

    read();
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return size;
}
