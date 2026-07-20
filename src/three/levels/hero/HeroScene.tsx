'use client';

import { AICore } from './AICore';
import { HeroCamera } from './HeroCamera';
import { GridFloor } from './GridFloor';
import { SkyDome } from './SkyDome';
import { LightShafts } from './LightShafts';
import { ParticleFlow } from './ParticleFlow';
import { EnergyStreams } from './EnergyStreams';
import { DynamicLights } from './DynamicLights';
import { HERO_COLORS, HERO_FOG } from './heroConfig';

/**
 * The Hero World scene graph — the opening level, treated as a complete product.
 *
 * Layered depth (sky dome → fog → light shafts → GPU particle flow → data
 * streams → grid → dynamic-lit platform → AI Core), everything emissive/additive
 * so it glows without a post pass, plus real point lights on a standard-material
 * platform for genuine dynamic lighting. Nothing is static; the whole field
 * reacts to the pointer. Mounted into the persistent canvas via the scene slot,
 * client-only.
 */
export function HeroScene() {
  return (
    <>
      <color attach="background" args={[HERO_COLORS.fog]} />
      <fog attach="fog" args={[HERO_FOG.color, HERO_FOG.near, HERO_FOG.far]} />
      <ambientLight intensity={0.25} />

      <SkyDome />
      <GridFloor />
      <LightShafts />
      <ParticleFlow />
      <EnergyStreams />
      <DynamicLights />
      <AICore />
      <HeroCamera />
    </>
  );
}
