'use client';

import { useEffect, useMemo, useRef } from 'react';
import { AdditiveBlending, BufferAttribute, BufferGeometry, Color, type Points, ShaderMaterial } from 'three';
import { useEngine } from '@/hooks/useEngine';
import { useEngineStore } from '@/hooks/useEngineStore';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useEngineFrame } from '@/three/hooks/useEngineFrame';
import { SIMPLEX_NOISE_3D, CURL_NOISE } from '@/three/shaders/chunks';
import { COLORS } from '@/design/tokens';
import { TickPriority } from '@/types';
import { HERO_PARTICLES } from './heroConfig';

/**
 * GPU curl-noise particle flow — the living atmosphere of the Hero World.
 *
 * Particles flow along a divergence-free curl-noise field computed entirely in
 * the vertex shader (no CPU per-particle work). The whole field reacts to the
 * pointer: cursor speed injects turbulence and biases the flow direction, so
 * the environment feels alive under the mouse. Density scales with the
 * performance tier; motion freezes under reduced-motion.
 */
export function ParticleFlow() {
  const engine = useEngine();
  const reduced = useReducedMotion();
  const tier = useEngineStore((s) => s.tier);
  const pointsRef = useRef<Points>(null);
  const turbulence = useRef(0);
  const prevPointer = useRef({ x: 0, y: 0 });

  const { geometry, material } = useMemo(() => {
    const count = HERO_PARTICLES[tier];
    const positions = new Float32Array(count * 3);
    const rand = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      // Random point in a spherical shell around the core.
      const r = 3 + Math.random() * 8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3 + 0] = r * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = r * Math.cos(phi) * 0.6;
      positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
      rand[i] = 0.3 + Math.random() * 0.7;
    }

    const geo = new BufferGeometry();
    geo.setAttribute('position', new BufferAttribute(positions, 3));
    geo.setAttribute('aRand', new BufferAttribute(rand, 1));

    const mat = new ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
      uniforms: {
        uTime: { value: 0 },
        uTurb: { value: 0 },
        uSize: { value: 26 },
        uColorA: { value: new Color(COLORS.flux) },
        uColorB: { value: new Color(COLORS.flux2) },
      },
      vertexShader: /* glsl */ `
        ${SIMPLEX_NOISE_3D}
        ${CURL_NOISE}
        attribute float aRand;
        uniform float uTime;
        uniform float uTurb;
        uniform float uSize;
        varying float vAlpha;
        varying float vMix;
        void main() {
          vec3 base = position;
          vec3 flow = curlNoise(base * 0.12 + uTime * 0.04);
          float t = uTime * (0.15 + aRand * 0.2);
          vec3 pos = base
            + flow * (1.3 + uTurb * 1.8)
            + vec3(sin(t + aRand * 6.28), cos(t * 0.7), sin(t * 0.5)) * 0.35;
          vec4 mv = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mv;
          gl_PointSize = max(1.0, uSize * aRand * (1.0 / -mv.z));
          vAlpha = aRand;
          vMix = clamp(length(base) / 11.0, 0.0, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        varying float vAlpha;
        varying float vMix;
        void main() {
          float d = length(gl_PointCoord - 0.5);
          float a = smoothstep(0.5, 0.0, d);
          vec3 col = mix(uColorA, uColorB, vMix);
          gl_FragColor = vec4(col, a * vAlpha * 0.85);
        }
      `,
    });

    return { geometry: geo, material: mat };
  }, [tier]);

  useEffect(() => {
    return () => {
      geometry.dispose();
      material.dispose();
    };
  }, [geometry, material]);

  useEngineFrame((_, tick) => {
    if (reduced) {
      material.uniforms.uTime.value = 0;
      return;
    }
    material.uniforms.uTime.value = tick.elapsed;

    // Pointer motion → turbulence + gentle field rotation.
    const { x, y } = engine.interaction.normalized;
    const speed = Math.hypot(x - prevPointer.current.x, y - prevPointer.current.y);
    prevPointer.current = { x, y };
    turbulence.current += (Math.min(speed * 12, 1) - turbulence.current) * 0.08;
    material.uniforms.uTurb.value = turbulence.current;

    if (pointsRef.current) {
      pointsRef.current.rotation.y += tick.delta * 0.02 + x * 0.0015;
      pointsRef.current.rotation.x += y * 0.0008;
    }
  }, TickPriority.Animation);

  return <points ref={pointsRef} geometry={geometry} material={material} frustumCulled={false} />;
}
