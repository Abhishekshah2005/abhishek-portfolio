"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial } from "@react-three/drei";
import * as THREE from "three";
import { gsap } from "@/lib/gsap";
import { pointer, lerp } from "@/lib/pointer";
import { heroScroll } from "@/lib/scene-store";
import { heroLines } from "@/lib/content";
import { useDeviceTier } from "@/lib/hooks";
import { bindContextLoss } from "@/lib/webgl";

const PAPER = "#f2efe9";
const INK = "#111014";
const BLUE = "#2b44ff";

/* ------------------------------------------------------------------
   The headline, rendered to a canvas texture so that WebGL — and
   therefore the glass — can actually refract it. The DOM keeps a real
   <h1> for search engines and screen readers.
------------------------------------------------------------------ */

type Drawn = { texture: THREE.CanvasTexture; edges: THREE.Vector4 };

function drawHeadline(width: number, height: number): Drawn | null {
  const canvas = document.createElement("canvas");
  // Cap the backing store: 2K across is plenty for type this large.
  const scale = Math.min(2048 / width, 2);
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);

  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  ctx.fillStyle = PAPER;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const target = canvas.width * 0.94;
  const measure = (text: string, size: number) => {
    ctx.font = `500 ${size}px "Archivo Variable", system-ui, sans-serif`;
    return ctx.measureText(text).width;
  };

  // Each line is scaled independently so all three flush to the same
  // width — the justified slab that makes this kind of type feel huge.
  const sized = heroLines.map((line) => {
    const probe = 200;
    const size = probe * (target / measure(line.text, probe));
    return { ...line, size, lineHeight: size * 0.8 };
  });

  // Filling the width can easily overflow the height on a wide screen, so
  // the whole slab is then scaled to fit — lines stay flush with each
  // other, just smaller.
  const rawHeight = sized.reduce((sum, l) => sum + l.lineHeight, 0);
  const maxHeight = canvas.height * 0.72;
  if (rawHeight > maxHeight) {
    const k = maxHeight / rawHeight;
    for (const line of sized) {
      line.size *= k;
      line.lineHeight *= k;
    }
  }

  const totalHeight = sized.reduce((sum, l) => sum + l.lineHeight, 0);
  // Sits slightly above centre, leaving the lower band clear for the
  // supporting copy and the CTA.
  let y = canvas.height * 0.46 - totalHeight / 2;

  // v-coordinates (1 = top) of each line's band, for the reveal shader.
  const edges: number[] = [1 - y / canvas.height];

  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  for (const line of sized) {
    ctx.font = `500 ${line.size}px "Archivo Variable", system-ui, sans-serif`;
    ctx.fillStyle = line.accent ? BLUE : INK;
    ctx.fillText(line.text, canvas.width / 2, y + line.lineHeight / 2);
    y += line.lineHeight;
    edges.push(1 - y / canvas.height);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.minFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  texture.anisotropy = 4;

  return {
    texture,
    edges: new THREE.Vector4(edges[0], edges[1], edges[2], edges[3]),
  };
}

const headlineVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Per-line mask reveal: each line is clipped to its own band and its content
 * slides up into place. Doing it in the shader (rather than with three DOM
 * elements) is what lets the glass refract mid-reveal.
 */
const headlineFragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec3 uReveal;
  uniform vec4 uEdges;
  uniform vec2 uPointer;
  uniform vec3 uPaper;
  uniform float uDrift;
  varying vec2 vUv;

  // One line: clipped to its own band, its content sliding up into place.
  vec3 band(vec2 uv, float top, float bottom, float reveal, vec3 base) {
    float h = top - bottom;
    float sv = uv.y - (1.0 - reveal) * h;
    if (uv.y <= top && uv.y >= bottom && sv <= top && sv >= bottom) {
      return texture2D(uMap, vec2(uv.x, sv)).rgb;
    }
    return base;
  }

  void main() {
    vec2 uv = vec2(vUv.x, vUv.y + uDrift);
    vec3 col = uPaper;

    col = band(uv, uEdges.x, uEdges.y, uReveal.x, col);
    col = band(uv, uEdges.y, uEdges.z, uReveal.y, col);
    col = band(uv, uEdges.z, uEdges.w, uReveal.z, col);

    // The cursor lifts the paper very slightly — a light in the room,
    // not a spotlight.
    float d = distance(vUv, uPointer * 0.5 + 0.5);
    col += (1.0 - smoothstep(0.0, 0.42, d)) * 0.035;

    gl_FragColor = vec4(col, 1.0);
  }
`;

function Headline() {
  const { viewport, size } = useThree();
  const [drawn, setDrawn] = useState<Drawn | null>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  // Redraw whenever the viewport changes shape, and once webfonts land.
  useEffect(() => {
    let cancelled = false;
    const render = () => {
      if (cancelled) return;
      const next = drawHeadline(size.width, size.height);
      if (next) {
        setDrawn((prev) => {
          prev?.texture.dispose();
          return next;
        });
      }
    };

    if (document.fonts?.status === "loaded") render();
    else document.fonts?.ready.then(render).catch(render);

    return () => {
      cancelled = true;
    };
  }, [size.width, size.height]);

  useEffect(() => () => drawn?.texture.dispose(), [drawn]);

  const uniforms = useMemo(
    () => ({
      uMap: { value: null as THREE.Texture | null },
      uReveal: { value: new THREE.Vector3(0, 0, 0) },
      uEdges: { value: new THREE.Vector4(1, 0.66, 0.33, 0) },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPaper: { value: new THREE.Color(PAPER) },
      uDrift: { value: 0 },
    }),
    [],
  );

  // Play the reveal once the texture exists — never before, or the first
  // line would flash in un-typeset.
  useEffect(() => {
    if (!drawn || !matRef.current) return;
    const u = matRef.current.uniforms;
    u.uMap.value = drawn.texture;
    u.uEdges.value = drawn.edges;

    const target = u.uReveal.value as THREE.Vector3;
    if (heroScroll.revealed >= 1) {
      target.set(1, 1, 1);
      return;
    }

    const tl = gsap.timeline({ delay: 0.15 });
    tl.to(target, { x: 1, duration: 1.5, ease: "expo.out" })
      .to(target, { y: 1, duration: 1.5, ease: "expo.out" }, "-=1.25")
      .to(target, { z: 1, duration: 1.5, ease: "expo.out" }, "-=1.25")
      .call(() => {
        heroScroll.revealed = 1;
      });

    return () => {
      tl.kill();
    };
  }, [drawn]);

  useFrame(() => {
    const mat = matRef.current;
    if (!mat) return;
    const u = mat.uniforms;
    (u.uPointer.value as THREE.Vector2).set(pointer.ex, pointer.ey);
    // The whole slab drifts up as the hero leaves — parallax against the glass.
    u.uDrift.value = lerp(u.uDrift.value as number, heroScroll.progress * 0.22, 0.1);
  });

  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={headlineVertex}
        fragmentShader={headlineFragment}
        uniforms={uniforms}
      />
    </mesh>
  );
}

/* ------------------------------------------------------------------
   The glass. A slowly-morphing blob of transmissive material that
   follows the cursor and swells as the hero scrolls away.
------------------------------------------------------------------ */

function Glass({ tier }: { tier: "low" | "mid" | "high" }) {
  const ref = useRef<THREE.Mesh>(null);
  const { viewport } = useThree();

  const detail = tier === "low" ? 8 : tier === "mid" ? 16 : 32;
  const samples = tier === "low" ? 3 : tier === "mid" ? 6 : 10;
  const resolution = tier === "low" ? 256 : tier === "mid" ? 512 : 1024;

  // Base radius keyed to the smaller viewport dimension so the lens reads
  // the same on a laptop and an ultrawide.
  const radius = Math.min(viewport.width, viewport.height) * 0.155;

  // Idle home is off to the right, clear of the supporting copy in the
  // lower left. The cursor pulls it around from there.
  const homeX = viewport.width * 0.17;
  const homeY = viewport.height * 0.02;

  useFrame((state, delta) => {
    const mesh = ref.current;
    if (!mesh) return;

    const t = state.clock.elapsedTime;
    const p = heroScroll.progress;
    const k = 1 - Math.pow(0.001, delta);

    const targetX =
      homeX + pointer.ex * viewport.width * 0.17 + Math.sin(t * 0.24) * 0.22;
    const targetY =
      homeY + pointer.ey * viewport.height * 0.14 + Math.cos(t * 0.19) * 0.18;

    mesh.position.x = lerp(mesh.position.x, targetX, k);
    mesh.position.y = lerp(
      mesh.position.y,
      targetY - p * viewport.height * 0.32,
      k,
    );
    mesh.position.z = 1.1 + p * 1.4;

    // Never let the lens leave the frame — a half-cropped sphere just
    // reads as a rendering bug. The visible frame shrinks as the mesh moves
    // toward the camera, so the bounds have to be taken at *its* depth,
    // not at z = 0.
    const growth = 1 + p * 0.85;
    const margin = radius * growth * 1.15;
    const depth = Math.max(state.camera.position.z - mesh.position.z, 0.001);
    const shrink = depth / state.camera.position.z;
    const limitX = Math.max((viewport.width * shrink) / 2 - margin, 0);
    const limitY = Math.max((viewport.height * shrink) / 2 - margin, 0);
    mesh.position.x = Math.min(Math.max(mesh.position.x, -limitX), limitX);
    mesh.position.y = Math.min(Math.max(mesh.position.y, -limitY), limitY);

    mesh.rotation.x = t * 0.12 + pointer.ey * 0.3;
    mesh.rotation.y = t * 0.16 + pointer.ex * 0.4;

    // Swells and drifts back as you scroll past — the perspective change
    // that makes the first scroll feel like it did something.
    const scale = growth;
    // Uneven breathing is what separates "liquid" from "billiard ball".
    mesh.scale.set(
      scale * (1 + Math.sin(t * 0.63) * 0.035),
      scale * (1 + Math.sin(t * 0.47 + 1.7) * 0.045),
      scale * (1 + Math.cos(t * 0.55) * 0.03),
    );
  });

  return (
    <mesh ref={ref} position={[0, 0, 1.1]}>
      <icosahedronGeometry args={[radius, detail]} />
      <MeshTransmissionMaterial
        samples={samples}
        resolution={resolution}
        transmission={1}
        // Thin and clear: a lens that magnifies the type behind it rather
        // than a frosted marble that hides it.
        thickness={radius * 0.55}
        roughness={0}
        ior={1.5}
        chromaticAberration={0.08}
        anisotropicBlur={0}
        distortion={0.12}
        distortionScale={0.2}
        temporalDistortion={0.04}
        backside={tier === "high"}
        backsideThickness={radius * 0.25}
        color="#ffffff"
        attenuationColor="#ffffff"
        attenuationDistance={12}
      />
    </mesh>
  );
}

/** Small solid accents that give the glass something to bend besides type. */
function Shards({ tier }: { tier: "low" | "mid" | "high" }) {
  const group = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const count = tier === "low" ? 3 : 6;

  const items = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        position: [
          (Math.sin(i * 2.7) * 0.42) * viewport.width,
          (Math.cos(i * 1.9) * 0.36) * viewport.height,
          -0.6 - (i % 3) * 0.4,
        ] as [number, number, number],
        scale: 0.05 + (i % 3) * 0.022,
        color: i % 3 === 0 ? BLUE : i % 3 === 1 ? "#ff5a2b" : "#7b5cff",
        speed: 0.2 + (i % 4) * 0.08,
      })),
    [count, viewport.width, viewport.height],
  );

  useFrame((state) => {
    const g = group.current;
    if (!g) return;
    const t = state.clock.elapsedTime;
    g.children.forEach((child, i) => {
      child.rotation.x = t * items[i].speed;
      child.rotation.z = t * items[i].speed * 0.6;
      child.position.y = items[i].position[1] + Math.sin(t * 0.5 + i) * 0.12;
    });
    g.position.y = heroScroll.progress * viewport.height * 0.5;
  });

  return (
    <group ref={group}>
      {items.map((item, i) => (
        <mesh key={i} position={item.position} scale={item.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={item.color}
            roughness={0.35}
            metalness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

function Rig() {
  useFrame((state, delta) => {
    // A whisper of parallax on the camera so the whole frame feels held.
    const cam = state.camera;
    const k = 1 - Math.pow(0.004, delta);
    cam.position.x = lerp(cam.position.x, pointer.ex * 0.18, k);
    cam.position.y = lerp(cam.position.y, pointer.ey * 0.12, k);
    cam.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene({
  onReady,
  onContextLost,
}: {
  onReady?: () => void;
  onContextLost?: () => void;
}) {
  const tier = useDeviceTier();

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 35 }}
      dpr={[1, tier === "low" ? 1.25 : 1.75]}
      gl={{ antialias: tier !== "low", powerPreference: "high-performance" }}
      // The scene owns its background so the transmissive material has
      // something real to sample.
      onCreated={({ scene, gl }) => {
        scene.background = new THREE.Color(PAPER);
        bindContextLoss(gl.domElement, onContextLost);
        onReady?.();
      }}
    >
      <ambientLight intensity={1.1} />
      <directionalLight position={[3, 4, 6]} intensity={1.6} />
      <directionalLight position={[-4, -2, 2]} intensity={0.5} color={BLUE} />

      <Headline />
      <Shards tier={tier} />
      <Glass tier={tier} />
      <Rig />

      {/* Reflections come from lightformers in-scene — no HDRI fetch. */}
      <Environment resolution={128} frames={1}>
        <Lightformer
          intensity={2.2}
          position={[0, 3, 2]}
          scale={[8, 3, 1]}
          color="#ffffff"
        />
        <Lightformer
          intensity={1.4}
          position={[-3, -1, 1]}
          scale={[4, 4, 1]}
          color="#cdd6ff"
        />
        <Lightformer
          intensity={1.1}
          position={[3, -2, 1]}
          scale={[4, 4, 1]}
          color="#ffd9c7"
        />
      </Environment>
    </Canvas>
  );
}
