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
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
] as const;

/**
 * Hero — offer-first, built to convert. The name lives in the header and
 * the title tag; the first screen's job is to hook the right visitor.
 * Every figure here is factual and re-stated with its caveat in the
 * Companies section below.
 */
export const hero = {
  kicker: "Company registration & filings — UAE · UK · US",
  lines: [
    { text: "Register in Dubai.", outline: false },
    { text: "Keep what you earn.", outline: true },
  ],
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

export const services = [
  { name: "Fractional CFO", tag: "Advisory · projections · runway" },
  { name: "Books & Audit", tag: "Xero · Sage · three jurisdictions" },
  { name: "Financial Models", tag: "P&L · cash flow · what-if" },
  { name: "Automation & AI Agents", tag: "The repetitive work, gone" },
  { name: "Custom Software", tag: "SaaS · apps · integrations" },
  { name: "Scaling Operations", tag: "CRM · call-centre · process" },
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
