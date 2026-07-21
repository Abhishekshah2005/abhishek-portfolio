'use client';

import dynamic from 'next/dynamic';
import type { ReactNode } from 'react';
import { cn } from '@/lib';
import { useEngineOptional } from '@/hooks/useEngine';
import { useActiveScene } from '@/providers/SceneProvider';

// The R3F stage is client-only and lazy — Three never enters the initial bundle
// or the server render.
const EngineCanvas = dynamic(
  () => import('@/three/EngineCanvas').then((m) => m.EngineCanvas),
  { ssr: false },
);

export interface SceneLayerProps {
  /** Future scenes mount here as R3F subtrees. Empty = ready, idle stage. */
  children?: ReactNode;
  /** Bind the camera waypoint track to scroll progress. */
  followScroll?: boolean;
  /** Allow the canvas to receive pointer events (for 3D picking). */
  interactive?: boolean;
  className?: string;
}

/**
 * The persistent 3D stage — a fixed, full-viewport layer behind all DOM
 * content that every future scene mounts inside. Mounts the engine-wired
 * `EngineCanvas` only once the engine exists, so the render bridge and camera
 * hooks always have a live engine.
 */
export function SceneLayer({ children, followScroll = false, interactive = false, className }: SceneLayerProps) {
  const engine = useEngineOptional();
  const activeScene = useActiveScene();

  return (
    <div
      aria-hidden
      className={cn(
        'fixed inset-0 z-[var(--z-canvas)]',
        interactive ? 'pointer-events-auto' : 'pointer-events-none',
        className,
      )}
    >
      {/* Only mount the WebGL canvas when a scene is actually present. */}
      {engine && (activeScene || children) ? (
        <EngineCanvas followScroll={followScroll} className="size-full">
          {activeScene}
          {children}
        </EngineCanvas>
      ) : null}
    </div>
  );
}
