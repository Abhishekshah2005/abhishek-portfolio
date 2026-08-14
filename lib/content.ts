/**
 * Every word the site renders lives here.
 *
 * `projects[]` is real, sourced from Abhishek's actual CV — named products
 * (OpsRail, Black Tiger) and named client sites, each with a live URL.
 * Anything still marked `placeholder: true` elsewhere is scaffolding so the
 * layout can be judged — replace before launch (see CONTENT.md).
 */

export const person = {
  name: "Abhishek Shah",
  short: "Abhishek",
  role: "Finance · Technology · A.I.",
  location: "Mumbai, India",
  email: "abhishekrathod630@gmail.com",
  phone: "+91 90043 30770",
  available: "Open to UK, UAE & Australia engagements",
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
 * *asterisks* light up blue instead of cream.
 */
export const manifesto =
  "Most businesses hire an accountant who can't build, or a developer who can't read a *P&L*. I never chose. Thirteen years of statutory audit and UK accounting, eight of them also *founding* and scaling a BPO — then writing the *software* and *AI* that made half of that work disappear: two live *SaaS* products, shipped myself. The numbers and the machines that produce them, designed *together*.";

export type Project = {
  slug: string;
  title: string;
  discipline: string;
  year: string;
  summary: string;
  /** Poster tint. */
  tone: string;
  placeholder: boolean;
  /** Live URL — real projects only; the card links out when this is set. */
  url?: string;
};

/**
 * Real work — two live SaaS products founded and built solo, plus named
 * client sites, all sourced from Abhishek's CV. Every entry here has a
 * working URL.
 */
export const projects: Project[] = [
  {
    slug: "opsrail",
    title: "Order-To-Cash, Built From Scratch",
    discipline: "Product × SaaS",
    year: "2025",
    summary:
      "A vertical operations platform for building-material, steel, electrical and FMCG distributors — quotation automation, credit control with order holds, multi-warehouse inventory, dispatch planning and GST invoicing synced to Tally. The full enquiry-to-payment cycle, not the generic CRM these businesses were forced to bend to fit.",
    tone: "#3fd0ff",
    placeholder: false,
    url: "https://getopsrail.com",
  },
  {
    slug: "black-tiger",
    title: "A CRM With Boots On The Ground",
    discipline: "Product × CRM",
    year: "2025",
    summary:
      "A security-workforce CRM covering the operation end to end — guard master, rosters, attendance, incidents and billing inputs — paired with a GPS-verified guard mobile app for check-in/out, patrol tracking and photo incident reports, so the field and the control room work off one live record.",
    tone: "#7b5cff",
    placeholder: false,
    url: "https://black-tiger-gtg2.onrender.com",
  },
  {
    slug: "invicta",
    title: "Not A BPO, On Purpose",
    discipline: "Brand × Web",
    year: "2024",
    summary:
      "Brand narrative, service architecture, copy direction and full responsive build for a customer-experience firm positioned deliberately against the BPO category it competes in — plus the market positioning and messaging behind it.",
    tone: "#ff5a2b",
    placeholder: false,
    url: "https://invictaindia.in",
  },
  {
    slug: "brand-sites",
    title: "Four More Brands, Shipped",
    discipline: "Web × Brand",
    year: "2024–25",
    summary:
      "Ceramic Cartel (Melbourne premium auto-detailing), BlueChip Circle (institutional finance), Events Addict (luxury Indian weddings) and Voyage Memorable (Dubai destination management) — each with its own information architecture, copy direction, responsive build and SEO metadata, deployed end to end.",
    tone: "#ff4f8b",
    placeholder: false,
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
  body: "I'm not a CA, not ACCA and not FCA — and I say that upfront. What I have is thirteen years in the room: statutory, internal, tax and VAT audits on clients including Tata Motors Finance, LIC of India and Kellogg's India, then eight years running full UK accounting in Xero for my own BPO — bank reconciliation, VAT returns and a 15-day audited P&L cycle, real numbers on a real deadline. You get the work done properly — and if a job ever needs a chartered signature, I'll be the first to tell you.",
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
    tag: "15-day audited P&L cycle",
    description:
      "Full P&L accountability and a 15-day audited management reporting cycle — built running my own multi-entity business for eight years, not learned from a textbook. Board-ready numbers, on a rhythm leadership can actually plan around.",
    points: [
      "A 15-day audited P&L cycle — twice-monthly management profit and loss, reviewed and signed off, not a quarterly surprise",
      "Full P&L accountability across multiple entities, built managing my own books for eight years",
      "Direct oversight of an in-house finance team — process, controls and review standards set and enforced",
      "Cash, margin and cost-movement visibility leadership can actually act on",
    ],
    idealFor:
      "Founders and operators who need senior financial judgement on tap, not a full-time hire's salary.",
    process: [
      {
        step: "Diagnostic",
        detail:
          "A first pass through your books and reporting — what's solid, what's missing, what's actually urgent.",
      },
      {
        step: "Cadence",
        detail:
          "A 15-day audited P&L cycle — the same rhythm I ran for my own business, twice a month, for eight years.",
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
    tag: "Xero · 13+ years audit",
    description:
      "End-to-end UK accounting in Xero, run for real across multiple entities for eight years — plus thirteen years of statutory, internal, tax and VAT audit on clients including Tata Motors Finance and LIC of India.",
    points: [
      "Day-to-day UK accounting in Xero — sales, purchases, payroll postings and journals, kept continuously audit-ready",
      "Bank reconciliations across multiple accounts, closed to zero unmatched items every cycle",
      "VAT returns prepared, reconciled and filed — control accounts checked before every submission",
      "Statutory, internal, tax, stock and VAT audit experience across corporate and non-corporate clients",
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
    name: "Management Reporting & Modelling",
    tag: "P&L · cash · a fixed cycle",
    description:
      "P&L and management reporting built to a fixed, audited cycle — the same twice-monthly rhythm that gave one growing business near-real-time visibility on margin, cost movement and cash for eight straight years.",
    points: [
      "Twice-monthly management P&L, reviewed and signed off — not a static model nobody opens again",
      "Year-end finalisation, plus complete schedules and workings prepared for external accountants and auditors",
      "Multi-entity reporting kept consistent and comparable across books",
      "Built to be updated by you, not just handed over once and forgotten",
    ],
    idealFor:
      "Operators who need reporting they can trust on a fixed schedule, not a one-off model for a pitch deck.",
    process: [
      {
        step: "Structure",
        detail: "Map the business into the numbers that actually move — the same exercise behind eight years of my own reporting cycle.",
      },
      {
        step: "Build",
        detail: "Management P&L and reporting schedules, built to close on a fixed 15-day cycle.",
      },
      {
        step: "Hand-off",
        detail: "A walkthrough so you can run it yourself, plus updates when the business changes.",
      },
    ],
  },
  {
    slug: "automation-ai-agents",
    name: "Automation & AI Agents",
    tag: "Claude · ChatGPT · Replit",
    description:
      "The same AI-assisted stack that took two live SaaS products from idea to production in weeks, not months — Claude, Claude Cowork, ChatGPT, Replit, Google Flow and Nano Banana, pointed at your repetitive work instead of a demo.",
    points: [
      "Built on the tools already proven on two live products — Claude, Claude Cowork, ChatGPT, Replit, Google Flow, Nano Banana",
      "Reconciliations, data entry and recurring reports handled by workflows and agents that just run",
      "Design-to-production timelines compressed from months to weeks, the same way OpsRail and Black Tiger shipped",
      "Built on the tools you already use — no rip-and-replace",
    ],
    idealFor: "Teams doing the same manual task every week that a workflow — or an AI-assisted build — could just do.",
    process: [
      {
        step: "Find the repeat work",
        detail: "The reconciliations, exports and copy-paste jobs eating real hours every month.",
      },
      {
        step: "Automate it",
        detail: "Workflows and AI agents built in the same AI-assisted stack that shipped two live SaaS products.",
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
    tag: "Two SaaS products, shipped solo",
    description:
      "OpsRail and Black Tiger — two commercial SaaS products, founded, designed and built end to end, not commissioned from someone else's team. The same delivery for your internal tool or integration.",
    points: [
      "Live proof of the work: OpsRail (order-to-cash for distributors) and Black Tiger (security workforce CRM with a GPS guard app), both founded and built solo",
      "Internal tools built for the exact process you have, not the closest off-the-shelf fit",
      "Integrations between your accounting stack, CRM and everything else that touches a number",
      "Built and maintained by someone who also understands the accounting and operations behind it",
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
        detail: "A tool or integration scoped to that process — shipped the way OpsRail and Black Tiger were, not a six-month platform project.",
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
    tag: "0 to 17 people, eight years",
    description:
      "Built a sales and operations floor from zero to fifteen–seventeen people and ran it for eight years — recruitment, training, QA, performance management, multi-brand client relationships, full P&L and compliance across two countries.",
    points: [
      "Team building from zero — recruitment, scripting, training, QA and performance management, proven on a 15–17 person floor",
      "Multi-brand client and partner management sustaining revenue across a portfolio for eight straight years",
      "CRM and process design — the same operational backbone built into OpsRail and Black Tiger for clients",
      "Compliance and governance held across two jurisdictions simultaneously, not delegated away",
    ],
    idealFor: "Teams that have outgrown spreadsheets and tribal knowledge and need real process underneath them.",
    process: [
      {
        step: "Audit",
        detail: "Where's the process actually living today — a spreadsheet, someone's head, three disconnected tools.",
      },
      {
        step: "Design",
        detail: "Process and tooling that fits how the team actually works — built the way I built my own floor, not a generic playbook.",
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
    a: "No, and I lead with that. What I have is thirteen years of statutory, internal, tax and VAT audit — clients including Tata Motors Finance, LIC of India and Kellogg's India — plus eight years running full UK accounting in Xero for my own business. If a job ever needs a chartered signature, you'll hear it from me before you have to ask.",
  },
  {
    q: "Can you handle UAE, UK and US filings for one business at the same time?",
    a: "That's the actual point of working from one desk. A UAE holding company, a UK trading entity and a US LLC can be registered and kept compliant together, by one person who understands how the three interact.",
  },
  {
    q: "You do accounting and build software — how does that actually work?",
    a: "One person, two skill sets that usually live in different people. Thirteen years of audit and UK accounting told me exactly what a finance function actually needs; the last year went into learning to build it myself, in an AI-assisted stack, rather than briefing a developer and hoping the translation survives. OpsRail and Black Tiger are both live because of that — not a portfolio piece, a business decision that shipped.",
  },
] as const;

export const contact = {
  heading: "LET'S TALK",
  body: "Tell me what's slowing you down. If I'm not the right person, I'll say so and point you at someone who is.",
  cta: "Start a conversation",
  socials: [
    { label: "Email", href: `mailto:${person.email}`, placeholder: false },
    { label: "Call", href: `tel:${person.phone.replace(/\s+/g, "")}`, placeholder: false },
    { label: "LinkedIn", href: "#", placeholder: true },
    { label: "GitHub", href: "#", placeholder: true },
    { label: "X", href: "#", placeholder: true },
  ],
};
