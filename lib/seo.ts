/**
 * SEO constants and structured-data builders.
 *
 * One source for the site URL and the JSON-LD graphs, so metadata,
 * sitemap.ts, robots.ts and opengraph-image.tsx can never drift out of
 * sync with each other or with the visible page copy.
 */
import { contact, faqs, jurisdictions, person, services } from "@/lib/content";

// The GitHub Pages default URL — the site's actual deploy target, not a
// placeholder. Update this (and next.config.ts's basePath) together if a
// custom domain ever replaces it.
export const SITE_URL = "https://abhishekshah2005.github.io/abhishek-portfolio";

export const SITE_TITLE =
  "Company Registration & Filings — UAE, UK & US";

export const SITE_DESCRIPTION =
  "Register your company in Dubai, the UK or the US and keep every filing compliant — UAE mainland & free-zone setup, corporate tax & VAT, UK confirmation statements & payroll, US LLC formation & Form 5472 — plus fractional CFO, bookkeeping and financial automation from thirteen years of audit and UK accounting, and CRM/SaaS products designed and built end to end.";

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
    telephone: person.phone,
    // Real profile links only — placeholders and mailto:/tel: entries
    // don't belong in sameAs.
    sameAs: contact.socials
      .filter((s) => !s.placeholder && s.href.startsWith("http"))
      .map((s) => s.href),
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
      "Statutory and tax audit",
      "Financial modelling",
      "Financial automation",
      "CRM and SaaS product development",
      "AI-assisted software development",
      "BPO operations leadership",
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
