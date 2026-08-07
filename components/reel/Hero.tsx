"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";
import { useVelocitySkew } from "@/components/ui/motion";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { hero, person } from "@/lib/content";
import { Magnetic } from "@/components/ui/Magnetic";

const FlowField = dynamic(() => import("@/components/three/FlowField"), {
  ssr: false,
});

/**
 * The hero is a pitch, not a poster. Left: the offer, the proof chips and
 * two CTAs. Right: the hook — a huge lime figure cycling through the three
 * UAE facts (0% / 9% / 100%). A visitor who never scrolls still leaves
 * knowing exactly what's on offer and how to start.
 */
export function Hero({ started }: { started: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const hookRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const smearRef = useVelocitySkew<HTMLDivElement>(0.4, 5);
  const { scrollTo } = useSmoothScroll();

  // Starts mounted — this is the top of the page. The observer's only job
  // is releasing the scene once you've scrolled well past it.
  const [near, setNear] = useState(true);
  const [sceneKey, setSceneKey] = useState(0);
  const reduced = useReducedMotion();
  const fine = useFinePointer();

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

  // Intro: words rise, then the supporting stack staggers in.
  useEffect(() => {
    const headline = headlineRef.current;
    const section = sectionRef.current;
    if (!headline || !section || !started) return;

    if (reduced) {
      gsap.set(section.querySelectorAll("[data-intro]"), {
        autoAlpha: 1,
        y: 0,
      });
      return;
    }

    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      split = new SplitText(headline.querySelectorAll("[data-line]"), {
        type: "words",
        mask: "words",
      });
      gsap.from(split.words, {
        yPercent: 115,
        duration: 1.15,
        stagger: 0.05,
        ease: "expo.out",
        delay: 0.1,
      });

      gsap.fromTo(
        section.querySelectorAll("[data-intro]"),
        { autoAlpha: 0, y: 22 },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          stagger: 0.07,
          delay: 0.65,
          ease: "expo.out",
        },
      );
    }, section);

    return () => {
      split?.revert();
      ctx.revert();
    };
  }, [started, reduced]);

  // The hook: 0% -> 9% -> 100%, sliding through a mask on a loop.
  useEffect(() => {
    const wrap = statsRef.current;
    if (!wrap || reduced || !started) return;

    const items = gsap.utils.toArray<HTMLElement>("[data-stat]", wrap);
    if (items.length < 2) return;

    // Everything except the first waits below the mask.
    gsap.set(items.slice(1), { yPercent: 110 });

    const tl = gsap.timeline({ repeat: -1, delay: 1.6 });
    items.forEach((item, i) => {
      const next = items[(i + 1) % items.length];
      tl.to(
        item,
        { yPercent: -110, duration: 0.75, ease: "expo.inOut" },
        "+=2.3",
      ).fromTo(
        next,
        { yPercent: 110 },
        { yPercent: 0, duration: 0.75, ease: "expo.inOut" },
        "<",
      );
    });

    return () => {
      tl.kill();
    };
  }, [reduced, started]);

  // The hook panel (giant stat + attribution) tilts toward the cursor in
  // 3D, the same language as the work reel's cards — one interaction
  // vocabulary reused instead of a hero-only gimmick.
  useEffect(() => {
    const section = sectionRef.current;
    const hook = hookRef.current;
    if (!section || !hook || reduced || !fine) return;

    gsap.set(hook, { transformPerspective: 1000 });
    const rx = gsap.quickTo(hook, "rotationX", {
      duration: 0.7,
      ease: "power3.out",
    });
    const ry = gsap.quickTo(hook, "rotationY", {
      duration: 0.7,
      ease: "power3.out",
    });

    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      ry(px * 10);
      rx(-py * 7);
    };
    const onLeave = () => {
      rx(0);
      ry(0);
    };

    section.addEventListener("pointermove", onMove, { passive: true });
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      gsap.killTweensOf(hook);
    };
  }, [reduced, fine]);

  // Exit: the whole frame lifts away and pulls into focus-blur as you
  // scroll into the marquee — a proper cinematic exit, not just a fade.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;

    const ctx = gsap.context(() => {
      gsap.to("[data-hero-inner]", {
        autoAlpha: 0,
        y: -90,
        scale: 0.96,
        filter: "blur(6px)",
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "80% top",
          scrub: true,
        },
      });

      // The hint fades out over the first sliver of scroll — once you're
      // actually scrolling, you don't need to be told to.
      gsap.to("[data-scroll-hint]", {
        autoAlpha: 0,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "12% top",
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  // The hint bounces gently on a loop — visible the instant the page
  // settles, no scroll or hover needed to notice it.
  useEffect(() => {
    const hint = scrollHintRef.current;
    if (!hint || reduced || !started) return;

    const tl = gsap.timeline({ repeat: -1, delay: 1.4 });
    tl.to(hint, { y: 8, duration: 0.9, ease: "sine.inOut" }).to(hint, {
      y: 0,
      duration: 0.9,
      ease: "sine.inOut",
    });

    return () => {
      tl.kill();
    };
  }, [reduced, started]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      // Pinned scroll-theatre on desktop; on phones the content is taller
      // than the viewport, so it flows naturally instead of being clipped
      // by a fixed-height sticky frame.
      className="relative lg:h-[135vh]"
      aria-label="Introduction"
    >
      <div className="relative overflow-hidden lg:sticky lg:top-0 lg:h-dvh">
        {near && !reduced && (
          <div className="absolute inset-0 z-0">
            <FlowField
              key={sceneKey}
              onContextLost={() => setSceneKey((k) => k + 1)}
            />
          </div>
        )}

        <div
          data-hero-inner
          className="relative z-10 mx-auto grid max-w-[1600px] items-center gap-10 px-5 pt-28 pb-20 md:px-10 lg:h-full lg:grid-cols-[1.15fr_0.85fr] lg:gap-16 lg:pt-24 lg:pb-16"
        >
          {/* The offer */}
          <div ref={smearRef} className="will-change-transform">
            <div className="mb-6 flex flex-wrap items-center gap-x-5 gap-y-3">
              <p
                data-intro
                className="invisible flex items-center gap-3 font-mono text-[10px] tracking-[0.24em] text-cream-2 uppercase"
              >
                <span className="relative flex h-2 w-2 shrink-0">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-lime" />
                </span>
                {hero.kicker}
              </p>
              <p
                data-intro
                className="invisible flex items-center gap-2 rounded-full border border-lime/25 bg-lime/5 px-3 py-1.5 font-mono text-[9px] tracking-[0.16em] text-lime uppercase"
              >
                {person.available}
              </p>
            </div>

            <h1
              ref={headlineRef}
              className="font-display text-[clamp(2.7rem,6.2vw,6.2rem)] leading-[0.95] font-semibold tracking-[-0.035em]"
            >
              <span className="sr-only">
                {person.name} — {person.role}.{" "}
              </span>
              {hero.lines.map((line) => (
                <span
                  key={line.text}
                  data-line
                  className={`line-mask ${
                    line.outline ? "text-outline-lime" : "text-cream"
                  }`}
                >
                  {line.text}
                </span>
              ))}
            </h1>

            <p
              data-intro
              className="invisible mt-7 max-w-xl text-base leading-relaxed text-cream-2"
            >
              {hero.sub}
            </p>

            {/* Proof chips — the scan-read version of the whole site. */}
            <ul data-intro className="invisible mt-7 flex flex-wrap gap-2.5">
              {hero.chips.map((chip) => (
                <li
                  key={chip}
                  className="rounded-full border border-[var(--line)] px-3.5 py-2 font-mono text-[10px] tracking-[0.14em] text-cream-2 uppercase"
                >
                  {chip}
                </li>
              ))}
            </ul>

            <div
              data-intro
              className="invisible mt-9 flex flex-wrap items-center gap-5"
            >
              <Magnetic strength={0.28}>
                <a
                  href={`mailto:${person.email}?subject=Company registration enquiry`}
                  data-cursor
                  className="group inline-flex items-center gap-3 rounded-full bg-lime px-7 py-4 no-underline"
                >
                  <span className="font-display text-sm font-semibold tracking-tight text-coal">
                    {hero.primaryCta}
                  </span>
                  <span
                    aria-hidden
                    className="text-coal transition-transform duration-500 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </a>
              </Magnetic>

              <button
                onClick={() => scrollTo("#registrations")}
                data-cursor
                className="group inline-flex min-h-11 items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-cream-2 uppercase transition-colors duration-300 hover:text-lime"
              >
                {hero.secondaryCta}
                <span
                  aria-hidden
                  className="transition-transform duration-500 group-hover:translate-y-0.5"
                >
                  ↓
                </span>
              </button>
            </div>
          </div>

          {/* The hook — one figure at a time, huge and lime. */}
          <div
            data-intro
            ref={hookRef}
            className="invisible will-change-transform lg:justify-self-end"
          >
            <div
              ref={statsRef}
              className="relative h-[clamp(150px,24vw,300px)] w-full overflow-hidden lg:w-[36vw]"
            >
              {hero.stats.map((stat, i) => (
                <div
                  key={stat.value}
                  data-stat
                  className="absolute inset-0 flex flex-col justify-center will-change-transform"
                  // Reduced motion shows only the first fact, statically.
                  style={reduced && i > 0 ? { display: "none" } : undefined}
                >
                  <span className="font-display text-[clamp(5rem,15vw,12rem)] leading-[0.85] font-semibold tracking-[-0.04em] text-lime">
                    {stat.value}
                  </span>
                  <span className="mt-4 max-w-sm font-mono text-[11px] leading-relaxed tracking-[0.18em] text-cream-2 uppercase">
                    {stat.label}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-6 border-t border-[var(--line)] pt-4 font-mono text-[10px] tracking-[0.2em] text-cream-3 uppercase">
              {person.name} · {person.role} · {person.location}
            </p>
          </div>
        </div>

        <div
          data-scroll-hint
          ref={scrollHintRef}
          className="pointer-events-none absolute bottom-5 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 md:bottom-8"
        >
          <span className="font-mono text-[10px] tracking-[0.3em] text-cream-3 uppercase">
            Scroll
          </span>
          <svg
            width="10"
            height="14"
            viewBox="0 0 10 14"
            fill="none"
            aria-hidden
          >
            <path
              d="M1 1L5 12L9 1"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-cream-3"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
