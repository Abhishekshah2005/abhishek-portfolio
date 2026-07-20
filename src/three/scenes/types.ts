import type { ComponentType } from 'react';

/**
 * The contract every future 3D scene implements.
 *
 * Scenes are intentionally NOT defined in this foundation phase — this is the
 * shape they will conform to so the {@link SceneManager} and the Canvas shell
 * can mount them polymorphically later.
 */
export interface SceneModule {
  id: string;
  /** The R3F subtree for this scene (rendered inside the Canvas). */
  Component: ComponentType;
  /** Optional preloading hook run before the scene becomes active. */
  preload?: () => Promise<void>;
}

/** A lazy scene registration — enables code-split scene loading. */
export type LazySceneModule = () => Promise<{ default: SceneModule }>;
