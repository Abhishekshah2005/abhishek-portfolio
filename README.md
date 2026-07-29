# Abhishek Shah — portfolio

A single-page, scroll-driven portfolio. Six chapters, each with its own
signature interaction, so the site keeps introducing something new rather than
repeating one trick.

```bash
pnpm install
pnpm dev          # http://localhost:3000
pnpm typecheck && pnpm lint && pnpm build
```

## The chapters

| # | Chapter | Signature interaction |
|---|---------|----------------------|
| 00 | Preloader | Counter + peeling slat curtain |
| 01 | Hero | A liquid-glass lens that genuinely refracts the headline |
| 02 | About | Draggable, throwable skill stickers on a gradient wash |
| 03 | Work | Cursor-tracked project preview over an oversized index |
| 04 | Playground | Real rigid-body physics you can grab and throw |
| 05 | Capabilities | A cursor-carried light source lighting real 3D material |
| 06 | Contact | Per-character kinetic type + magnetic CTA |

## How it's put together

**One animation frame.** GSAP's ticker is the only `requestAnimationFrame` loop
on the page. Lenis' smooth scroll, the pointer easing, the cursor, and the
per-frame DOM writes all ride on it. Nothing starts its own loop.

**The hero headline lives in WebGL.** A DOM overlay can't be refracted by a
transmissive material — the glass has to have something in the scene to bend.
So the headline is drawn to a canvas texture, rendered on a plane, and the lens
sits in front of it. The reveal (each line masked to its own band, sliding up)
is done in the fragment shader, which is what lets the glass distort type
mid-animation. A real `<h1>` stays in the document the whole time for search
engines, screen readers, and anyone with reduced motion.

**WebGL contexts are rationed.** Browsers will drop a context when a page asks
for too much, and a dropped context leaves a permanently blank canvas. Each 3D
chapter mounts only when it's near the viewport and tears down when it isn't —
including the hero, whose transmission buffers are the most expensive thing
here. Every scene also listens for `webglcontextlost`, calls `preventDefault`,
and remounts itself.

**Scenes scale to the device.** `useDeviceTier` reads core count, memory, and
pointer type once; geometry detail, transmission samples, buffer resolution,
DPR, and physics object count all key off it.

## Accessibility

Not an afterthought — several things were built differently because of it:

- **Reduced motion** replaces rather than removes. The hero falls back to the
  DOM headline, the preloader is skipped entirely, the physics toy is swapped
  for an explanation, and smooth scrolling hands back to the platform.
- **Contrast is checked, not eyeballed.** Every text/background pair clears
  4.5:1, including the low-opacity meta text on dark chapters and the darkest
  stop of the travelling-light gradient.
- **Touch targets** are ≥44px throughout.
- **Focus is visible** everywhere — restyled, never removed.
- Full keyboard operation, a skip link, sequential headings, and `Escape` to
  close the mobile menu.

## Stack

Next.js 16 (App Router, static) · React 19 · TypeScript · Tailwind v4 ·
GSAP 3.15 (ScrollTrigger, SplitText, Draggable, Inertia) · Lenis ·
React Three Fiber + drei · Rapier physics · Archivo + Space Grotesk,
self-hosted.

## Content

All copy and data is in [`lib/content.ts`](lib/content.ts). See
[CONTENT.md](CONTENT.md) for what still needs replacing before launch.
