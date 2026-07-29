"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks";
import { contact, person } from "@/lib/content";
import { Magnetic } from "@/components/ui/Magnetic";

export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || reduced) return;

    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      split = new SplitText("[data-contact-heading]", {
        type: "chars",
        mask: "chars",
      });
      gsap.from(split.chars, {
        yPercent: 120,
        duration: 1.1,
        stagger: 0.03,
        ease: "expo.out",
        scrollTrigger: { trigger: section, start: "top 68%" },
      });

      gsap.from("[data-contact-fade]", {
        autoAlpha: 0,
        y: 22,
        duration: 1,
        stagger: 0.09,
        scrollTrigger: { trigger: section, start: "top 60%" },
      });
    }, section);

    return () => {
      split?.revert();
      ctx.revert();
    };
  }, [reduced]);

  const year = 2026;

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative flex min-h-dvh flex-col justify-between px-5 pt-28 pb-8 md:px-10 md:pt-40"
      aria-label="Contact"
    >
      <div>
        <p className="mb-10 font-mono text-[10px] tracking-[0.28em] text-ink-3 uppercase">
          06 — Talk
        </p>

        <h2
          data-contact-heading
          className="text-mega font-medium tracking-[-0.045em]"
        >
          {contact.heading}
        </h2>

        <div className="mt-12 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <p
            data-contact-fade
            className="max-w-md text-base leading-relaxed text-ink-2"
          >
            {contact.body}
          </p>

          <div data-contact-fade className="flex flex-col items-start gap-6">
            <Magnetic strength={0.28}>
              <a
                href={`mailto:${person.email}`}
                data-cursor="write"
                className="group inline-flex items-center gap-4 rounded-full bg-blue px-8 py-5 text-white no-underline"
              >
                <span className="font-display text-base font-medium tracking-tight">
                  {contact.cta}
                </span>
                <span
                  aria-hidden
                  className="transition-transform duration-500 group-hover:translate-x-1.5"
                >
                  →
                </span>
              </a>
            </Magnetic>

            <a
              href={`mailto:${person.email}`}
              className="inline-flex min-h-11 items-center font-mono text-[12px] tracking-[0.08em] text-ink-2 underline decoration-ink/25 underline-offset-4 transition-colors hover:text-blue"
            >
              {person.email}
            </a>
          </div>
        </div>
      </div>

      <footer
        data-contact-fade
        className="mt-20 flex flex-col gap-6 border-t border-[var(--line)] pt-6 md:flex-row md:items-center md:justify-between"
      >
        <div className="flex flex-wrap items-center gap-5">
          {contact.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              data-cursor
              className="inline-flex min-h-11 min-w-11 items-center justify-center text-[13px] text-ink-2 transition-colors duration-300 hover:text-ink"
              {...(social.href === "#"
                ? { "aria-disabled": true, tabIndex: -1 }
                : {})}
            >
              {social.label}
            </a>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-6 font-mono text-[10px] tracking-[0.18em] text-ink-3 uppercase">
          <span>{person.location}</span>
          <span>
            © {year} {person.name}
          </span>
        </div>
      </footer>
    </section>
  );
}
