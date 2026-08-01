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
  { id: "work", label: "Work" },
  { id: "services", label: "Services" },
  { id: "contact", label: "Contact" },
] as const;

/** Hero — two voices: solid and hollow. */
export const hero = {
  lines: [
    { text: "ABHISHEK", outline: false },
    { text: "SHAH", outline: true },
  ],
  statement:
    "I build the systems that let a business see clearly, run leaner and scale without breaking — accounting and CFO work on one side, software and AI on the other.",
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
