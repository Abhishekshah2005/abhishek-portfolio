# ATLAS — Creative Direction Revision (v2.0)
### The pivot: from "operating system" to "interactive world"
**Type:** Visual & experiential direction change only. **Zero architecture change.** This document supersedes the aesthetic layer of the Art Bible and GDD; the Implementation Blueprint (tech), Engine, and all systems remain authoritative and untouched.

---

## 0. The pivot in one paragraph
We built a superb engine and dressed it as a cyberpunk operating system — plasma-neon duotone, terminal boot logs, HUD telemetry, scanlines, glitch, depth-gauge %. It reads as *software*. We are changing that. ATLAS is no longer an OS you operate; it is **an atlas of worlds you travel through** — a serene, crafted, physical digital universe of connected environments, lit by one warm guiding light, built from glass, stone and metal, discovered by movement. Same engine. New soul.

> **New north star:** *"You didn't open a website. You arrived somewhere."*
> Every decision below serves **exploration, materiality, wonder** over **interface, telemetry, neon**.

---

## 1. Critical review — challenging our own decisions
| Past decision | Why it's wrong now | Verdict |
|---|---|---|
| "ATLAS OS / operator link / establishing" framing | Makes it software, not a place | **Reframe** ATLAS = an *atlas of worlds* |
| Plasma duotone (flux blue + cyan + ember + rare violet) | 4 neon accents = cyberpunk overload | **One accent**, warm |
| Terminal boot log + scramble decode + scanlines + CRT flicker | Hacker aesthetic, the opposite of wonder | **Remove**; reimagine as an *arrival* |
| Holographic HUD (brackets, mono telemetry, "systems nominal", coordinates, depth %) | Dashboard, not exploration | **Reduce ~90%** to quiet wayfinding |
| Techy reticle cursor (corner ticks, "VIEW/DRAG" labels, mix-blend glitch) | Reads as UI chrome | **Simplify** to an elegant physical cursor |
| AI Core as glowing plasma reactor | Neon centerpiece, sci-fi cliché | **Rematerialize** as a sculptural, material object |
| "Foundry / AI Core / SaaS Grid" level names | Industrial-tech naming | **Rename** to crafted *environments* |
| Energy streams / data-rain / neon grid floor | Data-viz cyberpunk | **Replace** with natural floor, soft volumetric light |
| Scroll = descend a data shaft with a % gauge | Scroll as measurement, not travel | **Scroll = travelling** through space |
| Project cards (planned) | Reading, not interacting | **Physical objects** in the world |

**What genuinely works and must be protected:** the entire engineering foundation, the single-RAF discipline, the scene-slot level architecture, real-progress loading, adaptive performance tiers, accessibility/reduced-motion rigour, the cinematic camera rig, and the *idea* of a continuous journey with a persistent centerpiece companion. We keep the bones and the ambition — we change the skin and the feeling.

---

## 2. WHAT STAYS (do not touch)
**All technical architecture, verbatim:**
✓ Engine (Ticker/one-RAF, EventEmitter, all Managers, physics springs) ✓ Design-System *structure* (tokens pipeline, primitives, cva, `cn`) ✓ Experience Layer & Provider tree ✓ Scroll Engine (Lenis + GSAP, velocity/progress) ✓ Cursor Engine (`CursorManager`, variants, velocity) ✓ Performance System (tiers, `QUALITY_PROFILES`, adaptive degrade, PerfMonitor) ✓ Transition Engine ✓ Scene Architecture (`SceneProvider`/`useSceneContent`/`SceneLayer`/`EngineCanvas`, `frameloop="never"`) ✓ Asset Pipeline (`AssetManager`, Draco/KTX2, `useTexture/useModel`) ✓ Boot **infrastructure** (`LoadingManager`, `usePreloader`, min-duration, skip, reduced-motion gating) ✓ Camera rig (`CameraManager` waypoints + drift) ✓ Audio architecture (`AudioManager`).

**Creative principles that survive:** dark-capable cinematic depth, one persistent centerpiece companion, a continuous journey with progression, premium restraint, accessibility-first, 60fps target.

---

## 3. WHAT CHANGES (re-skin/re-tune — same files, new values)
1. **Design tokens** (`globals.css @theme`) → warm neutral palette + **one** accent (the single highest-leverage change; because tokens are the one source, this recolors the entire app).
2. **Boot → Arrival** (`BootSequence`): keep the loader machinery, replace the styling/copy (no log, no scanlines, no scramble, no "OS").
3. **HUD → Wayfinding** (`HeroHud`): strip to a whisper.
4. **Cursor** (`CursorLayer`): elegant, physical, minimal.
5. **Centerpiece** (`AICore`): rematerialize to sculpture (physical materials, one light seam).
6. **World background** (`GridFloor`, `LightShafts`, `EnergyStreams`, `ParticleFlow`): replace neon grid/data-rain with stone floor, soft volumetric light, gentle dust motes.
7. **Typography reveals** (`NameReveal`): keep the assemble, drop the glitch/scramble feel; calmer, more elegant.
8. **Motion tokens**: slower, weightier, physical.

---

## 4. WHAT IS REMOVED (retired motifs — not architecture)
Scanlines · CRT flicker · glitch · noise-as-static · scramble/decode text as a *primary* motif · corner brackets everywhere · mono data-glyph telemetry ("systems nominal", "spine-00", lat/lon, depth %) · "ATLAS OS / operator link / establishing / synchronizing" copy · plasma duotone + secondary neon accents · heavy bloom/global glow · energy-stream "data rain" · the neon grid floor · HUD clutter. `ScrambleText` and the scanline/flicker keyframes are **kept in the codebase** but **retired from the experience** (available if ever needed).

---

## 5. WHAT IS SIMPLIFIED
- **UI → near zero.** The world is the interface. Chrome only when it aids wayfinding.
- **One accent.** Glow only to *guide the eye* (interactive/important), never decoration.
- **Fewer, softer particles.** Atmosphere, not spectacle.
- **Fewer simultaneous effect channels.** Let material, light, composition and whitespace carry it.
- **Scroll choreography = one clear travel gesture per transition**, not five flashing systems at once.

---

## 6. WHAT BECOMES MORE PLAYFUL
- **Physical interaction:** a draggable/throwable **companion object**; project objects you rotate, open, lift.
- **Collectibles:** *motes of light* gathered across the journey (replaces "Signal Shards" with a warmer metaphor).
- **Unlocks:** doors, bridges, gates that physically open as you arrive — progression you *see*.
- **Hidden areas:** side-paths and rooms rewarding curiosity.
- **Environmental storytelling:** each space reveals the maker through its objects (tools, sketches, prototypes) — no "about text" needed.
- **Wonder moments:** a sunrise breaking, a room lighting up, a structure assembling — earned payoffs.

---

## 7. HOW TO MAKE IT FEEL LIKE EXPLORATION, NOT SOFTWARE
1. **Places, not sections.** You *enter* the Observatory; you don't scroll to a section.
2. **Travel, not reveal.** Scroll walks/rides/glides you through space (§ Scroll).
3. **Objects, not cards.** You approach and interact with work.
4. **Light guides, not labels.** The single warm accent leads the eye to what matters.
5. **Silence and space.** Generous whitespace, quiet moments, room to breathe — premium confidence.
6. **Diegetic everything.** Progress = how far you've travelled (a horizon, a path), not a "%".
7. **Reward curiosity.** Hidden things, physical toys, discoveries.

---

# 8. THE UPDATED CREATIVE BLUEPRINT

## 8.1 Concept & story (ATLAS, reframed)
ATLAS is **an atlas of worlds** — a hand-crafted collection of environments, each a facet of the maker's craft. The visitor **arrives** at dawn, travels through connected spaces as the light moves (dawn → day → dusk → night → dawn), discovering and physically handling the work, gathering motes of light, and unlocking the path forward. A single sculptural **Monolith** (the reimagined centerpiece) is the heart/sun of this world — the source of the guiding light, present across the journey. The story is quieter now: *a journey through a maker's world, told by light and space.*

## 8.2 Visual language — palette (ONE accent)
Warm, natural, restrained. Neutrals do 95% of the work; one warm light is the only accent.

| Token | Value (proposed) | Role |
|---|---|---|
| `--bg-base` | `#0C0B0A` (warm near-black) | deep space / night |
| `--stone-900…500` | warm charcoals → warm greys (e.g. `#141210`, `#1E1B18`, `#2A2622`, `#4A443D`) | environments, materials |
| `--bone` | `#F2ECE3` (warm off-white) | primary text / daylight surfaces |
| `--fog` | `#9A928A` (warm grey) | secondary text, atmosphere |
| **`--accent` (the only accent)** | **`#E9A96A` warm "Lumen" gold/amber** | the guiding light — interactive, important, the Monolith's seam. *Rationed.* |
| `--accent-soft` | `#C88A4E` | shadowed accent / restraint |
| (retire) | flux `#5B8CFF`, flux-2 cyan, rare violet | removed as accents |

**Glow law:** glow is a *tool of attention*, applied only to the accent on interactive/important elements. No ambient neon. 92%+ of every frame is neutral material and light.

**Alternate to confirm:** a *light gallery* variant (bone-white base, ink text, warm accent) for daylight environments — the palette should **shift per environment along the day→night arc**, unified by the single accent. Recommendation: keep a dark cinematic base for atmospheric spaces and let 1–2 environments open into daylight for contrast.

## 8.3 Material system (the new hero)
Physical PBR over shaders-as-decoration:
- **Glass** — transmission/refraction, subtle thickness, soft caustics (the Monolith, display cases).
- **Stone** — matte, micro-roughness variation, warm (floors, plinths, architecture).
- **Metal** — brushed/machined, low-key anisotropy, restrained specular (Porsche/Dyson).
- **Soft surfaces** — occasional fabric/paper for warmth (sketches, workshop).
- **Contact shadows + soft AO**, natural reflections, **volumetric fog** for depth. Emissive reserved for the accent seam.

## 8.4 Lighting & atmosphere
Real, motivated, cinematic. One or two soft key lights per environment (warm), fill from ambient/IBL, the Monolith as a gentle practical light. **Volumetric shafts** (soft, natural — sun through a window, not neon god-rays). **Day→night** progression across the journey drives colour temperature and shadow length. Fog grades distance. This is where "expensive" now comes from — light and material, not glow.

## 8.5 Typography
- **Display grotesk, large and quiet** — editorial, generous whitespace, warm bone color. Reveals are *elegant* (mask/rise/soft fade), not decrypt/glitch.
- **UI/body**: the same grotesk / sans, restrained.
- **Mono: retired to a whisper** (the terminal signal). Use sparingly for a rare functional label, or not at all.
- Place-names appear like **chapter titles** (Journey/Inside): a large word fading in on arrival, then receding.

## 8.6 Motion language
Slower, weightier, physical, confident. Springs for physical objects; long eased camera travels (`power2/expo.inOut`); reveals settle rather than snap. **No glitch, no fast scramble, no jitter.** Micro-interactions are gentle (soft scale, warm glow bloom). Motion.dev for UI micro-interactions, GSAP for cinematic — unchanged tooling, calmer vocabulary.

## 8.7 Cursor
An **elegant physical cursor**: a soft, small ring/dot that eases with subtle weight and grows gently near interactive objects (magnetic). Remove corner ticks, mono labels, glitch invert. It should feel like a *presence*, not a targeting reticle. (Keep the `CursorManager` engine and variants; restyle the renderer.)

## 8.8 UI / HUD philosophy — near-zero
The world is the UI. Keep only:
- A **place-name** chapter title on arrival (fades away).
- A **discreet progress sense** — a thin path/horizon indicator or nothing (no "%", no gauge).
- A **quiet menu** (single elegant control) for wayfinding/skip/mute/reduced-motion.
- Contextual **prompts** only when an object is interactable ("hold to lift", minimal).
Remove brackets, telemetry, coordinates, status readouts. PlayStation clarity + Apple restraint.

## 8.9 Arrival (boot, reimagined)
Keep the real-progress loader, min-duration, skip, reduced-motion. **New feeling:** black → a single warm point of light **blooms** and breathes with the real load → soft ambient tone → the world **fades up** (horizon, fog, the Monolith's silhouette) → a quiet line or the maker's name materializes elegantly → the journey opens. **No** boot log, scramble, scanlines, "ATLAS OS", or percentages shown as telemetry (progress felt through the growing light, not a number).

## 8.10 World map — environments (renamed, day→night arc)
Places, each with its own identity, one shared art direction. Order is a journey through light:

```
Dawn        ARRIVAL          threshold — light blooms, you wake into the world
   ↓        THE OBSERVATORY  vantage / who the maker is (the Monolith overlooks the world)
Morning     THE WORKSHOP     craft & engineering — tools, workbench, things being built
   ↓        THE LAB          AI & experiments — quiet, precise, prototypes
Midday      THE STUDIO       design & interactive work — playful, tactile
   ↓        THE GALLERY      premium web / showcase — plinths, framed pieces, light
Dusk        THE VAULT        flagship projects — display cases you open
   ↓        THE ARCHIVE      experience & timeline — a warm library
Night       THE GARDEN       contact / rest — a calm place, an invitation
Dawn        DEPARTURE        credits — light returns, the world exhales
Hidden      side-paths & rooms rewarding exploration
```
Disciplines (AI, SaaS, Mobile, Web, CRM, Automation, Interactive) map into these environments **data-driven** (merge if content is thin) — no rigid one-per-discipline.

## 8.11 Scroll = travelling (per-transition metaphors)
Every scroll moves you *through the world*, never merely reveals text. Each transition uses a physical travel gesture:
- **Walk** a corridor/path into the next space.
- **Elevator/lift** between levels of light.
- **Bridge assembling** to cross a gap (an unlock you see).
- **Door/gate opening** on approach.
- **Camera gliding** through a threshold, environment transforming.
- **Light changing** (day→dusk→night) as you progress; fog, weather, shadow shift.
Velocity still drives feel (faster = more motion blur/atmosphere), but subtly and elegantly.

## 8.12 Project presentation — physical objects
No cards. Each project **exists in the world** and is **handled**:
- a **workbench** holding a device/prototype you rotate,
- a **display case** you open,
- a **blueprint/model table** you explore,
- a **plinth sculpture** you orbit,
- an **interactive console** (elegant, not cyberpunk) you operate.
Approaching illuminates it (accent light); interacting reveals the story in **elegant large typography + a few real metrics** — not a card, not a dashboard. Emphasis: *complete products* (design + engineering + outcome).

## 8.13 Game feel
Exploration-first: **movement** through space, **discovery** of hidden rooms/side-paths, **collectibles** (motes of light), **unlocks** (doors/bridges/gates opening as progression), **physics** (a companion object + handleable project objects), **meaningful rewards** (secret spaces, wonder moments), **environmental storytelling** (spaces that describe the maker). It should not *look* like a game — it should *feel* like one.

## 8.14 Sound direction (architecture already exists)
Warm, organic, ambient — resonance, soft wind, gentle tones, material foley (glass, stone, metal) on interaction. Per-environment ambience crossfades along the day→night arc. **No** UI stings, cyberpunk synths, or glitch. Muted by default, gesture-unlocked, reduced-motion-respecting. (Wire later via `AudioManager` + the boot cue hooks already in place.)

## 8.15 Centerpiece — the Monolith (reimagined AI Core)
Keep the component + particle/geometry scaffolding; **rematerialize**: a slowly rotating **sculptural form of glass/obsidian/polished stone** with a **single warm light seam** — refracting the environment, casting soft real light, breathing. It is the world's sun/heart and the source of the guiding accent. Reduce emissive to the seam; remove fresnel-neon and plasma. Think Monument Valley monolith × Apple/Dyson object × a still, glowing artifact. It still reacts to presence (subtle) and anchors identity — but as *matter and light*, not a reactor.

## 8.16 Accessibility & performance (principles unchanged)
Reduced-motion → calm, near-still world (light shifts as gentle fades, no travel motion sickness). DOM-first content + Classic View remain the SEO/a11y baseline. 60fps target via tiers; the material/lighting direction must budget against tiers (transmission/refraction and soft shadows are the new cost centers — gate them: full glass/AO/volumetrics on high/ultra, simplified on low/medium). One RAF, disposal discipline, lazy scenes — unchanged.

---

## 9. Component-by-component: keep / re-skin / retire
| Built artifact | Action | Note |
|---|---|---|
| `engine/**`, `providers/**`, `hooks/**`, `state/**` | **Keep** | zero change |
| `three/` architecture (EngineCanvas, scene-slot, hooks, loaders, particle *system*, material *factory*) | **Keep** | reuse to build new environments |
| `design/tokens` + `globals.css @theme` | **Re-skin** | warm neutrals + one accent (§8.2) — the master lever |
| `ui/*` primitives (Button, Card, Panel, GlassPanel, Text, etc.) | **Keep, re-tune** | new tokens auto-apply; soften glass/glow |
| `cursor/CursorLayer` | **Re-skin** | elegant cursor (§8.7); keep `CursorManager` |
| `experience/boot/*` | **Re-skin → Arrival** | keep loader infra; drop log/scanlines/scramble/OS copy (§8.9) |
| `experience/boot/ScrambleText`, scanline/flicker keyframes | **Retire** (keep in repo) | out of the experience |
| `experience/PerfMonitor`, layers, overlays, transitions | **Keep** | dev tool + infra |
| `sections/hero/HeroHud` | **Rebuild as wayfinding** | strip ~90% (§8.8) |
| `sections/hero/HoloPanel`, `CapabilityChips` | **Rework** | holo→material panel; chips→quieter/environmental |
| `sections/hero/NameReveal` | **Re-tune** | elegant reveal, drop scramble |
| `three/levels/hero/AICore` | **Rematerialize** | Monolith (§8.15) |
| `three/levels/hero/GridFloor` | **Replace** | stone floor + soft contact shadow |
| `three/levels/hero/LightShafts` | **Re-tune** | soft natural volumetrics |
| `three/levels/hero/EnergyStreams` | **Retire/replace** | remove data-rain; maybe drifting embers/leaves |
| `three/levels/hero/ParticleFlow`/`ParticleAtmosphere` | **Re-tune** | soft warm dust motes, fewer, slower |
| `three/materials/*` (gradient, fresnel) | **Extend** | add glass/stone/metal PBR factories |

## 10. Token migration (the master lever — for a future phase)
Because tokens are the single source (`globals.css @theme` + `design/tokens.ts`), the whole app recolors by editing them: replace the plasma palette with §8.2 (warm base/stone/bone/fog + one Lumen accent), soften `--shadow-glow-*` (accent-only, gentler), warm the fonts' color usage, slow the motion durations slightly, and retire the scanline/flicker/caret keyframes from use. No component rewrites needed to shift 80% of the neon.

## 11. Decisions — LOCKED (confirmed 2026-07-14)
1. ✅ **Accent color** — warm **"Lumen" amber `#E9A96A`** is the single accent. Rationed; glow only to guide the eye.
2. ✅ **Light mood** — **dark cinematic base with a day→night arc** (some environments open into daylight for contrast).
3. ✅ **Name/metaphor** — **keep "ATLAS", reframed as *an atlas of worlds*** (a collection of crafted places you travel through).
4. ✅ **Centerpiece** — **the Monolith**: a slowly rotating glass/obsidian/stone sculpture with one warm light seam.
5. ⏳ **Environment set & order + discipline mapping** — §8.10 list is the working plan; final mapping (which discipline lives where) is **pending your real project content**. This is the only open item and does not block re-skin work (tokens, arrival, cursor, HUD, Monolith, hero world).

---

## 12. What this document supersedes
This is now the authoritative **creative/aesthetic** direction. It overrides the neon/OS aesthetic in the Art Bible and the cyberpunk framing in the GDD. It changes **nothing** in the Implementation Blueprint's technical spec, the Engine, or any system. Future implementation phases re-skin against this; they do not re-architect.
