"use client";

import { useEffect, useRef } from "react";
import { gsap, SplitText } from "@/lib/gsap";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";
import { contact, person } from "@/lib/content";
import { Magnetic } from "@/components/ui/Magnetic";

/**
 * The finale: LET'S TALK filling the frame, every letter individually
 * magnetic — the heading itself is the last toy on the page.
 */
export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const reduced = useReducedMotion();
  const fine = useFinePointer();

  // Reveal on arrival.
  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    if (!section || !heading || reduced) return;

    let split: SplitText | null = null;
    const ctx = gsap.context(() => {
      split = new SplitText(heading, { type: "chars", mask: "chars" });
      gsap.from(split.chars, {
        yPercent: 120,
        duration: 1.05,
        stagger: 0.035,
        ease: "expo.out",
        scrollTrigger: { trigger: section, start: "top 65%" },
      });

      gsap.from("[data-contact-fade]", {
        autoAlpha: 0,
        y: 22,
        duration: 1,
        stagger: 0.08,
        scrollTrigger: { trigger: section, start: "top 55%" },
      });
    }, section);

    return () => {
      split?.revert();
      ctx.revert();
    };
  }, [reduced]);

  // Per-letter magnetism. Runs after the reveal split has settled — it
  // wraps each character so they can be pushed around independently.
  useEffect(() => {
    const heading = headingRef.current;
    if (!heading || reduced || !fine) return;

    let split: SplitText | null = null;
    let raf = 0;
    const movers: {
      el: HTMLElement;
      xTo: (v: number) => void;
      yTo: (v: number) => void;
    }[] = [];

    // Delay past the reveal, so two SplitText instances never fight.
    const timer = window.setTimeout(() => {
      split = new SplitText(heading, { type: "chars" });
      for (const char of split.chars as HTMLElement[]) {
        movers.push({
          el: char,
          xTo: gsap.quickTo(char, "x", { duration: 0.5, ease: "power3.out" }),
          yTo: gsap.quickTo(char, "y", { duration: 0.5, ease: "power3.out" }),
        });
      }
    }, 2600);

    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        for (const { el, xTo, yTo } of movers) {
          const r = el.getBoundingClientRect();
          const cx = r.left + r.width / 2;
          const cy = r.top + r.height / 2;
          const dx = e.clientX - cx;
          const dy = e.clientY - cy;
          const dist = Math.hypot(dx, dy);
          const radius = 180;
          if (dist < radius) {
            const force = (1 - dist / radius) * 0.42;
            xTo(-dx * force);
            yTo(-dy * force);
          } else {
            xTo(0);
            yTo(0);
          }
        }
      });
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
      split?.revert();
    };
  }, [reduced, fine]);

  const year = 2026;

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative flex min-h-dvh flex-col justify-between px-5 pt-28 pb-8 md:px-10 md:pt-40"
      aria-label="Contact"
    >
      {/* Same container width as every other chapter now — this was the
          last section still spreading its body/CTA edge-to-edge on a wide
          screen instead of sitting in the shared column. */}
      <div className="mx-auto w-full max-w-[1320px]">
        <p className="mb-10 font-mono text-[10px] tracking-[0.3em] text-cream-3 uppercase">
          06 — Talk
        </p>

        <h2
          ref={headingRef}
          className="text-mega font-semibold tracking-[-0.04em] whitespace-nowrap"
        >
          {contact.heading}
        </h2>

        <div className="mt-14 flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
          <p
            data-contact-fade
            className="max-w-md text-base leading-relaxed text-cream-2"
          >
            {contact.body}
          </p>

          <div data-contact-fade className="flex flex-col items-start gap-6">
            <Magnetic strength={0.3}>
              <a
                href={`mailto:${person.email}`}
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

            <a
              href={`mailto:${person.email}`}
              className="inline-flex min-h-11 items-center font-mono text-[12px] tracking-[0.08em] text-cream-2 underline decoration-cream/25 underline-offset-4 transition-colors hover:text-lime"
            >
              {person.email}
            </a>
          </div>
        </div>
      </div>

      <footer
        data-contact-fade
        className="mx-auto mt-20 flex w-full max-w-[1320px] flex-col gap-6 border-t border-[var(--line)] pt-6 md:flex-row md:items-center md:justify-between"
      >
        <div className="flex flex-wrap items-center gap-2">
          {contact.socials.map((social) => (
            <a
              key={social.label}
              href={social.href}
              data-cursor
              className="inline-flex min-h-11 min-w-11 items-center justify-center px-2 text-[13px] text-cream-2 transition-colors duration-300 hover:text-lime"
              {...(social.placeholder
                ? { "aria-disabled": true, tabIndex: -1 }
                : {})}
            >
              {social.label}
            </a>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-6 font-mono text-[10px] tracking-[0.18em] text-cream-3 uppercase">
          <span>{person.location}</span>
          <span>
            © {year} {person.name}
          </span>
        </div>
      </footer>
    </section>
  );
}
