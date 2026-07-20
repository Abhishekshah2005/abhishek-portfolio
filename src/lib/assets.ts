/**
 * Asset pipeline configuration.
 *
 * Central paths + typed helpers for every asset class. Public assets live under
 * `/public/**`; 3D assets stream through the engine `AssetManager` (Draco/KTX2).
 * Fonts are self-hosted via the `geist` package (no `/public/fonts` needed).
 */
export const ASSET_PATHS = {
  images: '/images',
  video: '/video',
  textures: '/textures',
  models: '/models',
  audio: '/audio',
  /** Local Draco decoder (place decoder files here to drop the CDN dependency). */
  draco: '/draco',
} as const;

export type AssetKindPath = keyof typeof ASSET_PATHS;

/** Build a public asset URL from a kind + filename. */
export function assetUrl(kind: AssetKindPath, file: string): string {
  const base = ASSET_PATHS[kind];
  return `${base}/${file.replace(/^\/+/, '')}`;
}

/**
 * Recommended encoding targets (documentation for the asset build step):
 * - images  → AVIF/WebP via next/image; source in /images
 * - video   → H.264 mp4 + AV1 webm, muted, poster frame
 * - textures→ KTX2 (Basis) compressed
 * - models  → GLB + Draco geometry compression
 * - audio   → webm/opus + mp3 fallback
 */
export const ASSET_TARGETS = {
  image: ['avif', 'webp'],
  video: ['webm', 'mp4'],
  texture: ['ktx2'],
  model: ['glb'],
  audio: ['webm', 'mp3'],
} as const;
