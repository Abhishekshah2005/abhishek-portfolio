"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks";
import { useVelocitySkew } from "@/components/ui/motion";
import { hero, person } from "@/lib/content";
import { Magnetic } from "@/components/ui/Magnetic";

const FlowField = dynamic(() => import("@/components/three/FlowField"), {
  ssr: false,
});

export function Hero({ started }: { started: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const metaRef = useRef<HTMLDivElement>(null);
  const smearRef = useVelocitySkew<HTMLDivElement>(0.5, 7);

  // Starts mounted — this is the top of the page. The observer's only job
  // is releasing the scene once you've scrolled well past; a throttled tab
  // can delay its first callback indefinitely.
  const [near, setNear] = useState(true);
  const [sceneKey, setSceneKey] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const io = new IntersectionObserver(
      ([entry]) => setNear(entry.isIntersecting),
      { rootMargin: "200px" },
    );
    io.observe(section);
    return () => io.disconnect();
  }, []);

  // Intro: characters rise line by line once the preloader hands over.
  useEffect(() => {
    const title = titleRef.current;
    const meta = metaRef.current;
    if (!title || !meta || !started) return;

    if (reduced) {
      gsap.set(meta.querySelectorAll("[data-intro]"), { autoAlpha: 1, y: 0 });
      return;
    }

    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      split = new SplitText(title.querySelectorAll("[data-line]"), {
        type: "chars",
        mask: "chars",
      });
      gsap.from(split.chars, {
        yPercent: 118,
        duration: 1.15,
        stagger: 0.028,
        ease: "expo.out",
        delay: 0.1,
      });

      gsap.fromTo(
        meta.querySelectorAll("[data-intro]"),
        { autoAlpha: 0, y: 24 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1.1,
          stagger: 0.09,
          delay: 0.75,
          ease: "expo.out",
        },
      );
    });

    return () => {
      split?.revert();
      ctx.revert();
    };
  }, [started, reduced]);

  // Exit: the title splits apart vertically as the hero leaves — the first
  // scroll visibly *does* something to the frame.
  useEffect(() => {
    const section = sectionRef.current;
    const title = titleRef.current;
    if (!section || !title || reduced) return;

    const ctx = gsap.context(() => {
      const lines = title.querySelectorAll("[data-line]");
      gsap.to(lines[0], {
        yPercent: -34,
        autoAlpha: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to(lines[1], {
        yPercent: 34,
        autoAlpha: 0.25,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
      gsap.to("[data-hero-meta]", {
        autoAlpha: 0,
        y: -30,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "45% top",
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-[130vh]"
      aria-label="Introduction"
    >
      <div className="sticky top-0 h-dvh overflow-hidden">
        {near && !reduced && (
          <div className="absolute inset-0 z-0">
            <FlowField
              key={sceneKey}
              onContextLost={() => setSceneKey((k) => k + 1)}
            />
          </div>
        )}

        <div
          ref={smearRef}
          className="absolute inset-0 z-10 flex flex-col justify-center will-change-transform"
        >
          <h1
            ref={titleRef}
            className="px-4 text-center font-display font-semibold tracking-[-0.04em]"
          >
            <span className="sr-only">
              {person.name} — {person.role}
            </span>
            {hero.lines.map((line) => (
              <span
                key={line.text}
                data-line
                aria-hidden
                className={`line-mask text-mega leading-[0.84] ${
                  line.outline ? "text-outline" : "text-cream"
                }`}
              >
                {line.text}
              </span>
            ))}
          </h1>
        </div>

        <div
          ref={metaRef}
          data-hero-meta
          className="pointer-events-none absolute inset-0 z-20 flex flex-col justify-between p-5 md:p-10"
        >
          <div />
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <div data-intro className="invisible flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-lime" />
              <p className="font-mono text-[11px] tracking-[0.22em] text-cream-2 uppercase">
                {person.role}
              </p>
            </div>

            <p
              data-intro
              className="invisible max-w-md text-base leading-relaxed text-cream-2"
            >
              {hero.statement}
            </p>

            <div data-intro className="invisible">
              <Magnetic>
                <a
                  href="#contact"
                  data-cursor
                  className="group pointer-events-auto inline-flex items-center gap-3 rounded-full bg-lime px-7 py-4 no-underline"
                >
                  <span className="text-sm font-medium tracking-tight text-coal">
                    Start a conversation
                  </span>
                  <span
                    aria-hidden
                    className="text-coal transition-transform duration-500 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
              </Magnetic>
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-5 left-1/2 z-20 -translate-x-1/2 md:bottom-8">
          <span className="font-mono text-[10px] tracking-[0.3em] text-cream-3 uppercase">
            Scroll
          </span>
        </div>
      </div>
    </section>
  );
}
