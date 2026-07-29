"use client";

/**
 * Mutable bridges between DOM scroll (GSAP/ScrollTrigger) and the WebGL
 * scenes. Deliberately not React state: these change every frame, and
 * re-rendering a Canvas tree 60 times a second would be absurd.
 */
export const heroScroll = {
  /** 0 at the top of the hero, 1 once it has fully scrolled away. */
  progress: 0,
  /** 0→1 once the intro reveal has run, used to gate idle motion. */
  revealed: 0,
};

/**
 * Where the headline actually landed, as a fraction of viewport width.
 *
 * The lens parks itself against these bounds instead of a hard-coded offset:
 * the type block changes width with the viewport, and a lens sitting on blank
 * paper is just a grey ball — the refraction only reads over letterforms.
 */
export const heroLayout = {
  slabHalfWidth: 0.3,
};

export const revealScroll = {
  progress: 0,
};
