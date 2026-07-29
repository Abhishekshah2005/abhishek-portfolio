"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { journey, smoothstep, walkerX } from "@/lib/journey";

/**
 * The walker.
 *
 * Built from primitives rather than a rigged model — no asset to download,
 * and every proportion becomes a number we can animate. Two morphs run over
 * the walk: `ape` drains away by the village, `biz` arrives by the valley.
 *
 * The figure is a deliberately abstract silhouette. It reads as "progress"
 * without caricaturing anybody.
 */

const FUR = new THREE.Color("#4a3a2c");
const SKIN = new THREE.Color("#c08a5e");
const CASUAL = new THREE.Color("#7c8a99");
const SUIT = new THREE.Color("#1b2338");
const CASE = new THREE.Color("#3a2a1c");

/**
 * Materials live at module scope on purpose.
 *
 * They're rewritten every frame by the morph, which makes them mutable state
 * rather than derived data — and anything a hook hands back is off-limits for
 * that. There is only ever one walker on the page, so a shared instance is
 * honest about what these are, and it survives a canvas remount intact.
 */
const clothMat = new THREE.MeshStandardMaterial({
  color: FUR.clone(),
  roughness: 0.85,
});
const skinMat = new THREE.MeshStandardMaterial({
  color: FUR.clone(),
  roughness: 0.8,
});
const caseMat = new THREE.MeshStandardMaterial({
  color: CASE.clone(),
  roughness: 0.5,
  transparent: true,
  opacity: 0,
});
const tmp = new THREE.Color();

export function Walker() {
  const root = useRef<THREE.Group>(null);
  const body = useRef<THREE.Group>(null);
  const torso = useRef<THREE.Group>(null);
  const head = useRef<THREE.Group>(null);
  const muzzle = useRef<THREE.Mesh>(null);
  const tail = useRef<THREE.Group>(null);
  const briefcase = useRef<THREE.Group>(null);

  const legL = useRef<THREE.Group>(null);
  const legR = useRef<THREE.Group>(null);
  const shinL = useRef<THREE.Group>(null);
  const shinR = useRef<THREE.Group>(null);
  const armL = useRef<THREE.Group>(null);
  const armR = useRef<THREE.Group>(null);

  useFrame(() => {
    const p = journey.progress;
    const x = walkerX();

    // He carries himself: deriving position here rather than having a parent
    // push it in keeps the stride and the ground locked together.
    if (root.current) root.current.position.x = x;

    // Ape drains out over the first stage and a bit; the suit arrives across
    // the last two. Between them he's simply a person.
    const ape = 1 - smoothstep(0.08, 0.28, p);
    const biz = smoothstep(0.6, 0.9, p);

    // Stride is keyed to distance travelled, never to time — otherwise the
    // feet slide whenever the scroll speed changes.
    const stride = x * 1.45;
    const swing = Math.sin(stride);
    const swingOff = Math.sin(stride + Math.PI);
    const amp = 0.72 - ape * 0.12;

    if (legL.current) legL.current.rotation.x = swing * amp;
    if (legR.current) legR.current.rotation.x = swingOff * amp;
    // Knees only bend forward, and only on the backswing.
    if (shinL.current) shinL.current.rotation.x = Math.max(0, -swing) * 0.9;
    if (shinR.current) shinR.current.rotation.x = Math.max(0, -swingOff) * 0.9;

    // Arms counter-swing. The briefcase arm stiffens once he's carrying it.
    if (armL.current) armL.current.rotation.x = swingOff * (amp * 0.8);
    if (armR.current)
      armR.current.rotation.x =
        swing * (amp * 0.8) * (1 - biz * 0.72) - biz * 0.12;

    if (body.current) {
      // Vertical bob, twice per stride.
      body.current.position.y = 0.92 + Math.abs(Math.sin(stride)) * 0.045;
      body.current.scale.setScalar(0.86 + (1 - ape) * 0.14);
    }

    if (torso.current) {
      // Hunched and heavy at the start, upright by the time he's a person.
      torso.current.rotation.x = ape * 0.62 - biz * 0.04;
    }

    if (head.current) {
      head.current.position.z = ape * 0.16;
      head.current.position.y = 0.62 - ape * 0.12;
      head.current.rotation.x = -ape * 0.5;
    }

    if (muzzle.current) {
      muzzle.current.scale.setScalar(Math.max(ape, 0.001));
      muzzle.current.visible = ape > 0.02;
    }

    if (tail.current) {
      tail.current.scale.setScalar(Math.max(ape, 0.001));
      tail.current.visible = ape > 0.02;
      tail.current.rotation.x = -0.5 + Math.sin(stride) * 0.14;
    }

    if (briefcase.current) {
      briefcase.current.visible = biz > 0.03;
      briefcase.current.scale.setScalar(biz);
    }
    caseMat.opacity = biz;

    // Fur -> plain clothes -> suit.
    tmp.copy(FUR).lerp(CASUAL, 1 - ape).lerp(SUIT, biz);
    clothMat.color.copy(tmp);

    tmp.copy(FUR).lerp(SKIN, 1 - ape);
    skinMat.color.copy(tmp);
  });

  return (
    <group ref={root}>
      <group ref={body} position={[0, 0.92, 0]}>
        {/* Torso + everything that rides on it */}
        <group ref={torso}>
          <mesh position={[0, 0.28, 0]} material={clothMat} castShadow>
            <capsuleGeometry args={[0.19, 0.42, 6, 14]} />
          </mesh>

          <group ref={head} position={[0, 0.62, 0]}>
            <mesh material={skinMat} castShadow>
              <sphereGeometry args={[0.17, 20, 20]} />
            </mesh>
            <mesh ref={muzzle} position={[0, -0.04, 0.14]} material={skinMat}>
              <sphereGeometry args={[0.09, 14, 14]} />
            </mesh>
            {/* Ears sit outside the ape morph so he keeps a head silhouette. */}
            <mesh position={[-0.16, 0.02, 0]} material={skinMat}>
              <sphereGeometry args={[0.045, 10, 10]} />
            </mesh>
            <mesh position={[0.16, 0.02, 0]} material={skinMat}>
              <sphereGeometry args={[0.045, 10, 10]} />
            </mesh>
          </group>

          <group ref={armL} position={[-0.22, 0.46, 0]}>
            <mesh position={[0, -0.24, 0]} material={clothMat} castShadow>
              <capsuleGeometry args={[0.065, 0.38, 5, 10]} />
            </mesh>
            <mesh position={[0, -0.48, 0]} material={skinMat}>
              <sphereGeometry args={[0.07, 12, 12]} />
            </mesh>
          </group>

          <group ref={armR} position={[0.22, 0.46, 0]}>
            <mesh position={[0, -0.24, 0]} material={clothMat} castShadow>
              <capsuleGeometry args={[0.065, 0.38, 5, 10]} />
            </mesh>
            <mesh position={[0, -0.48, 0]} material={skinMat}>
              <sphereGeometry args={[0.07, 12, 12]} />
            </mesh>
            <group ref={briefcase} position={[0.02, -0.66, 0]}>
              <mesh material={caseMat} castShadow>
                <boxGeometry args={[0.26, 0.19, 0.07]} />
              </mesh>
            </group>
          </group>

          <group ref={tail} position={[0, 0.06, -0.16]}>
            <mesh
              position={[0, -0.06, -0.12]}
              rotation={[1.1, 0, 0]}
              material={skinMat}
            >
              <capsuleGeometry args={[0.032, 0.26, 4, 8]} />
            </mesh>
            <mesh
              position={[0, -0.2, -0.26]}
              rotation={[0.5, 0, 0]}
              material={skinMat}
            >
              <capsuleGeometry args={[0.024, 0.22, 4, 8]} />
            </mesh>
          </group>
        </group>

        {/* Legs hang from the hips, not the torso, so the lean doesn't
            drag them along with it. */}
        <group ref={legL} position={[-0.1, 0, 0]}>
          <mesh position={[0, -0.24, 0]} material={clothMat} castShadow>
            <capsuleGeometry args={[0.08, 0.34, 5, 10]} />
          </mesh>
          <group ref={shinL} position={[0, -0.46, 0]}>
            <mesh position={[0, -0.2, 0]} material={clothMat}>
              <capsuleGeometry args={[0.07, 0.3, 5, 10]} />
            </mesh>
            <mesh position={[0, -0.4, 0.05]} material={skinMat}>
              <boxGeometry args={[0.13, 0.07, 0.24]} />
            </mesh>
          </group>
        </group>

        <group ref={legR} position={[0.1, 0, 0]}>
          <mesh position={[0, -0.24, 0]} material={clothMat} castShadow>
            <capsuleGeometry args={[0.08, 0.34, 5, 10]} />
          </mesh>
          <group ref={shinR} position={[0, -0.46, 0]}>
            <mesh position={[0, -0.2, 0]} material={clothMat}>
              <capsuleGeometry args={[0.07, 0.3, 5, 10]} />
            </mesh>
            <mesh position={[0, -0.4, 0.05]} material={skinMat}>
              <boxGeometry args={[0.13, 0.07, 0.24]} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}
