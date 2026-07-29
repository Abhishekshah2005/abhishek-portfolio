/**
 * Every word and number the site renders lives here.
 *
 * Anything marked `placeholder: true` is invented scaffolding so the layout can
 * be judged — it must be replaced before this goes live. See CONTENT.md for the
 * checklist. Nothing here claims a named client or a verified metric.
 */

export const person = {
  name: "Abhishek Shah",
  short: "Abhishek",
  /** Shown under the hero — the one sentence that has to land. */
  role: "Finance · Technology · AI",
  tagline: "I fix what slows businesses down.",
  location: "London · Dubai · Ahmedabad",
  email: "abhishekrathod630@gmail.com",
  available: "Available for select projects",
};

/** The giant hero words, revealed one line at a time. */
export const heroLines = [
  { text: "FINANCE", accent: false },
  { text: "TECHNOLOGY", accent: false },
  { text: "& A.I.", accent: true },
];

export const heroSub =
  "I build the systems that let a business see clearly, run leaner and scale without breaking — accounting and CFO work on one side, software and AI on the other.";

export const chapters = [
  { id: "hero", index: "01", label: "Index" },
  { id: "about", index: "02", label: "Who" },
  { id: "work", index: "03", label: "Work" },
  { id: "playground", index: "04", label: "Play" },
  { id: "capabilities", index: "05", label: "What" },
  { id: "contact", index: "06", label: "Talk" },
] as const;

export const about = {
  heading: "Two disciplines that almost never meet.",
  body: [
    "Most businesses hire an accountant who can't build, or a developer who can't read a P&L. I do both — which means the numbers and the software that produce them are designed together instead of arguing.",
    "Fifteen-ish years of that has looked like: closing books across three jurisdictions, standing up fractional CFO functions, and then writing the automation that made half of it unnecessary.",
  ],
  /** Draggable stickers — icon is a lucide-style key we render as SVG. */
  stickers: [
    { label: "Xero", tone: "blue" },
    { label: "Sage", tone: "mint" },
    { label: "Fractional CFO", tone: "ink" },
    { label: "Next.js", tone: "ink" },
    { label: "AI agents", tone: "flare" },
    { label: "P&L", tone: "paper" },
    { label: "Audit", tone: "paper" },
    { label: "React", tone: "blue" },
    { label: "Automation", tone: "flare" },
    { label: "Three.js", tone: "ink" },
    { label: "UK · UAE · IN", tone: "paper" },
    { label: "CRM", tone: "mint" },
  ],
} as const;

export type Project = {
  slug: string;
  title: string;
  discipline: string;
  year: string;
  summary: string;
  /** Solid-colour poster stand-in until real imagery exists. */
  tone: string;
  placeholder: boolean;
};

/**
 * PLACEHOLDER PROJECTS. Deliberately generic — a category of work, not a named
 * client. Replace title/summary/year with real engagements (and add imagery to
 * /public/work) before launch.
 */
export const projects: Project[] = [
  {
    slug: "close-automation",
    title: "Month-End, Automated",
    discipline: "Finance × Automation",
    year: "—",
    summary:
      "A multi-entity close that ran on spreadsheets, rebuilt as a scheduled pipeline: bank feeds reconciled, journals posted, variance report written before anyone opened a laptop.",
    tone: "#2b44ff",
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
    tone: "#12110f",
    placeholder: true,
  },
];

export const capabilities = [
  {
    group: "See clearly",
    tint: "#2b44ff",
    items: [
      "Bookkeeping & management accounts",
      "Financial projections and models",
      "P&L, cash flow and runway reporting",
      "Audit support and compliance",
    ],
  },
  {
    group: "Run leaner",
    tint: "#7b5cff",
    items: [
      "Process mapping and automation",
      "Xero / Sage implementation and clean-up",
      "AI agents for repetitive back-office work",
      "Systems integration — one source of truth",
    ],
  },
  {
    group: "Scale confidently",
    tint: "#ff5a2b",
    items: [
      "Fractional CFO and advisory",
      "Custom software, SaaS and mobile apps",
      "CRM, business development and call-centre setup",
      "Team, process and operations scaling",
    ],
  },
] as const;

export const contact = {
  heading: "Let's talk",
  body: "Tell me what's slowing you down. If I'm not the right person, I'll say so and point you at someone who is.",
  cta: "Start a conversation",
  socials: [
    { label: "Email", href: `mailto:${person.email}` },
    { label: "LinkedIn", href: "#", placeholder: true },
    { label: "GitHub", href: "#", placeholder: true },
    { label: "X", href: "#", placeholder: true },
  ],
};

export const playground = {
  heading: "Go on, throw something.",
  body: "No reason for this to exist. That's the point — the same care goes into the things nobody asked for.",
  hint: "Drag · Throw · Reset",
};
