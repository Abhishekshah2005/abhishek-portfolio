'use client';

import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

/**
 * A refined, Cuberto-class cursor: a crisp dot that tracks tightly and a softer
 * ring that trails with spring physics and expands over interactive targets
 * (links, buttons, `[data-cursor]`). Fine-pointer only (touch keeps native);
 * SSR-safe (renders nothing until mounted). The native cursor is hidden on
 * fine pointers via globals.
 */
export function PremiumCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hover, setHover] = useState(false);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 350, damping: 30, mass: 0.4 });
  const ringY = useSpring(y, { stiffness: 350, damping: 30, mass: 0.4 });
  const dotX = useSpring(x, { stiffness: 1100, damping: 45, mass: 0.2 });
  const dotY = useSpring(y, { stiffness: 1100, damping: 45, mass: 0.2 });

  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    setEnabled(true);

    const move = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      setHover(Boolean(t?.closest?.('a, button, [data-cursor], input, textarea, [role="button"]')));
    };
    const down = () => setDown(true);
    const up = () => setDown(false);

    window.addEventListener('pointermove', move, { passive: true });
    window.addEventListener('pointerover', over, { passive: true });
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    return () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
    };
  }, [x, y]);

  if (!enabled) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[var(--z-cursor)] hidden md:block">
      {/* Trailing ring */}
      <motion.div style={{ x: ringX, y: ringY }} className="absolute left-0 top-0">
        <motion.div
          className="-translate-x-1/2 -translate-y-1/2 rounded-full border border-flux/70"
          animate={{
            width: hover ? 56 : 30,
            height: hover ? 56 : 30,
            opacity: down ? 0.5 : 1,
            backgroundColor: hover ? 'color-mix(in oklab, var(--color-flux) 12%, transparent)' : 'rgba(0,0,0,0)',
          }}
          transition={{ type: 'spring', stiffness: 300, damping: 26, mass: 0.5 }}
        />
      </motion.div>

      {/* Crisp dot */}
      <motion.div style={{ x: dotX, y: dotY }} className="absolute left-0 top-0">
        <motion.div
          className="size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-flux"
          animate={{ opacity: hover ? 0 : 1, scale: down ? 0.6 : 1 }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>
    </div>
  );
}
