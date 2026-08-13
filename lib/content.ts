/**
 * Every word the site renders lives here.
 *
 * Anything marked `placeholder: true` is scaffolding so the layout can be
 * judged — replace before launch (see CONTENT.md). Nothing here claims a
 * named client or a verified metric.
 */

export const person = {
  name: "Abhishek Shah",
  short: "Abhishek",
  role: "Finance · Technology · A.I.",
  location: "London · Dubai · Ahmedabad",
  email: "abhishekrathod630@gmail.com",
  available: "Available for select projects",
};

export const nav = [
  { id: "registrations", label: "Companies" },
  { id: "work", label: "Work" },
  // The only nav item that's a real route rather than a same-page anchor —
  // it goes to the full writeups on /services, not the homepage teaser.
  { href: "/services", label: "Services" },
  { id: "contact", label: "Contact" },
] as const;

/**
 * The full chapter list, for the scroll-position rail — mirrors the
 * "0N — Label" kickers already printed at the top of each section, so the
 * rail can never disagree with what's on screen.
 */
export const chapters = [
  { id: "manifesto", label: "Who" },
  { id: "registrations", label: "Companies" },
  { id: "faq", label: "FAQ" },
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Talk" },
] as const;

/**
 * Hero — offer-first, built to convert. The name lives in the header and
 * the title tag; the first screen's job is to hook the right visitor.
 * Every figure here is factual and re-stated with its caveat in the
 * Companies section below.
 */
export const hero = {
  kicker: "Company registration & filings — UAE · UK · US",
  // The headline itself is hardcoded in Hero.tsx (it needs a specific word
  // picked out per line for the shimmer, which this shape can't express).
  sub: "Mainland or free-zone company, residency visa, bank account and every filing after — plus UK and US formation, tax and payroll. One desk, end to end.",
  /** The cycling hook — the number IS the headline. */
  stats: [
    { value: "0%", label: "personal income tax in the UAE" },
    { value: "9%", label: "corporate tax — and only above AED 375k profit" },
    { value: "100%", label: "foreign ownership — no local partner needed" },
  ],
  chips: [
    "Free-zone & mainland",
    "Residency visas",
    "Bank account support",
    "UK — CT600 · VAT · payroll",
    "US — LLC · Form 5472",
  ],
  primaryCta: "Get a free consultation",
  secondaryCta: "Compare UAE · UK · US",
};

/**
 * The manifesto — scrubbed word by word while pinned. Words wrapped in
 * *asterisks* light up lime instead of cream.
 */
export const manifesto =
  "Most businesses hire an accountant who can't build, or a developer who can't read a *P&L*. I never chose. Fifteen years of closing books across *three* countries, standing up *CFO* functions — then writing the *software* and *AI* that made half of that work disappear. The numbers and the machines that produce them, designed *together*.";

export type Project = {
  slug: string;
  title: string;
  discipline: string;
  year: string;
  summary: string;
  /** Poster tint until real imagery exists. */
  tone: string;
  placeholder: boolean;
};

/** PLACEHOLDER projects — categories of work, not named clients. */
export const projects: Project[] = [
  {
    slug: "close-automation",
    title: "Month-End, Automated",
    discipline: "Finance × Automation",
    year: "—",
    summary:
      "A multi-entity close that ran on spreadsheets, rebuilt as a scheduled pipeline: bank feeds reconciled, journals posted, variance report written before anyone opened a laptop.",
    tone: "#d9ff40",
    placeholder: true,
  },
  {
    slug: "cfo-dashboard",
    title: "The Operator's Dashboard",
    discipline: "Finance × Product",
    year: "—",
    summary:
      "One screen a founder actually checks: cash runway, committed spend, collections risk and the three numbers that move them — pulled live from the ledger.",
    tone: "#ff5a2b",
    placeholder: true,
  },
  {
    slug: "ai-back-office",
    title: "An Agent For The Back Office",
    discipline: "AI × Operations",
    year: "—",
    summary:
      "Document-in, decision-out. Invoices, receipts and contracts read by an agent, coded correctly, escalated to a human only when confidence drops.",
    tone: "#7b5cff",
    placeholder: true,
  },
  {
    slug: "scale-systems",
    title: "Built To Take The Weight",
    discipline: "Software × Scaling",
    year: "—",
    summary:
      "CRM, call-centre workflow and reporting stitched into one source of truth so a growing team stopped re-typing the same customer into four tools.",
    tone: "#3fd0ff",
    placeholder: true,
  },
];

/* ------------------------------------------------------------------
   THE FLAGSHIP: company registration & filings across three flags.
   Tax figures are stated factually and hedged — verify current
   thresholds before launch (see CONTENT.md).
------------------------------------------------------------------ */

export type Jurisdiction = {
  code: string;
  name: string;
  tagline: string;
  services: string[];
  /** Only the UAE gets the "why" panel — it's the pitch. */
  why?: {
    title: string;
    points: string[];
    note: string;
  };
};

export const jurisdictions: Jurisdiction[] = [
  {
    code: "UAE",
    name: "United Arab Emirates",
    tagline: "Where founders keep more of what they earn.",
    services: [
      "Mainland & free-zone company registration",
      "Corporate tax registration & filings",
      "VAT registration & returns",
      "Residency visas through your company",
      "Corporate bank account support",
      "Bookkeeping kept FTA-compliant",
    ],
    why: {
      title: "Why the UAE is worth a hard look",
      points: [
        "0% personal income tax — salaries and dividends land whole",
        "Corporate tax of 9% only above AED 375k profit — qualifying free-zone income can sit at 0%",
        "No capital gains or withholding tax for individual investors",
        "100% foreign ownership — no local partner needed",
        "Full repatriation of profits and capital",
        "An extensive double-tax-treaty network protecting cross-border income",
      ],
      note: "The honest caveat: what you actually save depends on where you live and earn. That's the first conversation we have — before anything gets registered.",
    },
  },
  {
    code: "UK",
    name: "United Kingdom",
    tagline: "Companies House and HMRC, handled end to end.",
    services: [
      "Ltd company registration at Companies House",
      "Confirmation statements — filed on time, every year",
      "Annual accounts & Corporation Tax (CT600)",
      "Director self-assessment returns",
      "VAT registration & Making Tax Digital returns",
      "Payroll — PAYE, RTI submissions, payslips & pension auto-enrolment",
    ],
  },
  {
    code: "US",
    name: "United States",
    tagline: "Formation and filings without the Delaware mystique.",
    services: [
      "LLC & C-Corp formation — Delaware, Wyoming & beyond",
      "EIN and state registrations",
      "Federal & state tax filings",
      "Foreign-owned LLC reporting (Form 5472)",
      "Annual reports & franchise tax",
      "Bookkeeping in US GAAP shape",
    ],
  },
];

/** The straight-talk block — his words, kept honest. */
export const credentials = {
  kicker: "The honest bit",
  body: "I'm not a CA, not ACCA and not FCA — and I say that upfront. I'm an accountant: strong accounting fundamentals and solid audit knowledge, built over years of working alongside chartered accountants. You get the work done properly — and if a job ever needs a chartered signature, I'll be the first to tell you.",
};

export type Service = {
  slug: string;
  name: string;
  tag: string;
  description: string;
  /** The flip-card back / page "what's included" list. */
  points: string[];
  idealFor: string;
  process: { step: string; detail: string }[];
};

/**
 * The broader service list, below the flagship. Each entry carries a real
 * sentence, not just a tag — search engines and scanning visitors both read
 * off the same copy, so it has to earn its place either way. `points` /
 * `idealFor` / `process` back the flip cards on the homepage and the full
 * writeups on `/services` — one array, two views, so they can never drift
 * out of sync with each other.
 */
export const services: Service[] = [
  {
    slug: "fractional-cfo",
    name: "Fractional CFO",
    tag: "Advisory · projections · runway",
    description:
      "Board-ready financial leadership without a full-time hire — cash flow forecasting, fundraising support and the budget-vs-actual reporting investors and lenders actually ask for.",
    points: [
      "Monthly board packs — cash runway, budget-vs-actual, the numbers investors actually read",
      "Fundraising support — data room prep, cap table sanity checks, investor Q&A",
      "Rolling 13-week and 12-month cash flow forecasts",
      "A direct line to your bank, auditor and lawyers when finance questions come up",
    ],
    idealFor:
      "Founders and operators who need senior financial judgement on tap, not a full-time hire's salary.",
    process: [
      {
        step: "Diagnostic",
        detail:
          "A first pass through your books, cap table and reporting — what's solid, what's missing, what's actually urgent.",
      },
      {
        step: "Cadence",
        detail:
          "Monthly close, board pack and a standing call — the rhythm investors and lenders expect to see.",
      },
      {
        step: "Scale with you",
        detail:
          "More hours when you're raising or closing a round, fewer when things are steady — priced for the shape of your year, not a fixed retainer.",
      },
    ],
  },
  {
    slug: "bookkeeping-audit-support",
    name: "Bookkeeping & Audit Support",
    tag: "Xero · Sage · three countries",
    description:
      "Books kept accurate month to month in Xero or Sage across UK, UAE and Indian entities, with audit-ready files and direct support for your external auditor.",
    points: [
      "Monthly bookkeeping in Xero or Sage — UK, UAE and Indian entities, one consistent chart of accounts",
      "Bank and card reconciliations closed every month, not caught up in a scramble before year-end",
      "Audit-ready working files, so your external auditor gets what they ask for the first time",
      "VAT / corporation tax filings scheduled and filed on time, every time",
    ],
    idealFor:
      "Businesses that want their books closed monthly, not reconstructed in a panic at year-end.",
    process: [
      {
        step: "Migrate or clean up",
        detail: "Bring your existing books in — or start clean if there's nothing worth keeping.",
      },
      {
        step: "Monthly close",
        detail: "Reconciled accounts, categorised transactions, a P&L you can actually read, every month.",
      },
      {
        step: "Audit season, handled",
        detail: "Working papers ready before your auditor asks, and I'm on the call when they have questions.",
      },
    ],
  },
  {
    slug: "financial-modelling",
    name: "Financial Modelling",
    tag: "P&L · cash flow · what-if",
    description:
      "Three-statement models, scenario planning and cash-runway forecasts built to hold up under real investor and lender scrutiny — not just look good in a pitch deck.",
    points: [
      "Three-statement models — P&L, balance sheet, cash flow — properly linked, not a spreadsheet that breaks on one changed number",
      "Scenario and what-if planning for pricing, hiring and fundraising decisions",
      "Cash-runway forecasts that hold up under investor and lender diligence",
      "A model you can actually update yourself after handover",
    ],
    idealFor:
      "Anyone about to raise, borrow, or make a pricing or hiring call they can't afford to get wrong.",
    process: [
      {
        step: "Structure",
        detail: "Map the business into the drivers that actually move the numbers — not a generic template.",
      },
      {
        step: "Build",
        detail: "A linked three-statement model, stress-tested against the scenarios you're actually worried about.",
      },
      {
        step: "Hand-off",
        detail: "A walkthrough so you can run it yourself, plus updates when the assumptions change.",
      },
    ],
  },
  {
    slug: "automation-ai-agents",
    name: "Automation & AI Agents",
    tag: "The repetitive work, gone",
    description:
      "The reconciliations, data entry and recurring reports that used to eat a week, handled by workflows and AI agents that just run — and tell you when something looks wrong.",
    points: [
      "Bank feeds and reconciliations automated end to end",
      "Recurring reports generated and sent on a schedule — no more manual exports",
      "AI agents that flag anomalies — a duplicate invoice, an unusual spend — instead of you finding them three months later",
      "Built on the tools you already use — no rip-and-replace",
    ],
    idealFor: "Teams doing the same manual finance task every week that a workflow could just do.",
    process: [
      {
        step: "Find the repeat work",
        detail: "The reconciliations, exports and copy-paste jobs eating real hours every month.",
      },
      {
        step: "Automate it",
        detail: "Workflows and AI agents that run on schedule, on top of your existing stack.",
      },
      {
        step: "Watch it run",
        detail: "Reporting on what the automation caught, so it's trusted — not a black box.",
      },
    ],
  },
  {
    slug: "custom-software-integrations",
    name: "Custom Software & Integrations",
    tag: "SaaS · apps · integrations",
    description:
      "SaaS products, internal tools and system integrations that connect your accounting stack to the rest of the business, so numbers stop getting re-typed by hand.",
    points: [
      "Internal tools built for the exact process you have, not the closest off-the-shelf fit",
      "Integrations between your accounting stack, CRM and everything else that touches a number",
      "Small SaaS products, when the tool that should exist doesn't yet",
      "Built and maintained by someone who also understands the accounting behind it",
    ],
    idealFor:
      "Operations that have outgrown spreadsheets but aren't ready for — or don't need — enterprise software.",
    process: [
      {
        step: "Scope",
        detail: "What's the process today, where does it break, what would \"fixed\" actually look like.",
      },
      {
        step: "Build",
        detail: "A tool or integration scoped to that process — shipped, not a six-month platform project.",
      },
      {
        step: "Support",
        detail: "Maintained and extended as the business changes, not handed off and forgotten.",
      },
    ],
  },
  {
    slug: "scaling-operations",
    name: "Scaling Operations",
    tag: "CRM · call-centre · process",
    description:
      "CRM, call-centre setup and process design for teams that have outgrown spreadsheets and tribal knowledge — the operational half of getting bigger without breaking.",
    points: [
      "CRM setup and clean-up — pipeline, ownership, reporting that actually reflects the business",
      "Call-centre and support tooling for teams past the point of ad-hoc",
      "Process documentation, so growth doesn't depend on one person's memory",
      "The operational backbone that lets finance, sales and support actually talk to each other",
    ],
    idealFor: "Teams that have outgrown spreadsheets and tribal knowledge and need real process underneath them.",
    process: [
      {
        step: "Audit",
        detail: "Where's the process actually living today — a spreadsheet, someone's head, three disconnected tools.",
      },
      {
        step: "Design",
        detail: "Process and tooling that fits how the team actually works, not a generic playbook.",
      },
      {
        step: "Embed",
        detail: "Documented, trained, and checked back on — so it sticks after I'm not in the room.",
      },
    ],
  },
];

/**
 * FAQ — the objections a real prospect has before they email. Shared by the
 * visible FAQ section and its FAQPage structured data (see lib/seo.ts), so
 * the two can never drift out of sync.
 */
export const faqs = [
  {
    q: "How much does it cost to register a company in Dubai as a foreigner?",
    a: "Free-zone and mainland setup costs vary by activity, licence type and how many visas you need — the two or three numbers that actually decide it. I size it properly for your case before you commit to a jurisdiction.",
  },
  {
    q: "Can I own 100% of my UAE company as a foreign national?",
    a: "Yes — free-zone companies and most mainland activities now allow full foreign ownership, with no local sponsor required.",
  },
  {
    q: "What is a UK confirmation statement, and what happens if I miss it?",
    a: "It's an annual snapshot Companies House requires, confirming your directors, shareholders and registered address are current. Miss it and the company can be struck off the register — so it's filed on a fixed schedule, every year, without you having to remember.",
  },
  {
    q: "Do I need to file US taxes if my LLC has no US-based owners?",
    a: "Almost always, yes — a foreign-owned single-member LLC still carries an annual Form 5472 and pro forma 1120 filing obligation, even with zero US activity. Missing it carries a real penalty, so it's one of the first things I set up.",
  },
  {
    q: "Are you a Chartered Accountant — CA, ACCA or FCA?",
    a: "No, and I lead with that. I'm an accountant with strong accounting and audit fundamentals, built over years working alongside chartered accountants. If a job ever needs a chartered signature, you'll hear it from me before you have to ask.",
  },
  {
    q: "Can you handle UAE, UK and US filings for one business at the same time?",
    a: "That's the actual point of working from one desk. A UAE holding company, a UK trading entity and a US LLC can be registered and kept compliant together, by one person who understands how the three interact.",
  },
] as const;

export const contact = {
  heading: "LET'S TALK",
  body: "Tell me what's slowing you down. If I'm not the right person, I'll say so and point you at someone who is.",
  cta: "Start a conversation",
  socials: [
    { label: "Email", href: `mailto:${person.email}`, placeholder: false },
    { label: "LinkedIn", href: "#", placeholder: true },
    { label: "GitHub", href: "#", placeholder: true },
    { label: "X", href: "#", placeholder: true },
  ],
};
