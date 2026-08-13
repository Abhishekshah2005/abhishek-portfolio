"use client";

import { GradientShimmer, type GradientStop } from "@/components/ui/gradient-shimmer";
import { cn } from "@/lib/utils";

// The resting color stays the site's actual lime/cream — only the sweeping
// band itself dips dark then flashes bright, so at any instant most of the
// word still reads as plain brand color and the wave passing through it is
// the obviously-different part. A band that only nudges toward a
// similarly-bright color (the first version) reads as "static text" at a
// glance; dipping dark first is what makes the motion register.
const LIME_STOPS: GradientStop[] = [
  { color: "#7c8f2e", position: 0 },
  { color: "#f5ffc2", position: 0.5 },
  { color: "#7c8f2e", position: 1 },
];

// `--color-cream-3` (this project's own muted-text token) dipping to pure
// white — the cream equivalent of the lime band above, for the plain
// white/cream lead-in half of each heading.
const CREAM_STOPS: GradientStop[] = [
  { color: "#8f8e87", position: 0 },
  { color: "#ffffff", position: 0.5 },
  { color: "#8f8e87", position: 1 },
];

const TONES = {
  lime: { gradient: LIME_STOPS, baseColor: "#d9ff40" },
  cream: { gradient: CREAM_STOPS, baseColor: "#f2f1ec" },
} as const;

/**
 * The recurring heading-shimmer treatment, in the site's two text colors.
 * `tone="lime"` replaces the old static `text-outline-lime` hollow stroke
 * on each heading's emphasized word; `tone="cream"` matches it on the
 * plain white lead-in half of the same heading, so the whole line shimmers
 * rather than just one word in it.
 */
export function AccentShimmer({
  children,
  tone = "lime",
  className,
}: {
  children: string;
  tone?: keyof typeof TONES;
  className?: string;
}) {
  const { gradient, baseColor } = TONES[tone];
  return (
    <GradientShimmer
      as="span"
      data-shimmer
      gradient={gradient}
      baseColor={baseColor}
      duration={1.2}
      spread={8}
      pauseBetween={800}
      // Every one of these sits inside a heading that useLineReveal splits
      // into lines via GSAP SplitText on mount. SplitText detects line
      // breaks from actual rendered geometry — if the browser's own wrap
      // point falls *inside* a multi-word phrase here, SplitText fragments
      // this span into one clone per line, each carrying a slice of the
      // text (confirmed by inspecting the live DOM: a two-word span came
      // back as "Companies, " in one clone and the remainder orphaned in
      // another, background-image and all). `whitespace-nowrap` makes the
      // phrase wrap as one atomic unit — like a single word would — so it
      // always lands entirely within one of SplitText's line spans instead.
      className={cn("inline-block whitespace-nowrap", className)}
    >
      {children}
    </GradientShimmer>
  );
}
