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

## Should add

- **Project imagery.** `projects[].tone` currently drives a solid colour poster
  for both the hover preview and the expanded panel. Drop real images into
  `public/work/` and swap the gradient for `next/image`.
- **An OG image.** There's no `opengraph-image` yet, so link previews will be
  bare. A 1200×630 in `app/opengraph-image.png` is picked up automatically.
- **A favicon.** Currently none.
- **Proof figures.** The single highest-value addition. One concrete,
  defensible number per project ("cut close from 9 days to 2") does more than
  any amount of motion design.

## Deliberately not included

- No testimonials — I won't write words and attribute them to a person.
- No client logos.
- No "10+ years / 50+ projects" counters unless you supply the counts.
