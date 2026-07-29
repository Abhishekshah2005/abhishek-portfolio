"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ScrollTrigger } from "@/lib/gsap";
import { STAGES, journey } from "@/lib/journey";
import { useReducedMotion } from "@/lib/hooks";
import { person } from "@/lib/content";
import { Magnetic } from "@/components/ui/Magnetic";

const JourneyScene = dynamic(() => import("@/components/three/JourneyScene"), {
  ssr: false,
});

/** How much scroll each stage gets. Generous — the walk should not feel rushed. */
const VH_PER_STAGE = 125;

export function Journey() {
  const sectionRef = useRef<HTMLElement>(null);
  const [active, setActive] = useState(0);
  // Starts true: this is the top of the page, so it is near by definition.
  // The observer's job is deciding when to let the scene GO, not whether the
  // opening chapter is allowed to exist — waiting on a callback that a
  // throttled tab may never deliver would leave the hero empty.
  const [near, setNear] = useState(true);
  const [sceneKey, setSceneKey] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        journey.progress = self.progress;
        // React only hears about whole-stage changes; the frame-by-frame
        // value lives in the mutable store the scene reads.
        const index = Math.round(self.progress * (STAGES.length - 1));
        setActive((prev) => (prev === index ? prev : index));
      },
    });

    const io = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      { rootMargin: "200px" },
    );
    io.observe(section);

    return () => {
      st.kill();
      io.disconnect();
    };
  }, [reduced]);

  // Reduced motion gets the same story as plain, stacked sections.
  if (reduced) {
    return (
      <section id="journey" className="relative" aria-label="The journey">
        <h1 className="sr-only">
          {person.name} — {person.role}
        </h1>
        <div className="mx-auto max-w-3xl px-5 py-28 md:px-10">
          {STAGES.map((stage) => (
            <article
              key={stage.id}
              className="border-b border-[var(--line)] py-12 last:border-0"
            >
              <p className="mb-5 font-mono text-[10px] tracking-[0.28em] text-ink-3 uppercase">
                {stage.kicker}
              </p>
              <h2 className="text-minor mb-5 font-medium">{stage.title}</h2>
              <p className="max-w-prose text-base leading-relaxed text-ink-2">
                {stage.body}
              </p>
            </article>
          ))}
        </div>
      </section>
    );
  }

  const stage = STAGES[active];

  return (
    <section
      ref={sectionRef}
      id="journey"
      className="relative"
      style={{ height: `${STAGES.length * VH_PER_STAGE}vh` }}
      aria-label="The journey"
    >
      <div className="sticky top-0 h-dvh overflow-hidden select-none">
        {near && (
          <div className="absolute inset-0 z-0">
            <JourneyScene
              key={sceneKey}
              onContextLost={() => setSceneKey((k) => k + 1)}
            />
          </div>
        )}

        {/* Stable heading for crawlers and screen readers. The visible
            titles change as you walk, so they can't be the h1. */}
        <h1 className="sr-only">
          {person.name} — {person.role}
        </h1>

        {/* The landscape is doing whatever it likes behind the copy, so the
            copy gets its own footing rather than relying on luck. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-[5] w-full bg-gradient-to-r from-paper via-paper/80 to-transparent md:w-[62%]"
        />

        {/* The story. Crossfades as each stage takes over. */}
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center px-5 md:px-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -18 }}
              transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-xl"
            >
              <p className="mb-6 font-mono text-[10px] tracking-[0.28em] text-ink-3 uppercase">
                {stage.kicker}
              </p>
              <h2 className="text-major mb-6 font-medium text-ink">
                {stage.title}
              </h2>
              <p className="max-w-md text-base leading-relaxed text-ink-2">
                {stage.body}
              </p>

              {active === STAGES.length - 1 && (
                <div className="pointer-events-auto mt-9">
                  <Magnetic>
                    <a
                      href="#contact"
                      data-cursor="say hi"
                      className="group inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-paper-2 no-underline"
                    >
                      <span className="text-sm font-medium tracking-tight">
                        Start a conversation
                      </span>
                      <span
                        aria-hidden
                        className="transition-transform duration-500 group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </a>
                  </Magnetic>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Where you are in the walk. */}
        <div className="absolute right-5 bottom-6 z-10 flex flex-col items-end gap-2.5 md:right-10 md:bottom-10">
          {STAGES.map((s, i) => (
            <div key={s.id} className="flex items-center gap-3">
              <span
                className={`font-mono text-[10px] tracking-[0.2em] uppercase transition-colors duration-500 ${
                  i === active ? "text-ink" : "text-ink-3/60"
                }`}
              >
                {s.label}
              </span>
              <span
                className={`h-px transition-all duration-500 ease-[var(--ease-out-expo)] ${
                  i === active ? "w-9 bg-ink" : "w-4 bg-ink/25"
                }`}
              />
            </div>
          ))}
        </div>

        {active === 0 && (
          <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 md:bottom-10">
            <span className="font-mono text-[10px] tracking-[0.28em] text-ink-3 uppercase">
              Scroll to walk
            </span>
          </div>
        )}

        {/* No loading curtain here on purpose. An opaque cover over the
            copy means that if WebGL is slow, blocked or unavailable, the
            hero is a blank white screen. The page background is already
            paper, so the scene simply fades in over it. */}
      </div>
    </section>
  );
}
