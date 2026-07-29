"use client";

import {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import { Environment, Lightformer, MeshTransmissionMaterial } from "@react-three/drei";
import {
  CuboidCollider,
  Physics,
  RigidBody,
  type RapierRigidBody,
} from "@react-three/rapier";
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
   Typesetting

   The headline is laid out in CSS pixels exactly as before, but each
   glyph becomes its own texture so it can be an independent physics
   body. The DOM keeps a real <h1> for search engines and screen readers.
------------------------------------------------------------------ */

type Glyph = {
  id: string;
  canvas: HTMLCanvasElement;
  /** centre position and size, in CSS pixels */
  xPx: number;
  yPx: number;
  wPx: number;
  hPx: number;
};

function font(px: number) {
  return `500 ${px}px "Archivo Variable", system-ui, sans-serif`;
}

/** One glyph rendered to a transparent canvas, sized to its own ink. */
function glyphCanvas(char: string, fontPx: number, color: string) {
  const probe = document.createElement("canvas").getContext("2d");
  if (!probe) return null;
  probe.font = font(fontPx);
  const advance = probe.measureText(char).width;

  const pad = fontPx * 0.14;
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(2, Math.ceil(advance + pad * 2));
  canvas.height = Math.max(2, Math.ceil(fontPx * 1.15 + pad * 2));

  // Sizing a canvas resets its context, so the font has to be set again.
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  ctx.font = font(fontPx);
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(char, canvas.width / 2, canvas.height / 2);

  return { canvas, advance };
}

function layoutHeadline(width: number, height: number): Glyph[] {
  const probe = document.createElement("canvas").getContext("2d");
  if (!probe) return [];

  const target = width * 0.94;
  const measure = (text: string, size: number) => {
    probe.font = font(size);
    return probe.measureText(text).width;
  };

  // Each line fills the width, then the whole slab is scaled to a height
  // budget — filling the width alone overflows on a wide screen.
  const sized = heroLines.map((line) => {
    const p = 200;
    const size = p * (target / measure(line.text, p));
    return { ...line, size, lineHeight: size * 0.8 };
  });

  const raw = sized.reduce((sum, l) => sum + l.lineHeight, 0);
  const maxHeight = height * 0.72;
  if (raw > maxHeight) {
    const k = maxHeight / raw;
    for (const line of sized) {
      line.size *= k;
      line.lineHeight *= k;
    }
  }

  const total = sized.reduce((sum, l) => sum + l.lineHeight, 0);
  let y = height * 0.46 - total / 2;

  const glyphs: Glyph[] = [];

  sized.forEach((line, lineIndex) => {
    const lineWidth = measure(line.text, line.size);
    let x = (width - lineWidth) / 2;
    const centreY = y + line.lineHeight / 2;

    Array.from(line.text).forEach((char, charIndex) => {
      probe.font = font(line.size);
      const advance = probe.measureText(char).width;

      if (char.trim()) {
        const drawn = glyphCanvas(char, line.size, line.accent ? BLUE : INK);
        if (drawn) {
          glyphs.push({
            id: `${lineIndex}-${charIndex}`,
            canvas: drawn.canvas,
            xPx: x + advance / 2,
            yPx: centreY,
            wPx: drawn.canvas.width,
            hPx: drawn.canvas.height,
          });
        }
      }
      x += advance;
    });

    y += line.lineHeight;
  });

  return glyphs;
}

/* ------------------------------------------------------------------
   A letter

   Sits fixed in its typeset position until something hits it, then
   becomes a free body. Reset tweens it home and pins it again.
------------------------------------------------------------------ */

type Placed = Glyph & { x: number; y: number; w: number; h: number };

function Letter({
  glyph,
  resetToken,
  intro,
}: {
  glyph: Placed;
  resetToken: number;
  intro: boolean;
}) {
  const body = useRef<RapierRigidBody>(null);
  const mesh = useRef<THREE.Mesh>(null);
  const loose = useRef(false);
  const dragging = useRef(false);

  const { camera } = useThree();
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const ray = useMemo(() => new THREE.Raycaster(), []);
  const point = useRef(new THREE.Vector3());
  const previous = useRef(new THREE.Vector3());
  const velocity = useRef(new THREE.Vector3());

  const texture = useMemo(() => {
    const t = new THREE.CanvasTexture(glyph.canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    t.minFilter = THREE.LinearFilter;
    t.generateMipmaps = false;
    t.anisotropy = 4;
    return t;
  }, [glyph.canvas]);

  useEffect(() => () => texture.dispose(), [texture]);

  /** Anything that moves this letter also un-pins it. */
  const wake = useCallback(() => {
    const b = body.current;
    if (!b || loose.current) return;
    loose.current = true;
    b.setBodyType(0, true); // Dynamic
  }, []);

  // Intro: the glyph rises into place. The body stays parked at home —
  // only the mesh inside it animates, so physics never sees the reveal.
  useEffect(() => {
    const m = mesh.current;
    if (!m) return;
    if (!intro) {
      m.position.set(0, 0, 0);
      (m.material as THREE.Material).opacity = 1;
      return;
    }
    const material = m.material as THREE.Material;
    const delay = 0.25 + glyph.xPx * 0.00035 + Number(glyph.id.split("-")[0]) * 0.12;

    const tl = gsap.timeline({ delay });
    tl.fromTo(
      m.position,
      { y: -glyph.h * 1.1 },
      { y: 0, duration: 1.3, ease: "expo.out" },
      0,
    ).fromTo(
      material,
      { opacity: 0 },
      { opacity: 1, duration: 0.7, ease: "power2.out" },
      0,
    );

    return () => {
      tl.kill();
    };
  }, [intro, glyph]);

  // Reset: fly home, then pin again so the headline reads cleanly.
  useEffect(() => {
    if (resetToken === 0) return;
    const b = body.current;
    if (!b) return;

    b.setBodyType(2, true); // Kinematic while we drive it back
    const from = b.translation();
    const proxy = { x: from.x, y: from.y, z: from.z };

    const tween = gsap.to(proxy, {
      x: glyph.x,
      y: glyph.y,
      z: 0,
      duration: 1.1,
      ease: "expo.inOut",
      onUpdate: () => {
        b.setNextKinematicTranslation(proxy);
      },
      onComplete: () => {
        b.setTranslation({ x: glyph.x, y: glyph.y, z: 0 }, true);
        b.setRotation({ x: 0, y: 0, z: 0, w: 1 }, true);
        b.setBodyType(1, true); // Fixed
        loose.current = false;
      },
    });

    return () => {
      tween.kill();
    };
  }, [resetToken, glyph.x, glyph.y]);

  useFrame((state) => {
    if (!dragging.current || !body.current) return;
    ray.setFromCamera(state.pointer, camera);
    if (!ray.ray.intersectPlane(plane, point.current)) return;
    velocity.current.subVectors(point.current, previous.current);
    previous.current.copy(point.current);
    body.current.setNextKinematicTranslation({
      x: point.current.x,
      y: point.current.y,
      z: 0,
    });
  });

  const release = useCallback(() => {
    const b = body.current;
    if (!b) return;
    dragging.current = false;
    loose.current = true;
    b.setBodyType(0, true);
    b.setLinvel(
      { x: velocity.current.x * 42, y: velocity.current.y * 42, z: 0 },
      true,
    );
    b.setAngvel({ x: 0, y: 0, z: -velocity.current.x * 9 }, true);
  }, []);

  useEffect(() => {
    if (!dragging.current) return;
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    return () => {
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
    };
  });

  const grab = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const b = body.current;
    if (!b) return;
    const t = b.translation();
    previous.current.set(t.x, t.y, 0);
    velocity.current.set(0, 0, 0);
    b.setBodyType(2, true);
    dragging.current = true;
  };

  return (
    <RigidBody
      ref={body}
      type="fixed"
      position={[glyph.x, glyph.y, 0]}
      colliders={false}
      linearDamping={0.55}
      angularDamping={0.7}
      restitution={0.45}
      friction={0.2}
      onCollisionEnter={wake}
    >
      <CuboidCollider args={[glyph.w / 2, glyph.h / 2, 0.14]} />
      <mesh ref={mesh} onPointerDown={grab}>
        <planeGeometry args={[glyph.w, glyph.h]} />
        <meshBasicMaterial
          map={texture}
          transparent
          opacity={0}
          toneMapped={false}
          depthWrite={false}
        />
      </mesh>
    </RigidBody>
  );
}

/* ------------------------------------------------------------------
   The marble — the thing you throw at the words.
------------------------------------------------------------------ */

function Marble({
  tier,
  homeX,
  radius,
  resetToken,
}: {
  tier: "low" | "mid" | "high";
  homeX: number;
  radius: number;
  resetToken: number;
}) {
  const body = useRef<RapierRigidBody>(null);
  const dragging = useRef(false);
  const { camera, viewport } = useThree();

  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), []);
  const ray = useMemo(() => new THREE.Raycaster(), []);
  const point = useRef(new THREE.Vector3());
  const previous = useRef(new THREE.Vector3());
  const velocity = useRef(new THREE.Vector3());

  const detail = tier === "low" ? 8 : tier === "mid" ? 16 : 32;
  const samples = tier === "low" ? 3 : tier === "mid" ? 6 : 10;
  const resolution = tier === "low" ? 256 : tier === "mid" ? 512 : 1024;

  useEffect(() => {
    if (resetToken === 0) return;
    const b = body.current;
    if (!b) return;
    b.setLinvel({ x: 0, y: 0, z: 0 }, true);
    b.setAngvel({ x: 0, y: 0, z: 0 }, true);
    b.setTranslation({ x: homeX, y: 0, z: 0 }, true);
  }, [resetToken, homeX]);

  useFrame((state) => {
    const b = body.current;
    if (!b) return;

    if (dragging.current) {
      ray.setFromCamera(state.pointer, camera);
      if (!ray.ray.intersectPlane(plane, point.current)) return;
      velocity.current.subVectors(point.current, previous.current);
      previous.current.copy(point.current);
      b.setNextKinematicTranslation({
        x: point.current.x,
        y: point.current.y,
        z: 0,
      });
      return;
    }

    // Left alone it drifts after the cursor across the full frame, so it
    // keeps passing over letterforms — a lens on blank paper is just a grey
    // ball. Weak enough that it reads as drifting, not chasing.
    const t = b.translation();
    const targetX = pointer.ex * viewport.width * 0.32;
    const targetY = pointer.ey * viewport.height * 0.26;
    b.applyImpulse(
      {
        x: (targetX - t.x) * 0.0022,
        y: (targetY - t.y) * 0.0022,
        z: 0,
      },
      true,
    );
  });

  const release = useCallback(() => {
    const b = body.current;
    if (!b) return;
    dragging.current = false;
    b.setBodyType(0, true);
    b.setLinvel(
      { x: velocity.current.x * 58, y: velocity.current.y * 58, z: 0 },
      true,
    );
  }, []);

  useEffect(() => {
    if (!dragging.current) return;
    window.addEventListener("pointerup", release);
    window.addEventListener("pointercancel", release);
    return () => {
      window.removeEventListener("pointerup", release);
      window.removeEventListener("pointercancel", release);
    };
  });

  const grab = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const b = body.current;
    if (!b) return;
    const t = b.translation();
    previous.current.set(t.x, t.y, 0);
    velocity.current.set(0, 0, 0);
    b.setBodyType(2, true);
    dragging.current = true;
  };

  return (
    <RigidBody
      ref={body}
      position={[homeX, 0, 0]}
      colliders="ball"
      restitution={0.6}
      friction={0.1}
      linearDamping={0.5}
      angularDamping={0.6}
      // Heavier than the letters, so a throw actually scatters them.
      density={6}
    >
      <mesh onPointerDown={grab}>
        <icosahedronGeometry args={[radius, detail]} />
        <MeshTransmissionMaterial
          samples={samples}
          resolution={resolution}
          transmission={1}
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
    </RigidBody>
  );
}

/** Keeps everything on stage. */
function Bounds() {
  const { viewport } = useThree();
  const w = viewport.width / 2;
  const h = viewport.height / 2;

  return (
    <RigidBody type="fixed" colliders={false} restitution={0.5}>
      <CuboidCollider args={[w, 0.5, 2]} position={[0, -h - 0.5, 0]} />
      <CuboidCollider args={[w, 0.5, 2]} position={[0, h + 0.5, 0]} />
      <CuboidCollider args={[0.5, h * 2, 2]} position={[-w - 0.5, 0, 0]} />
      <CuboidCollider args={[0.5, h * 2, 2]} position={[w + 0.5, 0, 0]} />
      {/* A shallow slab in z so nothing can drift out of focus. */}
      <CuboidCollider args={[w, h, 0.5]} position={[0, 0, -0.9]} />
      <CuboidCollider args={[w, h, 0.5]} position={[0, 0, 0.9]} />
    </RigidBody>
  );
}

function Stage({ resetToken, tier }: { resetToken: number; tier: "low" | "mid" | "high" }) {
  const { size, viewport } = useThree();
  const [glyphs, setGlyphs] = useState<Glyph[]>([]);
  // Whether this mount owns the intro is knowable at first render — the
  // headline shouldn't replay its reveal every time you scroll back up.
  const [intro] = useState(() => heroScroll.revealed < 1);

  // Re-typeset on resize, and once webfonts have actually landed.
  useEffect(() => {
    let cancelled = false;
    const run = () => {
      if (cancelled) return;
      setGlyphs(layoutHeadline(size.width, size.height));
    };
    if (document.fonts?.status === "loaded") run();
    else document.fonts?.ready.then(run).catch(run);
    return () => {
      cancelled = true;
    };
  }, [size.width, size.height]);

  useEffect(() => {
    if (!intro) return;
    const id = window.setTimeout(() => {
      heroScroll.revealed = 1;
    }, 2600);
    return () => window.clearTimeout(id);
  }, [intro]);

  // CSS pixels -> world units.
  const scale = viewport.width / size.width;
  const placed = useMemo<Placed[]>(
    () =>
      glyphs.map((g) => ({
        ...g,
        x: (g.xPx - size.width / 2) * scale,
        y: (size.height / 2 - g.yPx) * scale,
        w: g.wPx * scale,
        h: g.hPx * scale,
      })),
    [glyphs, scale, size.width, size.height],
  );

  const radius = Math.min(viewport.width, viewport.height) * 0.13;
  const homeX = viewport.width * 0.34;

  return (
    <Suspense fallback={null}>
      {/* Zero gravity: knocked letters drift and spin instead of piling up
          at the bottom of the frame, which would wreck the composition. */}
      <Physics gravity={[0, 0, 0]} timeStep="vary">
        <Bounds />
        {placed.map((glyph) => (
          <Letter
            key={glyph.id}
            glyph={glyph}
            resetToken={resetToken}
            intro={intro}
          />
        ))}
        {placed.length > 0 && (
          <Marble
            tier={tier}
            homeX={homeX}
            radius={radius}
            resetToken={resetToken}
          />
        )}
      </Physics>
    </Suspense>
  );
}

function Rig() {
  useFrame((state, delta) => {
    const cam = state.camera;
    const p = heroScroll.progress;
    const k = 1 - Math.pow(0.004, delta);
    cam.position.x = lerp(cam.position.x, pointer.ex * 0.16, k);
    cam.position.y = lerp(cam.position.y, pointer.ey * 0.1 - p * 0.5, k);
    // Pulls back as the hero leaves, so the chapter recedes rather than cuts.
    cam.position.z = lerp(cam.position.z, 5 + p * 1.6, k);
    cam.lookAt(0, 0, 0);
  });
  return null;
}

export default function HeroScene({
  onReady,
  onContextLost,
  resetToken = 0,
}: {
  onReady?: () => void;
  onContextLost?: () => void;
  resetToken?: number;
}) {
  const tier = useDeviceTier();

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 35 }}
      dpr={[1, tier === "low" ? 1.25 : 1.75]}
      gl={{ antialias: tier !== "low", powerPreference: "high-performance" }}
      // The scene owns its background so the transmissive marble has
      // something real to sample.
      onCreated={({ scene, gl }) => {
        scene.background = new THREE.Color(PAPER);
        bindContextLoss(gl.domElement, onContextLost);
        onReady?.();
      }}
    >
      <ambientLight intensity={1.15} />
      <directionalLight position={[3, 4, 6]} intensity={1.5} />
      <directionalLight position={[-4, -2, 2]} intensity={0.45} color={BLUE} />

      <Stage resetToken={resetToken} tier={tier} />
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
