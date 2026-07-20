# ATLAS — Scroll Storytelling Engine · SCENE MAP
### The site as one continuous, directed film — not sections with animations
**Status:** design for approval. **No implementation until approved.** Builds on the current stack (light premium + indigo, GSAP, Motion.dev, Lenis, Three, the engine's single RAF + scene-slot + CameraManager). The existing Hero becomes **Scene 00** of the film.

---

## 0. The core idea — "the Through-Line"
The reason the current site "feels like a landing page with animations" is that each section is a separate object that fades in. A film doesn't fade between shots — it **transforms**. So we introduce ONE persistent visual entity that **never disappears and never re-appears** — it only **reshapes**:

> **The Through-Line** — a single living indigo line/graph (the same intelligence network from the Hero). It is the connective tissue of the entire story. It collapses from the Hero network into one line, then continuously morphs into every diagram, chart, workflow, pipeline, product frame, growth curve and case-study connector, and finally blooms back into the network at the contact scene (a bookend loop).

Because one element carries through every scene, **nothing abruptly appears** — each scene is the previous scene *reshaped*. That is the whole engine.

**Design test per scene:** *Does this scene transform OUT of the previous one and INTO the next via a shared element — or does it cut/fade?* If it cuts or fades, redesign it.

---

## 1. The film's arc (why a visitor keeps scrolling)
A lead-gen story told cinematically: **Who → What → Proof → Trust → Invitation.** Each scroll answers "what happens next?" with a visible, unresolved transformation (the Through-Line is always mid-morph), so stopping feels like pausing a film mid-shot.

```
00 ARRIVAL      →  01 THE COMBINATION  →  02 FINANCE  →  03 TECHNOLOGY & AI
     ↓                                                          ↓
08 INVITATION   ←  07 ORIGIN  ←  06 THE NUMBERS  ←  05 PROOF  ←  04 BUSINESS & SCALING
     ↓
09 SIGNOFF
```

---

## 2. THE SCENE MAP (what transforms into what)
Every row: the scene, its message, what the **Through-Line becomes**, the **transform OUT → INTO** the next scene, the **GSAP technique**, and **what scroll drives**.

### Scene 00 — ARRIVAL  *(the current Hero, re-purposed as Act I opening)*
- **Message:** Abhishek Shah — Finance × Technology × AI.
- **Through-Line = ** the full intelligence network + the colossal word morph (Finance → Technology → Intelligence) → resolves to the lockup.
- **Transforms INTO 01:** the network **collapses inward** — all nodes/edges converge into a **single glowing line**; the lockup's letters **scatter into particles** that the line catches. (Typography dissolves into a diagram.)
- **GSAP:** master timeline; particle collapse; SplitText scatter; camera dolly-in (CameraManager). **Scroll drives:** word morph, network density, camera push, letter scatter.

### Scene 01 — THE COMBINATION  *(the thesis)*
- **Message:** "One operator. Three disciplines. Complete products." The rare combination is the value.
- **Through-Line = ** draws itself into a clean **3-node diagram** — Finance ◦ Technology&AI ◦ Business — all wired to a central **"your business"** node.
- **Transforms INTO 02:** the **Finance node detaches and scales forward** to fill the viewport (depth/scale choreography), its wire stretching into the next scene's chart axis.
- **GSAP:** SVG path draw (`drawSVG`-style via stroke-dashoffset), nodes FLIP into place, scale-to-fill depth transition. **Scroll drives:** line draw, node assembly, the Finance-node zoom.

### Scene 02 — FINANCE  *(capability 1)*
- **Message:** CFO-grade finance — UK · Dubai · India accounting, Xero/Sage, financial projections, P&L strategy, advisory.
- **Through-Line = ** becomes a **rising P&L / projection curve**; numbers count up; a ledger grid resolves into a single insight line.
- **Transforms INTO 03:** the projection curve **re-routes** — its control points migrate and the smooth curve **breaks into an AI-workflow graph** (curve → nodes+edges). (Dashboard transforms into AI workflow.)
- **GSAP:** SVG morph (path `d` interpolation), number count-up (progress-driven), mask reveal of ledger. **Scroll drives:** curve draw, number counters, curve→graph morph.

### Scene 03 — TECHNOLOGY & AI  *(capability 2 — a horizontal surprise)*
- **Message:** AI solutions & agents, automation, SaaS, websites, CRM, mobile apps, custom software.
- **Through-Line = ** morphs, in a **horizontal pinned track**, through a chain: **AI agent workflow → automation loop → CRM pipeline → mobile-app frame → website frame → custom-software block.** Each is the SAME line reshaping as you scroll sideways.
- **Transforms INTO 04:** the last frame **shrinks and docks** — the whole chain zooms out to reveal it's one system powering a business. (Products/pipelines/apps/sites — the example chain — realized as one continuous horizontal morph.)
- **GSAP:** horizontal ScrollTrigger (pinned, translateX), SVG morph between each form, clip-path frame reveals, FLIP dock. **Scroll drives:** horizontal travel, each morph beat, dock-out.

### Scene 04 — BUSINESS & SCALING  *(capability 3)*
- **Message:** Build, automate & scale — business development, call-center ops, team & process design.
- **Through-Line = ** the tech system **zooms out** and its output feeds a **growth curve** climbing across the frame (ops/team/process as feeding nodes).
- **Transforms INTO 05:** the growth curve's **peak accelerates into a single large number** (a result), which becomes the entry to proof.
- **GSAP:** scale/depth zoom-out, curve draw, node inflow, number FLIP hand-off. **Scroll drives:** zoom, curve growth, peak→number.

### Scene 05 — PROOF / WORK  *(case studies as transforming exhibits)*
- **Message:** Real outcomes — the combination applied. *(⛔ needs real projects + metrics.)*
- **Through-Line = ** the result number seeds an **exploding grid** of work; then a single case study **expands (shared-element)** to full-bleed: problem → system → result, big metrics counting.
- **Transforms INTO 06:** the expanded case study **collapses back**, its headline metric **scaling up** to become the numbers scene.
- **GSAP:** **FLIP** (grid ↔ expanded), clip-path/`mask` reveals, exploding-grid stagger, shared-element metric hand-off. **Scroll drives:** grid explode, case expand/collapse, metric scale.

### Scene 06 — THE NUMBERS  *(a large-typography pinned moment)*
- **Message:** Results at a glance (e.g., "£X saved · N systems shipped · N businesses scaled"). *(⛔ real figures.)*
- **Through-Line = ** briefly hidden *inside* the numerals (it draws the digits), then re-emerges.
- **Transforms INTO 07:** the numbers **dissolve into two long lines** (a finance path + an engineering path) that begin travelling toward each other.
- **GSAP:** huge SplitText numerals, pinned hold, digits→lines morph. **Scroll drives:** number assembly, dissolve-to-paths.

### Scene 07 — ORIGIN  *(about, told as transformation — not a bio card)*
- **Message:** Why the combination exists — a finance mind that learned to build. Human, brief.
- **Through-Line = ** the **"×"** returns: two SVG paths (finance + engineering) **draw and cross** at a single point; short story lines reveal along them.
- **Transforms INTO 08:** the crossing point **blooms** — the single point re-expands into the full **intelligence network** (bookend to Scene 00).
- **GSAP:** dual path draw + crossing, text reveal along path, point→network bloom. **Scroll drives:** path draw, crossing, bloom.

### Scene 08 — INVITATION  *(contact — the payoff, not a form)*
- **Message:** "Let's build, automate & scale yours." Primary CTA (book a call) + channels.
- **Through-Line = ** the fully-connected, gently pulsing network from the Hero — the loop closes; the CTA sits at its focal center, magnetic.
- **Transforms INTO 09:** a slow settle / exhale into the footer.
- **GSAP:** network re-bloom, CTA magnetic (Motion.dev), calm settle. **Scroll drives:** bloom completion, CTA emphasis.

### Scene 09 — SIGNOFF  *(footer)*
- Name, links, subtle. The film ends quietly.

---

## 3. What scroll controls (globally, every scene)
Scroll is the film's transport. Bound to it: **camera** (CameraManager dolly/push for the 3D backdrop), **the Through-Line's shape** (SVG morph / network state), **typography** (SplitText reveals, scale, mask), **numbers** (count-up), **light & background** (subtle temperature/vignette shifts per act), **cards/frames** (FLIP, clip-path, scale), **rotation/opacity/blur/depth**. Velocity adds subtle motion-blur/parallax. Nothing animates on its own timer during the story — the visitor is the projectionist.

---

## 4. Navigation reacts to story progress
- **Progress rail** (thin, right or top) fills with overall scroll; already prototyped in the Hero.
- **Chapter indicator:** a small morphing label — `00 · Arrival → 01 · Combination → 02 · Finance …` — updates smoothly (text morph) as each scene enters.
- **Header state:** transparent over Act I, translucent glass after; the primary CTA is always reachable; nav links deep-link to scenes and the film **scrubs** to them (no jump-cut).

---

## 5. The Scroll Storytelling Engine (architecture — reuses the foundation)
- **One continuous scroll** (Lenis) on the **single RAF** (engine ticker) — already wired; GSAP ScrollTrigger synced to Lenis.
- **`SceneDirector`** — a coordinator that registers scenes in order and owns a **master GSAP timeline** plus per-scene **pinned ScrollTriggers** with **nested timelines** (each scene's outro *is* the next scene's intro via shared elements). A `useScene({ id, timeline })` hook registers a scene's local timeline; the director handles pin spacing + ordering.
- **The Through-Line** is a persistent component (SVG for crisp morphs + the WebGL network for the bookends) that subscribes to global story progress and reshapes — the shared element across scenes.
- **Techniques:** GSAP **FLIP** (shared-element/layout), **SVG path morph** (diagram↔chart↔workflow), **clip-path / mask** reveals, **scale + depth (z/translateZ)** for expand-into, **container/nested timelines**, **progress-driven** counters. SplitText for type. Motion.dev for UI micro-interactions (cursor, CTAs, chapter label).
- **Shared elements across scene boundaries** implemented with FLIP + a small "portal" registry so a metric/number/frame can hand off from one scene to the next without unmount.
- **3D backdrop** (the network) persists via the existing scene-slot; CameraManager waypoints scrub with story progress for camera moves. 3D is tier-gated; the SVG Through-Line carries the story on low tiers.

---

## 6. Performance & accessibility (non-negotiable)
- **60fps:** transforms only (`x/y/scale/rotate/opacity/clip-path`), **FLIP instead of animating width/height/top**, `will-change` applied/removed around active scenes, `ScrollTrigger` pin-spacing tuned, scrub smoothing, no layout thrash, batch reads/writes. Heavy scenes lazy-mounted as they approach.
- **Single RAF** (engine ticker) — no new loops.
- **Reduced motion:** the film degrades to clean, static **scenes** (each readable, gentle fades only, no pin/scrub/horizontal) — full content, zero motion sickness.
- **SSR/SEO:** all copy, headings, case studies, numbers render as semantic HTML behind the choreography (crawlable); the story layer enhances.
- **Mobile:** simplified choreography (fewer simultaneous morphs, vertical substitutes for the horizontal track), touch-tuned, lighter 3D.

---

## 7. Build order (after approval — each step compiles, keeps 60fps, ends in a commit)
1. **`SceneDirector` + `useScene` + the Through-Line** (SVG spine + progress plumbing) — the engine, grey-boxed with 2 placeholder scenes to prove continuity end-to-end.
2. **Scene 00 → 01 transition** (Hero network collapse → diagram) — prove "transform, not cut."
3. **Chapter indicator + progress + header states.**
4. **Scenes 02 → 04** (Finance, Tech&AI horizontal, Business) — the capability morphs.
5. **Scenes 05 → 06** (Proof, Numbers) — FLIP/shared elements *(⛔ needs real content)*.
6. **Scenes 07 → 08 → 09** (Origin, Invitation, Signoff) — the loop closes.
7. **Perf + a11y + mobile + reduced-motion passes**, then final polish.

---

## 8. Dependencies / open items
- **Real content required** for Scenes 05 (case studies) and 06 (numbers/metrics), and specifics for 02–04 (which finance services, which tech projects, which business results to feature). Scenes 00–04 and the engine can be built with placeholders and swapped.
- **Decisions to confirm** below before implementation.
