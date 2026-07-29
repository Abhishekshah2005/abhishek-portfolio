"use client";

import { useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { pointer, lerp } from "@/lib/pointer";
import { useDeviceTier } from "@/lib/hooks";
import { bindContextLoss } from "@/lib/webgl";

/**
 * A dark, faceted field that only exists to be lit. The cursor carries a real
 * point light across it, so the highlights are actual shading rather than a
 * CSS gradient pretending to be one.
 */
function Field({ tier }: { tier: "low" | "mid" | "high" }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { viewport } = useThree();

  const cols = tier === "low" ? 18 : tier === "mid" ? 28 : 38;
  const rows = tier === "low" ? 10 : tier === "mid" ? 15 : 20;
  const count = cols * rows;

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useLayoutEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const spanX = viewport.width * 1.15;
    const spanY = viewport.height * 1.3;
    const stepX = spanX / cols;
    const stepY = spanY / rows;

    let i = 0;
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const px = -spanX / 2 + stepX * (x + 0.5);
        const py = -spanY / 2 + stepY * (y + 0.5);
        // Gentle wave so the light has contours to travel over.
        const pz = Math.sin(x * 0.42) * 0.22 + Math.cos(y * 0.55) * 0.18;

        dummy.position.set(px, py, pz);
        dummy.rotation.set(0, 0, (x + y) * 0.06);
        dummy.scale.set(stepX * 0.82, stepY * 0.82, 0.22);
        dummy.updateMatrix();
        mesh.setMatrixAt(i++, dummy.matrix);
      }
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [cols, rows, dummy, viewport.width, viewport.height]);

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial
        color="#17161c"
        roughness={0.42}
        metalness={0.62}
      />
    </instancedMesh>
  );
}

function CursorLight() {
  const ref = useRef<THREE.PointLight>(null);
  const { viewport } = useThree();

  useFrame((_, delta) => {
    const light = ref.current;
    if (!light) return;
    const k = 1 - Math.pow(0.002, delta);
    light.position.x = lerp(light.position.x, pointer.ex * viewport.width * 0.55, k);
    light.position.y = lerp(light.position.y, pointer.ey * viewport.height * 0.55, k);
  });

  return (
    <pointLight
      ref={ref}
      position={[0, 0, 2.4]}
      intensity={38}
      distance={11}
      decay={1.7}
      color="#ffd9b0"
    />
  );
}

export default function RevealScene({
  active,
  onContextLost,
}: {
  active: boolean;
  onContextLost?: () => void;
}) {
  const tier = useDeviceTier();

  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      camera={{ position: [0, 0, 7], fov: 40 }}
      dpr={[1, tier === "low" ? 1.1 : 1.5]}
      gl={{ antialias: false }}
      onCreated={({ gl }) => bindContextLoss(gl.domElement, onContextLost)}
    >
      <ambientLight intensity={0.16} />
      <Field tier={tier} />
      <CursorLight />
      {/* A second, cooler light keeps the far corners from going pure black. */}
      <pointLight position={[-5, 4, 4]} intensity={16} distance={16} color="#5b6cff" />
    </Canvas>
  );
}
