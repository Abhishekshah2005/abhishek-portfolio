'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useEngine } from '@/hooks/useEngine';
import { useEngineStore } from '@/hooks/useEngineStore';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useEngineFrame } from '@/three/hooks/useEngineFrame';
import { HERO_WAYPOINTS } from './heroConfig';

// Between Camera (40) and Render (50): base transform is set by useEngineCamera
// at 40; this adds intro + drift, then re-aims, before the render at 50.
const DRIFT_PRIORITY = 45;

/**
 * The Hero World camera. Registers the scroll-sampled waypoint path (base rail)
 * on the CameraManager, plays a cinematic fly-in as the boot dissolves, and
 * layers subtle spring-eased pointer parallax + breathing — expensive-feeling,
 * never shaky. Fly-in and drift are disabled under reduced motion.
 */
export function HeroCamera() {
  const engine = useEngine();
  const reduced = useReducedMotion();
  const bootComplete = useEngineStore((s) => s.bootComplete);
  const drift = useRef({ x: 0, y: 0 });
  const introT = useRef(1);

  useEffect(() => {
    engine.camera.setWaypoints(HERO_WAYPOINTS);
    engine.camera.setDamping(0.06);
    return () => engine.camera.setWaypoints([]);
  }, [engine]);

  // Fly-in when the boot dissolves.
  useEffect(() => {
    if (!bootComplete) return;
    if (reduced) {
      introT.current = 0;
      return;
    }
    const state = { v: 1 };
    introT.current = 1;
    const tween = gsap.to(state, {
      v: 0,
      duration: 2.4,
      ease: 'expo.out',
      onUpdate: () => {
        introT.current = state.v;
      },
    });
    return () => {
      tween.kill();
    };
  }, [bootComplete, reduced]);

  useEngineFrame((r3f, tick) => {
    const cam = r3f.camera;

    // Cinematic arrival: start pulled back + elevated, settle to the rail.
    const it = introT.current;
    if (it > 0.001) {
      cam.position.x += it * 3;
      cam.position.y += it * 3;
      cam.position.z += it * 7;
    }

    if (!reduced) {
      const { x, y } = engine.interaction.normalized;
      drift.current.x += (x * 0.5 - drift.current.x) * 0.04;
      drift.current.y += (y * 0.35 - drift.current.y) * 0.04;
      const breathe = Math.sin(tick.elapsed * 0.55) * 0.12;
      cam.position.x += drift.current.x;
      cam.position.y += drift.current.y + breathe;
    }

    cam.lookAt(engine.camera.target);
  }, DRIFT_PRIORITY);

  return null;
}
