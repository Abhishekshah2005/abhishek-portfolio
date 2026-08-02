"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks";
import { useLineReveal } from "@/components/ui/motion";
import { faqs, person } from "@/lib/content";

/**
 * The objections a real prospect has before they email, answered directly.
 * Sits right after the Companies chapter it's answering, while the offer is
 * still fresh — this is also the highest-intent, most keyword-natural copy
 * on the page, and it backs the FAQPage structured data built from the same
 * `faqs` array (see lib/seo.ts) so the schema can never say more than the
 * visible page does.
 *
 * Answers are always in the DOM and expand in place — no content is ever
 * `display:none`, so there's nothing here a crawler could read differently
 * than a visitor does.
 */
export function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useLineReveal<HTMLHeadingElement>();
  const [open, setOpen] = useState<number | null>(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;

    const ctx = gsap.context(() => {
      gsap.from("[data-faq-row]", {
        y: 30,
        autoAlpha: 0,
        duration: 1,
        stagger: 0.06,
        ease: "expo.out",
        scrollTrigger: { trigger: section, start: "top 78%" },
      });
    }, section);

    return () => ctx.revert();
  }, [reduced]);

  return (
    <section
      ref={sectionRef}
      id="faq"
      className="relative px-5 py-24 md:px-10 md:py-32"
      aria-label="Frequently asked questions"
    >
      <div className="mb-12 flex items-end justify-between">
        <h2 ref={headingRef} className="text-minor max-w-[16ch] font-semibold">
          Before you <span className="text-outline-lime">email</span>
        </h2>
        <p className="hidden font-mono text-[10px] tracking-[0.24em] text-cream-3 uppercase md:block">
          03 — FAQ
        </p>
      </div>

      <dl className="mx-auto max-w-4xl">
        {faqs.map((item, i) => {
          const isOpen = open === i;
          const panelId = `faq-panel-${i}`;
          return (
            <div
              key={item.q}
              data-faq-row
              className="border-t border-[var(--line)] last:border-b"
            >
              <dt>
                <button
                  type="button"
                  data-cursor
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpen((prev) => (prev === i ? null : i))}
                  className="group flex w-full items-center justify-between gap-6 py-6 text-left md:py-7"
                >
                  <span className="font-display text-xl leading-snug font-medium tracking-[-0.01em] text-cream md:text-2xl">
                    {item.q}
                  </span>
                  <span
                    aria-hidden
                    className={`shrink-0 text-2xl text-lime transition-transform duration-400 ease-[var(--ease-out-expo)] ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
              </dt>
              <dd
                id={panelId}
                className="grid overflow-hidden transition-[grid-template-rows] duration-500 ease-[var(--ease-out-expo)]"
                style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
              >
                <div className="overflow-hidden">
                  <p className="max-w-2xl pb-7 text-[15px] leading-relaxed text-cream-2 md:pb-8 md:text-base">
                    {item.a}
                  </p>
                </div>
              </dd>
            </div>
          );
        })}
      </dl>

      <p className="mx-auto mt-10 max-w-4xl font-mono text-[10px] leading-relaxed tracking-[0.14em] text-cream-3 uppercase">
        Something else on your mind? {person.email}
      </p>
    </section>
  );
}
