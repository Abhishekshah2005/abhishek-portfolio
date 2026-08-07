"use client";

import { useEffect, useState } from "react";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { chapters } from "@/lib/content";

/**
 * A fixed dot-rail on the right edge tracking which chapter you're in —
 * the "film reel" idea made literal as a wayfinding device. Desktop only:
 * on a narrow screen it would just be clutter competing with real content
 * for the same 20px of edge space.
 *
 * Driven by IntersectionObserver rather than ScrollTrigger — this only
 * needs to know "which section is currently centred," a classic scrollspy
 * problem an observer solves without pulling scroll math into it.
 */
export function ChapterRail() {
  const { scrollTo } = useSmoothScroll();
  const [active, setActive] = useState(0);

  useEffect(() => {
    const sections = chapters
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el !== null);
    if (sections.length === 0) return;

    // A thin band through the vertical centre of the viewport — a section
    // is "active" once it crosses that band, not merely once any pixel of
    // it is on screen.
    const observer = new IntersectionObserver(
      (entries) => {
        let best: { id: string; ratio: number } | null = null;
        for (const entry of entries) {
          if (entry.isIntersecting && (!best || entry.intersectionRatio > best.ratio)) {
            best = { id: entry.target.id, ratio: entry.intersectionRatio };
          }
        }
        if (best) {
          const idx = chapters.findIndex((c) => c.id === best?.id);
          if (idx !== -1) setActive(idx);
        }
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Chapters"
      className="fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 md:flex"
    >
      {chapters.map((chapter, i) => {
        const isActive = i === active;
        return (
          <button
            key={chapter.id}
            type="button"
            onClick={() => scrollTo(`#${chapter.id}`)}
            data-cursor
            aria-label={`Jump to ${chapter.label}`}
            aria-current={isActive ? "true" : undefined}
            className="group -m-2 flex items-center gap-3 p-2"
          >
            <span
              className={`font-mono text-[9px] tracking-[0.18em] uppercase transition-all duration-300 ${
                isActive
                  ? "translate-x-0 text-lime opacity-100"
                  : "translate-x-1 text-cream-3 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
              }`}
            >
              {chapter.label}
            </span>
            <span
              aria-hidden
              className={`block rounded-full transition-all duration-300 ${
                isActive
                  ? "h-7 w-[3px] bg-lime shadow-[0_0_8px_0_rgba(217,255,64,0.6)]"
                  : "h-[3px] w-[3px] bg-cream-3/50 group-hover:bg-cream-2"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
