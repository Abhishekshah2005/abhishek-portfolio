'use client';

import { useRef } from 'react';
import type { Group } from 'three';
import { Environment, Lightformer, MeshDistortMaterial } from '@react-three/drei';
import { useEngine } from '@/hooks/useEngine';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useEngineFrame } from '@/three/hooks/useEngineFrame';
import { TickPriority } from '@/types';

/**
 * The Object — a single, quietly-morphing dark liquid-chrome form on a black
 * cinematic stage. Its beauty comes from what it reflects: an in-scene studio of
 * warm light-formers (no external HDRI, no network). It turns slowly, leans
 * toward the pointer, and — on the first scroll — rotates and swells, changing
 * perspective. Restraint over spectacle. Reduced-motion stills it.
 */
export function HeroObject() {
  const engine = useEngine();
  const reduced = useReducedMotion();
  const groupRef = useRef<Group>(null);

  useEngineFrame((_, tick) => {
    const g = groupRef.current;
    if (!g) return;
    const n = engine.interaction.normalized;
    const p = engine.scroll.progress;

    const targetY = n.x * 0.3 + p * 1.1 + (reduced ? 0 : tick.elapsed * 0.04);
    const targetX = -n.y * 0.2 + p * 0.15;
    g.rotation.y += (targetY - g.rotation.y) * 0.06;
    g.rotation.x += (targetX - g.rotation.x) * 0.06;
    g.scale.setScalar(1 + p * 0.18);
  }, TickPriority.Animation);

  return (
    <>
      <color attach="background" args={['#0a0a0c']} />
      <ambientLight intensity={0.35} />
      <directionalLight position={[5, 6, 4]} intensity={1.1} color="#fff6ea" />

      <group ref={groupRef}>
        <mesh>
          <icosahedronGeometry args={[2, 64]} />
          <MeshDistortMaterial
            color="#0c0c11"
            metalness={1}
            roughness={0.16}
            distort={reduced ? 0.1 : 0.3}
            speed={reduced ? 0 : 1.1}
            envMapIntensity={1.2}
          />
        </mesh>
      </group>

      {/* In-scene studio — the reflections that make it feel expensive. */}
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.2} position={[4, 4, 3]} scale={[7, 7, 1]} color="#ffffff" />
        <Lightformer form="rect" intensity={1.3} position={[-5, 1, 2]} scale={[6, 6, 1]} color="#e9dfce" />
        <Lightformer form="circle" intensity={1.6} position={[0, -4, 4]} scale={[5, 5, 1]} color="#fff2e0" />
        <Lightformer form="rect" intensity={0.8} position={[0, 5, -3]} scale={[8, 3, 1]} color="#ffffff" />
      </Environment>
    </>
  );
}
