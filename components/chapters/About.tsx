"use client";

import { useEffect, useRef } from "react";
import { gsap, Draggable, ScrollTrigger, SplitText } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks";
import { about, person } from "@/lib/content";

/** Deterministic scatter — must match between server and client render. */
const LAYOUT = [
  { x: 6, y: 12, r: -8 },
  { x: 38, y: 4, r: 5 },
  { x: 70, y: 14, r: -4 },
  { x: 14, y: 38, r: 7 },
  { x: 47, y: 32, r: -6 },
  { x: 76, y: 42, r: 9 },
  { x: 4, y: 62, r: -5 },
  { x: 33, y: 58, r: 8 },
  { x: 62, y: 66, r: -9 },
  { x: 20, y: 84, r: 4 },
  { x: 50, y: 86, r: -7 },
  { x: 78, y: 80, r: 6 },
];

const TONE: Record<string, string> = {
  blue: "bg-blue text-white border-blue",
  flare: "bg-flare text-white border-flare",
  mint: "bg-[#0f9d76] text-white border-[#0f9d76]",
  ink: "bg-ink text-paper-2 border-ink",
  paper: "bg-paper-2 text-ink border-ink/15",
};

export function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  // Heading reveal + the gradient wash drifting as the chapter scrolls.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;

    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      split = new SplitText("[data-about-heading]", {
        type: "lines",
        mask: "lines",
      });
      gsap.from(split.lines, {
        yPercent: 110,
        duration: 1.3,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: section, start: "top 70%" },
      });

      gsap.from("[data-about-body] p", {
        autoAlpha: 0,
        y: 24,
        duration: 1,
        stagger: 0.12,
        scrollTrigger: { trigger: "[data-about-body]", start: "top 82%" },
      });

      gsap.to("[data-wash]", {
        yPercent: -18,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, section);

    return () => {
      split?.revert();
      ctx.revert();
    };
  }, [reduced]);

  // The stickers: drop in, then become grabbable and throwable.
  useEffect(() => {
    const board = boardRef.current;
    if (!board) return;

    const chips = gsap.utils.toArray<HTMLElement>("[data-sticker]", board);
    if (!chips.length) return;

    if (reduced) {
      gsap.set(chips, { autoAlpha: 1, y: 0, scale: 1 });
      return;
    }

    // Resting tilt lives on the element so a thrown sticker knows where to
    // settle back to.
    const homeRotation = (el: HTMLElement) => Number(el.dataset.rot ?? 0);
    chips.forEach((chip) => gsap.set(chip, { rotation: homeRotation(chip) }));

    let zTop = 10;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        chips,
        { autoAlpha: 0, y: -40, scale: 0.86 },
        {
          autoAlpha: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          ease: "back.out(1.6)",
          stagger: { each: 0.05, from: "random" },
          scrollTrigger: { trigger: board, start: "top 78%" },
        },
      );
    }, board);

    const draggables = chips.map((chip) =>
      Draggable.create(chip, {
        type: "x,y",
        bounds: board,
        inertia: true,
        edgeResistance: 0.72,
        // Throwing a sticker should spin it a little — that's the whole joke.
        onPress() {
          gsap.to(this.target, {
            scale: 1.08,
            duration: 0.3,
            ease: "back.out(2)",
            overwrite: "auto",
          });
          gsap.set(this.target, { zIndex: ++zTop });
        },
        onDrag() {
          const home = homeRotation(this.target as HTMLElement);
          gsap.to(this.target, {
            rotation: home + gsap.utils.clamp(-22, 22, this.deltaX * 0.9),
            duration: 0.4,
            overwrite: "auto",
          });
        },
        onRelease() {
          gsap.to(this.target, {
            scale: 1,
            duration: 0.5,
            ease: "elastic.out(1, 0.5)",
            overwrite: "auto",
          });
        },
        onThrowComplete() {
          gsap.to(this.target, {
            rotation: homeRotation(this.target as HTMLElement),
            duration: 1.2,
            ease: "elastic.out(1, 0.4)",
            overwrite: "auto",
          });
        },
      })[0],
    );

    // Bounds are measured on create, so they have to be refreshed when the
    // board changes size.
    const onResize = () => draggables.forEach((d) => d.applyBounds(board));
    window.addEventListener("resize", onResize);
    ScrollTrigger.addEventListener("refresh", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      ScrollTrigger.removeEventListener("refresh", onResize);
      draggables.forEach((d) => d.kill());
      ctx.revert();
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative isolate overflow-hidden py-24 md:py-40"
      aria-label="About"
    >
      {/* Warm gradient wash — the colour chapter of the site. */}
      <div
        data-wash
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-1/4 -z-10 h-[150%]"
      >
        <div className="absolute top-[10%] left-[-10%] h-[55vw] w-[55vw] rounded-full bg-[radial-gradient(circle_at_center,#ffb03a_0%,transparent_62%)] opacity-45 blur-[70px]" />
        <div className="absolute top-[35%] right-[-12%] h-[52vw] w-[52vw] rounded-full bg-[radial-gradient(circle_at_center,#7b5cff_0%,transparent_62%)] opacity-35 blur-[80px]" />
        <div className="absolute bottom-[4%] left-[26%] h-[42vw] w-[42vw] rounded-full bg-[radial-gradient(circle_at_center,#2b44ff_0%,transparent_60%)] opacity-25 blur-[90px]" />
      </div>

      <div className="mx-auto grid max-w-[1500px] gap-16 px-5 md:px-10 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <div>
          <p className="mb-8 font-mono text-[10px] tracking-[0.28em] text-ink-3 uppercase">
            02 — Who
          </p>
          <h2
            data-about-heading
            className="text-major max-w-[13ch] font-medium"
          >
            {about.heading}
          </h2>
          <div
            data-about-body
            className="mt-10 max-w-xl space-y-5 text-base leading-relaxed text-ink-2"
          >
            {about.body.map((para) => (
              <p key={para.slice(0, 24)}>{para}</p>
            ))}
            <p className="pt-2 font-mono text-[11px] tracking-[0.18em] text-ink-3 uppercase">
              {person.location}
            </p>
          </div>
        </div>

        {/* The board. Chips are real content first, toys second. */}
        <div className="flex flex-col gap-4">
          <p className="font-mono text-[10px] tracking-[0.22em] text-ink-3 uppercase">
            Pick them up · throw them around
          </p>
          <div
            ref={boardRef}
            className="relative h-[420px] w-full touch-none rounded-3xl border border-ink/10 bg-paper-2/40 backdrop-blur-[2px] md:h-[520px]"
          >
            <ul className="contents">
              {about.stickers.map((sticker, i) => {
                const spot = LAYOUT[i % LAYOUT.length];
                return (
                  <li
                    key={sticker.label}
                    data-sticker
                    data-cursor="grab"
                    data-rot={spot.r}
                    style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                    className={`invisible absolute cursor-grab rounded-full border px-4 py-2.5 text-[13px] font-medium tracking-tight whitespace-nowrap shadow-[0_8px_24px_-12px_rgba(17,16,20,0.5)] select-none active:cursor-grabbing ${TONE[sticker.tone]}`}
                  >
                    {sticker.label}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
