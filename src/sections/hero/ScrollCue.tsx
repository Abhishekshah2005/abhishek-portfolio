'use client';

import { useEngineStore } from '@/hooks/useEngineStore';
import { Icon, IconArrowDown } from '@/icons';

/**
 * The "scroll to descend" affordance. Appears once the boot dissolves and fades
 * away the moment the operator starts descending — so it never nags.
 */
export function ScrollCue({ active }: { active: boolean }) {
  const progress = useEngineStore((s) => s.scrollProgress);
  const visible = active && progress < 0.04;

  return (
    <div
      aria-hidden={!visible}
      style={{ opacity: visible ? 1 : 0 }}
      className="pointer-events-none absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 transition-opacity duration-500 ease-signal"
    >
      <span className="font-mono text-2xs uppercase tracking-[0.3em] text-fog">scroll to descend</span>
      <Icon icon={IconArrowDown} size="sm" className="animate-bounce text-flux" />
    </div>
  );
}
