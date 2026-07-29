"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { Observer } from "gsap/Observer";
import { Flip } from "gsap/Flip";

/**
 * Single place where GSAP plugins are registered. Importing gsap from here
 * (never from "gsap" directly in components) guarantees registration has
 * happened before any timeline is built.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(
    ScrollTrigger,
    SplitText,
    Draggable,
    InertiaPlugin,
    Observer,
    Flip,
  );

  // One rhythm for the whole site.
  gsap.defaults({ ease: "expo.out", duration: 1.1 });

  // ScrollTrigger must not fight Lenis' own resize/scroll handling.
  ScrollTrigger.config({ ignoreMobileResize: true });
}

export { gsap, ScrollTrigger, SplitText, Draggable, InertiaPlugin, Observer, Flip };
