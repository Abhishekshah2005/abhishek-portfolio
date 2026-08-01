"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks";
import { projects, type Project } from "@/lib/content";

/**
 * The work reel: a pinned horizontal strip of poster panels driven by
 * vertical scroll. Desktop only — below md it's an honest vertical stack,
 * because pinned horizontal scroll on touch is misery.
 */
export function Reel() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track || reduced) return;

    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const distance = () => track.scrollWidth - window.innerWidth;

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
        },
      });

      // Inner parallax: each poster's face slides against its frame while
      // the frame crosses the viewport — the two speeds are the depth.
      const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", track);
      panels.forEach((panel) => {
        const face = panel.querySelector("[data-face]");
        if (!face) return;
        gsap.fromTo(
          face,
          { xPercent: -10 },
          {
            xPercent: 10,
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
      });

      // The strip smears with scroll velocity — the reel's film feel.
      const setSkew = gsap.quickSetter(track, "skewX", "deg");
      let skew = 0;
      const tick = () => {
        const v = (scrollTween.scrollTrigger?.getVelocity() ?? 0) / -260;
        const target = gsap.utils.clamp(-6, 6, v);
        skew += (target - skew) * 0.1;
        setSkew(skew);
      };
      gsap.ticker.add(tick);

      return () => {
        gsap.ticker.remove(tick);
      };
    });

    return () => mm.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative overflow-hidden"
      aria-label="Selected work"
    >
      <div className="flex items-end justify-between px-5 pt-24 pb-10 md:px-10 md:pt-32">
        <h2 className="text-minor font-semibold">
          Selected <span className="text-outline-lime">work</span>
        </h2>
        <p className="font-mono text-[10px] tracking-[0.24em] text-cream-3 uppercase">
          02 — {String(projects.length).padStart(2, "0")} problems
        </p>
      </div>

      <div
        ref={trackRef}
        className="flex flex-col gap-6 px-5 pb-24 will-change-transform md:h-[78vh] md:flex-row md:items-center md:gap-[5vw] md:px-[8vw] md:pb-0"
      >
        {projects.map((project, i) => (
          <Panel key={project.slug} project={project} index={i} />
        ))}

        {/* End card: the reel resolves into the ask. */}
        <div className="flex shrink-0 items-center justify-center md:h-full md:w-[38vw]">
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

      <p className="px-5 pb-10 font-mono text-[10px] tracking-[0.2em] text-cream-3 uppercase md:px-10">
        Representative engagements · names withheld · references on request
      </p>
    </section>
  );
}

function Panel({ project, index }: { project: Project; index: number }) {
  return (
    <article
      data-panel
      className="relative shrink-0 overflow-hidden rounded-2xl bg-raise md:h-[70vh] md:w-[56vw] lg:w-[46vw]"
    >
      {/* The poster face — oversized so the parallax never shows an edge. */}
      <div
        data-face
        aria-hidden
        className="absolute inset-y-0 left-[-12%] w-[124%]"
        style={{
          background: `
            radial-gradient(120% 90% at 78% 18%, ${project.tone}2e 0%, transparent 55%),
            radial-gradient(90% 90% at 12% 88%, ${project.tone}17 0%, transparent 60%),
            linear-gradient(160deg, #17171b 0%, #101013 60%, #0c0c0e 100%)
          `,
        }}
      >
        <span
          className="absolute top-6 right-8 font-display text-[9rem] leading-none font-semibold opacity-[0.07] md:text-[15rem]"
          style={{ color: project.tone }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
      </div>

      <div className="relative flex h-full min-h-[380px] flex-col justify-between p-7 md:p-10">
        <div className="flex items-center justify-between">
          <span
            className="rounded-full border px-3 py-1.5 font-mono text-[10px] tracking-[0.18em] uppercase"
            style={{ borderColor: `${project.tone}55`, color: project.tone }}
          >
            {project.discipline}
          </span>
          <span className="font-mono text-[10px] text-cream-3">
            {project.year}
          </span>
        </div>

        <div className="max-w-md">
          <h3 className="mb-4 font-display text-3xl font-semibold tracking-[-0.02em] md:text-5xl">
            {project.title}
          </h3>
          <p className="text-[15px] leading-relaxed text-cream-2 md:text-base">
            {project.summary}
          </p>
        </div>
      </div>
    </article>
  );
}
