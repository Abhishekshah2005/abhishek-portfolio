"use client";

import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import {
  CuboidCollider,
  Physics,
  RigidBody,
  type RapierRigidBody,
} from "@react-three/rapier";
import * as THREE from "three";
import { useDeviceTier } from "@/lib/hooks";
import { bindContextLoss } from "@/lib/webgl";

const PALETTE = ["#2b44ff", "#ff5a2b", "#7b5cff", "#ffb03a", "#0f9d76", "#111014"];

type Shape = "box" | "sphere" | "capsule" | "torus";

type Toy = {
  id: number;
  shape: Shape;
  color: string;
  scale: number;
  position: [number, number, number];
};

/** Deterministic layout — no Math.random, so a remount is reproducible. */
function buildToys(count: number, seed: number): Toy[] {
  const shapes: Shape[] = ["box", "sphere", "capsule", "torus"];
  return Array.from({ length: count }, (_, i) => {
    const n = i + seed * 7;
    return {
      id: i,
      shape: shapes[n % shapes.length],
      color: PALETTE[n % PALETTE.length],
      scale: 0.42 + ((n * 13) % 5) * 0.07,
      position: [
        -2.4 + ((n * 17) % 10) * 0.52,
        2.4 + i * 0.85,
        -0.15 + ((n * 5) % 3) * 0.15,
      ] as [number, number, number],
    };
  });
}

/**
 * One throwable object.
 *
 * While dragged the body becomes kinematic and is driven straight from the
 * pointer; on release it goes dynamic again and inherits the velocity it had
 * in the last frames, so a flick actually throws it.
 */
function Toy({ toy }: { toy: Toy }) {
  const api = useRef<RapierRigidBody>(null);
  const [dragging, setDragging] = useState(false);
  const { camera } = useThree();

  const plane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0),
    [],
  );
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const point = useRef(new THREE.Vector3());
  const previous = useRef(new THREE.Vector3());
  const velocity = useRef(new THREE.Vector3());

  useFrame((state) => {
    if (!dragging || !api.current) return;
    raycaster.setFromCamera(state.pointer, camera);
    if (!raycaster.ray.intersectPlane(plane, point.current)) return;

    velocity.current.subVectors(point.current, previous.current);
    previous.current.copy(point.current);

    api.current.setNextKinematicTranslation({
      x: point.current.x,
      y: point.current.y,
      z: 0,
    });
  });

  const release = useCallback(() => {
    const body = api.current;
    if (!body) return;
    body.setBodyType(0, true); // Dynamic
    body.setLinvel(
      { x: velocity.current.x * 55, y: velocity.current.y * 55, z: 0 },
      true,
    );
    body.setAngvel({ x: 0, y: 0, z: -velocity.current.x * 12 }, true);
    setDragging(false);
  }, []);

  const grab = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const body = api.current;
    if (!body) return;
    const t = body.translation();
    previous.current.set(t.x, t.y, 0);
    velocity.current.set(0, 0, 0);
    // 2 = KinematicPositionBased
    body.setBodyType(2, true);
    setDragging(true);
  };

  // Release is bound to the window, not the mesh: raycast-based pointerout
  // fires constantly while dragging and would drop the object mid-throw.
  useEffect(() => {
    if (!dragging) return;
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    return () => {
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
    };
  }, [dragging, release]);

  return (
    <RigidBody
      ref={api}
      position={toy.position}
      colliders={toy.shape === "sphere" ? "ball" : "hull"}
      restitution={0.35}
      friction={0.7}
      linearDamping={0.25}
      angularDamping={0.35}
    >
      <mesh castShadow receiveShadow scale={toy.scale} onPointerDown={grab}>
        {toy.shape === "box" && <boxGeometry args={[1.5, 1.5, 1.5]} />}
        {toy.shape === "sphere" && <sphereGeometry args={[0.95, 32, 32]} />}
        {toy.shape === "capsule" && <capsuleGeometry args={[0.55, 1, 8, 24]} />}
        {toy.shape === "torus" && (
          <torusGeometry args={[0.85, 0.34, 20, 44]} />
        )}
        <meshStandardMaterial
          color={toy.color}
          roughness={0.32}
          metalness={0.08}
        />
      </mesh>
    </RigidBody>
  );
}

/** Invisible box that keeps the toys on stage. */
function Walls() {
  const { viewport } = useThree();
  const halfW = viewport.width / 2;
  const halfH = viewport.height / 2;

  return (
    <RigidBody type="fixed" colliders={false}>
      <CuboidCollider args={[halfW, 0.5, 3]} position={[0, -halfH - 0.5, 0]} />
      <CuboidCollider args={[0.5, halfH * 2, 3]} position={[-halfW - 0.5, 0, 0]} />
      <CuboidCollider args={[0.5, halfH * 2, 3]} position={[halfW + 0.5, 0, 0]} />
      {/* Front and back keep everything in a shallow slab so nothing can be
          flung out of focus. */}
      <CuboidCollider args={[halfW, halfH * 2, 0.5]} position={[0, 0, -1]} />
      <CuboidCollider args={[halfW, halfH * 2, 0.5]} position={[0, 0, 1]} />
    </RigidBody>
  );
}

export default function PlaygroundScene({
  resetKey,
  active,
  onContextLost,
}: {
  resetKey: number;
  active: boolean;
  onContextLost?: () => void;
}) {
  const tier = useDeviceTier();
  const count = tier === "low" ? 7 : tier === "mid" ? 11 : 14;
  const toys = useMemo(() => buildToys(count, resetKey), [count, resetKey]);

  return (
    <Canvas
      // Parking the loop when the chapter is off-screen keeps the physics
      // step from burning battery for nothing.
      frameloop={active ? "always" : "never"}
      shadows
      camera={{ position: [0, 0, 12], fov: 32 }}
      dpr={[1, tier === "low" ? 1.25 : 1.6]}
      gl={{ antialias: tier !== "low" }}
      onCreated={({ gl }) => bindContextLoss(gl.domElement, onContextLost)}
    >
      <ambientLight intensity={1.3} />
      <directionalLight
        position={[4, 8, 6]}
        intensity={2.2}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />

      {/* Rapier loads its physics engine as WASM, which suspends. Without a
          boundary here that suspension would blank the whole canvas — lights
          and shadows included — until the download finished. */}
      <Suspense fallback={null}>
        <Physics gravity={[0, -14, 0]} timeStep="vary">
          <Walls />
          {toys.map((toy) => (
            <Toy key={`${resetKey}-${toy.id}`} toy={toy} />
          ))}
        </Physics>
      </Suspense>

      <ContactShadows
        position={[0, -3.6, 0]}
        opacity={0.32}
        scale={22}
        blur={2.6}
        far={6}
        color="#111014"
      />

      <Environment resolution={128} frames={1}>
        <Lightformer intensity={2} position={[0, 4, 3]} scale={[9, 3, 1]} />
        <Lightformer
          intensity={1.1}
          position={[-4, 0, 2]}
          scale={[4, 4, 1]}
          color="#dfe4ff"
        />
      </Environment>
    </Canvas>
  );
}
