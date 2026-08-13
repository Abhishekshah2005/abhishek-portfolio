"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks";
import { manifesto, person } from "@/lib/content";

/**
 * The manifesto: pinned full-screen while the paragraph lights up word by
 * word under your scroll. Words marked *like this* in the copy turn blue.
 *
 * Reading speed is literally handed to the visitor — the scrub IS the
 * pacing, which is why this pattern beats a fade-in for long-ish copy.
 */
export function Manifesto() {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const reduced = useReducedMotion();

  // The asterisks are authoring syntax, not content.
  const plain = manifesto.replace(/\*/g, "");

  useEffect(() => {
    const section = sectionRef.current;
    const copy = copyRef.current;
    if (!section || !copy || reduced) return;

    // Which words are accents, by their index in the word stream.
    const accents = new Set<number>();
    manifesto.split(/\s+/).forEach((word, i) => {
      if (word.includes("*")) accents.add(i);
    });

    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      split = new SplitText(copy, { type: "words" });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      split.words.forEach((word, i) => {
        tl.to(
          word,
          {
            opacity: 1,
            color: accents.has(i) ? "#3fd0ff" : "#f2f1ec",
            duration: 1,
            ease: "none",
          },
          i,
        );
      });
    }, section);

    return () => {
      split?.revert();
      ctx.revert();
    };
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="manifesto"
      className={reduced ? "relative" : "relative h-[280vh]"}
      aria-label="About"
    >
      <div
        className={
          reduced
            ? "flex min-h-[60vh] items-center"
            : "sticky top-0 flex h-dvh items-center overflow-hidden"
        }
      >
        <div className="mx-auto w-full max-w-[1200px] px-5 md:px-10">
          {/* The chapter has no visible heading — the kicker + scrubbed
              paragraph ARE the design. A real (sr-only) h2 still completes
              the document outline for screen readers and crawlers. */}
          <h2 className="sr-only">
            About {person.name} — an accountant handling UAE, UK and US
            company registration and filings
          </h2>
          <p className="mb-8 font-mono text-[10px] tracking-[0.3em] text-cream-3 uppercase">
            01 — Who
          </p>
          <p
            ref={copyRef}
            className="font-display text-[clamp(1.7rem,4.2vw,4rem)] leading-[1.14] font-medium tracking-[-0.015em]"
            // Words start barely-there and are lit by the timeline. Reduced
            // motion never dims them in the first place.
            style={reduced ? undefined : { opacity: 1 }}
          >
            {reduced ? (
              plain
            ) : (
              // NOT text-cream/15: Tailwind v4 compiles that arbitrary-
              // opacity utility to `color-mix(in oklab, ...)`, which
              // computes to an oklab() string. GSAP's color tween can only
              // parse rgb/rgba/hsl/hsla/hex/named colors (see its
              // _colorExp source) — an oklab() starting value is simply
              // invisible to it, so the per-word reveal below silently
              // never fires. This is the one spot in the app where a GSAP
              // color tween's FROM state depends on inherited CSS colour,
              // so it's the one spot that needed the literal RGBA instead.
              <span style={{ color: "rgba(242, 241, 236, 0.15)" }}>
                {plain}
              </span>
            )}
          </p>
        </div>
      </div>
    </section>
  );
}
