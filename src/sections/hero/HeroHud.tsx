'use client';

import { motion } from 'motion/react';
import { useEngineStore } from '@/hooks/useEngineStore';
import { LogoMark, Bracket } from '@/icons';
import { HoloPanel } from './HoloPanel';

/** Live depth gauge — re-renders on scroll only (isolated from the HUD frame). */
function DepthReadout() {
  const p = useEngineStore((s) => s.scrollProgress);
  const pct = Math.round(p * 100);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-8 font-mono text-2xs uppercase tracking-[0.2em] text-fog">
        <span>Depth</span>
        <span className="tabular-nums text-signal">{String(pct).padStart(2, '0')}%</span>
      </div>
      <div className="h-px w-40 bg-line">
        <div className="h-full origin-left bg-flux" style={{ transform: `scaleX(${p})` }} />
      </div>
    </div>
  );
}

const BRACKETS = [
  { corner: 'tl', cls: 'left-4 top-4' },
  { corner: 'tr', cls: 'right-4 top-4' },
  { corner: 'bl', cls: 'bottom-4 left-4' },
  { corner: 'br', cls: 'bottom-4 right-4' },
] as const;

/**
 * The Hero World HUD — holographic ATLAS OS chrome that powers on gradually
 * once the boot dissolves. Four glass panels in the safe corners (mission,
 * location, live depth, systems) framed by hairline brackets, all revealed with
 * Motion.dev micro-transitions. Reduced motion is honoured by Motion.
 */
export function HeroHud({ active }: { active: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 p-6 md:p-8">
      {/* Corner brackets */}
      {BRACKETS.map((b) => (
        <motion.span
          key={b.corner}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
          transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
          className={`absolute ${b.cls} text-fog-dim`}
        >
          <Bracket corner={b.corner} />
        </motion.span>
      ))}

      {/* Top-left: identity + mission */}
      <HoloPanel active={active} delay={0.1} className="absolute left-6 top-6 md:left-8 md:top-8">
        <div className="flex items-center gap-2">
          <LogoMark size={18} className="text-flux" />
          <div className="font-mono text-2xs uppercase tracking-[0.24em] text-fog">
            <div className="text-signal">ATLAS</div>
            <div>mission // enter</div>
          </div>
        </div>
      </HoloPanel>

      {/* Top-right: location + status */}
      <HoloPanel
        active={active}
        delay={0.2}
        className="absolute right-6 top-6 text-right font-mono text-2xs uppercase tracking-[0.2em] text-fog md:right-8 md:top-8"
      >
        <div className="text-signal">spine-00 · threshold</div>
        <div className="mt-1 flex items-center justify-end gap-1.5">
          <span className="size-1.5 rounded-full bg-flux-2 [animation:atlas-pulse_2s_ease-in-out_infinite]" />
          systems nominal
        </div>
      </HoloPanel>

      {/* Bottom-left: live depth */}
      <HoloPanel active={active} delay={0.3} className="absolute bottom-6 left-6 md:bottom-8 md:left-8">
        <DepthReadout />
      </HoloPanel>

      {/* Bottom-right: coordinates */}
      <HoloPanel
        active={active}
        delay={0.4}
        className="absolute bottom-6 right-6 text-right font-mono text-2xs uppercase tracking-[0.2em] text-fog-dim md:bottom-8 md:right-8"
      >
        <div>lat 00.00 · lon 00.00</div>
        <div className="mt-1">atlas os v0.7</div>
      </HoloPanel>
    </div>
  );
}
