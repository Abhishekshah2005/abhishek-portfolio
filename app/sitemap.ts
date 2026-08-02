import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

/**
 * A single-page site still gets a sitemap: it's a near-zero-cost signal
 * that tells crawlers the canonical URL and how often to expect it to
 * change, and it's where a second real route (case studies, a blog) would
 * get added later without restructuring anything.
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
  ];
}
