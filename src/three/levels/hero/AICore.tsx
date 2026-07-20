'use client';

import { useEffect, useMemo, useRef } from 'react';
import { AdditiveBlending, Color, DoubleSide, type Group, type Mesh, ShaderMaterial } from 'three';
import { useEngine } from '@/hooks/useEngine';
import { useEngineStore } from '@/hooks/useEngineStore';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useEngineFrame } from '@/three/hooks/useEngineFrame';
import { SIMPLEX_NOISE_3D, FRESNEL } from '@/three/shaders/chunks';
import { TickPriority } from '@/types';
import { HERO_COLORS, HERO_CORE, HERO_CORE_DETAIL } from './heroConfig';

interface RingConfig {
  r: number;
  tube: number;
  rot: [number, number, number];
  speed: number;
  color: string;
}

const RINGS: RingConfig[] = [
  { r: 2.0, tube: 0.012, rot: [1.2, 0, 0.3], speed: 0.25, color: HERO_COLORS.ring },
  { r: 2.45, tube: 0.01, rot: [0.4, 0.6, 0], speed: -0.18, color: HERO_COLORS.ring },
  { r: 2.9, tube: 0.008, rot: [0, 1.1, 0.5], speed: 0.12, color: HERO_COLORS.accent },
];

/**
 * The AI Core — the identity centerpiece.
 *
 * A living energy reactor: a simplex-displaced icosahedron with a fresnel
 * emissive skin, a wireframe containment shell, orbiting energy rings and a
 * soft additive halo (fakes bloom, no post-processing dependency). Reacts to
 * pointer and scroll; surges when the boot completes. All animation runs on the
 * engine ticker (single RAF).
 */
export function AICore() {
  const engine = useEngine();
  const reduced = useReducedMotion();
  const tier = useEngineStore((s) => s.tier);
  const bootComplete = useEngineStore((s) => s.bootComplete);

  const groupRef = useRef<Group>(null);
  const coreRef = useRef<Mesh>(null);
  const shellRef = useRef<Mesh>(null);
  const ringRefs = useRef<Array<Mesh | null>>([]);
  const pointerInfluence = useRef(0);
  const surge = useRef(0);
  const pulse = useRef(0);

  const coreMaterial = useMemo(
    () =>
      new ShaderMaterial({
        uniforms: {
          uTime: { value: 0 },
          uAmp: { value: HERO_CORE.amplitude },
          uFreq: { value: HERO_CORE.frequency },
          uPointer: { value: 0 },
          uColorA: { value: new Color(HERO_COLORS.coreDark) },
          uColorB: { value: new Color(HERO_COLORS.coreHot) },
        },
        vertexShader: /* glsl */ `
          ${SIMPLEX_NOISE_3D}
          uniform float uTime;
          uniform float uAmp;
          uniform float uFreq;
          uniform float uPointer;
          varying vec3 vNormal;
          varying vec3 vView;
          varying float vDisp;
          void main() {
            float n = snoise(normalize(position) * uFreq + uTime * 0.3);
            float disp = n * uAmp * (1.0 + uPointer * 0.6);
            vec3 p = position + normal * disp;
            vDisp = disp;
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            vNormal = normalize(normalMatrix * normal);
            vView = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: /* glsl */ `
          ${FRESNEL}
          uniform float uTime;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          varying vec3 vNormal;
          varying vec3 vView;
          varying float vDisp;
          void main() {
            float f = fresnel(vView, vNormal, 2.4);
            vec3 col = mix(uColorA, uColorB, smoothstep(-0.12, 0.16, vDisp));
            col += f * uColorB * 1.6;
            float pulse = 0.62 + 0.38 * sin(uTime * 1.4);
            gl_FragColor = vec4(col * pulse + f * 0.6, 1.0);
          }
        `,
      }),
    [],
  );

  const haloMaterial = useMemo(
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
          uniform vec3 uColor;
          uniform float uTime;
          varying vec2 vUv;
          void main() {
            float d = distance(vUv, vec2(0.5));
            float a = smoothstep(0.5, 0.02, d);
            a *= 0.55 + 0.45 * sin(uTime * 1.1);
            gl_FragColor = vec4(uColor, a * 0.7);
          }
        `,
      }),
    [],
  );

  useEffect(() => {
    return () => {
      coreMaterial.dispose();
      haloMaterial.dispose();
    };
  }, [coreMaterial, haloMaterial]);

  // Clicking anywhere sends a ripple through the core — invites interaction.
  useEffect(() => engine.events.on('pointer:down', () => (pulse.current = 1)), [engine]);

  useEngineFrame((_, tick) => {
    const t = reduced ? 0 : tick.elapsed;
    pulse.current *= 0.93;
    coreMaterial.uniforms.uTime.value = t;
    haloMaterial.uniforms.uTime.value = t;

    // Pointer proximity (global) subtly energises the core.
    const { x, y } = engine.interaction.normalized;
    const infl = Math.min(Math.hypot(x, y), 1);
    pointerInfluence.current += (infl - pointerInfluence.current) * 0.05;
    coreMaterial.uniforms.uPointer.value = pointerInfluence.current + pulse.current;

    // Scroll + boot surge + click pulse drive amplitude.
    const target = bootComplete ? 1 : 0.35;
    surge.current += (target - surge.current) * 0.04;
    const p = engine.scroll.progress;
    coreMaterial.uniforms.uAmp.value =
      HERO_CORE.amplitude * (0.6 + surge.current * 0.6 + p * 0.5 + pulse.current * 0.8);

    if (groupRef.current) groupRef.current.scale.setScalar(1 + pulse.current * 0.06);

    if (reduced) return;

    if (coreRef.current) {
      coreRef.current.rotation.y = t * 0.14 + x * 0.25;
      coreRef.current.rotation.x = y * 0.16;
    }
    if (shellRef.current) {
      shellRef.current.rotation.y = -t * 0.09;
      shellRef.current.rotation.x = t * 0.05;
    }
    ringRefs.current.forEach((ring, i) => {
      if (ring) ring.rotation.z = t * RINGS[i].speed;
    });
    if (groupRef.current) {
      groupRef.current.position.y = Math.sin(t * 0.5) * 0.08;
    }
  }, TickPriority.Animation);

  return (
    <group ref={groupRef}>
      {/* Energy core */}
      <mesh ref={coreRef} material={coreMaterial}>
        <icosahedronGeometry args={[HERO_CORE.radius, HERO_CORE_DETAIL[tier]]} />
      </mesh>

      {/* Hot inner glow */}
      <mesh>
        <sphereGeometry args={[0.55, 24, 24]} />
        <meshBasicMaterial
          color={HERO_COLORS.coreHot}
          transparent
          opacity={0.35}
          blending={AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Containment shell */}
      <mesh ref={shellRef}>
        <icosahedronGeometry args={[HERO_CORE.radius * 1.35, 1]} />
        <meshBasicMaterial color={HERO_COLORS.ring} wireframe transparent opacity={0.14} />
      </mesh>

      {/* Orbiting energy rings */}
      {RINGS.map((ring, i) => (
        <mesh
          key={i}
          ref={(el) => {
            ringRefs.current[i] = el;
          }}
          rotation={ring.rot}
        >
          <torusGeometry args={[ring.r, ring.tube, 12, 96]} />
          <meshBasicMaterial color={ring.color} transparent opacity={0.55} />
        </mesh>
      ))}

      {/* Soft glow halo */}
      <mesh position={[0, 0, -0.3]} material={haloMaterial}>
        <planeGeometry args={[9, 9]} />
      </mesh>
    </group>
  );
}
