'use client';

import { useRef } from 'react';
import { type PointLight, MathUtils } from 'three';
import { useEngine } from '@/hooks/useEngine';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useEngineFrame } from '@/three/hooks/useEngineFrame';
import { TickPriority } from '@/types';
import { HERO_COLORS } from './heroConfig';

/**
 * Genuine dynamic lighting. Two coloured point lights orbit the core while a
 * third tracks the pointer, sweeping specular highlights across a real
 * standard-material platform beneath the Core (the only lit surface — kept
 * cheap). Intensities pulse with the core's rhythm.
 */
export function DynamicLights() {
  const engine = useEngine();
  const reduced = useReducedMotion();
  const fluxRef = useRef<PointLight>(null);
  const emberRef = useRef<PointLight>(null);
  const mouseRef = useRef<PointLight>(null);

  useEngineFrame((_, tick) => {
    const t = reduced ? 0 : tick.elapsed;
    if (fluxRef.current) {
      fluxRef.current.position.set(Math.cos(t * 0.6) * 4, 1.5 + Math.sin(t * 0.4) * 0.8, Math.sin(t * 0.6) * 4);
      fluxRef.current.intensity = 6 + Math.sin(t * 1.4) * 2;
    }
    if (emberRef.current) {
      emberRef.current.position.set(Math.cos(t * 0.6 + Math.PI) * 4.5, 0.5, Math.sin(t * 0.6 + Math.PI) * 4.5);
      emberRef.current.intensity = 4 + Math.cos(t * 1.1) * 1.5;
    }
    if (mouseRef.current) {
      const { x, y } = engine.interaction.normalized;
      mouseRef.current.position.x = MathUtils.lerp(mouseRef.current.position.x, x * 5, 0.06);
      mouseRef.current.position.y = MathUtils.lerp(mouseRef.current.position.y, y * 3 + 1, 0.06);
    }
  }, TickPriority.Animation);

  return (
    <group>
      <pointLight ref={fluxRef} color={HERO_COLORS.coreHot} intensity={6} distance={18} decay={1.6} />
      <pointLight ref={emberRef} color={HERO_COLORS.accent} intensity={4} distance={16} decay={1.6} />
      <pointLight ref={mouseRef} color={HERO_COLORS.ring} intensity={3} distance={12} decay={1.8} position={[0, 1, 3]} />

      {/* The single lit surface — a milled platform that catches the moving lights. */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.55, 0]} receiveShadow>
        <circleGeometry args={[7, 64]} />
        <meshStandardMaterial color="#0b0d14" metalness={0.85} roughness={0.35} envMapIntensity={0.4} />
      </mesh>
    </group>
  );
}
