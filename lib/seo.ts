/**
 * SEO constants and structured-data builders.
 *
 * One source for the site URL and the JSON-LD graphs, so metadata,
 * sitemap.ts, robots.ts and opengraph-image.tsx can never drift out of
 * sync with each other or with the visible page copy.
 */
import { faqs, jurisdictions, person, services } from "@/lib/content";

export const SITE_URL = "https://abhishekshah.com";

export const SITE_TITLE =
  "Company Registration & Filings — UAE, UK & US";

export const SITE_DESCRIPTION =
  "Register your company in Dubai, the UK or the US and keep every filing compliant — UAE mainland & free-zone setup, corporate tax & VAT, UK confirmation statements & payroll, US LLC formation & Form 5472 — plus fractional CFO, bookkeeping and financial automation.";

/**
 * Country codes ISO 3166-1 alpha-2 for the three flags this site serves.
 * Kept separate from the display `jurisdictions[].code` (which is a visual
 * flag label, not a standard code) so structured data stays correct even if
 * the display labels change.
 */
const AREA_SERVED = ["AE", "GB", "US"];

/**
 * ProfessionalService + Offer catalog: tells search engines what's actually
 * on offer, in the one format they can't misread. Built from `jurisdictions`
 * and `services` so it can't say something the page doesn't.
 */
export function buildServiceGraph() {
  const jurisdictionOffers = jurisdictions.map((j) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: `${j.name} company registration & filings`,
      description: j.tagline,
      areaServed: j.code,
    },
  }));

  const generalOffers = services.map((s) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: s.name,
      description: s.description,
    },
  }));

  return {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${SITE_URL}/#service`,
    name: person.name,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    email: person.email,
    areaServed: AREA_SERVED,
    knowsAbout: [
      "Company formation",
      "UAE free-zone company registration",
      "UAE corporate tax",
      "UK Companies House filings",
      "UK payroll and PAYE",
      "US LLC formation",
      "Form 5472",
      "Fractional CFO services",
      "Bookkeeping",
      "Financial modelling",
      "Financial automation",
    ],
    founder: {
      "@type": "Person",
      name: person.name,
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Services",
      itemListElement: [...jurisdictionOffers, ...generalOffers],
    },
  };
}

/** FAQPage schema, built from the same array the visible FAQ renders. */
export function buildFaqGraph() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };
}
