"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { pointer } from "@/lib/pointer";
import { useFinePointer, useInView, useReducedMotion } from "@/lib/hooks";
import { capabilities } from "@/lib/content";
import { GhostIndex, useLineReveal, useScaleIn } from "@/components/ui/motion";

const RevealScene = dynamic(() => import("@/components/three/RevealScene"), {
  ssr: false,
});

export function Capabilities() {
  const { ref, inView } = useInView<HTMLElement>("300px");
  const listRef = useRef<HTMLDivElement>(null);
  const [sceneKey, setSceneKey] = useState(0);
  const reduced = useReducedMotion();
  const fine = useFinePointer();
  const shellRef = useScaleIn<HTMLDivElement>();
  const headingRef = useLineReveal<HTMLHeadingElement>();

  // Each lit item needs the cursor in its *own* coordinate space. Offsets
  // within the list are cached (they only change on resize) so the frame
  // loop costs one boundingRect read, not one per item.
  useEffect(() => {
    const el = listRef.current;
    if (!el || reduced || !fine) return;

    const items = gsap.utils.toArray<HTMLElement>(".lit-text", el);
    let offsets: { left: number; top: number }[] = [];

    const measure = () => {
      const base = el.getBoundingClientRect();
      offsets = items.map((item) => {
        const r = item.getBoundingClientRect();
        return { left: r.left - base.left, top: r.top - base.top };
      });
    };
    measure();

    const tick = () => {
      const base = el.getBoundingClientRect();
      const x = pointer.x - base.left;
      const y = pointer.y - base.top;
      for (let i = 0; i < items.length; i++) {
        const o = offsets[i];
        if (!o) continue;
        items[i].style.setProperty("--mx", `${x - o.left}px`);
        items[i].style.setProperty("--my", `${y - o.top}px`);
      }
    };

    gsap.ticker.add(tick);
    window.addEventListener("resize", measure);
    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("resize", measure);
    };
  }, [reduced, fine]);

  useEffect(() => {
    const el = listRef.current;
    if (!el || reduced) return;
    const ctx = gsap.context(() => {
      gsap.from("[data-cap-group]", {
        autoAlpha: 0,
        y: 40,
        duration: 1.1,
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: "top 78%" },
      });
    }, el);
    return () => ctx.revert();
  }, [reduced]);

  const lit = fine && !reduced;

  return (
    <section
      ref={ref}
      id="capabilities"
      className="relative"
      aria-label="Capabilities"
    >
      <div
        ref={shellRef}
        className="relative isolate overflow-hidden bg-[#0b0a0e] py-24 will-change-transform md:py-40"
      >
      <GhostIndex n="05" dark />
      {inView && !reduced && (
        <div aria-hidden className="absolute inset-0 -z-10">
          <RevealScene
            key={sceneKey}
            active={inView}
            onContextLost={() => setSceneKey((k) => k + 1)}
          />
          {/* The light is bright enough to wash out type where it lands.
              This scrim guarantees a contrast floor no matter where the
              cursor is, and still lets the glow read through. */}
          <div className="absolute inset-0 bg-[#0b0a0e]/45" />
        </div>
      )}

      <div className="mx-auto max-w-[1500px] px-5 md:px-10">
        <p className="mb-6 font-mono text-[10px] tracking-[0.28em] text-paper/55 uppercase">
          05 — What
        </p>
        <h2
          ref={headingRef}
          className="text-major mb-4 max-w-[16ch] font-medium text-paper"
        >
          Everything I can take off your desk.
        </h2>
        <p className="mb-16 max-w-md text-base leading-relaxed text-paper/60">
          {lit
            ? "Move your cursor — the list lights up as you go."
            : "Three ways I tend to be useful."}
        </p>

        <div
          ref={listRef}
          className="relative grid gap-12 md:grid-cols-3 md:gap-10"
        >
          {capabilities.map((group) => (
            <div data-cap-group key={group.group} className="flex flex-col gap-6">
              <div className="flex items-center gap-3">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: group.tint }}
                />
                <h3 className="font-display text-lg font-medium text-paper">
                  {group.group}
                </h3>
              </div>

              <ul className="flex flex-col gap-px">
                {group.items.map((item) => (
                  <li
                    key={item}
                    data-cursor
                    className={`group/item border-t border-paper/10 py-4 text-base leading-snug transition-colors duration-300 ${
                      lit ? "lit-text" : "text-paper/70"
                    }`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      </div>
    </section>
  );
}