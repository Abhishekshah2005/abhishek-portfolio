"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, SplitText } from "@/lib/gsap";
import { heroScroll } from "@/lib/scene-store";
import { useReducedMotion } from "@/lib/hooks";
import { heroLines, heroSub, person } from "@/lib/content";
import { Magnetic } from "@/components/ui/Magnetic";

// WebGL never runs on the server and never blocks first paint.
const HeroScene = dynamic(() => import("@/components/three/HeroScene"), {
  ssr: false,
});

export function Hero({ started }: { started: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const [sceneReady, setSceneReady] = useState(false);
  const [near, setNear] = useState(false);
  const [sceneKey, setSceneKey] = useState(0);
  const reduced = useReducedMotion();

  // Reduced motion gets the DOM headline instead of the WebGL one — same
  // words, same hierarchy, no movement.
  const useScene = !reduced;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const st = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        heroScroll.progress = self.progress;
      },
    });

    // The hero's transmission buffers are the most expensive thing on the
    // page. Once it's well off-screen the whole canvas is torn down, which
    // hands its WebGL context back to the browser for the chapters below.
    const io = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      { rootMargin: "150px" },
    );
    io.observe(section);

    return () => {
      st.kill();
      io.disconnect();
    };
  }, []);

  // Intro: the supporting copy comes in under the headline reveal.
  useEffect(() => {
    if (!started) return;
    const meta = metaRef.current;
    if (!meta) return;

    if (reduced) {
      gsap.set(meta.querySelectorAll("[data-intro]"), { autoAlpha: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        meta.querySelectorAll("[data-intro]"),
        { autoAlpha: 0, y: 26 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.08,
          delay: 0.9,
          ease: "expo.out",
        },
      );
    }, meta);

    return () => ctx.revert();
  }, [started, reduced]);

  // DOM headline reveal — only used when the scene isn't driving the type.
  useEffect(() => {
    const heading = headingRef.current;
    if (!heading || !started || (sceneReady && near)) return;
    if (reduced) return;

    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      split = new SplitText(heading.querySelectorAll("[data-line]"), {
        type: "lines",
        mask: "lines",
      });
      gsap.from(split.lines, {
        yPercent: 115,
        duration: 1.4,
        stagger: 0.09,
        ease: "expo.out",
      });
    }, heading);

    return () => {
      split?.revert();
      ctx.revert();
    };
  }, [started, sceneReady, near, reduced]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-[190vh]"
      aria-label="Introduction"
    >
      <div className="sticky top-0 h-dvh overflow-hidden">
        {useScene && near && (
          <div className="absolute inset-0 z-0">
            <HeroScene
              key={sceneKey}
              onReady={() => setSceneReady(true)}
              onContextLost={() => {
                setSceneReady(false);
                setSceneKey((k) => k + 1);
              }}
            />
          </div>
        )}

        {/* The real heading. Visible until (and unless) WebGL takes over
            drawing it, but always present for assistive tech and crawlers. */}
        <div
          className={`pointer-events-none absolute inset-0 z-10 flex items-center justify-center px-4 transition-opacity duration-700 ${
            sceneReady && near ? "opacity-0" : "opacity-100"
          }`}
        >
          <h1
            ref={headingRef}
            className="w-full max-w-[92vw] text-center font-display text-mega leading-[0.86] font-medium tracking-[-0.045em]"
          >
            <span className="sr-only">
              {person.name} — {person.role}
            </span>
            {heroLines.map((line) => (
              <span
                key={line.text}
                data-line
                aria-hidden
                className={`line-mask ${line.accent ? "text-blue" : "text-ink"}`}
              >
                {line.text}
              </span>
            ))}
          </h1>
        </div>

        {/* Supporting layer: sits above the glass, stays legible. */}
        <div
          ref={metaRef}
          className="absolute inset-0 z-20 flex flex-col justify-between p-5 md:p-10"
        >
          <div />

          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p
              data-intro
              className="invisible max-w-md text-base leading-relaxed text-ink-2"
            >
              {heroSub}
            </p>

            <div data-intro className="invisible flex items-center gap-5">
              <Magnetic>
                <a
                  href="#contact"
                  data-cursor="say hi"
                  className="group pointer-events-auto relative inline-flex items-center gap-3 rounded-full bg-ink px-7 py-4 text-paper-2 no-underline"
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
          </div>
        </div>

        {/* Scroll affordance — the reference sites all earn the first scroll. */}
        <div className="pointer-events-none absolute bottom-5 left-1/2 z-20 -translate-x-1/2 md:bottom-10">
          <span className="font-mono text-[10px] tracking-[0.28em] text-ink-3 uppercase">
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
}
