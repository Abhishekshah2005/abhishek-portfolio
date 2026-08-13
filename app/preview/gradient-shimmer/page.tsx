import {
  GradientShimmer,
  type GradientPresetName,
} from "@/components/ui/gradient-shimmer";

/**
 * Scratch route to preview the gradient shimmer in isolation — not linked
 * from nav or the sitemap. Delete once a real placement is decided, or tell
 * me where on the live site to move it.
 *
 * `baseColor` is passed explicitly (the site's cream ink) rather than left
 * on the component's `currentColor` default — this page has no ambient text
 * color set on a parent for it to inherit.
 */
const PRESETS: GradientPresetName[] = [
  "sunrise",
  "bubble",
  "peach",
  "tonic",
  "mint",
  "spring",
  "twilight",
  "bay",
];

export default function GradientShimmerPreview() {
  return (
    <main className="flex min-h-dvh w-full flex-col items-center justify-center gap-10 bg-coal px-6 py-24">
      {PRESETS.map((preset) => (
        <GradientShimmer
          key={preset}
          gradient={preset}
          baseColor="#f2f1ec"
          className="font-display text-4xl font-semibold tracking-tight sm:text-6xl"
        >
          {preset}
        </GradientShimmer>
      ))}
    </main>
  );
}
