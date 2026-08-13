"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks";
import { useLineReveal } from "@/components/ui/motion";
import { Magnetic } from "@/components/ui/Magnetic";
import { AccentShimmer } from "@/components/ui/AccentShimmer";
import { contact, person, services, type Service } from "@/lib/content";

/**
 * The full writeup behind the homepage's flip cards. Same `services` array,
 * same copy — just every field shown instead of a four-line preview, so a
 * visitor who lands here straight from search gets the complete pitch, not
 * a teaser with nowhere to go.
 */
export function ServicesContent() {
  const heroHeadingRef = useLineReveal<HTMLHeadingElement>("top 90%");
  const reduced = useReducedMotion();

  return (
    <>
      <section className="relative overflow-hidden px-5 pt-32 pb-16 md:px-10 md:pt-40 md:pb-20">
        <div className="mx-auto max-w-[1320px]">
          <Link
            href="/#services"
            data-cursor
            className="group mb-8 inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.24em] text-cream-3 uppercase no-underline transition-colors duration-300 hover:text-lime"
          >
            <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
            Back to the overview
          </Link>
          <h1
            ref={heroHeadingRef}
            className="text-major max-w-[16ch] font-semibold"
          >
            <AccentShimmer tone="cream">Everything I take</AccentShimmer>{" "}
            <AccentShimmer>off your desk</AccentShimmer>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-cream-2 md:text-lg">
            Six ways I plug into a growing business — the finance function,
            the reporting nobody has time to build, and the software and
            automation that make both of those smaller jobs. Pick one, or
            stack a few; most clients start with one and add another once it
            earns its keep.
          </p>
        </div>
      </section>

      {services.map((service, i) => (
        <ServiceSection
          key={service.slug}
          service={service}
          index={i}
          total={services.length}
          reduced={reduced}
        />
      ))}

      <section className="border-t border-[var(--line)] px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto flex max-w-[1320px] flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-minor max-w-[16ch] font-semibold">
              <AccentShimmer tone="cream">Not sure which one</AccentShimmer>{" "}
              <AccentShimmer>you need?</AccentShimmer>
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-cream-2">
              {contact.body}
            </p>
          </div>
          <Magnetic strength={0.3}>
            <a
              href={`mailto:${person.email}?subject=Which service is right for me?`}
              data-cursor
              className="group inline-flex items-center gap-4 rounded-full bg-lime px-8 py-5 no-underline"
            >
              <span className="font-display text-base font-semibold tracking-tight text-coal">
                {contact.cta}
              </span>
              <span
                aria-hidden
                className="text-coal transition-transform duration-500 group-hover:translate-x-1.5"
              >
                →
              </span>
            </a>
          </Magnetic>
        </div>
      </section>
    </>
  );
}

function ServiceSection({
  service,
  index,
  total,
  reduced,
}: {
  service: Service;
  index: number;
  total: number;
  reduced: boolean;
}) {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useLineReveal<HTMLHeadingElement>("top 85%");

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;

    const ctx = gsap.context(() => {
      gsap.from(section.querySelectorAll("[data-reveal]"), {
        y: 28,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.06,
        ease: "expo.out",
        scrollTrigger: {
          trigger: section,
          start: "top 78%",
          toggleActions: "restart none restart reverse",
        },
      });
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  const nn = String(index + 1).padStart(2, "0");

  return (
    <article
      ref={sectionRef}
      id={service.slug}
      aria-label={service.name}
      className="scroll-mt-24 border-t border-[var(--line)] px-5 py-20 md:px-10 md:py-28"
    >
      <div className="mx-auto max-w-[1320px]">
        <div className="grid gap-10 md:grid-cols-[0.85fr_1.15fr] md:gap-16">
          {/* The pitch. */}
          <div>
            <p data-reveal className="mb-4 font-mono text-[11px] text-cream-3">
              {nn} / {String(total).padStart(2, "0")}
            </p>
            <h2 ref={headingRef} className="text-minor font-semibold">
              {service.name}
            </h2>
            <p
              data-reveal
              className="mt-2 font-mono text-[10px] tracking-[0.2em] text-cream-3 uppercase"
            >
              {service.tag}
            </p>
            <p
              data-reveal
              className="mt-6 max-w-md text-base leading-relaxed text-cream-2"
            >
              {service.description}
            </p>

            <div
              data-reveal
              className="mt-8 max-w-md rounded-2xl border border-[var(--line)] bg-raise/50 p-6"
            >
              <p className="mb-3 font-mono text-[10px] tracking-[0.2em] text-lime uppercase">
                Ideal for
              </p>
              <p className="text-[14px] leading-relaxed text-cream-2">
                {service.idealFor}
              </p>
            </div>

            <div data-reveal className="mt-8">
              <Magnetic strength={0.28}>
                <a
                  href={`mailto:${person.email}?subject=${encodeURIComponent(`Enquiry: ${service.name}`)}`}
                  data-cursor
                  className="group inline-flex items-center gap-3 rounded-full border border-lime/35 px-6 py-3.5 no-underline transition-colors duration-300 hover:bg-lime"
                >
                  <span className="font-mono text-[11px] tracking-[0.16em] text-lime uppercase transition-colors duration-300 group-hover:text-coal">
                    Ask about this
                  </span>
                  <span
                    aria-hidden
                    className="text-lime transition-all duration-300 group-hover:translate-x-1 group-hover:text-coal"
                  >
                    →
                  </span>
                </a>
              </Magnetic>
            </div>
          </div>

          {/* What's included + how it works. */}
          <div className="flex flex-col gap-10">
            <div data-reveal>
              <p className="mb-5 font-mono text-[10px] tracking-[0.2em] text-cream-3 uppercase">
                What&apos;s included
              </p>
              <ul className="grid gap-x-10 gap-y-3.5 sm:grid-cols-2">
                {service.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-[15px] leading-snug text-cream md:text-base"
                  >
                    <span aria-hidden className="mt-0.5 shrink-0 text-lime">
                      →
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>

            <div
              data-reveal
              className="rounded-3xl border border-[var(--line)] bg-raise/40 p-6 md:p-8"
            >
              <p className="mb-6 font-mono text-[10px] tracking-[0.2em] text-cream-3 uppercase">
                How it works
              </p>
              <ol className="flex flex-col gap-6">
                {service.process.map((step, i) => (
                  <li key={step.step} className="flex gap-4">
                    <span className="font-mono text-[11px] text-lime">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <p className="font-display text-base font-semibold tracking-[-0.01em]">
                        {step.step}
                      </p>
                      <p className="mt-1.5 max-w-lg text-[14px] leading-relaxed text-cream-2">
                        {step.detail}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
