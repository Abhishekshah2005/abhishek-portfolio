'use client';

import { useEffect, useMemo, useRef } from 'react';
import { AdditiveBlending, Color, DoubleSide, type Group, ShaderMaterial } from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useEngineFrame } from '@/three/hooks/useEngineFrame';
import { TickPriority } from '@/types';
import { HERO_COLORS } from './heroConfig';

const SHAFTS: Array<{ pos: [number, number, number]; rot: [number, number, number] }> = [
  { pos: [-4, 2, -3], rot: [0, 0, 0.35] },
  { pos: [4.5, 3, -4], rot: [0, 0, -0.5] },
  { pos: [0.5, 4, -6], rot: [0, 0, 0.12] },
];

/**
 * Volumetric light shafts — soft additive planes that sway slowly, giving the
 * space depth and a "god-ray" atmosphere without post-processing cost.
 */
export function LightShafts() {
  const reduced = useReducedMotion();
  const groupRef = useRef<Group>(null);

  const material = useMemo(
    () =>
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        side: DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new Color(HERO_COLORS.coreHot) },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uTime;
          uniform vec3 uColor;
          varying vec2 vUv;
          void main() {
            float vertical = smoothstep(0.0, 0.35, vUv.y) * smoothstep(1.0, 0.55, vUv.y);
            float horiz = smoothstep(0.5, 0.0, abs(vUv.x - 0.5));
            float flick = 0.7 + 0.3 * sin(uTime * 0.5);
            gl_FragColor = vec4(uColor, vertical * horiz * 0.1 * flick);
          }
        `,
      }),
    [],
  );

  useEffect(() => () => material.dispose(), [material]);

  useEngineFrame((_, tick) => {
    material.uniforms.uTime.value = reduced ? 0 : tick.elapsed;
    if (!reduced && groupRef.current) {
      groupRef.current.rotation.z = Math.sin(tick.elapsed * 0.1) * 0.05;
    }
  }, TickPriority.Animation);

  return (
    <group ref={groupRef}>
      {SHAFTS.map((shaft, i) => (
        <mesh key={i} material={material} position={shaft.pos} rotation={shaft.rot}>
          <planeGeometry args={[2.4, 14]} />
        </mesh>
      ))}
    </group>
  );
}
