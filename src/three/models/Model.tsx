'use client';

import type { Tuple3 } from '@/types';
import { useModel } from '../loaders/useAsset';

export interface ModelProps {
  url: string;
  position?: Tuple3;
  rotation?: Tuple3;
  scale?: number | Tuple3;
}

/**
 * A generic, reusable glTF model renderer.
 *
 * Loads through the cached AssetManager and renders `null` until ready (wrap
 * in `<Suspense>`-style gating or a loader as needed). No specific model is
 * referenced — the URL is always supplied by the caller.
 */
export function Model({ url, position, rotation, scale }: ModelProps) {
  const gltf = useModel(url);
  if (!gltf) return null;
  return <primitive object={gltf.scene} position={position} rotation={rotation} scale={scale} />;
}
