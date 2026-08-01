"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { useReducedMotion } from "@/lib/hooks";
import { nav, person } from "@/lib/content";

/**
 * One bar, no sheet, no hamburger — three anchors fit on a phone. Fewer
 * moving parts than a menu, and nothing to mis-tap.
 */
export function Header({ started }: { started: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollTo } = useSmoothScroll();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!started || !ref.current) return;
    if (reduced) {
      gsap.set("[data-nav-item]", { autoAlpha: 1, y: 0 });
      return;
    }
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-nav-item]",
        { autoAlpha: 0, y: -14 },
        { autoAlpha: 1, y: 0, duration: 1, stagger: 0.07, delay: 0.4 },
      );
    }, ref);
    return () => ctx.revert();
  }, [started, reduced]);

  return (
    <header
      ref={ref}
      className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-4 md:px-10 md:py-6"
    >
      <button
        data-nav-item
        onClick={() => scrollTo(0)}
        data-cursor
        className="invisible -my-2 flex min-h-11 items-center gap-3 py-2"
        aria-label="Back to top"
      >
        <span className="h-2 w-2 rounded-full bg-lime" />
        <span className="font-display text-[13px] font-semibold tracking-tight">
          {person.name}
        </span>
      </button>

      <nav
        data-nav-item
        className="invisible flex items-center gap-1 md:gap-2"
        aria-label="Sections"
      >
        {nav.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(`#${item.id}`)}
            data-cursor
            className="group relative min-h-11 px-2.5 py-2 text-[12px] tracking-wide text-cream-2 uppercase transition-colors duration-300 hover:text-cream md:px-3 md:text-[13px]"
          >
            {item.label}
            <span className="absolute inset-x-2.5 bottom-2 h-px origin-right scale-x-0 bg-lime transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:origin-left group-hover:scale-x-100 md:inset-x-3" />
          </button>
        ))}
      </nav>

      <span
        data-nav-item
        className="invisible hidden font-mono text-[10px] tracking-[0.22em] text-cream-3 uppercase lg:block"
      >
        {person.available}
      </span>
    </header>
  );
}
