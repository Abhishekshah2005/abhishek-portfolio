# ATLAS — MASTER IMPLEMENTATION BLUEPRINT
### Single source of truth for development · v1.0
**Binds:** Phase 1 (engine foundation) · Phase 2 (GDD/experience) · Art Bible (visual law) · Motion Philosophy.
**Rule of precedence:** Art Bible governs *look*; GDD governs *experience*; this document governs *build*. If they conflict, the conflict is a bug — resolve here.

---

## 0. RECONCILIATION — inconsistencies found & resolved

| # | Conflict across phases | Resolution (binding) |
|---|---|---|
| R1 | Phase 1 used plain CSS + system fonts; new brief adds **Tailwind v4 + shadcn/ui** | Adopt Tailwind v4 (CSS-first `@theme`) as the **single token source** for the DOM/HUD layer. Use shadcn/ui **only** for accessible primitives (Dialog, Popover, form, focus traps), **100% re-skinned** to the Art Bible — never stock shadcn look. |
| R2 | Fonts: Phase 1 system stack vs Art Bible "self-host grotesk/sans/mono" | **Self-host all three** via `next/font/local` (no build-time fetch). Wire as CSS vars → Tailwind theme. |
| R3 | Animation lib: Phase 1 = GSAP+custom; brief lists **Motion.dev** too | **GSAP is the single source of truth** for scroll/camera/timeline/reveals (already integrated on the one ticker). Motion.dev principles inform our hooks; `motion/react` is *permitted only* for isolated DOM enter/exit/layout of shadcn overlays — never for scroll/3D. One motion language enforced via preset hooks. |
| R4 | `EngineProvider` currently **gates all children** until boot → breaks SSR/SEO | Refactor: provider is **eager** (never blocks DOM). Semantic content renders SSR always; only the `<EngineCanvas>` layer is client-only (`dynamic ssr:false`). Engine-consuming DOM uses `useEngineOptional()` and no-ops until ready. |
| R5 | Cursor variants (`CursorManager`) vs GDD reticle states | Extend enum to the canonical set below (§18) and add a `descend` hint. |
| R6 | Repo is **not** a git repository; roadmap requires commits | M0 runs `git init`, commits the existing foundation as the baseline. |
| R7 | Web Atelier "horizontal scroll" vs global vertical Lenis | Implement as a **pinned horizontal ScrollTrigger track** inside one vertical level — do **not** flip Lenis orientation globally. |
| R8 | 7 disciplines vs pending real content | Foundry count is **data-driven**; if a discipline is thin, Foundries merge. Blocked on content (see §37). |

**Duplicated ideas merged:** cursor system (Phase-1 `CursorManager` + GDD reticle + Art Bible glow) → one spec (§18). Reveal/transition presets (Phase-1 `animation/presets` + GDD + 21st.dev seeds) → one Animation Inventory (§29). Quality/perf tiers (Phase-1 `QUALITY_PROFILES` + Art Bible depth) → one Performance Strategy (§23).

---

## 1. PROJECT OVERVIEW
An original, cinematic, scroll-driven 3D portfolio ("ATLAS") — the visitor pilots a descent down a vertical megastructure ("the Spine") while a companion object ("The Core") is fabricated from raw idea to shipped product. Positioning: *Abhishek engineers complete digital products (AI, SaaS, Mobile, Web, CRM, Automation, Interactive), not just websites.* Target: Awwwards SOTD quality, 60fps desktop / ≥30fps mobile, Lighthouse ≥95 on content, fully accessible via DOM-first + a Classic View. Feel: handcrafted, one studio, one language.

## 2. TECH STACK (final)
| Layer | Choice | Notes |
|---|---|---|
| Framework | **Next.js 15 App Router**, React 19 | Already in Phase 1 |
| Language | **TypeScript strict** (`verbatimModuleSyntax`) | Use `import type` |
| Styling | **Tailwind v4** (CSS-first `@theme`) + tokens | Single token source for DOM |
| UI primitives | **shadcn/ui** (Radix) — re-skinned only | Dialog/Popover/Form/VisuallyHidden/focus |
| 3D | **Three.js + R3F v9 + Drei** | `frameloop="never"` on engine ticker |
| Post-FX | `@react-three/postprocessing` | Bloom/DOF/aberration, tier-gated |
| Scroll | **Lenis** (Phase 1 `ScrollManager`) | One RAF |
| Animation | **GSAP + ScrollTrigger** (primary) | `motion/react` optional for shadcn overlays |
| Physics | Phase-1 `Spring` (default) · **Rapier** (lazy, secret Zero-G only) | tier-gated |
| State | **Zustand** vanilla (Phase-1 `engineStore`) | + `useStore` selectors |
| Fonts | `next/font/local` (3 families) | self-hosted |
| Analytics | Vercel Analytics + Speed Insights | privacy-friendly |
| Deploy | **Vercel** | edge, image opt (sharp) |
| Quality | ESLint, tsc, Playwright, Lighthouse CI | see §33 |

## 3. FOLDER STRUCTURE (extends Phase 1 — additions in **bold**)
```
src/
  app/
    layout.tsx                    # SSR shell, providers, fonts, metadata
    page.tsx                      # experience mount (canvas + DOM sections)
    (classic)/page.tsx            # ** Classic View (accessible fallback) **
    globals.css                   # ** Tailwind v4 entry + @theme tokens **
    opengraph-image.tsx sitemap.ts robots.ts  # ** SEO **
  engine/  core/ managers/ physics/            # Phase 1 (unchanged)
  three/   ...                                 # Phase 1 + new inventory (§30)
    **world/**  Spine, Rail, EnvironmentRig, PostFX
    **core-object/**  TheCore + fabrication states
    **levels/**  one folder per level (R3F subtree only, no copy)
  animation/  core/ presets/ hooks/            # Phase 1 (unchanged)
  hooks/                                        # Phase 1 + additions
  state/                                        # engineStore + ** run/progress slice **
  providers/                                    # refactored tree (§13)
  **ui/**        re-skinned shadcn primitives + atoms (Button, Field, Dialog…)
  **hud/**       diegetic HUD (frame, DepthGauge, Wordmark, ShardCounter, SoundToggle)
  **cursor/**    Reticle renderer (reads CursorManager)
  **sections/**  DOM content per level (semantic, SSR) — NOT built this phase
  **content/**   typed content models + data (projects, testimonials, bio)
  **icons/**     custom icon set (SVG React) + HUD marks
  **fonts/**     self-hosted font files + loader
  **lib/**       cn, format, seo, analytics helpers
config/ types/                                  # Phase 1
docs/  gdd, art-bible, implementation-blueprint  # source-of-truth docs
```

## 4. DESIGN TOKENS (single source)
Tokens live in **one place**: `globals.css` `@theme` (Tailwind v4). They are consumed by (a) Tailwind utilities, (b) raw CSS vars, (c) Three materials (imported constants mirrored in `config/`). Canonical values = Art Bible Part II. Namespaces: `--color-*`, `--space-*` (×8 scale), `--radius-*`, `--dur-*`, `--ease-*`, `--glow-*`, `--z-*`. **No raw hex/px/ms in components** — tokens only (enforced by review checklist).

## 5. TYPOGRAPHY SYSTEM
| Role | Family (self-hosted) | Token | Rules |
|---|---|---|---|
| Display | wide grotesk (e.g., Clash/Aeonik-class) | `--font-display` | sentence case, tight tracking, fluid `clamp()`, kinetic reveal |
| UI/body | variable sans (Geist/Inter-class) | `--font-sans` | 16px base, 1.5 line-height |
| HUD/data | monospace (Geist Mono-class) | `--font-mono` | UPPERCASE, +tracking, count-up + glitch settle |

Fluid scale (clamp, 1.2–1.25 ratio): `xs .75 · sm .875 · base 1 · lg 1.25 · xl 1.75 · 2xl 2.5 · 3xl 3.75 · display clamp(3rem, 8vw, 9rem)`. Load: preload display weight only; `font-display: swap`; subset Latin.

## 6. COLOR SYSTEM
Exactly the Art Bible ramp (void→signal-white, flux, ember, rare). Working space OKLCH; hex anchors canonical. **Laws:** ≤2 accent hues/frame; flux=alive, ember=act/reward (rationed), rare=secrets, gold=one legendary. Semantic aliases: `success=flux-b`, `warning/act=ember`, `danger=#FF3B4E`, `focus=flux-a`. Emissive/HDR values for 3D bloom mirrored in `config/`.

## 7. MOTION SYSTEM
Durations `80/140/240/400/700/1400/3000` → `--dur-*`. Eases `signal(0.16,1,0.3,1)`, `glide(0.65,0,0.35,1)`, `rise expo.out`, `snap(0.19,1,0.22,1)`, `play back.out(1.7)`, `linear`. Springs: cursor/magnetic=`stiff`, tilt/panel=`gentle`, Core=`wobbly` (Phase-1 presets). Stagger chars .02/words .04/lines .06/cards .08. **Choreography law:** enter fast → settle slow; overlap; one hero motion/frame; <100ms feedback; all on the single ticker. Reduced-motion collapses to fades (global via `AnimationManager.reducedMotion`).

## 8. SCROLL SYSTEM
Lenis (Phase-1 `ScrollManager`) drives one virtual scroll = the descent throttle. lerp .08–.10; scrub 1.0–1.5. `ScrollTrigger` synced via engine `scroll` event (already wired). Velocity (`ScrollManager.velocity`) feeds particle speed, motion-blur/aberration, doppler, Core wake, marquee. Section timelines via `TimelineManager.createScrub`. Web Atelier uses a pinned horizontal ScrollTrigger track (R7). Progress persists to store (`scrollProgress`).

## 9. CAMERA SYSTEM
Phase-1 `CameraManager` waypoint track = the Rail. Vocabulary: Glide (default dolly, `glide`, 1200–2000ms), Push-in (focus, `rise`, 600–900ms), Release, Pull-back (finale, 3–4s), Cut (≤3× total). Pointer parallax ≤3° spring-damped; FOV 35° breathing ±1.5°; DOF on focus (tier-gated). `useEngineCamera({followScroll})` binds R3F camera to the manager and samples waypoints from scroll progress. Inspect mode = the only free orbit (Drei controls, clamped).

## 10. 3D SYSTEM
One persistent `<EngineCanvas>` (Phase 1), `frameloop="never"`, DPR/shadows/AA from `QUALITY_PROFILES` per tier. Scene graph: `EnvironmentRig` (gradient sky, fog, lights) → `Spine` (structure, LOD) → active `Level` subtree (lazy) → `TheCore` (persistent, cross-level) → `PostFX`. Levels are code-split R3F subtrees mounted by `SceneManager.current`. Disposal on level exit (Phase-1 dispose utils). DOM↔3D anchoring via Drei `Html` sparingly; readable text stays DOM.

## 11. ANIMATION ARCHITECTURE
Three tiers: (1) **World/cinematic** — GSAP scrub timelines bound to scroll + camera waypoints (`TimelineManager`, `CameraManager`). (2) **DOM reveals/micro** — Phase-1 `animation/hooks` (`useReveal`, `useTextReveal`, `useStagger`, `useMagnetic`, `useTilt`, `useParallax`, `useMarquee`, `useSpotlight`, `useCursorVariant`) using shared presets. (3) **3D per-frame** — `useEngineFrame`/`useTick` for shader uniforms, Core, particles. All advance on the one ticker; all clean up via GSAP context / tracked cleanups. No component owns a raw `requestAnimationFrame`.

## 12. STATE MANAGEMENT
Zustand vanilla `engineStore` (Phase 1) + a **run/progress slice**: `depth`, `currentLevel`, `shards[]`, `achievements[]`, `secretsFound[]`, `audioMuted`, `reducedMotion`, `qualityTier`, `classicView`. Persist run/progress to `localStorage` (namespaced `atlas.run.v1`). React reads via `useEngineStore(selector)`. Engine writes via `StateManager` from events (no React in engine).

## 13. PROVIDER TREE (SSR-safe — R4 fix)
```
<html><body>
  <ThemeTokens/>                 # tokens are CSS, no JS needed
  <EngineProvider eager>         # never blocks DOM; provides nullable engine
    <A11yProvider>               # reduced-motion, classic-view context
      <CanvasLayer/>             # dynamic(ssr:false): <EngineCanvas> fixed, behind content
      <HudLayer/>                # diegetic HUD (client, null-safe)
      <CursorLayer/>             # reticle (client, pointer-fine only)
      {children}                 # SSR semantic sections (the real content/SEO)
    </A11yProvider>
  </EngineProvider>
</body></html>
```
Order matters: canvas is `position:fixed` z-0; DOM sections scroll above it (z-10); HUD z-40; cursor z-50; overlays/dialogs z-60.

## 14. HOOK STRUCTURE
Engine: `useEngine`/`useEngineOptional`, `useEngineStore`, `useEngineEvent`, `useTick`, `useScroll`, `useSpring`, `useVelocity`, `useWindowSize`, `useReducedMotion` (Phase 1). Animation: the `animation/hooks` set. 3D: `useEngineFrame`, `useEngineCamera`, `useRenderBridge`, `useTexture`, `useModel`. **New:** `useLevel(id)` (mount/activate + a11y sync), `useCollectible(id)`, `useAchievement(key)`, `useSecret(code)`, `useMagneticNav`, `useClassicView`. Naming: `use<Thing>`; return refs for imperative DOM; never re-render per frame.

## 15/16/17. SECTION ⇄ WORLD ⇄ LEVEL ORDER (reconciled)
**World order (macro):** Void → Spine (top→bottom) → Void. One continuous world.
**Level order (00–14)** and their **DOM section** (SSR, mirrors level for SEO/a11y):
| # | Level | DOM section role | Content |
|---|---|---|---|
| 00 | Cold Start | `<header>` boot | real % loader |
| 01 | Threshold | hero `<section>` | headline, thesis, scroll cue |
| 02 | Manifest | about intro | positioning |
| 03–09 | Foundries (AI, SaaS, Mobile, Web*, CRM, Automation, Experience) | `<section>` per discipline w/ project `<article>`s | projects |
| 10 | Proving Ground | skills `<section>` | skill list |
| 11 | Alliance | testimonials `<section>` | clients/quotes |
| 12 | Trace | timeline `<section>` | experience |
| 13 | Handshake | contact `<section>` + `<form>` | contact |
| 14 | Signoff | `<footer>` | credits/links |
Secrets (Vault, Sub-Level, Dev Console, Zero-G) are **not** in the DOM order; they branch off the Rail. *Web = horizontal track.

## 18. CURSOR SYSTEM (unified — R5)
Renderer in `cursor/` reads `CursorManager.state` each tick (no per-frame React). Variants (extended enum): `default · hover · drag · inspect · descend · text · hidden`. Behaviors: spring-follow (`stiff`), ring-expand on interactives, "⤢ DRAG"/"◎ INSPECT"/"↧ DESCEND" labels, I-beam over text, contrast-invert over bright regions, particle burst on click, magnetic assist near targets (`useMagnetic`). Pointer-fine only (hidden on touch/coarse; native cursor restored). Respects reduced-motion (no morph, static ring). Set via `useCursorVariant`.

## 19. NAVIGATION
A single **Signal node** (fixed HUD) expands into a vertical Foundry map (redesigned from 21st *Liquid Morph Floating Menu* + *Fluid Menu* — one language, magnetic, letter-roll labels). Selecting a level = **fast-travel warp** down the Rail (camera glide, never hard cut) + Lenis `scrollTo`. Keyboard: `Tab` focusable list, `↑↓` move, `Enter` warp, `Esc` close. Mobile: bottom-sheet map. Deep-linkable via hash (`#foundry/ai`).

## 20. HUD
Diegetic ATLAS OS chrome (client, null-safe, screen-space, no world fog/DOF). Persistent elements in the four safe-corners: Wordmark+status (TL), Depth gauge ruler+% (R edge), Shard counter (BL), Sound toggle (BR). Contextual: level title glitch-in, achievement toasts, inspect panel. Obsidian glass, hairlines/brackets, mono data with count-up. Hidden in Classic View.

## 21. CURSOR/PARALLAX SYSTEM
Layered parallax per Depth System (§II.10 Art Bible): starfield .1 → bg Spine .3 → mid .6 → interactive 1.0 → foreground particles 1.2 → HUD screen-space. DOM parallax via `useParallax` (transform, ticker-driven); 3D parallax via camera sway + layer depth + fog. Atmospheric perspective mandatory (distance ⇒ less contrast/saturation, more fog). All parallax disabled under reduced-motion.

## 22. SHADER STRATEGY
Custom GLSL (Phase-1 `three/shaders` chunks) for: Core (simplex displacement + fresnel + emissive flow), volumetric/depth fog, Signal flow-field, environment gradient sky, dissolve/fabrication (noise-threshold reveal), HUD scanline/dot-matrix (as 2D canvas/CSS where cheaper). Uniforms advanced by `useEngineFrame`. Precision `mediump` on mobile. Shaders are lazy-imported with their level.

## 23. PARTICLE STRATEGY
Four systems (Phase-1 `ParticleField` base), additive, GPU points, soft sprites: Signal streams (velocity-reactive), ambient dust, fabrication bursts (pooled, spawned on Core upgrades), collectible sparks. Counts from `QUALITY_PROFILES.particles` (low 200 → ultra 2500). Pooling + frustum considerations; dispose on level exit. Never decorative confetti.

## 24. LOADER STRATEGY
Boot % is **real** asset progress (Phase-1 `LoadingManager`), styled as reactor charge. Two-stage: (1) critical shell (fonts, HUD, Core, Threshold) gates first paint of the experience; (2) per-Foundry assets stream on approach (code-split + `AssetManager` cache, Draco/KTX2). Skeleton-free (world fades in). Classic View skips the 3D loader entirely.

## 25. PERFORMANCE STRATEGY
Targets: 60fps desktop, ≥30fps mobile, Lighthouse ≥95 (content), INP <200ms, LCP <2.5s (DOM hero text SSR). Levers: adaptive tiers (`PerformanceManager` auto up/downgrade), DPR clamp, tier-gated post-FX/shadows/particles, code-split levels + `next/dynamic(ssr:false)` for canvas, Draco/KTX2 assets, texture atlasing, `optimizePackageImports` (three/gsap/lenis/drei), memory disposal on exit, single RAF, `will-change` discipline, image `next/image`. Budget: initial JS (no 3D) <150KB; 3D chunk lazy. Instrumented via Dev Console secret + Speed Insights.

## 26. ACCESSIBILITY STRATEGY
DOM-first: all content is semantic SSR HTML behind/above the canvas, keyboard-navigable, ARIA-labelled; canvas `aria-hidden`. `prefers-reduced-motion` → full calm experience (fades, no parallax/DOF/blur/auto-camera). **Classic View** route: same content, zero spectacle, standard scroll. Visible in-style focus (`--bd-focus`); skip-to-content; AA contrast enforced; captions for meaningful audio (also shown visually); `Esc` exits immersive modes; no strobe; motion clamps. WCAG 2.1 AA is a release gate.

## 27. SEO STRATEGY
SSR/SSG the content layer (headings, project copy, testimonials, bio) so crawlers see real HTML. Per-level `<section>` with proper landmarks/headings. Metadata API: title/description/canonical, OpenGraph + Twitter cards, `opengraph-image` (branded), JSON-LD `Person` + `CreativeWork` per project, `sitemap.ts`, `robots.ts`. Classic View is fully crawlable. Fast LCP via SSR hero text (not 3D). Semantic project URLs (`#`/route) for shareability.

## 28. IMAGE STRATEGY
`next/image` (AVIF/WebP, responsive `sizes`, blur placeholder). Project imagery graded to palette at rest → full color on focus (CSS filter/shader). Framed by brackets, faint grain/scanline, mask reveal. Store source assets; generate optimized variants at build. LQIP for artifacts. Never raw floating screenshots. Textures for 3D compressed to KTX2.

## 29. VIDEO STRATEGY
Sparingly. Project demo videos: muted, `playsInline`, lazy (IntersectionObserver), poster = graded frame, autoplay only in view + on capable tiers; pause offscreen; provide controls in Inspect mode. Prefer short looping `webm/mp4` (H.264 + AV1). No background hero video (3D replaces it). Respect data-saver + reduced-motion (show poster only).

## 30. COMPONENT INVENTORY (DOM/HUD — re-skinned, one language; *seeds from Phase-2 21st.dev discovery, redesigned*)
Atoms: `Button` (magnetic, ember-glow), `IconButton`, `Field/Input/Textarea`, `Tag`, `KBD`, `Bracket`, `Hairline`, `GlitchText`, `CountUp`, `MonoLabel`.
HUD: `HudFrame`, `Wordmark`, `DepthGauge`, `ShardCounter`, `SoundToggle`, `AchievementToast`, `NavSignalNode`, `NavMap`.
Overlays (shadcn, re-skinned): `Dialog` (Inspect), `Popover`, `Tooltip`, `Sheet` (mobile nav), `VisuallyHidden`.
Content: `ProjectArtifact`, `ProjectInspectPanel`, `SkillNode`, `TestimonialReveal`, `ClientMonolith`, `TimelineNode`, `ContactTerminal`, `Credits`.
System: `ClassicView`, `ReducedMotionGate`, `DevConsole`, `Preloader`.
> Built in later phases — **not now**.

## 31. ANIMATION INVENTORY
Reveals: text cut (`useTextReveal`), stagger (`useStagger`), card/image/mask reveal, blur-in body, count-up data. Interactions: magnetic, tilt+spotlight+glare, parallax, marquee (velocity-reactive), cursor morphs, letter-roll hover. Transitions: level fog/light wipe, fast-travel warp, inspect push-in/release, Ember-mode theme wipe, reverse-fabrication. Cinematic: Core fabrication bursts, camera glide/pull-back, launch sequence. All map to presets in `animation/presets` + hooks.

## 32. 3D INVENTORY
Persistent: `TheCore` (7+ fabrication states), `EnvironmentRig` (gradient sky, fog, 3-pt studio lights), `Spine` (LOD structure), `SignalStreams`, `AmbientDust`, `PostFX` (bloom/DOF/aberration/vignette/grain). Per-level: AI neural cores, SaaS dashboard slabs, Mobile device shells, Web preview planes, CRM node-networks, Automation circuits, Experience micro-scenes, client chrome monoliths, skill constellation nodes, Signal Shards, Zero-G props. Materials per §II.8. Models Draco-compressed; instancing where repeated.

## 33. ICON INVENTORY
One custom stroke family (1.5px, rounded, 24px grid) as SVG React components: `arrow-down/up`, `sound-on/off`, `close`, `drag`, `inspect`, `external`, `mail`, `github`, `linkedin`, `play/pause`, `menu`, `shard`, `trophy`, `lock`, `check`, `node`, `circuit`, `chevron`. HUD marks: corner brackets, tick ruler, dot-matrix, scan-line. No emoji, no third-party packs.

## 34. AUDIO PLAN
Architecture from Phase-1 `AudioManager` (Web Audio, gesture-unlocked, master gain). Assets (later): ambient drone (per-Foundry timbre crossfades), UI stings (hover/click/confirm), fabrication hit, velocity whoosh/doppler, achievement chime, launch crescendo. Muted default; diegetic toggle; volume in store; respects reduced-motion (still allows audio) + user mute persistence. Files: short `webm/opus` + `mp3` fallback, decoded once, cached.

## 35. TESTING PLAN
- **Static:** `tsc --noEmit`, ESLint (zero errors gate) — every milestone.
- **Unit:** engine managers/utilities (Ticker delta clamp, Spring, EventEmitter, scroll math) via Vitest.
- **Component:** critical UI (nav, contact form, classic view) via Testing Library.
- **E2E/visual:** Playwright — boot completes, descent scroll advances levels, nav warp, contact submit, reduced-motion path, classic view renders content, no console errors. Screenshot diffs on key frames.
- **Perf:** Lighthouse CI budget + manual FPS on mid/low devices.
- **A11y:** axe on each section + keyboard-only walkthrough + screen-reader smoke.
- Gate: `build` + `typecheck` + `lint` + smoke E2E green before each commit/merge.

## 36. DEPLOYMENT PLAN
GitHub repo → Vercel. Branches: `main` (production, protected), `dev` (integration), feature branches per milestone → PR. Preview deploy per PR. CI: install → lint → typecheck → build → unit → E2E smoke → Lighthouse budget. Env vars for analytics keys. Post-launch: Vercel Analytics + Speed Insights, error monitoring (Sentry optional), OG image validation, `robots`/`sitemap` verified, custom domain + HTTPS. Rollback via Vercel instant revert.

## 37. QUALITY CHECKLIST (release gate — every PR)
- [ ] `typecheck` + `lint` + `build` green; no console errors/warnings.
- [ ] Only Part-II tokens (no raw hex/px/ms). Art Bible "Definition of Done" passes.
- [ ] 60fps desktop / ≥30fps mid-mobile on the touched scene.
- [ ] Reduced-motion variant designed & correct; keyboard focus visible & in-style; AA contrast.
- [ ] DOM content SSR + accessible; Classic View renders it.
- [ ] Single RAF; cleanup verified (no leaked listeners/RAF/GPU on unmount).
- [ ] Feels handcrafted — not stitched library components.
- [ ] Milestone independently testable; ends in a stable commit.

---

## 38. IMPLEMENTATION ROADMAP (Day 1 → production)
Each milestone: **Goal · Key tasks · Definition of Done (testable) · Commit**. Every milestone compiles, is independently testable, avoids regressions, ends in a stable commit. Suggested durations are relative (solo). Content-dependent milestones flagged ⛔.

### STAGE 0 — Setup & Systems (foundation hardening)
**M0 · Repo & baseline** (0.5d) — `git init`, commit Phase-1 foundation; add `.editorconfig`, PR template, CI skeleton. *DoD:* clean repo, CI runs lint/typecheck/build green. *Commit:* `chore: initialize repo + CI baseline`.

**M1 · Tailwind v4 + tokens** (1d) — install Tailwind v4 (`@tailwindcss/postcss`), migrate `globals.css` to `@import "tailwindcss"` + `@theme` with all Art-Bible tokens; mirror emissive/3D constants in `config/`. *DoD:* a token test page (temporary, deleted) shows correct colors/spacing; build green. *Commit:* `feat: tailwind v4 + design token layer`.

**M2 · Fonts + typography** (0.5d) — self-host 3 families via `next/font/local`; wire to theme; type scale utilities. *DoD:* headings render display font SSR; no layout shift; build green. *Commit:* `feat: self-hosted typography system`.

**M3 · shadcn re-skin base** (1d) — init shadcn (React 19), add Dialog/Popover/Tooltip/Sheet/Form/VisuallyHidden; restyle to Art Bible (obsidian glass, tokens). *DoD:* a re-skinned Dialog opens, keyboard-trapped, matches bible; no stock look. *Commit:* `feat: re-skinned shadcn primitives`.

**M4 · Provider tree refactor (R4)** (1d) — make `EngineProvider` eager; add `A11yProvider`, `CanvasLayer` (`dynamic ssr:false`), z-layer scaffolding; `useEngineOptional` everywhere in DOM. *DoD:* SSR HTML contains content with engine absent; hydration clean; engine boots client-side. *Commit:* `refactor: SSR-safe provider tree`.

### STAGE 1 — Shell (HUD, cursor, boot)
**M5 · HUD shell (static)** (1.5d) — `HudFrame`, `Wordmark`, `DepthGauge`, `ShardCounter`, `SoundToggle` reading store (static values). *DoD:* HUD renders in safe-corners, responsive, hidden in Classic View. *Commit:* `feat: diegetic HUD shell`.

**M6 · Cursor system** (1d) — `Reticle` reading `CursorManager`; variants + magnetic; pointer-fine gate; reduced-motion. *DoD:* reticle follows with spring, morphs on hover/drag, hidden on touch, no re-render/frame. *Commit:* `feat: custom cursor reticle`.

**M7 · Preloader / boot** (1d) — real % via `LoadingManager`, reactor-charge visual, inhale→reveal transition. *DoD:* boot shows true progress, completes to experience, skipped in Classic View. *Commit:* `feat: real-progress preloader`.

**M8 · Classic View + a11y base** (1d) — `(classic)` route renders semantic content shell; reduced-motion path; skip-link, focus styles. *DoD:* Classic View passes axe, keyboard-navigable, same content. *Commit:* `feat: classic view + a11y baseline`.

### STAGE 2 — World & The Core (the vertical slice)
**M9 · Environment rig + PostFX** (1.5d) — gradient sky, volumetric fog, 3-pt lights, bloom/DOF/aberration pipeline (tier-gated) in `<EngineCanvas>`. *DoD:* void renders with fog+bloom at all tiers; low tier drops post-FX; 60fps. *Commit:* `feat: 3D environment + post-processing`.

**M10 · The Core (hero asset)** (2–3d) — geometry + material with 7 fabrication states + displacement/fresnel/emissive shader; magnetic cursor lean; drag/throw (Spring). *DoD:* Core renders, cycles states via debug control, reacts to pointer, disposes clean. *Commit:* `feat: The Core object + fabrication states`.

**M11 · Spine + Rail + descent** (2d) — grey-box Spine (LOD), `CameraManager` waypoints, scroll→camera glide, Depth gauge live. *DoD:* scrolling dollies the camera down the Spine; depth % updates; reduced-motion = fade paging. *Commit:* `feat: spine, camera rail, scroll descent`.

**M12 · Threshold + Manifest levels** (2d) — level framework (`useLevel`), Threshold hero (headline cut-reveal, Core spawn, scroll cue), Manifest thesis. DOM sections SSR + 3D subtrees. *DoD:* boot→threshold→manifest flows; content in SSR HTML; a11y + reduced-motion pass. *Commit:* `feat: threshold + manifest levels`.

> **★ Vertical slice checkpoint:** boot → descend → hero → about, with The Core, on real engine, accessible + performant.

### STAGE 3 — Foundries & content levels
**M13 · Foundry framework + AI Core** (2–3d) ⛔ — reusable level shell (approach→ignition→dock→reveal→dwell→depart), Core upgrade beat, `ProjectArtifact` + `ProjectInspectPanel` (Dialog), typed content model. AI Core as first instance. *DoD:* full Foundry loop works with placeholder→real AI content; inspect opens/closes; disposes. *Commit:* `feat: foundry framework + AI Core`.

**M14 · SaaS + Mobile + CRM Foundries** (3d) ⛔ — dashboard slabs (tilt/spotlight), device shells (drag-rotate), node-networks. *DoD:* each loop works, tier-scaled, accessible. *Commit:* `feat: saas/mobile/crm foundries`.

**M15 · Web (horizontal) + Automation + Experience** (3d) ⛔ — pinned horizontal track (R7), automation circuit mini-game, playable micro-scene. *DoD:* horizontal section pins/unpins correctly; mini-game reveals case; no scroll-jank. *Commit:* `feat: web/automation/experience foundries`.

**M16 · Proving Ground (skills)** (1.5d) ⛔ — bootable skill nodes + constellation + telemetry. *DoD:* nodes activate, keyboard-accessible, data counts up. *Commit:* `feat: proving ground skills`.

**M17 · Alliance + Trace** (2d) ⛔ — client monoliths + testimonial reveals; timeline nodes. *DoD:* reveals on scroll; content SSR; a11y. *Commit:* `feat: alliance + trace levels`.

**M18 · Handshake + Signoff** (2d) ⛔ — contact terminal + form (validation, spam guard, submit action), Reactor-Align mini-game, launch sequence, credits + finale pull-back. *DoD:* form submits (server action/email), success triggers launch, footer content SSR. *Commit:* `feat: handshake contact + signoff`.

### STAGE 4 — Meta, play & polish
**M19 · Navigation + fast-travel** (1.5d) — Signal-node → nav map, warp to any level, deep-link hashes, mobile sheet. *DoD:* warp glides camera + scroll; keyboard/hash nav works. *Commit:* `feat: navigation + fast-travel`.

**M20 · Collectibles, achievements, secrets** (2.5d) — 12 Shards, achievement toasts, 4 secret areas + easter-egg codes, run persistence. *DoD:* shards collect+persist; secrets unlock; achievements fire; survives reload. *Commit:* `feat: collectibles, achievements, secrets`.

**M21 · Audio pass** (1.5d) — ambient beds, stings, fabrication, velocity, chimes; per-Foundry crossfade; toggle. *DoD:* audio unlocks on gesture, mutes/persists, no autoplay; reduced-motion unaffected. *Commit:* `feat: audio system + assets`.

**M22 · Performance pass** (2d) — tier tuning, LOD, code-split verification, texture/model compression, memory audit, Lighthouse budget. *DoD:* targets met (60/≥30fps, LH ≥95 content); no leaks over 5-min soak. *Commit:* `perf: budgets, LOD, memory audit`.

**M23 · Accessibility + reduced-motion QA** (1.5d) — full axe pass, keyboard walkthrough, screen-reader smoke, Classic View parity, focus order. *DoD:* WCAG AA gate passes on all levels. *Commit:* `a11y: full audit + fixes`.

**M24 · SEO + metadata** (1d) — metadata, OG image, JSON-LD, sitemap/robots, canonical. *DoD:* rich results valid, OG renders, crawlable content confirmed. *Commit:* `feat: SEO + structured data`.

### STAGE 5 — Content, QA & ship
**M25 · Real content integration** (2d) ⛔ — projects, testimonials, bio, résumé, links into content models + assets (images/video optimized). *DoD:* all placeholders replaced; imagery graded; links valid. *Commit:* `content: real portfolio content`.

**M26 · Cross-browser/device QA + polish** (2–3d) — Safari/Chrome/Firefox, iOS/Android, notch/safe-area, input edge-cases, micro-polish pass. *DoD:* visual + functional parity; polish checklist done. *Commit:* `fix: cross-platform QA + polish`.

**M27 · Production deploy & launch** (1d) — Vercel prod, domain, analytics, monitoring, final Lighthouse, launch. *DoD:* live on domain, green metrics, monitoring active. *Commit:* `release: v1.0 production launch`.

**Critical path:** M0–M4 (setup) → M9–M12 (world + Core + vertical slice) → M13 (Foundry framework) → M25 (content) → M22/M23 (perf/a11y) → M27 (ship). Foundries (M14–M18) parallelize once M13 lands. Content (⛔) can proceed with placeholders and swap at M25, but earlier real content de-risks design.

---

## 39. BLOCKERS / DEPENDENCIES
- ⛔ **Real content** (projects w/ metrics, 7 disciplines confirmed, testimonials/logos, bio/résumé/contact) — needed to finalize Foundries (best before M13, required by M25).
- Font license selection (3 families) — before M2.
- Confirm Tailwind v4 + shadcn adoption (R1) — before M1.
- Domain + Vercel/GitHub access — before M27.

## 40. WHAT THIS DOCUMENT SUPERSEDES
This blueprint is the build source of truth. The Art Bible (visual law) and GDD (experience law) remain authoritative in their domains and are referenced, not duplicated, here. Any future scope change updates *this* document first.
