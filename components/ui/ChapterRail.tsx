"use client";

import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { useActiveSection } from "@/lib/hooks";
import { chapters } from "@/lib/content";

const CHAPTER_IDS = chapters.map((c) => c.id);

/**
 * A fixed dot-rail on the right edge tracking which chapter you're in —
 * the "film reel" idea made literal as a wayfinding device. Desktop only:
 * on a narrow screen it would just be clutter competing with real content
 * for the same 20px of edge space.
 *
 * `useActiveSection` is the same scrollspy the header's nav uses to
 * highlight the current chapter, so the two can never disagree about where
 * you are on the page.
 */
export function ChapterRail() {
  const { scrollTo } = useSmoothScroll();
  const active = useActiveSection(CHAPTER_IDS);

  return (
    <nav
      aria-label="Chapters"
      className="fixed top-1/2 right-5 z-40 hidden -translate-y-1/2 flex-col items-end gap-4 md:flex"
    >
      {chapters.map((chapter) => {
        const isActive = chapter.id === active;
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
                  ? "h-7 w-[3px] bg-lime shadow-[0_0_8px_0_rgba(63,208,255,0.6)]"
                  : "h-[3px] w-[3px] bg-cream-3/50 group-hover:bg-cream-2"
              }`}
            />
          </button>
        );
      })}
    </nav>
  );
}
