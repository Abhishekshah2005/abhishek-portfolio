"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";
import { useLineDraw, useLineReveal } from "@/components/ui/motion";
import { AccentShimmer } from "@/components/ui/AccentShimmer";
import { projects, type Project } from "@/lib/content";

/**
 * The work reel: a pinned horizontal strip of poster panels driven by
 * vertical scroll. Three motion layers, each on its own element so they
 * never fight:
 *
 *   1. the TRACK translates and velocity-skews (scroll)
 *   2. each PANEL fans like a film strip — tilted at the edges, straight
 *      and full-size at centre (scroll, via containerAnimation)
 *   3. the panel's INNER layers tilt in 3D toward the cursor, with the
 *      numeral and content on different z-planes (hover)
 *
 * Below md it's an honest vertical stack with simple entrance reveals.
 */
export function Reel() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  // Unmasked: this heading has AccentShimmer children (see motion.tsx for why).
  const headingRef = useLineReveal<HTMLHeadingElement>("top 82%", false);
  const drawRef = useLineDraw<HTMLSpanElement>();
  const progressRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || reduced) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const distance = () => track.scrollWidth - window.innerWidth;
      // Reused, not a second trigger: the same scrub that drives the pin
      // also fills the progress rail below the heading, so "how far
      // through the reel am I" always matches what's actually on screen.
      const setProgress = progressRef.current
        ? gsap.quickSetter(progressRef.current, "scaleX")
        : null;

      const scrollTween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${distance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => setProgress?.(self.progress),
        },
      });

      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", track);

      panels.forEach((panel) => {
        // Film-strip fan: leans in from the right, stands straight at
        // centre, leans away to the left. Applied to the panel frame —
        // the hover tilt lives on an inner element, so they can't fight.
        gsap
          .timeline({
            scrollTrigger: {
              trigger: panel,
              containerAnimation: scrollTween,
              start: "left right",
              end: "right left",
              scrub: true,
            },
          })
          .fromTo(
            panel,
            { rotation: 4, scale: 0.92, yPercent: 3 },
            { rotation: 0, scale: 1, yPercent: 0, ease: "none" },
          )
          .to(panel, { rotation: -4, scale: 0.92, yPercent: 3, ease: "none" });

        // Depth: background face and giant numeral cross the frame at
        // different speeds.
        const face = panel.querySelector("[data-face]");
        if (face) {
          gsap.fromTo(
            face,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: scrollTween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        }
        const num = panel.querySelector("[data-num]");
        if (num) {
          gsap.fromTo(
            num,
            { xPercent: 26 },
            {
              xPercent: -26,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: scrollTween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        }
      });

      // The strip smears with scroll velocity — the film feel.
      const setSkew = gsap.quickSetter(track, "skewX", "deg");
      let skew = 0;
      const tick = () => {
        const v = (scrollTween.scrollTrigger?.getVelocity() ?? 0) / -260;
        const target = gsap.utils.clamp(-5, 5, v);
        skew += (target - skew) * 0.1;
        setSkew(skew);
      };
      gsap.ticker.add(tick);

      return () => {
        gsap.ticker.remove(tick);
      };
    });

    // Mobile: no pin — cards simply rise in as they arrive.
    mm.add("(max-width: 767px)", () => {
      gsap.utils.toArray<HTMLElement>("[data-panel]", track).forEach((panel) => {
        gsap.from(panel, {
          y: 48,
          autoAlpha: 0,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: panel,
            start: "top 85%",
            toggleActions: "restart none restart reverse",
          },
        });
      });
    });

    return () => mm.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative scroll-mt-24 overflow-hidden"
      aria-label="Selected work"
    >
      {/* Padding matches the track's own md:px-[8vw] inset below — they used
          to disagree (px-10 vs 8vw), which left the heading and the first
          poster card starting at visibly different x-positions on a wide
          screen. */}
      <div className="flex items-end justify-between px-5 pt-24 pb-10 md:px-[8vw] md:pt-32">
        <h2 ref={headingRef} className="text-minor font-semibold">
          <AccentShimmer tone="cream">Selected</AccentShimmer>{" "}
          <AccentShimmer>work</AccentShimmer>
        </h2>
        <div className="text-right">
          <p className="flex items-center justify-end gap-2.5 font-mono text-[10px] tracking-[0.24em] text-cream-3 uppercase">
            <span
              ref={drawRef}
              aria-hidden
              className="block h-px w-8 origin-left bg-lime"
            />
            04 — Work
          </p>
          <p className="mt-1 hidden font-mono text-[10px] tracking-[0.24em] text-cream-2 uppercase md:block">
            {String(projects.length).padStart(2, "0")} case files · scroll →
          </p>
        </div>
      </div>

      {/* The reel's own progress — fills left to right exactly as far as
          you've scrubbed through the pinned strip below. Desktop only:
          mobile doesn't pin/scrub, so there's no "progress" to show. */}
      <div
        aria-hidden
        className="relative mx-5 hidden h-px bg-[var(--line)] md:mx-[8vw] md:block"
      >
        <div
          ref={progressRef}
          className="absolute inset-y-0 left-0 w-full origin-left scale-x-0 bg-lime"
        />
      </div>

      <div
        ref={trackRef}
        className="flex flex-col gap-8 px-5 pb-24 will-change-transform md:h-[78vh] md:flex-row md:items-center md:gap-[5vw] md:px-[8vw] md:pb-0"
      >
        {projects.map((project, i) => (
          <Panel
            key={project.slug}
            project={project}
            index={i}
            total={projects.length}
          />
        ))}

        {/* End card: the reel resolves into the ask. */}
        <div className="flex shrink-0 items-center justify-center py-10 md:h-full md:w-[38vw] md:py-0">
          <a
            href="#contact"
            data-cursor
            className="group flex flex-col items-start gap-4 no-underline"
          >
            <span className="text-major font-semibold text-outline transition-colors duration-500 group-hover:text-lime group-hover:[-webkit-text-stroke-width:0]">
              Yours
              <br />
              next?
            </span>
            <span className="font-mono text-[11px] tracking-[0.24em] text-cream-2 uppercase">
              Start a conversation →
            </span>
          </a>
        </div>
      </div>

      <p className="px-5 pb-10 font-mono text-[10px] tracking-[0.2em] text-cream-3 uppercase md:px-[8vw]">
        Representative engagements · names withheld · references on request
      </p>
    </section>
  );
}

/**
 * One poster. The frame takes the scroll choreography; everything inside
 * lives on a 3D-tilting stage with real depth between its layers.
 */
function Panel({
  project,
  index,
  total,
}: {
  project: Project;
  index: number;
  total: number;
}) {
  const frameRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const fine = useFinePointer();
  const reduced = useReducedMotion();

  // Cursor tilt — desktop only. rotationX/Y on the stage never collides
  // with the frame's scroll-driven rotation/scale.
  useEffect(() => {
    const frame = frameRef.current;
    const stage = stageRef.current;
    if (!frame || !stage || !fine || reduced) return;

    const rx = gsap.quickTo(stage, "rotationX", {
      duration: 0.7,
      ease: "power3.out",
    });
    const ry = gsap.quickTo(stage, "rotationY", {
      duration: 0.7,
      ease: "power3.out",
    });

    const onMove = (e: PointerEvent) => {
      const r = frame.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      ry(px * 9);
      rx(-py * 7);
    };
    const onLeave = () => {
      rx(0);
      ry(0);
    };

    frame.addEventListener("pointermove", onMove, { passive: true });
    frame.addEventListener("pointerleave", onLeave);
    return () => {
      frame.removeEventListener("pointermove", onMove);
      frame.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(stage);
    };
  }, [fine, reduced]);

  const nn = String(index + 1).padStart(2, "0");

  return (
    <article
      ref={frameRef}
      data-panel
      className="group relative shrink-0 md:h-[68vh] md:w-[56vw] lg:w-[44vw]"
      style={{ perspective: "1400px" }}
    >
      {/* The whole poster is one link to its full writeup on /work — the
          hover tilt and film-strip fan stay on `frameRef`/the transform
          chain above, unaffected by an <a> sitting in the middle of it. */}
      <Link href={`/work#${project.slug}`} data-cursor className="block h-full no-underline">
      <div
        ref={stageRef}
        className="relative h-full min-h-[440px] overflow-hidden rounded-3xl border border-[var(--line-soft)] bg-raise will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Layer 0 — the face: tone-washed gradient + a fine blueprint
            grid, oversized so its parallax never shows an edge. */}
        <div
          data-face
          aria-hidden
          className="absolute inset-y-0 left-[-10%] w-[120%]"
          style={{
            background: `
              radial-gradient(110% 85% at 80% 12%, ${project.tone}30 0%, transparent 52%),
              radial-gradient(80% 80% at 8% 95%, ${project.tone}1a 0%, transparent 58%),
              linear-gradient(155deg, #18181c 0%, #101014 55%, #0c0c0f 100%)
            `,
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.16]"
            style={{
              backgroundImage: `
                linear-gradient(${project.tone}22 1px, transparent 1px),
                linear-gradient(90deg, ${project.tone}22 1px, transparent 1px)
              `,
              backgroundSize: "56px 56px",
            }}
          />
        </div>

        {/* Layer 1 — the numeral: the card's artwork, not a watermark.
            Outlined in the project tone, floating on its own z-plane. */}
        <span
          data-num
          aria-hidden
          className="absolute top-1/2 right-[-4%] -translate-y-1/2 font-display text-[13rem] leading-none font-semibold tracking-[-0.05em] opacity-45 transition-opacity duration-500 group-hover:opacity-80 md:text-[19rem]"
          style={{
            color: "transparent",
            WebkitTextStroke: `2px ${project.tone}`,
            transform: "translateZ(70px) translateY(-50%)",
          }}
        >
          {nn}
        </span>

        {/* Layer 2 — the content, lifted off the face. */}
        <div
          className="relative flex h-full flex-col justify-between p-7 md:p-10"
          style={{ transform: "translateZ(40px)" }}
        >
          <div className="flex items-baseline justify-between">
            <span
              className="font-mono text-[11px] tracking-[0.22em]"
              style={{ color: project.tone }}
            >
              {nn} / {String(total).padStart(2, "0")}
            </span>
            <span className="font-mono text-[10px] tracking-[0.18em] text-cream-3 uppercase">
              {project.year}
            </span>
          </div>

          <div className="max-w-lg">
            <span
              className="mb-4 inline-block rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] uppercase"
              style={{
                borderColor: `${project.tone}66`,
                color: project.tone,
              }}
            >
              {project.discipline}
            </span>
            <h3 className="font-display text-3xl font-semibold tracking-[-0.02em] md:text-5xl">
              {project.title}
            </h3>

            {/* The summary keeps its space and fades up on hover, so the
                reveal never shifts the title. Always visible on touch. */}
            <p className="mt-4 text-[15px] leading-relaxed text-cream-2 transition-all duration-500 ease-[var(--ease-out-expo)] md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100">
              {project.summary}
            </p>

            {/* Not a link of its own — the whole card already is one
                (see the wrapping <Link> above). This just signals it. */}
            <span
              aria-hidden
              className="relative z-10 mt-5 inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] uppercase transition-transform duration-300 group-hover:translate-x-1"
              style={{ color: project.tone }}
            >
              Full case study
              <span aria-hidden>↗</span>
            </span>
          </div>
        </div>

        {/* Hover glow — the tone leaks out of the card edges. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            boxShadow: `inset 0 0 0 1px ${project.tone}55, inset 0 0 120px -60px ${project.tone}66`,
          }}
        />
      </div>
      </Link>
    </article>
  );
}
