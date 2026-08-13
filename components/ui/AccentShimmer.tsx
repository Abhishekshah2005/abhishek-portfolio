"use client";

import { GradientShimmer, type GradientStop } from "@/components/ui/gradient-shimmer";
import { cn } from "@/lib/utils";

// A glint of cream light sweeping across solid lime — the same "light
// passing over the accent" language as the cursor glow and the header's
// glowing lime dot, rather than one of gradient-shimmer's built-in
// multi-hue presets, which would clash with this site's black/lime/cream
// palette.
const LIME_STOPS: GradientStop[] = [
  { color: "#d9ff40", position: 0 },
  { color: "#f2f1ec", position: 0.5 },
  { color: "#d9ff40", position: 1 },
];

/**
 * The recurring "emphasized word" treatment used across chapter headings —
 * replaces the old static `text-outline-lime` hollow stroke with a solid
 * lime fill that catches a light sweep every couple of seconds. A hollow
 * stroke and a filled shimmer are two different treatments of the same
 * idea, not layerable, so this is a straight swap rather than an addition.
 */
export function AccentShimmer({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <GradientShimmer
      as="span"
      gradient={LIME_STOPS}
      baseColor="#d9ff40"
      duration={1.6}
      pauseBetween={2400}
      className={cn("inline-block", className)}
    >
      {children}
    </GradientShimmer>
  );
}
