"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks";
import { useLineReveal } from "@/components/ui/motion";
import { services } from "@/lib/content";

/**
 * Services as an index: oversized rows that hard-invert to lime on hover —
 * the row itself becomes the highlight, no decoration needed.
 *
 * Each service name is a real `<h3>` and carries a full sentence, not just a
 * tag — both so a scanning visitor gets an actual answer and so the section
 * has substantive, crawlable content rather than four-word labels.
 */
export function Services() {
  const listRef = useRef<HTMLUListElement>(null);
  const headingRef = useLineReveal<HTMLHeadingElement>();
  const reduced = useReducedMotion();

  useEffect(() => {
    const list = listRef.current;
    if (!list || reduced) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-row]", {
        yPercent: 40,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.07,
        ease: "expo.out",
        scrollTrigger: { trigger: list, start: "top 80%" },
      });
    }, list);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="services"
      className="relative px-5 py-24 md:px-10 md:py-40"
      aria-label="Services"
    >
      <div className="mb-14 flex items-end justify-between">
        <h2 ref={headingRef} className="text-minor max-w-[14ch] font-semibold">
          What I take <span className="text-outline-lime">off your desk</span>
        </h2>
        <p className="hidden font-mono text-[10px] tracking-[0.24em] text-cream-3 uppercase md:block">
          05 — Services
        </p>
      </div>

      <ul ref={listRef}>
        {services.map((service, i) => (
          <li key={service.name} className="overflow-hidden">
            <div
              data-row
              data-cursor
              className="group relative flex flex-col gap-3 border-t border-[var(--line)] py-6 md:py-8"
            >
              {/* The invert: lime floods up from the baseline, covering
                  whatever height the row (name + description) ends up. */}
              <span
                aria-hidden
                className="absolute inset-0 origin-bottom scale-y-0 bg-lime transition-transform duration-300 ease-[var(--ease-out-expo)] group-hover:scale-y-100"
              />

              <div className="relative flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1">
                <span className="flex items-baseline gap-5 md:gap-8">
                  <span className="font-mono text-[11px] text-cream-3 transition-colors duration-200 group-hover:text-coal/60">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-3xl font-semibold tracking-[-0.02em] transition-colors duration-200 group-hover:text-coal md:text-6xl">
                    {service.name}
                  </h3>
                </span>

                <span className="flex items-center gap-6">
                  <span className="font-mono text-[11px] tracking-[0.14em] text-cream-2 uppercase transition-colors duration-200 group-hover:text-coal/70">
                    {service.tag}
                  </span>
                  <span
                    aria-hidden
                    className="hidden text-2xl text-cream-3 transition-all duration-300 group-hover:translate-x-1 group-hover:text-coal md:block"
                  >
                    →
                  </span>
                </span>
              </div>

              <p className="relative max-w-2xl text-[15px] leading-relaxed text-cream-2 transition-colors duration-200 group-hover:text-coal/75 md:text-base">
                {service.description}
              </p>
            </div>
          </li>
        ))}
        <li aria-hidden className="border-t border-[var(--line)]" />
      </ul>
    </section>
  );
}
