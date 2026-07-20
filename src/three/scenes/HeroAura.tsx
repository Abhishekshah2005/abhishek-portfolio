'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Color, ShaderMaterial, Vector2 } from 'three';
import { useEngineOptional } from '@/hooks/useEngine';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useEngineFrame } from '@/three/hooks/useEngineFrame';
import { SIMPLEX_NOISE_3D } from '@/three/shaders/chunks';
import { COLORS } from '@/design/tokens';
import { TickPriority } from '@/types';

/**
 * A subtle, premium abstract hero visual — a soft flowing indigo aura that
 * tints the light page from the upper area and drifts with a slow noise field,
 * gently following the pointer. Transparent over the paper background; kept
 * low-opacity so it enhances rather than dominates. Reduced-motion freezes it.
 */
export function HeroAura() {
  const engine = useEngineOptional();
  const reduced = useReducedMotion();
  const pointer = useRef(new Vector2(0, 0));

  const material = useMemo(
    () =>
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uPointer: { value: new Vector2(0, 0) },
          uColorA: { value: new Color(COLORS.flux) },
          uColorB: { value: new Color(COLORS.flux2) },
        },
        vertexShader: /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          ${SIMPLEX_NOISE_3D}
          uniform float uTime;
          uniform vec2 uPointer;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          varying vec2 vUv;
          void main() {
            vec2 uv = vUv;
            float n1 = snoise(vec3(uv * 2.2, uTime * 0.05));
            float n2 = snoise(vec3(uv * 4.0 + 7.0, uTime * 0.08));
            float flow = 0.5 + 0.5 * sin((uv.x + uv.y) * 2.4 + uTime * 0.25 + n1 * 1.6);

            // Aura concentrated toward the upper-right, nudged by the pointer.
            vec2 center = vec2(0.74, 0.7) + uPointer * 0.12;
            float d = distance(uv, center);
            float mask = smoothstep(0.95, 0.05, d);

            vec3 col = mix(uColorA, uColorB, clamp(flow * 0.6 + n2 * 0.25 + 0.3, 0.0, 1.0));
            float grain = (snoise(vec3(uv * 900.0, 0.0))) * 0.015;
            float alpha = mask * (0.14 + 0.20 * flow) + grain;
            gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.42));
          }
        `,
      }),
    [],
  );

  useEffect(() => () => material.dispose(), [material]);

  useEngineFrame((_, tick) => {
    material.uniforms.uTime.value = reduced ? 0 : tick.elapsed;
    if (engine) {
      const target = engine.interaction.normalized;
      pointer.current.x += (target.x - pointer.current.x) * 0.03;
      pointer.current.y += (target.y - pointer.current.y) * 0.03;
      (material.uniforms.uPointer.value as Vector2).copy(pointer.current);
    }
  }, TickPriority.Animation);

  return (
    <mesh material={material} position={[0, 0, 0]}>
      <planeGeometry args={[60, 40]} />
    </mesh>
  );
}
