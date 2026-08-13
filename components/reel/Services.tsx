"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks";
import { useLineDraw, useLineReveal } from "@/components/ui/motion";
import { SectionNumeral } from "@/components/ui/SectionNumeral";
import { AccentShimmer } from "@/components/ui/AccentShimmer";
import { services } from "@/lib/content";

/**
 * Services as a flip-card index. The front is the scan-read version (name,
 * tag, one-line pitch); the back is what a serious prospect actually wants
 * before they email — the included-work list. Both faces read the same
 * `service` object as the full writeup on `/services`, so the three views
 * can never say different things.
 *
 * Every card is a real link to its section on `/services` — the flip is a
 * preview, not the destination.
 */
export function Services() {
  const listRef = useRef<HTMLUListElement>(null);
  const headingRef = useLineReveal<HTMLHeadingElement>();
  const drawRef = useLineDraw<HTMLSpanElement>();
  const reduced = useReducedMotion();

  useEffect(() => {
    const list = listRef.current;
    if (!list || reduced) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-card]", {
        y: 36,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: {
          trigger: list,
          start: "top 80%",
          toggleActions: "restart none restart reverse",
        },
      });
    }, list);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      id="services"
      className="relative scroll-mt-24 overflow-hidden px-5 py-24 md:px-10 md:py-40"
      aria-label="Services"
    >
      <SectionNumeral n="05" />
      {/* Same container width as Companies/FAQ — every chapter now shares
          one rhythm instead of each picking its own. */}
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-6">
          <h2 ref={headingRef} className="text-minor max-w-[14ch] font-semibold">
            What I take <AccentShimmer>off your desk</AccentShimmer>
          </h2>
          <p className="hidden items-center gap-2.5 font-mono text-[10px] tracking-[0.24em] text-cream-3 uppercase md:flex">
            <span
              ref={drawRef}
              aria-hidden
              className="block h-px w-8 origin-left bg-lime"
            />
            05 — Services
          </p>
        </div>

        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <p className="max-w-md text-base leading-relaxed text-cream-2">
            Six ways I plug into a growing business — hover a card for what&apos;s
            included, or open the full writeup. Most clients start with one
            and add another once it earns its keep.
          </p>
          <Link
            href="/services"
            data-cursor
            className="group inline-flex shrink-0 items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-cream-2 uppercase no-underline transition-colors duration-300 hover:text-lime"
          >
            All services, in full
            <span
              aria-hidden
              className="transition-transform duration-500 group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>

        <ul
          ref={listRef}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {services.map((service, i) => (
            <li key={service.slug} data-card className="[perspective:1600px]">
              <Link
                href={`/services#${service.slug}`}
                data-cursor
                className="group block h-full no-underline"
                aria-label={`${service.name} — full details`}
              >
                <div className="relative h-full min-h-[300px] transition-transform duration-700 ease-[var(--ease-out-expo)] [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)] md:min-h-[340px]">
                  {/* Front — the scan-read pitch. */}
                  <div className="absolute inset-0 flex flex-col justify-between rounded-3xl border border-[var(--line)] bg-raise/60 p-7 [backface-visibility:hidden] md:p-8">
                    <div>
                      <div className="mb-5 flex items-center justify-between">
                        <span className="font-mono text-[11px] text-cream-3">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span
                          aria-hidden
                          className="text-lg text-cream-3 transition-all duration-300 group-hover:translate-x-1 group-hover:text-lime"
                        >
                          →
                        </span>
                      </div>
                      <h3 className="font-display text-2xl leading-tight font-semibold tracking-[-0.02em] md:text-3xl">
                        {service.name}
                      </h3>
                      <p className="mt-2 font-mono text-[10px] tracking-[0.16em] text-cream-3 uppercase">
                        {service.tag}
                      </p>
                    </div>
                    <p className="text-[14px] leading-relaxed text-cream-2 md:text-[15px]">
                      {service.description}
                    </p>
                  </div>

                  {/* Back — what's actually included, then the ask. */}
                  <div className="absolute inset-0 flex flex-col justify-between rounded-3xl border border-lime/25 bg-coal p-7 [backface-visibility:hidden] [transform:rotateY(180deg)] md:p-8">
                    <div>
                      <p className="mb-4 font-mono text-[10px] tracking-[0.2em] text-lime uppercase">
                        What&apos;s included
                      </p>
                      <ul className="flex flex-col gap-2.5">
                        {service.points.slice(0, 4).map((point) => (
                          <li
                            key={point}
                            className="flex items-baseline gap-2.5 text-[13px] leading-snug text-cream-2 md:text-[13.5px]"
                          >
                            <span aria-hidden className="text-lime">
                              →
                            </span>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <span className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-lime uppercase">
                      Full details
                      <span aria-hidden>→</span>
                    </span>
                  </div>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
