'use client';

import { useEffect, useMemo } from 'react';
import { AdditiveBlending, Color, DoubleSide, ShaderMaterial } from 'three';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useEngineFrame } from '@/three/hooks/useEngineFrame';
import { TickPriority } from '@/types';
import { HERO_COLORS } from './heroConfig';

/**
 * A shader-driven digital grid floor that fades into the fog with a soft energy
 * pulse rippling outward from the core — the "command center" ground plane.
 * Additive + derivative-based lines for crisp glow at any distance.
 */
export function GridFloor() {
  const reduced = useReducedMotion();

  const material = useMemo(
    () =>
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        side: DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uColor: { value: new Color(HERO_COLORS.grid) },
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
            vec2 uv = vUv * 44.0;
            vec2 grid = abs(fract(uv - 0.5) - 0.5) / fwidth(uv);
            float line = min(grid.x, grid.y);
            float mask = 1.0 - min(line, 1.0);
            float dist = distance(vUv, vec2(0.5));
            float ripple = 0.5 + 0.5 * sin(uTime * 0.8 - dist * 22.0);
            float fade = smoothstep(0.5, 0.08, dist);
            float a = mask * fade * (0.18 + 0.4 * ripple);
            gl_FragColor = vec4(uColor, a);
          }
        `,
      }),
    [],
  );

  useEffect(() => () => material.dispose(), [material]);

  useEngineFrame((_, tick) => {
    material.uniforms.uTime.value = reduced ? 0 : tick.elapsed;
  }, TickPriority.Animation);

  return (
    <mesh material={material} rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.4, 0]}>
      <planeGeometry args={[60, 60]} />
    </mesh>
  );
}
