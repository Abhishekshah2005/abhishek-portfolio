"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Instance, Instances } from "@react-three/drei";
import * as THREE from "three";
import {
  STAGES,
  STAGE_LENGTH,
  WORLD_LENGTH,
  journey,
  stageAt,
  walkerX,
} from "@/lib/journey";
import { pointer, lerp } from "@/lib/pointer";
import { useDeviceTier } from "@/lib/hooks";
import { bindContextLoss } from "@/lib/webgl";
import { Walker } from "./Walker";

/* ------------------------------------------------------------------
   Deterministic scatter. Math.random would re-roll the whole world on
   every remount, so the landscape has to come from a hash.
------------------------------------------------------------------ */

function rand(seed: number) {
  const x = Math.sin(seed * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}

type Item = {
  key: string;
  position: [number, number, number];
  scale: [number, number, number];
  rotation?: [number, number, number];
  color: string;
};

type World = {
  trunks: Item[];
  canopies: Item[];
  blocks: Item[];
  cones: Item[];
  glass: Item[];
  ground: Item[];
};

const GREENS = ["#2f6b34", "#3f7a3a", "#265b2c", "#4a8a42"];
const MUD = ["#a8794a", "#8a6b45", "#c19a68", "#7a5c3a"];
const STONE = ["#6a6d76", "#585b63", "#7b7f88", "#4e5158"];
const COOL = ["#565a66", "#454954", "#676c79", "#383c46"];
const VALLEY = ["#8d9a8a", "#a9b3a3", "#7b8878", "#c3ccbd"];

/** Builds the whole landscape once. */
function buildWorld(density: number): World {
  const trunks: Item[] = [];
  const canopies: Item[] = [];
  const blocks: Item[] = [];
  const cones: Item[] = [];
  const glass: Item[] = [];
  const ground: Item[] = [];

  // Ground is segmented so its colour can change *along* the walk rather
  // than the whole plane shifting hue at once.
  const segments = 90;
  const segLength = (WORLD_LENGTH + 80) / segments;
  const groundColor = new THREE.Color();
  for (let i = 0; i < segments; i++) {
    const x = -40 + segLength * (i + 0.5);
    const t = Math.min(Math.max(x / WORLD_LENGTH, 0), 0.999) * (STAGES.length - 1);
    const a = STAGES[Math.floor(t)];
    const b = STAGES[Math.min(Math.floor(t) + 1, STAGES.length - 1)];
    groundColor.set(a.ground).lerp(new THREE.Color(b.ground), t % 1);
    ground.push({
      key: `g${i}`,
      position: [x, -0.5, 0],
      scale: [segLength + 0.4, 1, 80],
      color: `#${groundColor.getHexString()}`,
    });
  }

  STAGES.forEach((_stage, s) => {
    const count = Math.round(density * (s === 0 ? 1.15 : 1));
    const baseX = s * STAGE_LENGTH;

    for (let i = 0; i < count; i++) {
      const r1 = rand(s * 91 + i * 7.3);
      const r2 = rand(s * 57 + i * 13.1);
      const r3 = rand(s * 23 + i * 3.7);
      const r4 = rand(s * 71 + i * 19.9);

      const x = baseX + r1 * STAGE_LENGTH;
      const key = `${s}-${i}`;

      // Only small greenery is ever allowed in front of the walker. Putting
      // architecture there parks a tower on the camera lens the moment you
      // walk past it.
      if (r2 < 0.16) {
        const fz = 3.4 + r2 * 9;
        cones.push({
          key: `fg${key}`,
          position: [x, 0.45 + r3 * 0.3, fz],
          scale: [0.7 + r3 * 0.5, 0.9 + r4 * 0.7, 0.7 + r3 * 0.5],
          color:
            s === 0
              ? GREENS[i % GREENS.length]
              : s === 1
                ? "#6f7f4a"
                : s === 4
                  ? "#5f8f5c"
                  : "#5c6b58",
        });
        continue;
      }

      // Everything else lives behind him, layered back for parallax.
      const z = -4 - r2 * 26;

      if (s === 0) {
        // Jungle: tall trunks under heavy canopies.
        const h = 3.6 + r3 * 5.2;
        trunks.push({
          key,
          position: [x, h / 2, z],
          scale: [0.16 + r4 * 0.12, h, 0.16 + r4 * 0.12],
          color: "#3d2f22",
        });
        canopies.push({
          key,
          position: [x, h + 0.6 + r4, z],
          scale: [1.6 + r3 * 1.9, 1.1 + r4 * 1.1, 1.6 + r3 * 1.9],
          rotation: [r1 * 3, r2 * 3, r3 * 0.4],
          color: GREENS[i % GREENS.length],
        });
      } else if (s === 1) {
        // Village: low huts with pitched roofs, a few remaining trees.
        if (r3 > 0.34) {
          const w = 1.9 + r4 * 1.5;
          const h = 1.3 + r4 * 0.9;
          blocks.push({
            key,
            position: [x, h / 2, z],
            scale: [w, h, w * 0.85],
            color: MUD[i % MUD.length],
          });
          cones.push({
            key: `r${key}`,
            position: [x, h + 0.55, z],
            scale: [w * 0.95, 1.1 + r3 * 0.5, w * 0.95],
            color: "#6b4a2c",
          });
        } else {
          const h = 2.6 + r3 * 2.4;
          trunks.push({
            key,
            position: [x, h / 2, z],
            scale: [0.15, h, 0.15],
            color: "#4a3626",
          });
          canopies.push({
            key,
            position: [x, h + 0.5, z],
            scale: [1.3 + r4, 0.9 + r4 * 0.6, 1.3 + r4],
            rotation: [r1 * 2, r2 * 2, 0],
            color: GREENS[(i + 1) % GREENS.length],
          });
        }
      } else {
        // Town -> city -> valley: the same block, taller and cleaner as
        // the walk goes on.
        const palette = s === 2 ? STONE : s === 3 ? COOL : VALLEY;
        const tallness = s === 2 ? 1 : s === 3 ? 2.15 : 0.72;
        const w = (s === 4 ? 3.6 : 2.2) + r4 * 2.2;
        const h = (2.4 + r3 * 5.4) * tallness;

        blocks.push({
          key,
          position: [x, h / 2, z],
          scale: [w, h, w * 0.8],
          color: palette[i % palette.length],
        });

        // A lit band so the massing reads as architecture, not crates.
        glass.push({
          key: `w${key}`,
          position: [x, h * (0.55 + r1 * 0.25), z + w * 0.41],
          scale: [w * 0.82, h * (s === 4 ? 0.34 : 0.16), 0.08],
          color: s === 4 ? "#dff0ff" : "#b9c6de",
        });

        if (s === 4 && r3 > 0.55) {
          // Valley palms.
          const ph = 3.2 + r4 * 2;
          trunks.push({
            key: `p${key}`,
            position: [x + 2.4, ph / 2, z + 1.6],
            scale: [0.13, ph, 0.13],
            color: "#7a6a52",
          });
          cones.push({
            key: `pc${key}`,
            position: [x + 2.4, ph + 0.35, z + 1.6],
            scale: [1.5, 0.8, 1.5],
            color: "#4f8f52",
          });
        }
      }
    }
  });

  return { trunks, canopies, blocks, cones, glass, ground };
}

/* ------------------------------------------------------------------
   Sky, fog and ground tint all move with the stage.
------------------------------------------------------------------ */

const skyVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const skyFragment = /* glsl */ `
  uniform vec3 uTop;
  uniform vec3 uBottom;
  varying vec2 vUv;
  void main() {
    gl_FragColor = vec4(mix(uBottom, uTop, pow(vUv.y, 0.85)), 1.0);
  }
`;

function Sky() {
  const mesh = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  const uniforms = useMemo(
    () => ({
      uTop: { value: new THREE.Color(STAGES[0].sky[0]) },
      uBottom: { value: new THREE.Color(STAGES[0].sky[1]) },
    }),
    [],
  );

  const a = useMemo(() => new THREE.Color(), []);
  const b = useMemo(() => new THREE.Color(), []);

  useFrame(({ scene }) => {
    const t = stageAt(journey.progress);
    const i = Math.min(Math.floor(t), STAGES.length - 2);
    const f = Math.min(Math.max(t - i, 0), 1);
    const from = STAGES[i];
    const to = STAGES[i + 1] ?? STAGES[i];

    a.set(from.sky[0]).lerp(b.set(to.sky[0]), f);
    (uniforms.uTop.value as THREE.Color).copy(a);
    a.set(from.sky[1]).lerp(b.set(to.sky[1]), f);
    (uniforms.uBottom.value as THREE.Color).copy(a);

    a.set(from.fog).lerp(b.set(to.fog), f);
    if (scene.fog) (scene.fog as THREE.Fog).color.copy(a);

    // The sky rides with the camera so it can never be walked past.
    if (mesh.current) {
      mesh.current.position.x = camera.position.x;
      mesh.current.position.z = -60;
      mesh.current.position.y = 14;
    }
  });

  return (
    <mesh ref={mesh} renderOrder={-1}>
      <planeGeometry args={[260, 90]} />
      <shaderMaterial
        vertexShader={skyVertex}
        fragmentShader={skyFragment}
        uniforms={uniforms}
        depthWrite={false}
        fog={false}
      />
    </mesh>
  );
}

/** Soft blob under the walker — cheaper and calmer than a shadow map. */
function Contact() {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (mesh.current) mesh.current.position.x = walkerX();
  });
  return (
    <mesh ref={mesh} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
      <circleGeometry args={[0.42, 24]} />
      <meshBasicMaterial color="#000000" transparent opacity={0.16} />
    </mesh>
  );
}

function Scenery({ world }: { world: World }) {
  return (
    <>
      <Instances limit={world.ground.length} range={world.ground.length}>
        <boxGeometry />
        <meshStandardMaterial roughness={1} />
        {world.ground.map((it) => (
          <Instance
            key={it.key}
            position={it.position}
            scale={it.scale}
            color={it.color}
          />
        ))}
      </Instances>

      <Instances limit={Math.max(world.trunks.length, 1)}>
        <cylinderGeometry args={[0.5, 0.62, 1, 7]} />
        <meshStandardMaterial roughness={0.95} />
        {world.trunks.map((it) => (
          <Instance
            key={it.key}
            position={it.position}
            scale={it.scale}
            color={it.color}
          />
        ))}
      </Instances>

      <Instances limit={Math.max(world.canopies.length, 1)}>
        <icosahedronGeometry args={[0.62, 1]} />
        <meshStandardMaterial roughness={0.9} flatShading />
        {world.canopies.map((it) => (
          <Instance
            key={it.key}
            position={it.position}
            scale={it.scale}
            rotation={it.rotation}
            color={it.color}
          />
        ))}
      </Instances>

      <Instances limit={Math.max(world.blocks.length, 1)}>
        <boxGeometry />
        <meshStandardMaterial roughness={0.86} />
        {world.blocks.map((it) => (
          <Instance
            key={it.key}
            position={it.position}
            scale={it.scale}
            color={it.color}
          />
        ))}
      </Instances>

      <Instances limit={Math.max(world.cones.length, 1)}>
        <coneGeometry args={[0.62, 1, 7]} />
        <meshStandardMaterial roughness={0.9} flatShading />
        {world.cones.map((it) => (
          <Instance
            key={it.key}
            position={it.position}
            scale={it.scale}
            color={it.color}
          />
        ))}
      </Instances>

      <Instances limit={Math.max(world.glass.length, 1)}>
        <boxGeometry />
        <meshStandardMaterial roughness={0.25} metalness={0.1} />
        {world.glass.map((it) => (
          <Instance
            key={it.key}
            position={it.position}
            scale={it.scale}
            color={it.color}
          />
        ))}
      </Instances>
    </>
  );
}

function Rig() {
  useFrame((state, delta) => {
    const x = walkerX();
    const cam = state.camera;
    const k = 1 - Math.pow(0.0001, delta);
    // Follows a step behind and slightly above, leaving road ahead of him.
    cam.position.x = lerp(cam.position.x, x - 1.1 + pointer.ex * 0.35, k);
    cam.position.y = lerp(cam.position.y, 2.3 + pointer.ey * 0.25, k);
    cam.position.z = lerp(cam.position.z, 9.2, k);
    cam.lookAt(x + 2.2, 1.15, 0);
  });
  return null;
}

export default function JourneyScene({
  onContextLost,
}: {
  onContextLost?: () => void;
}) {
  const tier = useDeviceTier();

  const density = tier === "low" ? 16 : tier === "mid" ? 26 : 36;
  const world = useMemo(() => buildWorld(density), [density]);

  return (
    <Canvas
      camera={{ position: [0, 2.3, 9.2], fov: 42 }}
      dpr={[1, tier === "low" ? 1.2 : 1.65]}
      gl={{ antialias: tier !== "low", powerPreference: "high-performance" }}
      onCreated={({ scene, gl }) => {
        scene.fog = new THREE.Fog(STAGES[0].fog, 22, 78);
        bindContextLoss(gl.domElement, onContextLost);
      }}
    >
      <Sky />

      <hemisphereLight args={["#ffffff", "#6b6a5a", 1.5]} />
      <directionalLight position={[12, 18, 10]} intensity={1.5} />
      <directionalLight position={[-8, 6, -6]} intensity={0.35} color="#9fb4d8" />

      <Scenery world={world} />

      <Walker />
      <Contact />

      <Rig />
    </Canvas>
  );
}
