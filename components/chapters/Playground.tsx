"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useInView, useReducedMotion } from "@/lib/hooks";
import { playground } from "@/lib/content";
import { Magnetic } from "@/components/ui/Magnetic";

const PlaygroundScene = dynamic(
  () => import("@/components/three/PlaygroundScene"),
  { ssr: false },
);

export function Playground() {
  const { ref, inView } = useInView<HTMLElement>("300px");
  const [resetKey, setResetKey] = useState(0);
  const [sceneKey, setSceneKey] = useState(0);
  const reduced = useReducedMotion();

  return (
    <section
      ref={ref}
      id="playground"
      className="relative bg-ink py-24 text-paper md:py-32"
      aria-label="Playground"
    >
      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="mb-6 font-mono text-[10px] tracking-[0.28em] text-paper/55 uppercase">
              04 — Play
            </p>
            <h2 className="text-major max-w-[14ch] font-medium text-paper">
              {playground.heading}
            </h2>
          </div>
          <div className="flex max-w-sm flex-col items-start gap-5">
            <p className="text-base leading-relaxed text-paper/60">
              {playground.body}
            </p>
            <Magnetic strength={0.25}>
              <button
                onClick={() => setResetKey((k) => k + 1)}
                data-cursor="reset"
                className="inline-flex min-h-11 items-center rounded-full border border-paper/25 px-6 text-[13px] text-paper transition-colors duration-300 hover:bg-paper hover:text-ink"
              >
                Drop them again
              </button>
            </Magnetic>
          </div>
        </div>

        <div className="relative h-[62vh] min-h-[380px] overflow-hidden rounded-3xl border border-paper/10 bg-[#0d0c10]">
          {/* Reduced motion gets a still arrangement rather than a physics
              sim it never asked for. */}
          {inView && !reduced && (
            <PlaygroundScene
              key={sceneKey}
              resetKey={resetKey}
              active={inView}
              onContextLost={() => setSceneKey((k) => k + 1)}
            />
          )}

          {reduced && (
            <div className="flex h-full items-center justify-center px-8 text-center">
              <p className="max-w-md text-base text-paper/60">
                An interactive physics toy lives here. It&apos;s disabled
                because your system asks for reduced motion.
              </p>
            </div>
          )}

          {!reduced && (
            <p className="pointer-events-none absolute bottom-5 left-1/2 -translate-x-1/2 font-mono text-[10px] tracking-[0.24em] text-paper/55 uppercase">
              {playground.hint}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
