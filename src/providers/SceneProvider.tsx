'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

interface SceneSlotValue {
  scene: ReactNode;
  setScene: (node: ReactNode) => void;
}

const SceneSlotContext = createContext<SceneSlotValue | null>(null);

/**
 * Holds the active 3D scene node so a page/level can declaratively mount an R3F
 * subtree into the persistent canvas (rendered by `<SceneLayer>`) without the
 * canvas living in the page tree. The element is created in the DOM tree but
 * only *rendered* inside the Canvas, so its R3F hooks run in the WebGL context.
 */
export function SceneProvider({ children }: { children: ReactNode }) {
  const [scene, setScene] = useState<ReactNode>(null);
  const value = useMemo<SceneSlotValue>(() => ({ scene, setScene }), [scene]);
  return <SceneSlotContext.Provider value={value}>{children}</SceneSlotContext.Provider>;
}

function useSceneSlot(): SceneSlotValue {
  const ctx = useContext(SceneSlotContext);
  if (!ctx) throw new Error('useSceneSlot must be used within <SceneProvider>.');
  return ctx;
}

/** Read the active scene node (used by the SceneLayer). */
export function useActiveScene(): ReactNode {
  return useSceneSlot().scene;
}

/**
 * Mount an R3F subtree into the canvas for the lifetime of the calling
 * component. Clears on unmount so levels swap cleanly.
 */
export function useSceneContent(node: ReactNode): void {
  const { setScene } = useSceneSlot();
  const nodeRef = useRef(node);
  nodeRef.current = node;

  const set = useCallback(() => setScene(nodeRef.current), [setScene]);

  useEffect(() => {
    set();
    return () => setScene(null);
  }, [set, setScene]);
}
