"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks";
import { useLineReveal } from "@/components/ui/motion";
import { credentials, jurisdictions } from "@/lib/content";

/**
 * The flagship chapter: company registration & filings across three flags.
 * UAE leads — it's the pitch — then the UK's full compliance stack, then US.
 *
 * Content-forward on purpose: this is the section that turns a visitor into
 * an enquiry, so the copy does the work and the motion stays supporting.
 */
export function Registrations() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useLineReveal<HTMLHeadingElement>();
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-juris]", section).forEach((block) => {
        gsap.from(block.querySelectorAll("[data-reveal]"), {
          yPercent: 40,
          autoAlpha: 0,
          duration: 1,
          stagger: 0.06,
          ease: "expo.out",
          scrollTrigger: { trigger: block, start: "top 78%" },
        });
      });

      gsap.from("[data-honest]", {
        autoAlpha: 0,
        y: 30,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-honest]", start: "top 85%" },
      });
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="registrations"
      className="relative px-5 py-24 md:px-10 md:py-40"
      aria-label="Company registration and filings"
    >
      <div className="mb-6 flex items-end justify-between">
        <h2 ref={headingRef} className="text-minor max-w-[18ch] font-semibold">
          Companies, registered &amp; kept{" "}
          <span className="text-outline-lime">compliant</span>
        </h2>
        <p className="hidden font-mono text-[10px] tracking-[0.24em] text-cream-3 uppercase md:block">
          02 — Companies
        </p>
      </div>
      <p className="mb-16 max-w-md text-base leading-relaxed text-cream-2 md:mb-20">
        UAE · UK · US — formation to filings, from one desk. Pick the flag
        that fits how you earn; I handle the paperwork on all three.
      </p>

      <div>
        {jurisdictions.map((j) => (
          <article
            key={j.code}
            data-juris
            className="grid gap-8 border-t border-[var(--line)] py-12 md:grid-cols-[minmax(0,0.8fr)_1.4fr] md:gap-14 md:py-16"
          >
            {/* The flag */}
            <div>
              <h3
                data-reveal
                className={`text-major leading-[0.85] font-semibold ${
                  j.why ? "text-outline-lime" : "text-outline"
                }`}
              >
                {j.code}
                {/* Visually "UAE"/"UK"/"US" stays huge and iconic; the full
                    name gives the heading itself real, crawlable text. */}
                <span className="sr-only"> — {j.name} company registration and filings</span>
              </h3>
              <p
                data-reveal
                className="mt-4 font-mono text-[10px] tracking-[0.24em] text-cream-3 uppercase"
              >
                {j.name}
              </p>
              <p data-reveal className="mt-3 max-w-xs text-base text-cream-2">
                {j.tagline}
              </p>
            </div>

            {/* The stack */}
            <div className="flex flex-col gap-10">
              <ul className="grid gap-x-10 sm:grid-cols-2">
                {j.services.map((item) => (
                  <li
                    key={item}
                    data-reveal
                    className="flex items-baseline gap-3 border-b border-[var(--line-soft)] py-3.5 text-[15px] leading-snug text-cream md:text-base"
                  >
                    <span
                      aria-hidden
                      className={`h-1.5 w-1.5 shrink-0 translate-y-[-1px] rounded-full ${
                        j.why ? "bg-lime" : "bg-cream-3"
                      }`}
                    />
                    {item}
                  </li>
                ))}
              </ul>

              {/* The UAE pitch — the reason this section exists. */}
              {j.why && (
                <div
                  data-reveal
                  className="rounded-2xl border border-lime/25 bg-raise p-6 md:p-8"
                >
                  <p className="mb-5 font-mono text-[10px] tracking-[0.24em] text-lime uppercase">
                    {j.why.title}
                  </p>
                  <ul className="grid gap-x-10 gap-y-3 md:grid-cols-2">
                    {j.why.points.map((point) => (
                      <li
                        key={point}
                        className="flex items-baseline gap-3 text-[15px] leading-snug text-cream md:text-base"
                      >
                        <span
                          aria-hidden
                          className="translate-y-[-1px] font-mono text-[11px] text-lime"
                        >
                          →
                        </span>
                        {point}
                      </li>
                    ))}
                  </ul>
                  <p className="mt-6 max-w-2xl text-[13px] leading-relaxed text-cream-2">
                    {j.why.note}
                  </p>
                </div>
              )}
            </div>
          </article>
        ))}
        <div aria-hidden className="border-t border-[var(--line)]" />
      </div>

      {/* The credentials, said plainly — trust is the product here. */}
      <aside
        data-honest
        className="mt-16 max-w-3xl rounded-2xl border border-[var(--line)] p-6 md:mt-20 md:p-8"
      >
        <p className="mb-4 font-mono text-[10px] tracking-[0.24em] text-lime uppercase">
          {credentials.kicker}
        </p>
        <p className="text-base leading-relaxed text-cream-2">
          {credentials.body}
        </p>
      </aside>

      <p className="mt-10 font-mono text-[10px] leading-relaxed tracking-[0.14em] text-cream-3 uppercase">
        Tax positions depend on your circumstances and current law — thresholds
        are confirmed before anything is filed.
      </p>
    </section>
  );
}
