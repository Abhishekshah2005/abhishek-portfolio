"use client";

import { useEffect, useRef } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { gsap, SplitText } from "@/lib/gsap";
import { useFinePointer, useReducedMotion } from "@/lib/hooks";
import { contact, person } from "@/lib/content";
import { Magnetic } from "@/components/ui/Magnetic";
import { Footer } from "@/components/site/Footer";
import { useLineDraw } from "@/components/ui/motion";

const socialHref = (label: string) => contact.socials.find((s) => s.label === label)?.href;

// lucide-react dropped its brand/logo icons (trademark policy) — these two
// are the standard minimal glyph paths used across the ecosystem in their
// place, kept to the same `{ size? }` shape so they drop into the icon
// grid below identically to the lucide ones.
function LinkedInIcon({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM7.114 20.452H3.558V9h3.556v11.452z" />
    </svg>
  );
}

function GitHubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden>
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.221-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.295 2.747-1.026 2.747-1.026.546 1.378.203 2.397.1 2.65.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

/**
 * Every real way to reach him, as its own card — reads `contact.socials`
 * for the LinkedIn/GitHub URLs so this can't drift from the footer's copy
 * of the same links, but adds a proper display value (a raw href isn't
 * one) and a location card, which isn't a link at all.
 */
const CONTACT_CARDS = [
  { icon: Mail, label: "Email", value: person.email, href: `mailto:${person.email}` },
  {
    icon: Phone,
    label: "Call",
    value: person.phone,
    href: `tel:${person.phone.replace(/\s+/g, "")}`,
  },
  { icon: LinkedInIcon, label: "LinkedIn", value: "Abhishek Rathod", href: socialHref("LinkedIn") },
  { icon: GitHubIcon, label: "GitHub", value: "Abhishekshah2005", href: socialHref("GitHub") },
  { icon: MapPin, label: "Location", value: person.location, href: undefined },
] as const;

/**
 * The finale: LET'S TALK filling the frame, every letter individually
 * magnetic — the heading itself is the last toy on the page.
 */
export function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const drawRef = useLineDraw<HTMLSpanElement>("top 95%");
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
        scrollTrigger: {
          trigger: section,
          start: "top 65%",
          toggleActions: "restart none restart reverse",
        },
      });

      gsap.from("[data-contact-fade]", {
        autoAlpha: 0,
        y: 22,
        duration: 1,
        stagger: 0.08,
        scrollTrigger: {
          trigger: section,
          start: "top 55%",
          toggleActions: "restart none restart reverse",
        },
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

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative scroll-mt-24 flex min-h-dvh flex-col justify-between px-5 pt-28 pb-8 md:px-10 md:pt-40"
      aria-label="Contact"
    >
      {/* Same container width as every other chapter now — this was the
          last section still spreading its body/CTA edge-to-edge on a wide
          screen instead of sitting in the shared column. */}
      <div className="mx-auto w-full max-w-[1320px]">
        <p className="mb-10 flex items-center gap-2.5 font-mono text-[10px] tracking-[0.3em] text-cream-3 uppercase">
          <span
            ref={drawRef}
            aria-hidden
            className="block h-px w-8 origin-left bg-lime"
          />
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

        {/* Every way to reach him, spelled out — the footer's row of
            one-word links is easy to skim past; this isn't. */}
        <div
          data-contact-fade
          className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {CONTACT_CARDS.map(({ icon: Icon, label, value, href }) => {
            const external = !!href && href.startsWith("http");
            const cardClass =
              "group flex items-center gap-4 rounded-2xl border border-[var(--line)] bg-raise/50 p-5 transition-colors duration-300";

            const inner = (
              <>
                <span
                  aria-hidden
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-lime/10 text-lime transition-colors duration-300 group-hover:bg-lime group-hover:text-coal"
                >
                  <Icon size={18} />
                </span>
                <span className="flex min-w-0 flex-col">
                  <span className="font-mono text-[10px] tracking-[0.18em] text-cream-3 uppercase">
                    {label}
                  </span>
                  <span className="truncate text-[15px] text-cream">{value}</span>
                </span>
              </>
            );

            return href ? (
              <a
                key={label}
                href={href}
                data-cursor
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className={`${cardClass} no-underline hover:border-lime/40 hover:bg-raise`}
              >
                {inner}
              </a>
            ) : (
              <div key={label} className={cardClass}>
                {inner}
              </div>
            );
          })}
        </div>
      </div>

      <div data-contact-fade>
        <Footer className="mt-20 px-0 md:px-0" />
      </div>
    </section>
  );
}
