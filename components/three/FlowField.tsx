"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { pointer } from "@/lib/pointer";
import { useDeviceTier } from "@/lib/hooks";
import { bindContextLoss } from "@/lib/webgl";

/**
 * The hero's backdrop: a slow, dark flow field — liquid smoke with faint
 * contour lines, and a lime glint that follows the cursor. Runs on time as
 * well as input, so the frame is alive even when nobody's touching it.
 *
 * One fullscreen quad, one fragment shader — the cheapest possible way to
 * make a black screen feel expensive.
 */

const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  uniform float uTime;
  uniform vec2 uPointer;   // eased, -1..1
  uniform float uSpeed;    // pointer speed, eased
  uniform vec2 uAspect;
  varying vec2 vUv;

  // Cheap value noise + fbm — good enough for smoke at these contrasts.
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }

  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) {
      v += a * noise(p);
      p = p * 2.03 + vec2(11.7, 5.3);
      a *= 0.5;
    }
    return v;
  }

  void main() {
    vec2 uv = (vUv - 0.5) * uAspect;
    float t = uTime * 0.045;

    // Two layers of drift, the second warped by the first — the "liquid".
    vec2 q = vec2(fbm(uv * 1.6 + t), fbm(uv * 1.6 - t * 0.7));
    float n = fbm(uv * 2.2 + q * 1.4 + vec2(t * 0.6, -t * 0.4));

    // Base: near-black with the faintest warm lift where the smoke thickens.
    vec3 col = mix(vec3(0.039, 0.039, 0.043), vec3(0.085, 0.086, 0.094), n);

    // Contour lines — the topographic feel. Kept at a whisper.
    float bands = abs(fract(n * 7.0) - 0.5);
    col += vec3(0.95, 0.95, 0.93) * smoothstep(0.02, 0.0, bands) * 0.045;

    // The lime glint that lives under the cursor, swelling with speed.
    vec2 p = vec2(uPointer.x, uPointer.y) * uAspect * 0.5;
    float d = length(uv - p);
    float glow = (1.0 - smoothstep(0.0, 0.55, d)) * (0.10 + uSpeed * 0.010);
    col += vec3(0.851, 1.0, 0.251) * glow * (0.6 + n);

    // Vignette holds the frame.
    float vig = smoothstep(1.25, 0.35, length(uv));
    col *= 0.55 + 0.45 * vig;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function Quad() {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const { size } = useThree();

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uSpeed: { value: 0 },
      uAspect: { value: new THREE.Vector2(1, 1) },
    }),
    [],
  );

  useFrame((state) => {
    const u = matRef.current?.uniforms;
    if (!u) return;
    u.uTime.value = state.clock.elapsedTime;
    (u.uPointer.value as THREE.Vector2).set(pointer.ex, pointer.ey);
    u.uSpeed.value += (pointer.speed - u.uSpeed.value) * 0.08;
    (u.uAspect.value as THREE.Vector2).set(
      Math.max(size.width / size.height, 1),
      Math.max(size.height / size.width, 1),
    );
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

export default function FlowField({
  onContextLost,
}: {
  onContextLost?: () => void;
}) {
  const tier = useDeviceTier();

  return (
    <Canvas
      // No camera math needed — the quad is in clip space.
      gl={{ antialias: false, powerPreference: "high-performance" }}
      dpr={[1, tier === "low" ? 1 : 1.5]}
      onCreated={({ gl }) => bindContextLoss(gl.domElement, onContextLost)}
    >
      <Quad />
    </Canvas>
  );
}
