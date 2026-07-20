'use client';

import { useEffect, useState } from 'react';
import { usePerformance } from '@/hooks/usePerformance';
import { useKeyboard } from '@/hooks/useKeyboard';
import { cn } from '@/lib';

/**
 * Developer performance HUD: FPS, memory, tier, device, dropped frames. Hidden
 * by default; opens with `?debug` in the URL or the backtick (`) key. Purely
 * diagnostic — never shipped as user-facing chrome.
 */
export function PerfMonitor() {
  const [open, setOpen] = useState(false);
  const { fps, tier, device, memoryMB, droppedFrames } = usePerformance();

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has('debug')) setOpen(true);
  }, []);

  useKeyboard({ '`': () => setOpen((o) => !o) });

  if (!open) return null;

  const rows: Array<[string, string]> = [
    ['FPS', String(fps)],
    ['TIER', tier],
    ['DEVICE', device],
    ['MEM', memoryMB != null ? `${memoryMB}MB` : 'n/a'],
    ['DROP', String(droppedFrames)],
  ];

  const fpsTone = fps >= 55 ? 'text-flux-2' : fps >= 40 ? 'text-gold' : 'text-danger';

  return (
    <div className="pointer-events-none fixed bottom-4 left-4 z-[var(--z-toast)] select-none rounded-md border border-line bg-[var(--surface-glass)] px-3 py-2 font-mono text-2xs uppercase tracking-[0.12em] text-fog shadow-elev-3 backdrop-blur-glass">
      {rows.map(([label, value]) => (
        <div key={label} className="flex items-center justify-between gap-4">
          <span>{label}</span>
          <span className={cn('tabular-nums text-signal', label === 'FPS' && fpsTone)}>{value}</span>
        </div>
      ))}
    </div>
  );
}
