import { useEffect, useLayoutEffect } from 'react';

/**
 * `useLayoutEffect` on the client, `useEffect` on the server — avoids React's
 * SSR warning while keeping synchronous, pre-paint scheduling in the browser
 * (important for animation setup that must run before the first frame).
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;
