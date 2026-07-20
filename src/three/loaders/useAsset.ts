'use client';

import { useEffect, useState } from 'react';
import type { Texture } from 'three';
import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useEngine } from '@/hooks/useEngine';

/**
 * Load a texture through the engine's cached {@link AssetManager}. Returns
 * `null` until ready. Because the manager de-dupes and caches, the same URL
 * across many components loads once.
 */
export function useTexture(url: string): Texture | null {
  const engine = useEngine();
  const [texture, setTexture] = useState<Texture | null>(() => engine.assets.get<Texture>(url) ?? null);

  useEffect(() => {
    let active = true;
    engine.assets
      .loadTexture(url)
      .then((t) => active && setTexture(t))
      .catch(() => active && setTexture(null));
    return () => {
      active = false;
    };
  }, [engine, url]);

  return texture;
}

/** Load a glTF/GLB model through the cached AssetManager. `null` until ready. */
export function useModel(url: string): GLTF | null {
  const engine = useEngine();
  const [model, setModel] = useState<GLTF | null>(() => engine.assets.get<GLTF>(url) ?? null);

  useEffect(() => {
    let active = true;
    engine.assets
      .loadGLTF(url)
      .then((g) => active && setModel(g))
      .catch(() => active && setModel(null));
    return () => {
      active = false;
    };
  }, [engine, url]);

  return model;
}
