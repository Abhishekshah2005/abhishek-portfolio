'use client';

import { useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshReflectorMaterial, Sparkles } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import { engineStore } from '@/state/engineStore';
import { useReducedMotion } from '@/hooks/useReducedMotion';

/* ---------------------------------------------------------------- textures */

function radialTexture(inner: string, mid: string): THREE.CanvasTexture {
  const c = document.createElement('canvas');
  c.width = c.height = 256;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(128, 128, 0, 128, 128, 128);
  g.addColorStop(0, inner);
  g.addColorStop(0.35, mid);
  g.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 256, 256);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function figureTexture(): THREE.CanvasTexture {
  const w = 256;
  const h = 512;
  const c = document.createElement('canvas');
  c.width = w;
  c.height = h;
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#05050a';
  const cx = w / 2;
  const s = h * 0.9;
  const fy = h * 0.98;
  // head
  ctx.beginPath();
  ctx.arc(cx, fy - s * 0.86, s * 0.075, 0, Math.PI * 2);
  ctx.fill();
  // torso (tapered)
  ctx.beginPath();
  ctx.moveTo(cx - s * 0.09, fy - s * 0.74);
  ctx.lineTo(cx + s * 0.09, fy - s * 0.74);
  ctx.lineTo(cx + s * 0.06, fy - s * 0.34);
  ctx.lineTo(cx - s * 0.06, fy - s * 0.34);
  ctx.closePath();
  ctx.fill();
  // legs
  ctx.fillRect(cx - s * 0.055, fy - s * 0.36, s * 0.04, s * 0.36);
  ctx.fillRect(cx + s * 0.015, fy - s * 0.36, s * 0.04, s * 0.36);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

/* ------------------------------------------------------------------ pieces */

function Sun() {
  const glow = useMemo(() => radialTexture('rgba(255,222,150,0.95)', 'rgba(226,120,80,0.5)'), []);
  const core = useMemo(() => radialTexture('rgba(255,238,205,1)', 'rgba(255,190,120,0.6)'), []);
  return (
    <group position={[0, 0.35, -20]}>
      <mesh>
        <planeGeometry args={[42, 26]} />
        <meshBasicMaterial map={glow} transparent fog={false} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      <mesh position={[0, 0.1, 0.1]}>
        <planeGeometry args={[14, 9]} />
        <meshBasicMaterial map={core} transparent fog={false} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
      {/* thin bright horizon bar */}
      <mesh position={[0, -0.25, 0.2]}>
        <planeGeometry args={[60, 0.18]} />
        <meshBasicMaterial color="#ffd9a0" transparent fog={false} opacity={0.9} blending={THREE.AdditiveBlending} depthWrite={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Figure() {
  const map = useMemo(() => figureTexture(), []);
  return (
    <mesh position={[0, 1.15, -6]}>
      <planeGeometry args={[1.4, 2.5]} />
      <meshBasicMaterial map={map} transparent depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, -6]}>
      <planeGeometry args={[80, 80]} />
      <MeshReflectorMaterial
        resolution={640}
        mixBlur={1}
        mixStrength={10}
        blur={[300, 90]}
        minDepthThreshold={0.4}
        maxDepthThreshold={1.2}
        depthScale={1.1}
        roughness={0.7}
        metalness={0.55}
        color="#0a0a14"
        mirror={0}
      />
    </mesh>
  );
}

function SkyDome() {
  const tex = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 4;
    c.height = 256;
    const ctx = c.getContext('2d')!;
    const g = ctx.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, '#07070f');
    g.addColorStop(0.55, '#100d22');
    g.addColorStop(0.82, '#241a3a');
    g.addColorStop(1, '#3a2440');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 4, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, []);
  return (
    <mesh position={[0, 6, -34]} scale={[1, 1, 1]}>
      <planeGeometry args={[120, 60]} />
      <meshBasicMaterial map={tex} fog={false} depthWrite={false} toneMapped={false} />
    </mesh>
  );
}

function Rig({ reduced }: { reduced: boolean }) {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 1.15 });
  useFrame((state) => {
    const prog = engineStore.getState().scrollProgress;
    const p = state.pointer;
    target.current.x = p.x * 0.5;
    target.current.y = 1.15 + p.y * 0.18 - prog * 0.35;
    const k = reduced ? 1 : 0.05;
    camera.position.x += (target.current.x - camera.position.x) * k;
    camera.position.y += (target.current.y - camera.position.y) * k;
    camera.position.z = 7 - prog * 1.2;
    camera.lookAt(0, 1.15, -20);
  });
  return null;
}

function SceneContents({ reduced }: { reduced: boolean }) {
  return (
    <>
      <fog attach="fog" args={['#0b0a18', 8, 34]} />
      <SkyDome />
      <Sun />
      <Figure />
      <Floor />
      {!reduced && (
        <Sparkles count={90} scale={[26, 8, 20]} position={[0, 3, -10]} size={2.4} speed={0.25} opacity={0.7} color="#ffe9c8" />
      )}
      <Rig reduced={reduced} />
      <EffectComposer enableNormalPass={false}>
        <Bloom intensity={1.15} luminanceThreshold={0.35} luminanceSmoothing={0.5} mipmapBlur radius={0.8} />
        <Vignette eskil={false} offset={0.28} darkness={0.82} />
      </EffectComposer>
    </>
  );
}

function WorldSceneInner() {
  const reduced = useReducedMotion();
  return (
    <Canvas
      className="size-full"
      frameloop={reduced ? 'demand' : 'always'}
      dpr={[1, 1.6]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ fov: 42, near: 0.1, far: 80, position: [0, 1.15, 7] }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <SceneContents reduced={reduced} />
    </Canvas>
  );
}

/**
 * The cinematic 3D world — a glowing sun on the horizon, a wet reflective floor
 * mirroring a lone figure and drifting sparkles, real bloom + vignette, fog
 * depth, and a scroll/pointer-reactive camera. Fixed behind all content. This
 * is the reference's scene, done in real 3D. Client-only (lazy, no SSR).
 */
const LazyWorld = dynamic(() => Promise.resolve(WorldSceneInner), { ssr: false });

export function WorldScene() {
  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[var(--z-canvas)]"
      style={{
        background:
          'radial-gradient(130% 85% at 50% 63%, rgba(232,150,86,0.20), rgba(120,60,80,0.06) 42%, transparent 60%), linear-gradient(180deg, #07070f 0%, #0d0b1e 46%, #1b1433 70%, #0b0913 88%, #070610 100%)',
      }}
    >
      <LazyWorld />
    </div>
  );
}
