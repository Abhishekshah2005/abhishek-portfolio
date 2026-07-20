'use client';

import { useEffect, useState } from 'react';

export interface SafeAreaInsets {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

const ZERO: SafeAreaInsets = { top: 0, right: 0, bottom: 0, left: 0 };

const readVar = (styles: CSSStyleDeclaration, name: string): number =>
  parseFloat(styles.getPropertyValue(name)) || 0;

/**
 * Reads the device safe-area insets (notches / rounded corners) resolved from
 * the `--safe-*` CSS env() variables. Updates on resize & orientation change.
 */
export function useSafeArea(): SafeAreaInsets {
  const [insets, setInsets] = useState<SafeAreaInsets>(ZERO);

  useEffect(() => {
    const read = () => {
      const styles = getComputedStyle(document.documentElement);
      setInsets({
        top: readVar(styles, '--safe-top'),
        right: readVar(styles, '--safe-right'),
        bottom: readVar(styles, '--safe-bottom'),
        left: readVar(styles, '--safe-left'),
      });
    };
    read();
    window.addEventListener('resize', read, { passive: true });
    window.addEventListener('orientationchange', read);
    return () => {
      window.removeEventListener('resize', read);
      window.removeEventListener('orientationchange', read);
    };
  }, []);

  return insets;
}
