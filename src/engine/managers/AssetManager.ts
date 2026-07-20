import { Texture, TextureLoader } from 'three';
import { Manager, type EngineContext } from '../core/Manager';
import type { LoadingManager } from './LoadingManager';

export type AssetKind = 'texture' | 'gltf' | 'audio' | 'json';

interface AssetRecord {
  kind: AssetKind;
  value: unknown;
}

/**
 * A cached, promise-based asset loader.
 *
 * - De-duplicates concurrent requests for the same URL.
 * - Caches results so repeated `load` calls are free.
 * - Routes every loader through the shared {@link LoadingManager} so global
 *   progress stays accurate.
 * - Heavy loaders (GLTF/Draco) are dynamically imported the first time they
 *   are needed, keeping them out of the initial bundle.
 */
export class AssetManager extends Manager {
  private readonly cache = new Map<string, AssetRecord>();
  private readonly inflight = new Map<string, Promise<unknown>>();

  private textureLoader?: TextureLoader;

  constructor(
    ctx: EngineContext,
    private readonly loading: LoadingManager,
  ) {
    super(ctx);
  }

  /** Retrieve an already-loaded asset from cache (or `undefined`). */
  get<T>(url: string): T | undefined {
    return this.cache.get(url)?.value as T | undefined;
  }

  has(url: string): boolean {
    return this.cache.has(url);
  }

  /** Load (or return cached) a texture. */
  loadTexture(url: string): Promise<Texture> {
    return this.dedupe(url, 'texture', () => {
      this.textureLoader ??= new TextureLoader(this.loading.three);
      return this.textureLoader.loadAsync(url);
    });
  }

  /** Load (or return cached) a glTF/GLB model. */
  async loadGLTF(url: string): Promise<import('three/examples/jsm/loaders/GLTFLoader.js').GLTF> {
    return this.dedupe(url, 'gltf', async () => {
      const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
      const { DRACOLoader } = await import('three/examples/jsm/loaders/DRACOLoader.js');
      const loader = new GLTFLoader(this.loading.three);
      const draco = new DRACOLoader();
      draco.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');
      loader.setDRACOLoader(draco);
      return loader.loadAsync(url);
    });
  }

  /** Load (or return cached) an arbitrary JSON payload. */
  loadJSON<T = unknown>(url: string): Promise<T> {
    return this.dedupe(url, 'json', async () => {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Asset ${url} → ${res.status}`);
      return (await res.json()) as T;
    });
  }

  /** Warm the cache for a batch of textures without awaiting the result. */
  preloadTextures(urls: readonly string[]): Promise<Texture[]> {
    return Promise.all(urls.map((url) => this.loadTexture(url)));
  }

  private dedupe<T>(url: string, kind: AssetKind, factory: () => Promise<T>): Promise<T> {
    const cached = this.cache.get(url);
    if (cached) return Promise.resolve(cached.value as T);

    const existing = this.inflight.get(url);
    if (existing) return existing as Promise<T>;

    const promise = factory()
      .then((value) => {
        this.cache.set(url, { kind, value });
        this.inflight.delete(url);
        return value;
      })
      .catch((error) => {
        this.inflight.delete(url);
        this.events.emit('load:error', { url, error });
        throw error;
      });

    this.inflight.set(url, promise);
    return promise;
  }

  protected override onDispose(): void {
    for (const record of this.cache.values()) {
      if (record.value instanceof Texture) record.value.dispose();
    }
    this.cache.clear();
    this.inflight.clear();
    this.textureLoader = undefined;
  }
}
