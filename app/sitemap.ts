import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Required for `output: "export"` (static export) — without this, the
// build can't tell this route has no dynamic dependency and refuses to
// prerender it.
export const dynamic = "force-static";

/**
 * A near-zero-cost signal that tells crawlers the canonical URLs and how
 * often to expect them to change. `/services` and `/work` are real routes —
 * added here, not just linked, so they get crawled on their own rather than
 * relying entirely on discovery through the homepage's card links.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      // No lastModified: this build has no real signal for when content
      // last changed, and asserting a fake date (e.g. the Unix epoch) reads
      // as a broken/neglected site to anyone who actually checks the tag.
      url: SITE_URL,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/services`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/work`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
