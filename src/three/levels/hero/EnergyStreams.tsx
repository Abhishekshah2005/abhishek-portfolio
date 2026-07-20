'use client';

import { useEffect, useMemo, useRef } from 'react';
import { AdditiveBlending, Color, DoubleSide, type Group, ShaderMaterial } from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useEngineFrame } from '@/three/hooks/useEngineFrame';
import { TickPriority } from '@/types';
import { HERO_COLORS } from './heroConfig';

const COUNT = 7;

/**
 * Vertical data streams that rise around the Core — additive shader planes with
 * scrolling energy dashes, arranged radially and slowly orbiting. Reinforces
 * the "data flowing into the AI" read.
 */
export function EnergyStreams() {
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
            float streak = fract(vUv.y * 3.0 - uTime * 0.5);
            float dash = smoothstep(0.85, 1.0, streak) + smoothstep(0.15, 0.0, streak);
            float edge = smoothstep(0.5, 0.0, abs(vUv.x - 0.5));
            float fade = smoothstep(0.0, 0.25, vUv.y) * smoothstep(1.0, 0.7, vUv.y);
            gl_FragColor = vec4(uColor, dash * edge * fade * 0.4);
          }
        `,
      }),
    [],
  );

  useEffect(() => () => material.dispose(), [material]);

  const streams = useMemo(
    () =>
      Array.from({ length: COUNT }, (_, i) => {
        const angle = (i / COUNT) * Math.PI * 2;
        const radius = 3.4;
        return {
          position: [Math.cos(angle) * radius, 0.5, Math.sin(angle) * radius] as [number, number, number],
          rotation: [0, -angle + Math.PI / 2, 0] as [number, number, number],
        };
      }),
    [],
  );

  useEngineFrame((_, tick) => {
    material.uniforms.uTime.value = reduced ? 0 : tick.elapsed;
    if (!reduced && groupRef.current) groupRef.current.rotation.y = tick.elapsed * 0.04;
  }, TickPriority.Animation);

  return (
    <group ref={groupRef}>
      {streams.map((s, i) => (
        <mesh key={i} material={material} position={s.position} rotation={s.rotation}>
          <planeGeometry args={[0.5, 7]} />
        </mesh>
      ))}
    </group>
  );
}
