"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/lib/hooks";
import { useLineReveal } from "@/components/ui/motion";
import { Magnetic } from "@/components/ui/Magnetic";
import { AccentShimmer } from "@/components/ui/AccentShimmer";
import { contact, person, projects, type Project } from "@/lib/content";

/**
 * The full writeup behind the homepage's work reel. Same `projects` array,
 * same copy — every field shown (including the CV's full bullet detail,
 * not just the teaser card's one-paragraph summary) instead of what fits
 * on a poster, plus the real external link(s) each project actually has.
 */
export function WorkContent() {
  // Unmasked: this heading has AccentShimmer children (see motion.tsx for why).
  const heroHeadingRef = useLineReveal<HTMLHeadingElement>("top 90%", false);
  const reduced = useReducedMotion();

  return (
    <>
      <section className="relative overflow-hidden px-5 pt-32 pb-16 md:px-10 md:pt-40 md:pb-20">
        <div className="mx-auto max-w-[1320px]">
          <Link
            href="/#work"
            data-cursor
            className="group mb-8 inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.24em] text-cream-3 uppercase no-underline transition-colors duration-300 hover:text-lime"
          >
            <span aria-hidden className="transition-transform duration-300 group-hover:-translate-x-1">
              ←
            </span>
            Back to the overview
          </Link>
          <h1 ref={heroHeadingRef} className="text-major max-w-[20ch] font-semibold">
            <AccentShimmer tone="cream">Two</AccentShimmer> products, five brands —{" "}
            <AccentShimmer>shipped</AccentShimmer>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-cream-2 md:text-lg">
            Everything below is real and live — two SaaS products founded and
            built solo, plus named client sites, each with a working link.
            Not a portfolio of concepts; things you can actually open.
          </p>
        </div>
      </section>

      {projects.map((project, i) => (
        <ProjectSection
          key={project.slug}
          project={project}
          index={i}
          total={projects.length}
          reduced={reduced}
        />
      ))}

      <section className="border-t border-[var(--line)] px-5 py-24 md:px-10 md:py-32">
        <div className="mx-auto flex max-w-[1320px] flex-col items-start gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-minor max-w-[18ch] font-semibold">
              Got something <span className="text-lime">like this</span> in mind?
            </h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-cream-2">
              {contact.body}
            </p>
          </div>
          <Magnetic strength={0.3}>
            <a
              href={`mailto:${person.email}?subject=${encodeURIComponent("Let's build something")}`}
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

function ProjectSection({
  project,
  index,
  total,
  reduced,
}: {
  project: Project;
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
  const links = project.sites ?? (project.url ? [{ name: "Visit site", url: project.url }] : []);

  return (
    <article
      ref={sectionRef}
      id={project.slug}
      aria-label={project.title}
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
              {project.title}
            </h2>
            <p
              data-reveal
              className="mt-2 font-mono text-[10px] tracking-[0.2em] uppercase"
              style={{ color: project.tone }}
            >
              {project.discipline} · {project.year}
            </p>
            <p
              data-reveal
              className="mt-6 max-w-md text-base leading-relaxed text-cream-2"
            >
              {project.summary}
            </p>

            <div
              data-reveal
              className="mt-8 max-w-md rounded-2xl border border-[var(--line)] bg-raise/50 p-6"
            >
              <p
                className="mb-3 font-mono text-[10px] tracking-[0.2em] uppercase"
                style={{ color: project.tone }}
              >
                Role
              </p>
              <p className="text-[14px] leading-relaxed text-cream-2">{project.role}</p>
            </div>

            {links.length > 0 && (
              <div data-reveal className="mt-8 flex flex-wrap gap-3">
                {links.map((link) => (
                  <Magnetic key={link.url} strength={0.28}>
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      data-cursor
                      className="group inline-flex items-center gap-3 rounded-full border px-6 py-3.5 no-underline transition-colors duration-300 hover:bg-[var(--project-tone)]"
                      style={{
                        borderColor: `${project.tone}59`,
                        ["--project-tone" as string]: project.tone,
                      }}
                    >
                      <span
                        className="font-mono text-[11px] tracking-[0.16em] uppercase transition-colors duration-300 group-hover:text-coal"
                        style={{ color: project.tone }}
                      >
                        {link.name}
                      </span>
                      <span
                        aria-hidden
                        className="transition-all duration-300 group-hover:translate-x-1 group-hover:text-coal"
                        style={{ color: project.tone }}
                      >
                        ↗
                      </span>
                    </a>
                  </Magnetic>
                ))}
              </div>
            )}
          </div>

          {/* What was built. */}
          <div className="flex flex-col gap-10">
            <div data-reveal>
              <p className="mb-5 font-mono text-[10px] tracking-[0.2em] text-cream-3 uppercase">
                What I built
              </p>
              <ul className="grid gap-x-10 gap-y-3.5 sm:grid-cols-2">
                {project.points.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-3 text-[15px] leading-snug text-cream md:text-base"
                  >
                    <span aria-hidden className="mt-0.5 shrink-0" style={{ color: project.tone }}>
                      →
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
