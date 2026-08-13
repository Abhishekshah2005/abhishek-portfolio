import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    // /preview hosts scratch component previews that aren't part of the
    // real site — kept out of the index without needing a page-level noindex.
    rules: { userAgent: "*", allow: "/", disallow: "/preview" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
