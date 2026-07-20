'use client';

import { HeroAura } from './HeroAura';
import { IntelligenceField } from './IntelligenceField';

/**
 * The Home hero's living visualization: a soft indigo aura for atmosphere +
 * the interactive Intelligence Field (connected-systems network). Mounted into
 * the persistent canvas via the scene slot (lazy, client-only).
 */
export function HomeHeroScene() {
  return (
    <>
      <HeroAura />
      <IntelligenceField />
    </>
  );
}
