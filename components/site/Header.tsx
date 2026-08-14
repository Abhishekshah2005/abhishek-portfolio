"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { useActiveSection, useReducedMotion } from "@/lib/hooks";
import { nav, person } from "@/lib/content";

const NAV_SECTION_IDS = nav.flatMap((item) => ("id" in item ? [item.id] : []));

/**
 * One bar, no sheet, no hamburger — three anchors fit on a phone. Fewer
 * moving parts than a menu, and nothing to mis-tap.
 */
export function Header({ started }: { started: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const { scrollTo } = useSmoothScroll();
  const reduced = useReducedMotion();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  // Same scrollspy the chapter rail uses — only meaningful on the homepage
  // (the section ids don't exist elsewhere), but the hook is unconditional
  // either way since it's a no-op when it finds nothing to observe.
  const activeSection = useActiveSection(NAV_SECTION_IDS);

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

  // The bar is transparent over the hero (that's the intentional cinematic
  // look), but with NO background at all it has no guaranteed contrast
  // against whatever scrolls underneath it once you leave the hero — a
  // bright marquee band or a lit Services row could wash the wordmark out
  // completely. A scrim past a small scroll threshold fixes that without
  // touching the hero's clean-chrome look.
  useEffect(() => {
    const st = ScrollTrigger.create({
      start: 80,
      end: Number.MAX_SAFE_INTEGER,
      onToggle: (self) => setScrolled(self.isActive),
    });
    return () => st.kill();
  }, []);

  return (
    <header
      ref={ref}
      className={`fixed inset-x-0 top-0 z-40 flex items-center justify-between px-5 py-4 transition-[background-color,backdrop-filter,border-color] duration-500 md:px-10 md:py-5 ${
        scrolled
          ? "border-b border-[var(--line)] bg-coal/75 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      {isHome ? (
        <button
          data-nav-item
          onClick={() => scrollTo(0)}
          data-cursor
          className="invisible -my-2 flex min-h-11 items-center gap-3 py-2"
          aria-label="Back to top"
        >
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-lime shadow-[0_0_10px_1px_rgba(63,208,255,0.55)]" />
          {/* Below `sm`, the dot alone is the mark — four nav items plus
              the full wordmark don't fit in one row on a phone (the
              header was designed for three, per the comment above; a
              fourth pushed it over). The name still exists for a11y via
              the button/link's own accessible name below. */}
          <span className="hidden font-display text-lg font-semibold tracking-tight whitespace-nowrap text-cream sm:inline md:text-xl">
            {person.name}
          </span>
        </button>
      ) : (
        <Link
          data-nav-item
          href="/"
          data-cursor
          className="invisible -my-2 flex min-h-11 items-center gap-3 py-2 no-underline"
          aria-label="Home"
        >
          <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-lime shadow-[0_0_10px_1px_rgba(63,208,255,0.55)]" />
          {/* Below `sm`, the dot alone is the mark — four nav items plus
              the full wordmark don't fit in one row on a phone (the
              header was designed for three, per the comment above; a
              fourth pushed it over). The name still exists for a11y via
              the button/link's own accessible name below. */}
          <span className="hidden font-display text-lg font-semibold tracking-tight whitespace-nowrap text-cream sm:inline md:text-xl">
            {person.name}
          </span>
        </Link>
      )}

      <nav
        data-nav-item
        className="invisible flex items-center gap-1 md:gap-2"
        aria-label="Sections"
      >
        {nav.map((item) => {
          // "Where you are": Services lights up on /services itself; a
          // chapter anchor lights up once its section owns the centre of
          // the viewport, homepage only — the same signal the chapter rail
          // gives on the right edge, now echoed in the nav itself instead
          // of every item reading identically regardless of context.
          const isActive =
            "href" in item ? pathname === item.href : isHome && activeSection === item.id;

          // `inline-flex items-center` on both the <button> and <a> variants
          // deliberately, not left to each tag's own default: Chromium
          // vertically centres a <button>'s text using its own internal
          // layout rather than normal line-height flow, so an <a> with
          // pixel-identical box/padding/line-height still rendered its text
          // ~4px higher (confirmed via Range.getBoundingClientRect() on the
          // text node, not just the container). Forcing the same explicit
          // flex-centering on every variant is what actually guarantees a
          // shared baseline.
          const linkClass = `group relative inline-flex min-h-11 items-center px-2.5 py-2 text-[12px] tracking-wide uppercase transition-colors duration-300 md:px-3 md:text-[13px] ${
            isActive ? "text-lime" : "text-cream-2 hover:text-cream"
          }`;
          const underline = (
            <span
              aria-hidden
              className={`absolute inset-x-2.5 bottom-2 h-px origin-right bg-lime transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:origin-left group-hover:scale-x-100 md:inset-x-3 ${
                isActive ? "scale-x-100" : "scale-x-0"
              }`}
            />
          );

          // A real route (currently just /services) always navigates there,
          // regardless of which page the header is on.
          if ("href" in item) {
            return (
              <Link
                key={item.href}
                href={item.href}
                data-cursor
                aria-current={isActive ? "page" : undefined}
                className={`${linkClass} no-underline`}
              >
                {item.label}
                {underline}
              </Link>
            );
          }

          // A same-page anchor: Lenis-scroll when already on the homepage,
          // otherwise a real navigation to `/#id` — the SmoothScroll
          // provider picks up the hash once the homepage has mounted.
          return isHome ? (
            <button
              key={item.id}
              onClick={() => scrollTo(`#${item.id}`)}
              data-cursor
              aria-current={isActive ? "true" : undefined}
              className={linkClass}
            >
              {item.label}
              {underline}
            </button>
          ) : (
            <Link
              key={item.id}
              href={`/#${item.id}`}
              data-cursor
              className={`${linkClass} no-underline`}
            >
              {item.label}
              {underline}
            </Link>
          );
        })}
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
