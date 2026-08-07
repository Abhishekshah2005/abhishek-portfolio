import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * A near-zero-cost signal that tells crawlers the canonical URLs and how
 * often to expect them to change. `/services` is the second real route —
 * added here, not just linked, so it gets crawled on its own rather than
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
  ];
}
