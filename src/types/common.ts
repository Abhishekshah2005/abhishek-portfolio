/** Shared primitive & utility types used across the engine. */

export type Vec2 = { x: number; y: number };
export type Vec3 = { x: number; y: number; z: number };

export type Tuple2 = [number, number];
export type Tuple3 = [number, number, number];

/** A function that tears down a resource / subscription. */
export type Cleanup = () => void;

/** Anything the engine can dispose of. */
export interface IDisposable {
  dispose(): void;
}

/** Quality tiers used by the performance manager. */
export type QualityTier = 'low' | 'medium' | 'high' | 'ultra';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export type PointerType = 'mouse' | 'touch' | 'pen';

export type ScrollOrientation = 'vertical' | 'horizontal';

/** A value that is either present or explicitly absent. */
export type Maybe<T> = T | null;
