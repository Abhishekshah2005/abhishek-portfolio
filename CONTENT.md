# Content checklist — replace before launch

Everything the site renders lives in [`lib/content.ts`](lib/content.ts). Nothing
else needs editing to change copy.

Most of what this file originally flagged as placeholder has since been
replaced with real content sourced from Abhishek's CV — projects, socials,
credentials, location, the manifesto's years. What's left is genuinely open.

## Resolved

| # | Where | What changed |
|---|-------|---------------|
| 1 | `person.email` | Confirmed — `abhishekrathod630@gmail.com`. |
| 2 | `person.location` | Fixed — `Mumbai, India` (was a placeholder `London · Dubai · Ahmedabad`). |
| 3 | `projects[]` | Real, named work — OpsRail, Black Tiger, Invicta, four client brand sites — each with a working URL and full CV detail, no longer `placeholder: true`. |
| 4 | `contact.socials` | Real LinkedIn/GitHub URLs; the unused X placeholder was dropped rather than left dead. |
| 5 | `manifesto` | "Thirteen years", matching the CV's stated experience. |
| 6, 9 | `metadataBase` / `SITE_URL` | Both point at the real GitHub Pages URL (`lib/seo.ts`'s `SITE_URL`, which `app/layout.tsx` reads). Update both together if a custom domain ever replaces it. |
| 8 | `credentials.body` | Rewritten with real specifics — named audit clients, the 15-day P&L cycle, eight years running UK Xero accounting. |
| — | Project imagery placeholder | The `public/work/README.md` note this file used to point at is gone — the /work page ships as text-and-tone poster cards by design now, not something waiting on photography. |

## Still open

| # | Where | What it needs |
|---|-------|----------------|
| 7, 10 | `jurisdictions[]` tax figures, `faqs[]` | **Verify against current law before launch.** UAE personal/corporate tax, free-zone qualifying income, UK MTD scope, US Form 5472 — these were accurate when written, but thresholds and rules change, and a stale tax claim on a compliance-services site is the worst possible bug. |
| — | Favicon | Still none. |
| — | Proof figures | The single highest-value remaining addition — one concrete, defensible number per project or engagement ("cut close from 9 days to 2") does more than any amount of motion design. |

## Deliberately not included

- No testimonials — I won't write words and attribute them to a person.
- No client logos.
- No "10+ years / 50+ projects" counters unless supplied with real counts.
