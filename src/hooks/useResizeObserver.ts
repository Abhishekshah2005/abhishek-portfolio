'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

export interface Size {
  width: number;
  height: number;
}

/**
 * Observe an element's content-box size. Returns a ref to attach and the live
 * size. One `ResizeObserver` per consumer, cleaned up on unmount.
 */
export function useResizeObserver<T extends HTMLElement = HTMLDivElement>(): {
  ref: RefObject<T | null>;
  size: Size;
} {
  const ref = useRef<T | null>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const box = entries[0]?.contentRect;
      if (box) setSize({ width: box.width, height: box.height });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, size };
}
