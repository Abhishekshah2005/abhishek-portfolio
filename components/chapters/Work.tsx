"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { pointer } from "@/lib/pointer";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";
import { projects } from "@/lib/content";

export function Work() {
  const sectionRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<number | null>(null);
  const [open, setOpen] = useState<number | null>(null);

  const fine = useFinePointer();
  const reduced = useReducedMotion();
  const previewEnabled = fine && !reduced;

  // Rows rise into place as the chapter arrives.
  useEffect(() => {
    const list = listRef.current;
    if (!list || reduced) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-row]", {
        yPercent: 100,
        autoAlpha: 0,
        duration: 1.1,
        stagger: 0.09,
        ease: "expo.out",
        scrollTrigger: { trigger: list, start: "top 76%" },
      });
    }, list);

    return () => ctx.revert();
  }, [reduced]);

  // The floating preview chases the cursor with a lag — the effect only
  // works if it never quite catches up.
  useEffect(() => {
    const el = previewRef.current;
    if (!el || !previewEnabled) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.75, ease: "power3.out" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.75, ease: "power3.out" });

    const tick = () => {
      xTo(pointer.x);
      yTo(pointer.y);
    };
    gsap.ticker.add(tick);
    return () => gsap.ticker.remove(tick);
  }, [previewEnabled]);

  useEffect(() => {
    const el = previewRef.current;
    if (!el || !previewEnabled) return;
    gsap.to(el, {
      scale: active === null ? 0.6 : 1,
      autoAlpha: active === null ? 0 : 1,
      duration: 0.55,
      ease: "expo.out",
      overwrite: "auto",
    });
  }, [active, previewEnabled]);

  const toggle = (i: number) => {
    setOpen((prev) => (prev === i ? null : i));
    // Row heights changed, so anything pinned below has to re-measure.
    requestAnimationFrame(() => ScrollTrigger.refresh());
  };

  return (
    <section
      ref={sectionRef}
      id="work"
      className="relative py-24 md:py-40"
      aria-label="Selected work"
    >
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-8 border-b border-[var(--line)] pb-6">
          <div>
            <p className="mb-6 font-mono text-[10px] tracking-[0.28em] text-ink-3 uppercase">
              03 — Work
            </p>
            <h2 className="text-minor max-w-[16ch] font-medium">
              Problems I&apos;ve been handed, and what I did with them.
            </h2>
          </div>
          <p className="max-w-xs text-[13px] text-ink-3 md:text-right">
            Representative engagements. Names withheld — references available
            on request.
          </p>
        </div>

        <div
          ref={listRef}
          // Dim everything except the row under the cursor.
          onPointerLeave={() => setActive(null)}
          className="group/list"
        >
          {projects.map((project, i) => {
            const isOpen = open === i;
            const dimmed = active !== null && active !== i;

            return (
              <div
                key={project.slug}
                className="overflow-hidden border-b border-[var(--line)]"
              >
                <div data-row>
                  <button
                    onPointerEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    onBlur={() => setActive(null)}
                    onClick={() => toggle(i)}
                    aria-expanded={isOpen}
                    data-cursor={isOpen ? "close" : "open"}
                    className={`flex w-full items-baseline justify-between gap-6 py-7 text-left transition-opacity duration-500 md:py-10 ${
                      dimmed ? "opacity-25" : "opacity-100"
                    }`}
                  >
                    <span className="flex items-baseline gap-4 md:gap-8">
                      <span className="font-mono text-[10px] text-ink-3">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="text-minor font-display font-medium tracking-[-0.03em]">
                        {project.title}
                      </h3>
                    </span>
                    <span className="flex shrink-0 items-baseline gap-4 md:gap-10">
                      <span className="hidden font-mono text-[10px] tracking-[0.16em] text-ink-3 uppercase md:block">
                        {project.discipline}
                      </span>
                      <span
                        aria-hidden
                        className={`text-lg transition-transform duration-500 ${isOpen ? "rotate-45" : ""}`}
                      >
                        +
                      </span>
                    </span>
                  </button>
                </div>

                <div
                  className="grid transition-[grid-template-rows] duration-700 ease-[var(--ease-out-expo)]"
                  style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
                >
                  <div className="overflow-hidden">
                    <div className="grid gap-6 pb-10 md:grid-cols-[1fr_1.2fr] md:gap-16">
                      <div
                        aria-hidden
                        className="h-40 rounded-2xl md:h-56"
                        style={{
                          background: `linear-gradient(135deg, ${project.tone} 0%, ${project.tone}22 100%)`,
                        }}
                      />
                      <div className="flex flex-col justify-between gap-6">
                        <p className="max-w-prose text-base leading-relaxed text-ink-2">
                          {project.summary}
                        </p>
                        <p className="font-mono text-[10px] tracking-[0.18em] text-ink-3 uppercase">
                          {project.discipline} · {project.year}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Cursor-tracked preview. Decorative — everything it shows is also
          in the expanded panel. */}
      {previewEnabled && (
        <div
          ref={previewRef}
          aria-hidden
          className="pointer-events-none invisible fixed top-0 left-0 z-30 h-[240px] w-[320px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl will-change-transform"
          style={{ marginLeft: "-160px", marginTop: "-120px" }}
        >
          {projects.map((project, i) => (
            <div
              key={project.slug}
              className="absolute inset-0 flex flex-col justify-end p-6 transition-opacity duration-300"
              style={{
                opacity: active === i ? 1 : 0,
                background: `linear-gradient(150deg, ${project.tone} 0%, ${project.tone}cc 55%, #11101466 100%)`,
              }}
            >
              <span className="font-display text-xl font-medium text-white">
                {project.title}
              </span>
              <span className="mt-1 font-mono text-[10px] tracking-[0.16em] text-white/70 uppercase">
                {project.discipline}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
