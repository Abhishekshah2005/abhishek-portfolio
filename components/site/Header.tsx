"use client";

import { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { chapters, person } from "@/lib/content";
import { Magnetic } from "@/components/ui/Magnetic";

export function Header({ started }: { started: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollTo } = useSmoothScroll();

  // Past the hero the bar picks up a glass backing — without it the nav
  // collides with the oversized type running underneath.
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 80,
      end: Number.MAX_SAFE_INTEGER,
      onToggle: (self) => setScrolled(self.isActive),
    });
    return () => st.kill();
  }, []);

  useEffect(() => {
    if (!started || !ref.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        "[data-nav-item]",
        { autoAlpha: 0, y: -12 },
        { autoAlpha: 1, y: 0, duration: 1, stagger: 0.06, delay: 0.5 },
      );
    }, ref);
    return () => ctx.revert();
  }, [started]);

  // Close the mobile sheet on Escape — every overlay needs an escape route.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    scrollTo(`#${id}`);
  };

  return (
    <header
      ref={ref}
      className={`fixed inset-x-0 top-0 z-40 flex items-center justify-between transition-[background-color,backdrop-filter,padding,border-color] duration-500 ease-[var(--ease-out-expo)] ${
        scrolled
          ? "border-b border-[var(--line-soft)] bg-paper/72 px-5 py-4 backdrop-blur-xl md:px-10 md:py-5"
          : "border-b border-transparent p-5 md:p-10"
      }`}
    >
      <button
        data-nav-item
        onClick={() => scrollTo(0)}
        className="invisible -my-3 flex min-h-11 items-center gap-3 py-3 text-left"
        aria-label="Back to top"
      >
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-flare opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-flare" />
        </span>
        <span className="font-display text-[13px] font-medium tracking-tight">
          {person.name}
        </span>
      </button>

      <nav
        data-nav-item
        className="invisible hidden items-center gap-1 md:flex"
        aria-label="Sections"
      >
        {chapters.slice(1).map((c) => (
          <button
            key={c.id}
            onClick={() => go(c.id)}
            data-cursor
            className="group relative px-3 py-2 text-[13px] text-ink-2 transition-colors duration-300 hover:text-ink"
          >
            {c.label}
            <span className="absolute inset-x-3 bottom-1.5 h-px origin-right scale-x-0 bg-ink transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:origin-left group-hover:scale-x-100" />
          </button>
        ))}
      </nav>

      <div data-nav-item className="invisible flex items-center gap-4">
        <span className="hidden font-mono text-[10px] tracking-[0.2em] text-ink-3 uppercase lg:block">
          {person.available}
        </span>
        <Magnetic strength={0.24}>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/15 md:hidden"
          >
            <span className="flex flex-col gap-1">
              <span
                className={`block h-px w-4 bg-ink transition-transform duration-300 ${open ? "translate-y-[2.5px] rotate-45" : ""}`}
              />
              <span
                className={`block h-px w-4 bg-ink transition-transform duration-300 ${open ? "-translate-y-[2.5px] -rotate-45" : ""}`}
              />
            </span>
          </button>
        </Magnetic>
      </div>

      {/* Mobile sheet */}
      <div
        className={`fixed inset-0 z-50 bg-paper transition-[opacity,visibility] duration-500 md:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <div className="flex h-full flex-col justify-center gap-2 px-6">
          {chapters.map((c) => (
            <button
              key={c.id}
              onClick={() => go(c.id)}
              className="flex items-baseline gap-4 border-b border-[var(--line-soft)] py-4 text-left"
            >
              <span className="font-mono text-[10px] text-ink-3">{c.index}</span>
              <span className="font-display text-4xl font-medium tracking-tight">
                {c.label}
              </span>
            </button>
          ))}
        </div>
        <button
          onClick={() => setOpen(false)}
          aria-label="Close menu"
          className="absolute top-5 right-5 flex h-11 w-11 items-center justify-center rounded-full border border-ink/15"
        >
          <span className="text-lg leading-none">×</span>
        </button>
      </div>
    </header>
  );
}
