'use client';

import { Canvas } from '@react-three/fiber';
import type { ReactNode } from 'react';
import { ENGINE_CONFIG } from '@/config';
import { useEngineStore } from '@/hooks/useEngineStore';
import { getQualityProfile } from './environments/qualityProfiles';
import { useRenderBridge } from './hooks/useRenderBridge';
import { useEngineCamera } from './cameras/useEngineCamera';

/**
 * Wires R3F into the engine: drives the render loop from the single ticker and
 * binds the camera to the CameraManager. Rendered once, inside the Canvas.
 */
function CanvasBridge({ followScroll }: { followScroll: boolean }) {
  useRenderBridge();
  useEngineCamera({ followScroll });
  return null;
}

export interface EngineCanvasProps {
  children?: ReactNode;
  /** Drive the camera waypoint track from scroll progress. */
  followScroll?: boolean;
  className?: string;
}

/**
 * The reusable Three.js stage.
 *
 * - `frameloop="never"` so the engine ticker is the only loop.
 * - DPR and GL flags derive from the live performance tier via one quality
 *   profile, so the whole stage self-tunes.
 * - Holds no scene content itself — future scenes render as `children`.
 *
 * Lazy-load this component (`next/dynamic`, `ssr: false`) so Three is never in
 * the initial bundle or the server render.
 */
export function EngineCanvas({ children, followScroll = false, className }: EngineCanvasProps) {
  const tier = useEngineStore((s) => s.tier);
  const profile = getQualityProfile(tier);

  return (
    <Canvas
      className={className}
      frameloop="never"
      dpr={profile.dpr}
      shadows={profile.shadows}
      gl={{ antialias: profile.antialias, alpha: true, powerPreference: 'high-performance' }}
      camera={{
        fov: ENGINE_CONFIG.camera.fov,
        near: ENGINE_CONFIG.camera.near,
        far: ENGINE_CONFIG.camera.far,
        position: [...ENGINE_CONFIG.camera.position],
      }}
    >
      <CanvasBridge followScroll={followScroll} />
      {children}
    </Canvas>
  );
}
