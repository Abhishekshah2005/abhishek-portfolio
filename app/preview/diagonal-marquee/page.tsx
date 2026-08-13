"use client";

import DiagonalMarqueeCarousel from "@/components/ui/great-ui-diagonal-marquee-carousel";

/**
 * Scratch route to preview the diagonal marquee carousel in isolation —
 * not linked from nav or the sitemap. Delete once a real placement is
 * decided, or tell me where on the live site to move it.
 *
 * `fadeClassName` overrides the component's built-in `dark:from-neutral-950`
 * edge fade: this site is unconditionally dark (no `.dark` class, no light
 * mode anywhere else), so that variant would only apply when the visitor's
 * OS happens to report a dark preference — everyone else would get the
 * light `from-white` fade on a near-black page. Pointing it at the site's
 * own `--color-coal` token sidesteps that instead of relying on a light/dark
 * split this project doesn't have.
 */
export default function DiagonalMarqueeCarouselPreview() {
  return (
    <main className="relative h-dvh w-full overflow-hidden bg-coal">
      <DiagonalMarqueeCarousel fadeClassName="from-coal dark:from-coal" />
    </main>
  );
}
