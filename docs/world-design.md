# ATLAS — World Design Document (Phase 8B)
### One interconnected world · level design & choreography
**Builds on:** Creative Revision v2 (warm cinematic dark base + day→night arc, single **Lumen amber `#E9A96A`** accent, the **Monolith** centerpiece, materials over neon). **Keeps** all engineering. **Supersedes** the abstract "Spine descent / Foundries" world map in the GDD/ATLAS blueprint with a single, physically-continuous place. **No code.**

---

## 0. The world, in one breath
**ATLAS is a maker's observatory carved into a cliff at the edge of a calm sea of clouds.** One continuous structure — glass, concrete, brushed aluminium, dark wood — that you travel *through*, never cutting between rooms. You arrive at the summit at dawn and journey down and outward as the light turns to dusk, then night, then back to dawn. At its heart, in a great glass **Atrium**, the **Monolith** floats: the maker's guiding light and the hub every path connects to. The portfolio *is* the observatory — its rooms, workshops, machines and vaults. When visitors leave, they remember **a place they explored**, not a page they scrolled.

**Design test for every decision:** *Does this make it feel like a living place you move through — or like software you operate?* If the latter, cut it.

---

## 1. WORLD MAP
One structure. Continuous. A vertical spine (the **Grand Lift** + stairs) threads the levels; **bridges, doors and corridors** connect laterally; the **glass Atrium** at the heart is visible from almost everywhere, so you always feel *where you are*.

```
                        ☀ DAWN
  ┌───────────────────────────────────────────────┐  SUMMIT (outdoor)
  │  ① ARRIVAL — the Gate                          │  wake into the world
  └───────────────────┬───────────────────────────┘
                       │  Grand Lift descends
  ┌────────────────────▼──────────────────────────┐  UPPER
  │  ② THE ATRIUM  ★ CENTRAL HUB ★                 │  glass hall · the MONOLITH floats here
  │      ├─ branch → ③ ORIGIN ROOM (About)         │  a warm private study
  │      └─ (behind the Monolith) ✦ Cartographer's │  SECRET — personal alcove
  │            Alcove                               │
  └───────────────────┬───────────────────────────┘
                       │  corridor, morning light
  ┌────────────────────▼──────────────────────────┐  MID
  │  ④ THE WORKSHOP (craft & engineering)          │  benches, tools, a prototype
  │      └─ hatch ↓ ✦ The Understudy (SECRET)      │  early sketches / bloopers
  └───────────────────┬───────────────────────────┘
                       │  ⑤ THE BRIDGE (assembles as you cross)
  ┌────────────────────▼──────────────────────────┐
  │  branch off-bridge → ✦ Zero-G Cache (SECRET)   │  physics toy room
  └───────────────────┬───────────────────────────┘
  ┌────────────────────▼──────────────────────────┐  DEEPER · midday→dusk
  │  ⑥ THE INNOVATION LAB (AI)                     │  the Neural Core machine + AI work
  └───────────────────┬───────────────────────────┘
  ┌────────────────────▼──────────────────────────┐
  │  ⑦ THE GALLERY OF MACHINES (Skills)            │  each skill = a working machine
  └───────────────────┬───────────────────────────┘
  ┌────────────────────▼──────────────────────────┐  dusk
  │  ⑧ THE PROJECT VAULT (Projects)                │  testing bays / display chambers
  └───────────────────┬───────────────────────────┘
                       │  doors open outward to the cliff face
  ┌────────────────────▼──────────────────────────┐  OUTER · night falls
  │  ⑨ THE OBSERVATION DECK (vista / pause)        │  telescope · sea of clouds · stars
  └───────────────────┬───────────────────────────┘
  ┌────────────────────▼──────────────────────────┐  night
  │  ⑩ MISSION CONTROL (Contact)                   │  the transmit console
  └───────────────────┬───────────────────────────┘
  ┌────────────────────▼──────────────────────────┐  ☾ → ☀ dawn returns
  │  ⑪ LAUNCH PLATFORM (Departure / credits)       │  the world exhales; light returns
  └───────────────────────────────────────────────┘
```

**Map legend:**
- **Entry point:** ① Arrival (the Gate) — the only way in; a threshold, not a loader.
- **Central hub:** ② The Atrium with the Monolith — every route passes through or is visible from it; you can always look back and see it, reinforcing one connected place.
- **Connected environments:** ②–⑪ above, physically linked (lift, corridor, bridge, doors). **No teleports.**
- **Secret areas (3):** ✦ Cartographer's Alcove (behind the Monolith), ✦ The Understudy (hatch under the Workshop), ✦ Zero-G Cache (off the Bridge).
- **Hidden rooms** are entered by *interacting* (a switch, a misaligned panel, dragging the companion into a dock), then the camera detours in and back.
- **Vertical levels:** Summit → Upper (Atrium) → Mid (Workshop/Bridge) → Deeper (Lab/Gallery/Vault) → Outer (Deck) → Base (Mission Control/Launch). A real sense of descending into the cliff and out to its face.
- **Camera routes:** the **Main Rail** (continuous dolly along the spine) + **Detour arcs** (into rooms/secrets, then rejoin) + **Inspect orbits** (around a project object).
- **Scroll routes:** scroll drives the Main Rail (the journey). Optional exploration routes are opened by interaction, not scroll.
- **Optional exploration:** side-rooms and secrets are skippable; the main journey never requires them, but they reward curiosity.

---

## 2. JOURNEY MAP (minute by minute)
Target dwell: **4–7 minutes** on the golden path; **8–12** for explorers. Emotions engineered per beat.

| Time | Where | What happens | Emotion |
|---|---|---|---|
| **0:00–0:12** | Black → Gate | Real load felt as a single warm light **blooming** and breathing; ambient tone rises; no log, no %. | Stillness, anticipation |
| **0:12–0:30** | ① Arrival | The Gate opens onto the summit at dawn; fog parts; the observatory reveals below; the maker's name **materializes** quietly; "scroll to begin the descent." | Awe, invitation |
| **0:30–1:10** | Grand Lift → ② Atrium | The lift descends smoothly; glass walls slide past; you arrive in the Atrium and the **Monolith** turns to face you, warm seam glowing. The hub breathes. | Arrival, wonder |
| **1:10–1:40** | ③ Origin Room (optional branch) | A warm study: a desk, objects, a window. Hover objects → the maker's story surfaces as short lines. No "about text." | Intimacy, curiosity |
| **1:40–2:30** | ④ Workshop | You descend into craft: benches, tools, a **prototype on a table** you can rotate. Environmental storytelling (sketches pinned, materials). First **spark** collectible glints nearby. | Craft, groundedness |
| **2:30–3:00** | ⑤ Bridge | Scroll **assembles the bridge** plank by plank to cross a gap over the clouds — an unlock you *see*. A side path teases the Zero-G Cache. | Progression, delight |
| **3:00–3:50** | ⑥ Innovation Lab | The **Neural Core** machine thinks (slow, elegant, not neon); AI projects presented as running experiments you can nudge. | Intelligence, calm power |
| **3:50–4:40** | ⑦ Gallery of Machines | A hall where each **skill is a working machine** (see §9-skills); walking the gallery, machines wake as you pass. | Playful mastery |
| **4:40–5:40** | ⑧ Project Vault | Testing bays / display chambers; **projects are physical objects** you approach, open, operate; details in large elegant type + a few real metrics. | Substance, pride |
| **5:40–6:10** | ⑨ Observation Deck | Doors open to the cliff face; a **telescope**; the sea of clouds; **night has fallen**, stars out. A pause. Vantage reveals a hidden spark. | Serenity, scale |
| **6:10–6:40** | ⑩ Mission Control | A single warm **transmit console**; align it (tiny playful gesture) and send a message — the world listens. | Connection, intent |
| **6:40–7:15** | ⑪ Launch Platform | Sending **launches a light** that rises; **dawn returns**; a slow pull-back reveals the whole observatory you traveled, glowing with what you unlocked; credits; "return / share your run." | Catharsis, memory |
| **exit** | anywhere | Progress persists; returning visitors resume with the world remembering them. | Belonging |

Explorers branch into secrets (+2–5 min): Understudy, Zero-G Cache, Cartographer's Alcove — each a small, complete delight.

---

## 3. ENVIRONMENT DESCRIPTIONS
Each has its own identity; all share one art direction (materials + Lumen accent + light of that time of day).

- **① Arrival — the Gate.** Outdoor summit at dawn. Concrete threshold, a single great door, fog, warm horizon. Minimal. Sets the "you arrived somewhere" tone. *Time: dawn.*
- **② The Atrium (Hub).** A vast calm glass-and-concrete hall; the **Monolith** floats at center casting soft warm light and refracting the space; walkways radiate; glass reveals other levels. The emotional home base. *Time: early morning.*
- **③ Origin Room (About).** A warm, human study off the Atrium — dark wood, fabric chair, a lamp, personal objects on shelves. The maker's origin told through **objects you inspect**, never a paragraph. *Time: morning, lamp-lit.*
- **④ The Workshop (Engineering).** Brushed-aluminium benches, real tools, a **prototype table**, pinned sketches, raw materials. Where craft is felt. *Time: morning.*
- **⑤ The Bridge.** A span across a cloud-filled gap that **assembles as you cross**. Pure travel + unlock. *Time: late morning.*
- **⑥ Innovation Lab (AI).** Quiet, precise, glass-walled; the **Neural Core** — a slow, thinking machine of light and glass. AI projects as living experiments. *Time: midday.*
- **⑦ Gallery of Machines (Skills).** A long hall of **kinetic machines**, each a skill made physical, waking as you pass (see §9). *Time: afternoon.*
- **⑧ Project Vault (Projects).** Cathedral-quiet chambers and **testing bays**; each project a **physical object** in its own bay — a device, a model, a mechanism. *Time: dusk.*
- **⑨ Observation Deck (Pause).** Open to the cliff face and the **sea of clouds**; a brass-and-glass **telescope**; benches; stars emerging. A breath between substance and invitation. *Time: night falls.*
- **⑩ Mission Control (Contact).** Warm, focused; a single elegant **transmit console** (not a form) beneath a wide window on the night sky. *Time: night.*
- **⑪ Launch Platform (Departure).** Open platform; sending launches a rising light; **dawn returns**; the full observatory revealed. Credits. *Time: night → dawn.*
- **Secrets:** ✦ **Cartographer's Alcove** (behind the Monolith — a wall of the worlds the maker dreams of building), ✦ **The Understudy** (under the Workshop — process, failures, honesty), ✦ **Zero-G Cache** (off the Bridge — a room where gravity is off and you play).

---

## 4. INTERACTION INVENTORY
Every object has a purpose (wayfinding, storytelling, reward, or delight). Powered by existing engine (pointer, physics springs, scene-slot, events).

| Object | Where | Purpose / behaviour |
|---|---|---|
| **The Gate (great door)** | Arrival | Opens on first scroll — the entry ritual |
| **Grand Lift** | Arrival→Atrium & between levels | Scroll drives descent; the connective travel |
| **The Monolith** | Atrium (hub) | Guiding light; turns to face you; reacts to presence; pulses on interaction; the "home" object |
| **Companion object** ("the Spark-lamp") | follows you world-wide | Draggable/throwable physics toy; lights dark corners; docks into hidden locks to open secrets |
| **Blueprint / prototype table** | Workshop, Vault | Rotate/explore a project model with the pointer |
| **Mechanical arm / crane** | Workshop, Vault | Lifts and presents a project object on approach |
| **Assembling bridge** | Bridge | Planks lock in as you scroll across — visible unlock |
| **Neural Core machine** | Lab | A slow thinking sculpture; nudging it ripples light (AI skill/projects) |
| **Skill machines** (§9) | Gallery | Each wakes/operates as you pass or interact |
| **Display cases / testing chambers** | Vault | Open on approach to reveal a project |
| **Telescope** | Observation Deck | Look through → discover distant details / a hidden spark |
| **Transmit console** | Mission Control | Align + send (contact); triggers launch |
| **Doors, gates, hatches** | throughout | Physically connect spaces; some hide secrets |
| **Physical switches / dials** | Workshop, Control | Toggle lights, open panels, small satisfying feedback |
| **Interactive lights / soft LEDs** | throughout | Respond to proximity; the Lumen accent guides the eye |
| **Floating objects / motes ("sparks")** | throughout | Collectibles; drift, magnet to you when near |
| **Drones (quiet, few)** | Atrium, Lab | Ambient life; can be gently shooed; one carries a secret |
| **Observation benches, lamps, curtains, fabric** | Origin/Deck | Warmth, environmental storytelling, calm |

**Interaction laws:** everything responds within 100ms; the Lumen accent marks what's interactable; physics feels weighty and real; nothing blinks or nags; discovery over instruction.

---

## 5. CAMERA CHOREOGRAPHY (via existing `CameraManager` rail)
- **The Main Rail:** one continuous dolly threading the whole structure — descend the lift, glide corridors, cross the bridge, drift through halls, out to the deck, down to control. Feels like an unbroken **travelling shot**. Waypoints sampled by scroll progress.
- **Framing per environment:** each space has a "hero composition" (Monument-Valley-precise) the rail settles into — generous negative space, the subject lit by the accent.
- **Push-ins:** on approaching an interactive object, a gentle dolly-in focuses it (DOF on high tiers).
- **Inspect orbit:** the *only* free-look — orbit a project object, clamped, then release back to the rail.
- **The Vista pull-back:** Observation Deck and the finale use a slow, wide pull-back for scale/emotion.
- **Presence:** subtle pointer parallax + breathing on the whole rail (already built) — alive, **never shaky**. Cuts are forbidden except entering a secret (the one intentional shock).
- **Reduced motion:** the rail becomes gentle cross-fades between hero compositions; no travel sway.

---

## 6. SCROLL CHOREOGRAPHY (scroll = travel, never "reveal text")
Each segment is a **physical travel gesture**, and every scroll also advances the **day→night arc** (light temperature, shadow length, fog, sky):

| Scroll segment | Travel gesture | World change |
|---|---|---|
| Arrival → Atrium | **Grand Lift descends** | dawn → morning; fog thins |
| Atrium ↔ Origin Room | **step aside** into the study (optional) | warm lamp light |
| Atrium → Workshop | **walk a corridor** | morning light rakes across benches |
| Workshop → Lab | **the Bridge assembles** under you | late morning; wind, clouds below |
| Lab → Gallery | **glide through a threshold**; machines wake in sequence | midday brightness |
| Gallery → Vault | **descend stairs**; doors part | afternoon → dusk warms |
| Vault → Deck | **doors open to the cliff**; camera swings outward | dusk → night; stars ignite |
| Deck → Mission Control | **elevator down** into the base | full night |
| Control → Launch | **platform rises**; light launches | night → **dawn returns** |

Velocity still shapes feel (faster = more atmospheric motion) but stays elegant. No text is "revealed by scrolling"; text arrives *because you entered a place*.

---

## 7. LIGHTING PHILOSOPHY
- **Minimal white key + one warm accent.** Each environment lit by 1–2 soft, motivated white/neutral sources (a skylight, a lamp, the horizon) plus the **Lumen amber** used *only* to guide the eye and mark the interactive/important. Glow is never ambient decoration.
- **The Monolith is a practical light** — the warm heart whose glow you follow.
- **Day→night arc** is the master lighting timeline: colour temperature, shadow length, sky and fog shift continuously as you travel — the single strongest device for "this is a living place, and time is passing."
- **Volumetric, natural:** sun/skylight shafts through glass and fog (soft, not neon god-rays); real soft shadows + contact AO ground every object.
- **Restraint = expense:** most of the frame is quiet neutral material in beautiful light. Darkness and negative space are used with confidence.
- **Tier-gated cost:** full soft shadows / AO / volumetrics / glass transmission on high–ultra; simplified (baked/AO-lite, no transmission) on low–medium — same composition, lighter math.

---

## 8. MATERIAL PHILOSOPHY
One coherent material family across every space; identity comes from *proportion and light*, not color:
- **Brushed aluminium** — machined edges, low anisotropic specular (Dyson/Porsche restraint).
- **Glass** — transmission/refraction, subtle thickness, soft caustics (Atrium, Monolith, display cases).
- **Concrete** — matte, honest, warm-grey with micro-variation (structure, floors, Gate).
- **Dark wood** — warmth and humanity (Origin Room, benches, handrails).
- **Fabric** — softness and quiet (chairs, curtains, acoustic panels).
- **Soft LEDs** — thin, hidden light seams in the Lumen accent; never tubes of neon.
- **Minimal white lighting** + **one warm accent** — the whole palette.
Materials must read as *real and expensive*: correct roughness, real reflections, weight. No emissive-as-material except the single accent seam.

---

## 9. GAME MECHANICS
**Exploration-first, calm, rewarding.**
- **Movement = travel** through one continuous place (scroll-driven rail + interaction detours).
- **Collectibles — "Sparks" (motes of warm light):** ~10 hidden across the world; drift, magnet to you when near, chime softly, snap into the Monolith on collection. All found → the Monolith blooms fully + a hidden ending beat.
- **Unlockables:** the Bridge assembles, doors open, the Zero-G Cache activates, the Cartographer's wall lights — progression you *see*, tied to arrival and interaction.
- **Achievements:** quiet, tasteful (Journey/PS-trophy calm) — reached each environment, found each secret, collected all Sparks, an "unhurried" badge for lingering.
- **Physics toys:** the **Spark-lamp** companion (throw/drag, real inertia); the Zero-G Cache (bounce/float objects); loose tools on benches.
- **Meaningful discoveries:** secrets aren't gimmicks — the Understudy shows honest process, the Alcove shows ambition, the Cache is pure joy.
- **Environmental storytelling:** every room describes the maker through its objects and light — the "about" and "skills" are *felt*, not stated.
- **Skills as machines (Gallery of Machines) — original concepts:**
  - **React → "The Loom of Interfaces":** a floating rig that weaves glowing panels into being and dissolves them, endlessly, in rhythm.
  - **Three.js / WebGL → "The Orrery":** a holographic simulation — planets/particles of light computing their own motion inside a glass dome.
  - **Next.js → "The Routing Engine":** a brass switchboard of tracks; parcels of light travel routes, splitting and arriving (SSR/edge as physical delivery).
  - **TypeScript → "The Type-Foundry / Lathe":** a precision machine that casts rough shapes into exact, gleaming parts (types = precision).
  - **AI / ML → "The Neural Core"** (also anchors the Lab): a slow, breathing lattice of light that *considers* before it acts.
  - **Automation → "The Assembly Line":** a graceful robotic arm that repeats a perfect motion, building small objects untended.
  - **GSAP / Motion → "The Choreographer":** a kinetic mobile whose weighted arms trace elegant timed arcs — motion as sculpture.
  - **CRM / Systems → "The Archive Engine":** a quiet library mechanism that files and retrieves glowing records on rails.
  Each machine idles calmly and **performs** when you approach/interact — skills demonstrated, not listed.

---

## 10. WORLD CONSTRUCTION ORDER (how to build it, later)
Sequenced to de-risk and always stay shippable (each step compiles, keeps 60fps, reuses the scene-slot/level architecture). **No implementation now.**

1. **Re-skin the base first** (from Creative Revision v2): swap tokens → warm + Lumen amber; retire neon/HUD/terminal motifs. (Master lever; unblocks everything.)
2. **Grey-box the whole world** — the continuous structure + Main Rail as placeholder geometry (concrete blocks), validating scroll-as-travel, camera waypoints, and connectivity end-to-end. No art yet.
3. **Build the Monolith + Atrium (hub)** — the identity object and home base in final materials/light. First "expensive" moment.
4. **Vertical slice: Arrival → Atrium → Workshop** — one full connected run with real materials, day→night start, one interactive prototype, one Spark. Prove the feel.
5. **Material & lighting system** — the shared glass/aluminium/concrete/wood/fabric library + the day→night lighting timeline + tier gating.
6. **Environments in journey order** — Bridge, Lab (Neural Core), Gallery of Machines, Vault, Observation Deck. One at a time; each independently testable. (⛔ needs real project + skill content.)
7. **Mission Control + Launch + Departure** — contact console, launch sequence, finale pull-back.
8. **Interaction & physics layer** — companion Spark-lamp, doors/bridges/cranes, telescope, switches, project object interactions.
9. **Game layer** — Sparks collectibles, unlocks, achievements, secrets (Understudy, Zero-G Cache, Alcove), persistence.
10. **Sound pass** — ambient beds per environment (day→night crossfades), material foley (wire via existing `AudioManager`).
11. **Performance + accessibility + responsive pass** — tier tuning, reduced-motion "calm world", Classic View, mobile choreography, 60fps.
12. **Polish & secrets tuning** — the last 20% that wins the award: timing, light, restraint.

**Dependencies:** environment content (⑥–⑧) needs the real project list, skills, and bio (the one open item from the creative revision). Steps 1–5 can proceed with placeholders immediately.

---

## 11. What this supersedes
This document is the authoritative **level design / world layer**. It supersedes the GDD's abstract "Spine/Foundry descent" map with a single physical, connected world, while honoring **Creative Revision v2** (aesthetics) and the **Implementation Blueprint** (tech, unchanged). Future build phases realize this map; they do not re-architect.
