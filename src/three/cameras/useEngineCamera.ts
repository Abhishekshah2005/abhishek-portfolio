'use client';

import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { PerspectiveCamera } from 'three';
import { useEngine } from '@/hooks/useEngine';
import { TickPriority } from '@/types';

export interface UseEngineCameraOptions {
  /** Bind the CameraManager's waypoint track to scroll progress. */
  followScroll?: boolean;
}

/**
 * Drives the active R3F camera from the engine's {@link CameraManager}.
 *
 * The manager owns the eased transform; this hook copies it onto the real
 * camera each frame and (optionally) samples the waypoint track from scroll
 * progress — the seam that makes cinematic, scroll-driven camera paths work.
 */
export function useEngineCamera(options: UseEngineCameraOptions = {}): void {
  const engine = useEngine();
  const camera = useThree((s) => s.camera);

  useEffect(() => {
    const off: Array<() => void> = [];

    if (options.followScroll) {
      off.push(
        engine.events.on('scroll', ({ progress }) => engine.camera.applyProgress(progress)),
      );
    }

    off.push(
      engine.ticker.add(() => {
        camera.position.copy(engine.camera.position);
        camera.lookAt(engine.camera.target);
        if (camera instanceof PerspectiveCamera && camera.fov !== engine.camera.fov) {
          camera.fov = engine.camera.fov;
          camera.updateProjectionMatrix();
        }
      }, TickPriority.Camera),
    );

    return () => off.forEach((fn) => fn());
  }, [engine, camera, options.followScroll]);
}
