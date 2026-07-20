'use client';

import { useEffect, useMemo, useRef } from 'react';
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  type Group,
  LineBasicMaterial,
  LineSegments,
  ShaderMaterial,
  Vector2,
} from 'three';
import { useEngine } from '@/hooks/useEngine';
import { useEngineStore } from '@/hooks/useEngineStore';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useEngineFrame } from '@/three/hooks/useEngineFrame';
import { COLORS } from '@/design/tokens';
import { TickPriority } from '@/types';
import type { QualityTier } from '@/types';

const NODES: Record<QualityTier, number> = { low: 42, medium: 64, high: 88, ultra: 112 };
const PULSES: Record<QualityTier, number> = { low: 4, medium: 7, high: 10, ultra: 14 };
const K = 2; // nearest-neighbour edges per node

interface Edge {
  a: number;
  b: number;
}

/**
 * The Intelligence Field — a living network of connected systems (the "business
 * ecosystem / financial-intelligence graph" that Abhishek builds). A fixed
 * constellation of nodes wired to their nearest neighbours, gently parallaxing
 * with the pointer; nodes glow near the cursor (GPU-side), and signal pulses
 * travel the edges — data flowing through the systems. Indigo on light, subtle
 * and premium. Scroll deepens the connections. Reduced-motion → calm & still.
 */
export function IntelligenceField() {
  const engine = useEngine();
  const reduced = useReducedMotion();
  const tier = useEngineStore((s) => s.tier);
  const groupRef = useRef<Group>(null);
  const pointer = useRef(new Vector2(0, 0));
  const progress = useRef(0);
  const pushZ = useRef(0);

  const built = useMemo(() => {
    const count = NODES[tier];
    const positions = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const pts: Array<[number, number, number]> = [];
    for (let i = 0; i < count; i++) {
      const x = (Math.random() * 2 - 1) * 7.5;
      const y = (Math.random() * 2 - 1) * 4.2;
      const z = (Math.random() * 2 - 1) * 2.2;
      positions.set([x, y, z], i * 3);
      seeds[i] = Math.random();
      pts.push([x, y, z]);
    }

    // Nearest-neighbour edges (deduped).
    const seen = new Set<string>();
    const edges: Edge[] = [];
    for (let i = 0; i < count; i++) {
      const dists = pts
        .map((p, j) => ({ j, d: (p[0] - pts[i][0]) ** 2 + (p[1] - pts[i][1]) ** 2 + (p[2] - pts[i][2]) ** 2 }))
        .filter((o) => o.j !== i)
        .sort((a, b) => a.d - b.d)
        .slice(0, K);
      for (const { j } of dists) {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (seen.has(key)) continue;
        seen.add(key);
        edges.push({ a: i, b: j });
      }
    }

    const edgePos = new Float32Array(edges.length * 6);
    edges.forEach((e, k) => {
      edgePos.set(pts[e.a], k * 6);
      edgePos.set(pts[e.b], k * 6 + 3);
    });

    return { count, positions, seeds, edges, edgePos, pts };
  }, [tier]);

  // Node material — GPU pointer-proximity glow + twinkle.
  const nodeMat = useMemo(
    () =>
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: {
          uTime: { value: 0 },
          uPointer: { value: new Vector2(0, 0) },
          uProgress: { value: 0 },
          uColor: { value: new Color(COLORS.flux) },
          uColorHot: { value: new Color(COLORS.flux2) },
        },
        vertexShader: /* glsl */ `
          attribute float aSeed;
          uniform float uTime;
          uniform vec2 uPointer;
          uniform float uProgress;
          varying float vGlow;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vec4 clip = projectionMatrix * mv;
            vec2 ndc = clip.xy / clip.w;
            float d = distance(ndc, uPointer);
            float glow = smoothstep(0.34, 0.0, d);
            vGlow = glow;
            float tw = 0.75 + 0.25 * sin(uTime * 1.2 + aSeed * 6.2831);
            gl_PointSize = (3.0 + glow * 16.0 + uProgress * 1.5) * tw;
            gl_Position = clip;
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          uniform vec3 uColorHot;
          varying float vGlow;
          void main() {
            float dd = length(gl_PointCoord - 0.5);
            float a = smoothstep(0.5, 0.0, dd);
            vec3 c = mix(uColor, uColorHot, vGlow);
            gl_FragColor = vec4(c, a * (0.35 + 0.55 * vGlow));
          }
        `,
      }),
    [],
  );

  const nodeGeo = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(built.positions, 3));
    g.setAttribute('aSeed', new BufferAttribute(built.seeds, 1));
    return g;
  }, [built]);

  const lineGeo = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(built.edgePos, 3));
    return g;
  }, [built]);

  const lineMat = useMemo(
    () => new LineBasicMaterial({ color: new Color(COLORS.flux), transparent: true, opacity: 0.12 }),
    [],
  );

  // Signal pulses travelling along edges.
  const pulseCount = PULSES[tier];
  const pulses = useMemo(
    () =>
      Array.from({ length: pulseCount }, () => ({
        edge: Math.floor(Math.random() * built.edges.length),
        t: Math.random(),
        speed: 0.25 + Math.random() * 0.4,
      })),
    [pulseCount, built],
  );
  const pulseGeo = useMemo(() => {
    const g = new BufferGeometry();
    g.setAttribute('position', new BufferAttribute(new Float32Array(pulseCount * 3), 3));
    return g;
  }, [pulseCount]);
  const pulseMat = useMemo(
    () =>
      new ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        uniforms: { uColor: { value: new Color(COLORS.flux2) } },
        vertexShader: /* glsl */ `
          void main() {
            gl_PointSize = 6.0;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform vec3 uColor;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            gl_FragColor = vec4(uColor, smoothstep(0.5, 0.0, d) * 0.9);
          }
        `,
      }),
    [],
  );

  const lineSegments = useMemo(() => new LineSegments(lineGeo, lineMat), [lineGeo, lineMat]);

  useEffect(() => {
    return () => {
      nodeGeo.dispose();
      nodeMat.dispose();
      lineGeo.dispose();
      lineMat.dispose();
      pulseGeo.dispose();
      pulseMat.dispose();
    };
  }, [nodeGeo, nodeMat, lineGeo, lineMat, pulseGeo, pulseMat]);

  useEngineFrame((_, tick) => {
    const t = reduced ? 0 : tick.elapsed;
    const p = engine.scroll.progress;
    progress.current += (p - progress.current) * 0.06;

    nodeMat.uniforms.uTime.value = t;
    nodeMat.uniforms.uProgress.value = progress.current;

    // Pointer parallax + eased ndc for the glow.
    const n = engine.interaction.normalized;
    pointer.current.x += (n.x - pointer.current.x) * 0.05;
    pointer.current.y += (n.y - pointer.current.y) * 0.05;
    (nodeMat.uniforms.uPointer.value as Vector2).copy(pointer.current);

    if (groupRef.current) {
      if (!reduced) {
        groupRef.current.rotation.y = pointer.current.x * 0.18 + t * 0.02;
        groupRef.current.rotation.x = -pointer.current.y * 0.12;
      }
      pushZ.current += (progress.current * 2.2 - pushZ.current) * 0.05;
      groupRef.current.position.z = pushZ.current;
      // Converge/contract as the story advances (the network collapses inward).
      groupRef.current.scale.setScalar(1 - progress.current * 0.18);
    }

    // Advance pulses.
    if (!reduced) {
      const arr = pulseGeo.attributes.position.array as Float32Array;
      for (let i = 0; i < pulses.length; i++) {
        const pu = pulses[i];
        pu.t += tick.delta * pu.speed * (0.6 + progress.current);
        if (pu.t > 1) {
          pu.t = 0;
          pu.edge = Math.floor(Math.random() * built.edges.length);
        }
        const e = built.edges[pu.edge];
        const a = built.pts[e.a];
        const b = built.pts[e.b];
        arr[i * 3] = a[0] + (b[0] - a[0]) * pu.t;
        arr[i * 3 + 1] = a[1] + (b[1] - a[1]) * pu.t;
        arr[i * 3 + 2] = a[2] + (b[2] - a[2]) * pu.t;
      }
      pulseGeo.attributes.position.needsUpdate = true;
    }
  }, TickPriority.Animation);

  return (
    <group ref={groupRef}>
      <primitive object={lineSegments} />
      <points geometry={nodeGeo} material={nodeMat} frustumCulled={false} />
      <points geometry={pulseGeo} material={pulseMat} frustumCulled={false} />
    </group>
  );
}
