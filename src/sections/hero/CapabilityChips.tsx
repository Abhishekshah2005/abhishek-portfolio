'use client';

import { motion } from 'motion/react';
import { useEngineOptional } from '@/hooks/useEngine';

const CAPABILITIES = ['AI', 'SaaS', 'Mobile', 'Web', 'CRM', 'Automation', 'Experiences'];
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

/**
 * The discipline chips — communicating the full "complete digital products"
 * range and inviting interaction. Motion.dev staggered power-on + per-chip hover
 * micro-interaction; hovering switches the custom cursor to its "view" state.
 */
export function CapabilityChips({ active }: { active: boolean }) {
  const engine = useEngineOptional();

  return (
    <motion.ul
      initial="hidden"
      animate={active ? 'show' : 'hidden'}
      variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05, delayChildren: 0.4 } } }}
      className="pointer-events-auto mt-7 flex max-w-lg flex-wrap gap-2"
      aria-label="Capabilities"
    >
      {CAPABILITIES.map((cap) => (
        <motion.li
          key={cap}
          variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
          transition={{ duration: 0.5, ease: EASE }}
          whileHover={{ y: -3, scale: 1.06 }}
          onHoverStart={() => engine?.cursor.setVariant('view')}
          onHoverEnd={() => engine?.cursor.setVariant('default')}
          className="cursor-none rounded-full border border-line bg-graphite/50 px-3.5 py-1.5 font-mono text-2xs uppercase tracking-[0.15em] text-fog backdrop-blur-glass transition-colors hover:border-flux/60 hover:text-flux"
        >
          {cap}
        </motion.li>
      ))}
    </motion.ul>
  );
}
