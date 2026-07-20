# Interactive Portfolio Engine

A premium, scroll-driven, 3D portfolio **experience engine** — built like a small game, not a website. This repository currently contains **only the foundation and engine** (Phase 1). There are no pages, sections, or placeholder UI yet.

Stack: **Next.js 15 (App Router) · React 19 · TypeScript (strict) · Three.js + React Three Fiber · Lenis · GSAP + ScrollTrigger · Zustand**.

## Core principles

- **One RAF, one clock.** A single `Ticker` (driven by GSAP's ticker in the browser) advances Lenis, GSAP, Three and every subsystem. No duplicate animation loops.
- **Manager architecture.** Cross-cutting systems are decoupled managers that talk only through a typed event bus — the dependency graph is an acyclic tree.
- **Reusable, typed, production-ready.** Strict TypeScript, barrel exports, path aliases, leak-free cleanup everywhere.
- **Self-tuning.** A performance governor picks a quality tier and scales DPR, particles and post-processing to keep the frame budget.

## Architecture

```
src/
  config/        Central engine configuration (single source of tunables)
  types/         Shared types + the canonical engine event map
  state/         Zustand vanilla store (framework-agnostic global state)
  engine/
    core/        EventEmitter · Ticker · RAF drivers · Manager base · EngineContext
    managers/    Scene · Camera · Scroll · Animation · Asset · Loading · Interaction
                 Cursor · Audio · Performance · Timeline · State
    physics/     Framerate-independent Spring integrator
    Engine.ts    Orchestrator: constructs, boots and disposes every manager
  animation/
    core/        Easings · dependency-free text splitter
    presets/     Reveal / transition GSAP factories (reduced-motion aware)
    hooks/       useReveal · useTextReveal · useStagger · useMagnetic · useTilt
                 useParallax · useMarquee · useSpotlight · useCursorVariant
  three/
    EngineCanvas R3F stage wired into the single ticker (frameloop="never")
    hooks/       useRenderBridge · useEngineFrame
    cameras/     useEngineCamera (binds R3F camera to CameraManager)
    materials/   Gradient · Fresnel shader-material factories
    shaders/     Reusable GLSL chunks (simplex noise, fresnel, rotate2d)
    particles/   GPU particle field
    lights/      Studio three-point rig
    environments/Quality profiles per performance tier
    controls/    Orbit control presets
    loaders/     Cached useTexture / useModel
    models/      Generic <Model> loader
    scenes/      Scene contract only (no scenes built yet)
    utilities/   Math + disposal helpers
  hooks/         React bindings: useEngine · useEngineStore · useTick · useScroll · …
  providers/     EngineProvider (lifecycle + context)
  lib/           Small utilities
  app/           Next.js shell (empty page — engine mounts app-wide)
```

## The single loop

```
GSAP ticker (the only requestAnimationFrame)
   └─ Ticker  → prioritised subscribers (Input→Scroll→Physics→Animation→Camera→Render→PostRender)
        ├─ ScrollManager.raf(lenis)        (Scroll)
        ├─ CameraManager.update            (Camera)
        ├─ useTick / useEngineFrame / springs (Animation)
        └─ useRenderBridge → R3F advance   (Render)
Lenis 'scroll' ─→ ScrollTrigger.update
```

## Scripts

```bash
npm run dev        # dev server
npm run build      # production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Status

Phase 1 (this repo): engine foundation. Verified — `lint`, `typecheck` and `build` all pass with zero errors. Next phases mount scenes and portfolio sections on top of this engine.
