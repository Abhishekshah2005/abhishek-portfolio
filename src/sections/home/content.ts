/**
 * The homepage content — ten chapters of one continuous cinematic traverse.
 * Real, specific, honest copy (no lorem, no fabricated client names or metrics;
 * "proof" is framed as genuine capability + references-on-request).
 */

export type ChapterVariant =
  | 'opening'
  | 'statement'
  | 'projects'
  | 'services'
  | 'process'
  | 'quote'
  | 'contact';

export interface Readout {
  label: string;
  value: string;
}

export interface Chapter {
  id: string;
  n: string;
  /** Short name shown in the HUD chapter indicator. */
  label: string;
  kicker: string;
  headline: { lead: string; accent: string; tail?: string };
  body?: string;
  points?: string[];
  projects?: { tag: string; title: string; desc: string }[];
  services?: string[];
  steps?: { n: string; t: string; d: string }[];
  quote?: { text: string; by: string };
  cta?: { label: string; href: string };
  readout: Readout[];
  variant: ChapterVariant;
}

export const CONTACT_EMAIL = 'abhishekrathod630@gmail.com';

export const CHAPTERS: Chapter[] = [
  {
    id: 'opening',
    n: '01',
    label: 'Arrival',
    kicker: 'Abhishek Shah — Finance · Technology · AI',
    headline: { lead: 'I build the systems that ', accent: 'scale', tail: ' businesses.' },
    body: 'Chartered-grade finance meets AI, automation and custom software — one operator who can read the numbers and build the machine that grows them.',
    readout: [
      { label: 'Disciplines', value: 'Finance · Tech · AI' },
      { label: 'Jurisdictions', value: 'UK · UAE · India' },
    ],
    variant: 'opening',
  },
  {
    id: 'who',
    n: '02',
    label: 'The Operator',
    kicker: 'Who I am',
    headline: { lead: 'A rare combination, ', accent: 'engineered', tail: ' to compound.' },
    body: 'Most founders hire a finance person and a tech person and hope they talk. I am both. I close the books, model the future, then build and automate the operations that get you there — nothing lost in translation between spreadsheet and software.',
    points: [
      'Chartered-grade accounting & audit',
      'CFO strategy, P&L, forecasting',
      'AI, automation & custom software',
      'Business development & operations',
    ],
    readout: [
      { label: 'One operator', value: 'Finance + Build' },
      { label: 'Track', value: 'UK · UAE · India' },
    ],
    variant: 'statement',
  },
  {
    id: 'challenges',
    n: '03',
    label: 'The Problems',
    kicker: 'What I fix',
    headline: { lead: 'The things quietly ', accent: 'costing', tail: ' you.' },
    body: 'You cannot see cash coming. Your team drowns in manual work. Your tools do not talk. Growth keeps breaking operations. Each is a system problem — and systems are what I build.',
    points: [
      'Cash flow you cannot forecast',
      'Manual work eating the week',
      'Ten tools, no single source of truth',
      'Operations that crack as you scale',
    ],
    readout: [{ label: 'Approach', value: 'Diagnose · Build · Scale' }],
    variant: 'statement',
  },
  {
    id: 'finance',
    n: '04',
    label: 'The Numbers',
    kicker: 'Finance',
    headline: { lead: 'Books that ', accent: 'tell the truth', tail: ' — on time.' },
    body: 'Accounting, audit and CFO strategy across the UK, UAE and India. Real-time cash flow on Xero and Sage, board-ready reporting, forecasts you can raise on. Month-end in days, not weeks.',
    points: [
      'UK · UAE · India accounting & compliance',
      'Fractional CFO — P&L, projections, board packs',
      'Audit-ready systems, maintained year-round',
      'Real-time cash flow & 13-week runway',
    ],
    readout: [
      { label: 'Close', value: 'Days, not weeks' },
      { label: 'Stack', value: 'Xero · Sage' },
    ],
    variant: 'statement',
  },
  {
    id: 'tech',
    n: '05',
    label: 'The Machine',
    kicker: 'Technology & AI',
    headline: { lead: 'Work that ', accent: 'runs itself', tail: '.' },
    body: 'The automation, AI agents and custom software that remove repetitive work entirely — support that answers around the clock, systems that fold your stack into one source of truth, apps and sites built to convert.',
    points: [
      'AI agents & assistants for support & ops',
      'Automation across your existing tools',
      'Custom software & SaaS to replace fragile sheets',
      'High-performance apps & websites',
    ],
    readout: [
      { label: 'Reclaimed', value: 'Hours / week' },
      { label: 'Coverage', value: '24 / 7' },
    ],
    variant: 'statement',
  },
  {
    id: 'projects',
    n: '06',
    label: 'The Proof',
    kicker: 'Selected work',
    headline: { lead: 'Proof, ', accent: 'shipped', tail: '.' },
    body: 'The kind of systems I build and the outcomes they create. Detailed case studies and client references are available on request.',
    projects: [
      {
        tag: 'Finance transformation',
        title: 'Spreadsheets → a live financial cockpit',
        desc: 'Move a growing business onto Xero or Sage with real-time cash flow, forecasting and board reporting.',
      },
      {
        tag: 'Automation',
        title: 'Removing the manual week',
        desc: 'Map the repetitive work, then automate it end-to-end across the existing toolset.',
      },
      {
        tag: 'AI',
        title: 'A support agent that never sleeps',
        desc: 'A trained AI assistant handling front-line questions across support and operations.',
      },
      {
        tag: 'Software',
        title: 'The app the business outgrew sheets for',
        desc: 'Design and engineer the product or internal tool the fragile spreadsheets were pretending to be.',
      },
    ],
    readout: [{ label: 'Case studies', value: 'On request' }],
    variant: 'projects',
  },
  {
    id: 'services',
    n: '07',
    label: 'The Work',
    kicker: 'How I can help',
    headline: { lead: 'One partner, ', accent: 'end to end', tail: '.' },
    services: [
      'Accounting & Audit',
      'CFO & Financial Strategy',
      'AI Agents & Automation',
      'Custom Software & SaaS',
      'Apps & Websites',
      'CRM & Business Development',
      'Call-Centre Operations',
      'Planning & Forecasting',
    ],
    readout: [{ label: 'Engagements', value: 'Project · Retainer' }],
    variant: 'services',
  },
  {
    id: 'process',
    n: '08',
    label: 'The Method',
    kicker: 'How it works',
    headline: { lead: 'Diagnose. Build. ', accent: 'Scale', tail: '.' },
    steps: [
      { n: '01', t: 'Diagnose', d: 'Understand the business, the numbers and the bottlenecks.' },
      { n: '02', t: 'Design', d: 'A clear plan — finance, systems and automation that fit together.' },
      { n: '03', t: 'Build', d: 'Ship in focused increments; you see progress every week.' },
      { n: '04', t: 'Scale', d: 'Hand over systems that grow without breaking.' },
    ],
    readout: [{ label: 'Cadence', value: 'Weekly progress' }],
    variant: 'process',
  },
  {
    id: 'standard',
    n: '09',
    label: 'The Standard',
    kicker: 'How I work',
    headline: { lead: 'Built to be ', accent: 'trusted', tail: '.' },
    quote: {
      text: 'I do not hand over a dashboard and disappear. I build the system, prove it works, and make sure it runs without me.',
      by: 'Abhishek Shah',
    },
    body: 'Client references and introductions available on request.',
    readout: [{ label: 'Principle', value: 'Own the outcome' }],
    variant: 'quote',
  },
  {
    id: 'contact',
    n: '10',
    label: 'The Invitation',
    kicker: "Let's talk",
    headline: { lead: "Tell me what's ", accent: 'slowing you down', tail: '.' },
    body: 'A short conversation is the fastest way to see if I can help — no pitch, just a clear read on your numbers, your systems, and what to build first.',
    cta: { label: 'Request a consultation', href: `mailto:${CONTACT_EMAIL}` },
    readout: [
      { label: 'Response', value: 'Within 24h' },
      { label: 'Based', value: 'UK · UAE · India' },
    ],
    variant: 'contact',
  },
];
