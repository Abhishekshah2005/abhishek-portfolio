# ATLAS — ART BIBLE
### The immutable visual & artistic law for the interactive portfolio
**v1.0 · Design only · Extends the ATLAS blueprint (Phase 2) & engine foundation (Phase 1)**

> This document is law. No component, scene, material, motion, or color may violate it. When a decision is ambiguous, the Art Bible wins. When the Art Bible is silent, default to **restraint**.

---

## PART I — THE 30 PILLARS OF ARTISTIC DIRECTION

### 1. Creative Theme
**"Volumetric Noir-Tech."** A futuristic fabrication universe rendered in obsidian darkness and sculpted by a single family of plasma light. The visitor pilots a cinematic descent through a machine that builds a product in front of them. It should feel like the title sequence of a $200M sci-fi film that you can *drive*. Expensive because it is quiet, precise, and alive — never loud, never busy.

### 2. Core Story
An idea enters raw at the top and exits as a shipped product at the bottom. The world dramatizes **"I engineer complete digital products, not just websites."** Light returns as value is delivered; the finished object launches like a rocket. Every frame must advance the *raw → refined* narrative.

### 3. Environment
A single continuous **vertical megastructure ("the Spine")** suspended in an infinite volumetric void. No "pages" — one persistent world revealed by descent. Chambers ("Foundries") are carved into the Spine, each a discipline. Depth is the primary dimension; the eye always senses "there is more below."

### 4. Architecture Style
**Monolithic brutalism fused with parametric precision.** Massive concrete-and-obsidian masses (Tadao Ando shafts, Kubrick monolith) cut by fluid parametric detail (Zaha Hadid ribs, Apple-Park glass tolerances). Vertical dominance. Chamfered edges, exposed structural ribs, cathedral-scale voids lit by narrow light shafts. Nothing decorative — every form is "structural" or "functional."

### 5. Lighting
**Low-key cinematic chiaroscuro.** 90% darkness sculpted by 1–2 motivated lights per chamber:
- **Key:** warm ember practical, **2200–2700K**, low intensity, one direction.
- **Fill:** cool flux, **7000–9000K**, very soft, from the energy in the scene.
- **Rim/back:** brightest, separates objects from the void.
Volumetric god-rays through fog, bloom on all emissives, heat-shimmer near fabrication. Contrast ratio is high; mid-tones are rare. Think Blade Runner 2049 + Interstellar docking bay.

### 6. Mood
Calm confidence → focused craft → awe → warm invitation. Never frantic, never cute. The emotional target is **"I am in expert hands, and this is beautiful."** Cyberpunk energy is *implied*, never shouted.

### 7. Color System
Duotone **plasma-on-obsidian** (full tokens in Part II). Near-black canvas; a cool flux gradient is "energy/alive"; a rationed ember is "act/reward"; a sacred violet is "secret." ~92% of every frame is neutral darkness + white/fog text.

### 8. Material System
Physically-based but stylized. Five hero materials only (Part II §8): **obsidian glass, milled gunmetal, emissive Signal trace, evolving Core, volumetric fog.** Detail comes from *light and edge*, not texture noise. No wood, no skeuomorphism, no clutter.

### 9. Glass Style
**Obsidian glass, not white glassmorphism.** Dark smoked glass: low transmission, high clearcoat, a thin flux fresnel rim, real backdrop blur, a whisper of white surface sheen, and a 1px inner light border. Frosted-white "Apple 2015" glass is **banned**. Glass is *structural* (HUD, inspect panels), never decorative wallpaper.

### 10. Metal Style
**Brushed gunmetal + dark chrome.** Anisotropic highlights, matte-to-satin range, anodized micro-details. Metal reads as precision-milled hardware (Teenage Engineering, Porsche, McLaren carbon). **Gold is forbidden** except the single "Legendary Operator" reward. Chrome is used only for reflective client monoliths.

### 11. Neon Strategy
There is no "neon." There is **Signal light** — thin emissive lines carrying energy, restrained and motivated. Rules: max **two accent hues per frame**; light only where energy *is*; always animated/flowing, never static tubes; always bloomed; never outlines-for-decoration. Cyberpunk sign-clutter is banned. Tron discipline, not Times Square.

### 12. Fog Strategy
Volumetric, depth-graded, per-Foundry tinted. Exponential density: ~0 at camera, ramps with distance so distant structures dissolve into atmosphere. Fog carries god-rays and creates scale. Near fabrication: subtle heat-shimmer. Fog tint shifts the mood of each Foundry (cool for AI, warm for Automation, etc.). Fog is the "cheapest expensive" tool — use it everywhere.

### 13. Particle Strategy
Four particle roles only: **Signal streams** (energy flowing down the Spine, velocity-reactive), **ambient dust** (slow float, presence), **fabrication bursts** (impact on Core upgrades), **collectible sparks** (Shards). GPU points, additive blending, soft round sprites. Counts scale by performance tier. Particles must always mean something — never confetti-for-confetti.

### 14. Shader Style
Custom GLSL is the source of the ownable look: **Core** (simplex displacement + fresnel + animated emissive), **fog** (volumetric/depth), **Signal flow** (flow-field), **environment gradient**, **dissolve/fabrication** (noise-threshold reveal), **HUD scanline/dot-matrix**. Aesthetic: crisp technical edges + organic noise motion. Physically plausible, artistically graded. (Chunks already stubbed in `three/shaders`.)

### 15. Typography Style
Three voices: a **wide confident grotesk** (display/voice), a **neutral variable sans** (UI/body), a **technical monospace** (HUD/data). Type is **kinetic** — headlines arrive via mask/cut reveals; data counts and glitch-settles. Generous negative space, big display sizes, tight mono. Display = sentence case; HUD = UPPERCASE mono with tracking. Self-hosted (no build-time fetch). Full scale in Part II.

### 16. Camera Language
A **vehicle on a rail**, never free orbit (except Inspect mode). Vocabulary: *Glide* (default dolly), *Push-in* (focus), *Release* (back to rail), *Pull-back* (finale), *Cut* (≤3× total, for shock). Pointer parallax ≤3° with spring damping. FOV ~35°, breathing ±1.5°. DOF on focus. Look-at always motivated. Subtle anamorphic feel. Comfort clamps mandatory.

### 17. Animation Language
**Physical and engineered.** Everything has mass: enters fast, settles slow, overlaps rather than sequences. Reveals are masks/cuts/count-ups/fabrications. One hero motion per frame — never two things competing for the eye. Bouncy/cheap easing is banned except where playfulness is *earned* (collectibles, secrets).

### 18. Motion Philosophy
Motion is communication, not decoration. It shows cause/effect, guides the eye, and rewards input within 100ms. If a motion doesn't clarify, delight, or reward — cut it. Continuous motion (drift, flow, breathing) keeps the world *alive* between interactions. Motion is choreographed to a single global clock (one RAF).

### 19. Shape Language
**Verticals dominate** (descent). Precision polygons, chamfered corners, faceted/hex motifs, thin hairlines, corner brackets — contrasted by exactly **one organic form: The Core**. The tension between sharp technical geometry and one soft, living blob is the signature. Circles/pills reserved for interactive controls.

### 20. Iconography
One custom stroke family: **1.5px stroke, rounded joints, 24px grid, technical/minimal.** Plus diegetic HUD marks (corner brackets, tick rulers, dot-matrix). No emoji, no third-party icon packs, no mixing. Icons are line-based and can animate (draw-on, glitch-in).

### 21. Illustration Style
No cartoons. Illustration = **technical schematics / blueprints / wireframe line-art / dot-matrix diagrams**, rendered as diegetic HUD overlays in flux hairlines. Diagrams explain systems (architecture, automation flows) and reinforce the "engineer" identity.

### 22. Image Treatment
Project imagery is **graded to the palette** (duotone/desaturated) at rest, **resolving to full color on focus**. Always framed by corner brackets, given a faint scanline/grain, and revealed via mask/curtain. Never a raw screenshot floating on the canvas. Images live inside artifacts, not on the page.

### 23. 3D Style
Cinematic stylized-PBR: low-key lighting, bloom, volumetric fog, restrained polycount, one hyper-detailed hero (The Core). Everything reads as one coherent render, not "3D assets on a website." Stylized-real: believable materials, art-directed light.

### 24. Audio Style
Cinematic and premium. Ambient volumetric **drone** (timbre shifts per Foundry), **dry high-end UI stings** (PS5-grade, pitched to the accent), **mechanical fabrication** hits, **velocity whoosh/doppler**. Muted by default; unlocked on first gesture; diegetic toggle. Sound is synesthetic with color (flux = cool tones, ember = warm sting).

### 25. Accessibility Style
Accessibility is part of the art, not a compromise. `prefers-reduced-motion` yields a **full, designed** calm experience (fades, no parallax/DOF/blur). DOM-first content for screen readers & SEO; 3D is enhancement. AA contrast always; in-style visible focus; a **"classic view"** escape hatch delivers the same content as a clean fast scroll. No strobe. Captions where audio conveys meaning.

### 26. Interaction Philosophy
**Guided freedom.** The whole surface is alive but calm; curiosity is rewarded, never punished. Feedback is physical (magnetic, spring, light-response) and instant (<100ms). Freedom is framed by the rail — the visitor always feels directed yet free to dwell, drag, and discover.

### 27. UI Philosophy
The UI is **ATLAS's operating system**, not web chrome. A thin persistent diegetic HUD (wordmark, depth gauge, shard counter, sound toggle). Type-in-motion *is* the interface. Glass is structural. No header/footer/hamburger. If it looks like a normal website, it is wrong.

### 28. Design Principles (the 10 commandments)
1. **Restraint over decoration.** When in doubt, remove.
2. **Depth over ornament.** Create richness with light, fog, and layering — not detail noise.
3. **Light is the only accent.** Color appears where energy is.
4. **Everything is alive.** Nothing is fully static.
5. **Motion has mass.** Fast in, slow settle, real physics.
6. **One language.** Every element looks handcrafted by one studio.
7. **Content is sacred.** The work and the words are always reachable and accessible.
8. **Reward exploration.** Curiosity always pays off.
9. **Cinematic composition.** Frame every key moment like a film still.
10. **Precision.** Pixel, millisecond, and material tolerances are tight.

### 29. Brand Personality
**The Architect-Maker.** Confident, precise, futuristic, quietly playful, warm at the core. Voice: terse, technical, human ("Let's build." / "Transmitting." / "efficient. but you missed things."). Archetypes: Creator + Explorer. Feels like a senior engineer who is also an artist — trustworthy, exacting, imaginative.

### 30. Visual Storytelling
The Core's raw→refined arc, the descent as product lifecycle, returning light as delivered value, the reverse-launch as "shipping." Foreshadowing (light leaking upward), payoff cadence (micro every viewport, macro every Foundry, grand at the finish). Every visual choice serves the story that **an idea becomes a shipped product in expert hands.**

---

## PART II — TOKEN & SYSTEM SPECIFICATIONS

### II.1 COLOR TOKENS

**Neutral ramp (obsidian)**
| Token | Hex | Use |
|---|---|---|
| `--c-void` | `#05050A` | Page base / deepest void (matches engine) |
| `--c-obsidian-900` | `#080A10` | Deep surface |
| `--c-obsidian-800` | `#0B0D14` | Primary chamber surface |
| `--c-graphite-700` | `#14161F` | Panels / HUD base |
| `--c-graphite-600` | `#1C1F2B` | Elevated panel |
| `--c-steel-500` | `#2A2E3D` | Borders / edges |
| `--c-ash-400` | `#3A3F52` | Disabled / faint lines |
| `--c-fog-300` | `#8A93A6` | Secondary/muted text |
| `--c-mist-200` | `#B9C0CE` | Tertiary text / captions |
| `--c-signal-white` | `#F4F4F8` | Primary text |
| `--c-pure-white` | `#FFFFFF` | Spec highlights only |

**Flux (energy / alive) — primary accent**
| Token | Hex | Use |
|---|---|---|
| `--c-flux-deep` | `#2A4CCC` | Shadowed energy |
| `--c-flux-a` | `#5B8CFF` | Accent A (engine value) |
| `--c-flux-b` | `#00E5C4` | Accent B (gradient partner) |
| `--c-flux-hi` | `#BFF6FF` | Bloom cores / highlights |
| `--grad-flux` | `linear 135° #5B8CFF→#00E5C4` | Signal gradient (always implies motion) |

**Ember (act / reward) — reactive accent (rationed)**
| Token | Hex | Use |
|---|---|---|
| `--c-ember-deep` | `#C23A1A` | Heat shadow |
| `--c-ember` | `#FF6A3D` | CTAs, achievements, "act" |
| `--c-ember-hi` | `#FFB08C` | Ember bloom |

**Rare (secrets only) & semantic**
| Token | Hex | Use |
|---|---|---|
| `--c-rare` | `#A16BFF` | Secrets / legendary ONLY |
| `--c-rare-hi` | `#CBA8FF` | Rare bloom |
| `--c-danger` | `#FF3B4E` | Errors (minimal) |
| `--c-success` | `#00E5C4` | = flux-b |
| `--c-warning` | `#FF6A3D` | = ember |

**Emissive / HDR (3D bloom intensities)**
| Token | Value | Use |
|---|---|---|
| `--e-trace` | 1.5–2.5 | Signal traces |
| `--e-core-raw` | 0.6 | The Core at spawn |
| `--e-core-final` | 3.0–4.0 | Completed Core |
| `--e-cta` | 2.0 | Ember CTA glow |

> **Color law:** OKLCH is the intended working space for perceptual consistency; hex above are the canonical anchors. ≤2 accent hues per frame. Ember only for "act/reward." Rare only for secrets. Never tint neutrals warm unless motivated by ember light.

### II.2 SURFACE HIERARCHY
| Layer | Name | Fill | Treatment |
|---|---|---|---|
| S0 | Void | `--c-void` + fog | background, receives god-rays |
| S1 | Chamber shell | `--c-obsidian-800` | matte, AO in crevices |
| S2 | Structure / rigs | `--c-graphite-700` | milled metal, edge highlights |
| S3 | HUD / floating panel | `--c-graphite-600` @ 62% + backdrop-blur 24px | obsidian glass, 1px inner light border |
| S4 | Focused artifact / modal | glass @ 72% + backdrop-blur 32px + border-active | strongest separation, DOF behind |
| S5 | The Core / hero light | emissive | self-illuminated, casts light on S0–S2 |

Rule: elevation is expressed by **glow + blur + border + focus (DOF)**, not by drop shadows. Never stack more than 2 glass layers.

### II.3 SHADOW HIERARCHY (subtle — dark UI uses absence of light)
| Token | Value | Use |
|---|---|---|
| `--sh-contact` | radial dark under 3D objects | grounding |
| `--sh-ambient` | `0 2px 8px rgba(0,0,0,.40)` | tiny separation |
| `--sh-panel` | `0 20px 60px rgba(0,0,0,.55)` | floating HUD panels |
| `--sh-lift` | `0 40px 120px rgba(0,0,0,.60)` | modal / inspect |
| `--sh-inner` | `inset 0 1px 0 rgba(255,255,255,.06)` | top light edge on glass |

Shadows are for *separation on dark only*. They are never the primary depth cue — glow and fog are.

### II.4 GLOW HIERARCHY (the primary depth/energy cue)
| Token | Value | Meaning |
|---|---|---|
| `--gl-0` | none | inert |
| `--gl-sm` | `0 0 8px flux @20%` | subtle alive / hairline energy |
| `--gl-md` | `0 0 20px flux @30%, 0 0 40px flux @15%` | interactive rest |
| `--gl-lg` | layered flux bloom (3 stops) | active / hero |
| `--gl-ember` | `0 0 16px ember @35%` | CTA / act |
| `--gl-rare` | `0 0 24px rare @40%` | secret / legendary |

Glow intensity = importance/energy. In 3D, glow is real bloom (post-processing, tier-gated).

### II.5 BORDER HIERARCHY
| Token | Value | Use |
|---|---|---|
| `--bd-hairline` | `1px solid steel-500 @40%` | structural dividers |
| `--bd-edge` | `1px solid flux-a @20%` | interactive rest |
| `--bd-active` | `1px solid flux-a @60%` + `--gl-md` | hover/active |
| `--bd-focus` | `2px solid flux-a` + `--gl-md` | keyboard focus (a11y) |
| `--bd-bracket` | corner brackets (⌐¬) not full frame | diegetic focus target |
| `--bd-gradient` | `--grad-flux` 1px | special/hero panels |

Prefer 1px hairlines and corner brackets over boxes. Full rounded boxes are rare.

### II.6 RADIUS SYSTEM
| Token | Value | Applied to |
|---|---|---|
| `--r-0` | 0px | HUD chrome, brackets, technical data |
| `--r-xs` | 2px | tags, chips, data cells |
| `--r-sm` | 4px | small controls |
| `--r-md` | 8px | buttons, inputs |
| `--r-lg` | 14px | glass panels, cards |
| `--r-xl` | 22px | modals, inspect panels |
| `--r-pill` | 999px | nav pill, toggles |
| `--r-blob` | organic (shader/SVG) | The Core, liquid nav morph |

Rule: **sharp = technical** (HUD/data, `--r-0/xs`); **soft = interactive** (`--r-md/lg`); **pill = navigation**; **blob = organic (Core only)**. Pick radius by element class, never arbitrarily.

### II.7 GRID SYSTEM
- **Screen (DOM/HUD):** 12-column fluid grid, max content `1512px`, gutter `24px`, outer margin `clamp(20px, 5vw, 96px)`.
- **HUD safe-area:** 24–32px inset (TV title-safe); the four corners are reserved for HUD (wordmark, depth, shards, sound).
- **Spacing scale (8px base, 4px sub):** `4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192`. Tokens `--sp-1…--sp-11`.
- **Vertical rhythm:** levels are `100dvh` stages; content aligns to an 8px baseline.
- **3D world grid:** 1 unit = 1 meter. Spine segments spaced consistently (e.g., 12u per Foundry). Camera waypoints snap to segment anchors.
- **Composition:** key cinematic frames use rule-of-thirds / golden ratio; The Core sits on a power point, not dead center (except the finale).

### II.8 MATERIAL SYSTEM (Three.js PBR params)
| Material | metalness | roughness | clearcoat | extras |
|---|---|---|---|---|
| Obsidian glass (UI/inspect) | 0 | 0.12 | 1.0 | clearcoatRoughness 0.1, faint transmission, flux fresnel rim |
| Milled gunmetal (structure) | 1.0 | 0.35 | 0.2 | anisotropy, subtle env reflection |
| Dark chrome (client monoliths) | 1.0 | 0.05 | — | high reflection, used sparingly |
| Emissive Signal trace | 0 | 0.4 | — | emissive flux, `--e-trace`, animated flow |
| The Core (evolving) | 0→0.6 | 0.9→0.15 | 0→1.0 | displacement→clearcoat over journey, emissive `--e-core-raw`→`--e-core-final` |
| Volumetric fog | — | — | — | depth-graded density, per-Foundry tint, god-rays |

No textures with visible photographic noise. Surface interest = fresnel + edge emissive + light, not maps.

### II.9 MOTION SYSTEM
**Durations**
| Token | ms | Use |
|---|---|---|
| `--d-instant` | 80 | press feedback |
| `--d-fast` | 140 | micro hover |
| `--d-base` | 240 | UI state |
| `--d-slow` | 400 | panels |
| `--d-reveal` | 700 | text/card reveals |
| `--d-cine` | 1400 | camera glide |
| `--d-epic` | 3000 | finale pull-back |

**Easings**
| Token | Curve | Use |
|---|---|---|
| `--e-signal` | `cubic-bezier(0.16,1,0.3,1)` | UI, default |
| `--e-glide` | `cubic-bezier(0.65,0,0.35,1)` (power2.inOut) | camera |
| `--e-rise` | `expo.out` | entrances/reveals |
| `--e-snap` | `cubic-bezier(0.19,1,0.22,1)` | quick decisive |
| `--e-play` | `back.out(1.7)` | earned playfulness only |
| `--e-linear` | linear | continuous flow/marquee |

**Springs (engine presets):** cursor & magnetic = `stiff`; tilt & panels = `gentle`; Core drag = `wobbly`.
**Stagger:** chars 0.02 · words 0.04 · lines 0.06 · cards/nodes 0.08.
**Scroll:** Lenis lerp 0.08–0.10; scrub 1.0–1.5; velocity normalized & clamped for effects.
**Choreography law:** enter fast → settle slow; overlap, don't sequence; one hero motion per frame; nothing animates without cause.

### II.10 DEPTH SYSTEM (z / atmospheric)
| Layer | Parallax | Treatment |
|---|---|---|
| Far starfield | 0.1 | lowest contrast, bluest, foggiest |
| Fog volume | — | depth-graded density |
| Background Spine structures | 0.3 | desaturated, soft |
| Mid rigs / chamber | 0.6 | moderate contrast |
| Interactive plane (artifacts, Core) | 1.0 | crisp, in focus, highest contrast |
| Foreground particles | 1.2 | slight lead, additive |
| HUD | screen-space | always nearest, no fog, always crisp |

Atmospheric perspective is mandatory: distance → less contrast, more fog tint, less saturation. DOF focal plane rides the interactive layer. HUD never receives world fog/DOF.

---

## PART III — MOOD BOARD (references → decisions)

**Movies** — *Blade Runner 2049* (fog, volumetric light, monumental scale) → environment & lighting; *Interstellar* (docking, restraint, awe) → camera & finale; *Tron: Legacy* (Signal light discipline) → neon strategy; *Dune* (monolithic scale) → architecture; *Ex Machina* (calm glass tech) → glass & mood; *Arrival* (mono type, awe) → typography.

**Games** — *Death Stranding* (traversal, diegetic UI, atmosphere) → interaction & HUD; *Cyberpunk 2077* (HUD grammar) → iconography; *Control* (brutalist shifting spaces) → architecture; *Returnal/Housemarque* (particle VFX) → particle strategy; *Horizon* (holographic UI) → schematics; *Journey* (emotional traversal) → story arc; *Destiny* (menu craft) → UI polish; *Inside/Limbo* (silhouette lighting) → chiaroscuro.

**Architecture** — Zaha Hadid (parametric fluidity) → shape detail; Tadao Ando (concrete + light shafts) → lighting; Brutalism / Kubrick monolith → mass; Foster/Apple Park (glass tolerance) → precision; subterranean vaults & cathedral verticality → the Spine.

**Photography** — Todd Hido (fog, night, mood); low-key chiaroscuro portraiture → lighting ratios; long-exposure light trails → Signal streams; astrophotography/nebulae → depth & void; Apple product photography → material rendering & image treatment.

**Technology** — Apple Vision Pro renders (material realism) → 3D style; SpaceX telemetry/launch UI (real data drama) → HUD & boot %; Unreal Engine 5 Lumen demos → lighting/fog benchmark; Teenage Engineering & Nothing (industrial restraint, transparent tech) → material & UI restraint; fusion-reactor imagery → The Core.

**Cars** — Porsche (precision restraint) → overall discipline; McLaren (carbon + orange accent) → **ember accent rule**; Lamborghini (sharp facets) → shape language; Rolls-Royce (quiet material luxury) → surface calm; concept/Vision GT cars → futurism; anodized/matte finishes → metal style.

**Fashion** — Rick Owens & Yohji Yamamoto (mastery of black) → neutral discipline; ACRONYM techwear (function + dark + accent zip) → ember accents & interaction feel; Balenciaga (monolithic silhouette) → mass; Bottega (quiet luxury) → restraint; Issey Miyake (pleats/parametric) → repeated structural rhythm.

**Lighting** — single-source chiaroscuro; motivated practicals; volumetric god-rays; warm-key/cool-fill duotone; bioluminescence & reactor glow; neon-in-fog → the entire lighting doctrine (§5, §11, §12).

**Materials** — obsidian, smoked glass, brushed gunmetal, carbon fiber, anodized aluminum, black ceramic, matte rubber, holographic film, molten core, edge-lit acrylic → the material system (§II.8).

**Nature** — aurora borealis (Signal flow); deep-sea bioluminescence (glow in darkness); crystalline geodes (The Core); volcanic magma (ember heat); deep-space nebulae (void/depth); lightning (energy bursts); obsidian rock & fog/ice (surfaces & atmosphere) → particles, Core, color, and mood.

---

## PART IV — THE ART BIBLE LAWS (immutable)

**Absolute laws (never violate):**
1. Near-black canvas; ≥~90% of every frame is neutral darkness + white/fog text.
2. ≤2 accent hues per frame. Flux = alive. Ember = act/reward (rationed). Rare = secrets only. Gold = the one legendary reward.
3. Depth is built with **light, fog, glow, layering** — not drop shadows or texture noise.
4. Glass is obsidian-dark and structural. No white frosted glassmorphism. Max 2 glass layers.
5. One custom icon family + diegetic HUD marks. No emoji, no third-party icon packs, no mixed sets.
6. One motion language: enter fast, settle slow, overlap, one hero motion per frame, physics-based. No cheap bounce except earned playfulness.
7. All motion runs on the single engine ticker (one RAF). No rogue loops.
8. Type is kinetic and self-hosted. Display grotesk / UI sans / mono data — never substitute families.
9. The camera is on a rail. Free orbit only in Inspect mode. Comfort clamps + reduced-motion always honored.
10. Content is DOM-first, accessible (AA, focus, reduced-motion, classic view). The work is never locked behind spectacle.
11. Every interaction responds within 100ms with physical feedback.
12. Nothing is fully static — the world always breathes.
13. Every color/motion/material choice must serve the raw→refined story.
14. When uncertain: **remove, darken, slow down, and let light do the work.**

**Definition of Done (visual QA checklist for any future component):**
- [ ] Uses only tokens from Part II (no raw hex/px/ms outside the scale).
- [ ] Passes the "≤2 accent hues, ~90% neutral" frame test.
- [ ] Depth via glow/fog/layer, not drop shadow.
- [ ] Radius chosen by element class (technical/interactive/nav/organic).
- [ ] Motion uses named durations + easings; ≤1 hero motion; <100ms feedback.
- [ ] Glow/border state set correctly for rest/hover/active/focus.
- [ ] Reduced-motion variant designed; keyboard focus visible & in-style.
- [ ] AA contrast verified; DOM-first for any readable text.
- [ ] Feels handcrafted by one studio — not a stitched library component.
- [ ] Advances the ATLAS story / belongs to the world.

**Cheat sheet (pin this):**
`void #05050A` · `obsidian #0B0D14` · `graphite #14161F` · `fog #8A93A6` · `white #F4F4F8` · `flux #5B8CFF→#00E5C4` · `ember #FF6A3D` · `rare #A16BFF` — spacing ×8 — radius by class — durations 80/140/240/400/700/1400/3000 — ease `(0.16,1,0.3,1)` — depth = light+fog+glow — **when in doubt, restraint.**
