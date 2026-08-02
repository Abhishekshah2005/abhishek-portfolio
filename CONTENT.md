# Content checklist — replace before launch

Everything the site renders lives in [`lib/content.ts`](lib/content.ts). Nothing
else needs editing to change copy.

The site deliberately contains **no named clients and no invented metrics**.
Where proof would normally go, it says "references available on request"
instead of a number I can't stand behind. That's a safer default than a
plausible-looking figure — but it's also weaker than the real thing, so the
items below are worth doing.

## Must replace

| # | Where | What's there now | What it needs |
|---|-------|------------------|---------------|
| 1 | `person.email` | `abhishekrathod630@gmail.com` | Confirm this is the address you want publicly listed and scraped. A domain address (`hello@yourdomain.com`) is the usual choice. |
| 2 | `person.location` | `London · Dubai · Ahmedabad` | Confirm the three cities are how you want to present the UK/UAE/India coverage. |
| 3 | `projects[]` | 4 placeholder engagements, all `placeholder: true`, `year: "—"` | Real engagements. Keep them anonymous if the clients are confidential — "a 40-person logistics firm" is credible; a fabricated logo is not. Add real `year` values. |
| 4 | `contact.socials` | LinkedIn / GitHub / X all point at `#` and are marked `placeholder: true` | Real URLs, or delete the entries. They're currently rendered non-focusable so they can't trap keyboard users, but a dead link is still a dead link. |
| 5 | `manifesto` | "Fifteen years of closing books" | Your actual number of years. |
| 6 | `metadataBase` in `app/layout.tsx` | `https://abhishekshah.com` | Your real domain — Open Graph URLs are resolved against it. |
| 7 | `jurisdictions[]` tax figures | UAE: 0% personal income tax, 9% corporate above AED 375k, free-zone 0% on qualifying income | **Verify against current law before launch.** These were accurate when written, but thresholds and free-zone rules change — a stale tax claim on a compliance-services site is the worst possible bug. Same for UK (MTD scope) and US (Form 5472) references. |
| 8 | `credentials.body` | "not a CA, not ACCA and not FCA … worked alongside chartered accountants" | Confirm this wording is exactly how you want your qualifications framed — it's rendered verbatim in the Companies section. |
| 9 | `SITE_URL` in `lib/seo.ts` | `https://abhishekshah.com` | Same placeholder domain as item 6, now also feeding `sitemap.ts`, `robots.ts`, structured data and Open Graph URLs — update once the real domain is live. |
| 10 | `faqs[]` in `lib/content.ts` | 6 Q&As about UAE/UK/US registration and the credentials note | Same tax-law caveat as item 7 — the UAE ownership/tax answers and the Form 5472 answer should be re-verified before launch, since they also feed the FAQPage structured data search engines read directly. |

## Should add

- **Project imagery.** `projects[].tone` currently drives a solid colour poster
  for both the hover preview and the expanded panel. Drop real images into
  `public/work/` and swap the gradient for `next/image`.
- **A favicon.** Currently none.
- **Proof figures.** The single highest-value addition. One concrete,
  defensible number per project ("cut close from 9 days to 2") does more than
  any amount of motion design.

## SEO (added, verify before launch)

- **Metadata, structured data and the FAQ section now foreground the actual
  offer** — UAE/UK/US company registration and filings — instead of the
  generic "Finance · Technology · AI" framing the site launched with. Title,
  description, keywords: `app/layout.tsx`. Everything else pulls from
  `lib/content.ts`, so there's one place to edit copy.
- **`app/opengraph-image.tsx`** generates the link-preview card at build time
  (no external asset) — codes the current headline directly, so update it if
  the hero headline ever changes.
- **`app/sitemap.ts` / `app/robots.ts`** — minimal but real; both read
  `SITE_URL` from `lib/seo.ts`.
- **Two JSON-LD graphs** render in `app/layout.tsx`, built from
  `jurisdictions`, `services` and `faqs` so they can never assert something
  the visible page doesn't back up: a `ProfessionalService` with an
  `OfferCatalog` (9 offers — 3 jurisdictions + 6 general services), and a
  `FAQPage` matching the visible FAQ section verbatim.

## Deliberately not included

- No testimonials — I won't write words and attribute them to a person.
- No client logos.
- No "10+ years / 50+ projects" counters unless you supply the counts.
