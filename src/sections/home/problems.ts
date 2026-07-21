export type Discipline = 'Finance' | 'Software' | 'AI' | 'Business';

export interface Problem {
  id: string;
  group: string;
  problem: string;
  disciplines: Discipline[];
  solution: string;
  /** Placeholder proof — swap for a real figure/outcome later. */
  proof: string;
}

export const GROUPS = ['See clearly', 'Run leaner', 'Scale confidently'] as const;

/**
 * The "Diagnose" lenses — the signature moment. A visitor picks where it hurts
 * and the Index filters to the problems Abhishek solves in that discipline.
 * `disciplines: null` means "Everything" (the reset).
 */
export type LensId = 'all' | 'finance' | 'software' | 'ai';

export interface Lens {
  id: LensId;
  label: string;
  disciplines: readonly Discipline[] | null;
}

export const LENSES: readonly Lens[] = [
  { id: 'all', label: 'Everything', disciplines: null },
  { id: 'finance', label: 'Finance & cash', disciplines: ['Finance'] },
  { id: 'software', label: 'Software & systems', disciplines: ['Software'] },
  { id: 'ai', label: 'AI & automation', disciplines: ['AI'] },
];

/** Does a problem fall under the given lens? */
export function matchesLens(problem: Problem, lens: Lens): boolean {
  return lens.disciplines === null || problem.disciplines.some((d) => lens.disciplines!.includes(d));
}

export const PROBLEMS: Problem[] = [
  {
    id: 'cash',
    group: 'See clearly',
    problem: 'You can’t see cash coming.',
    disciplines: ['Finance'],
    solution: 'Real-time cash-flow and forecasting on Xero or Sage, built to your business.',
    proof: '13-week runway, always visible',
  },
  {
    id: 'multi-country',
    group: 'See clearly',
    problem: 'Your books span three countries.',
    disciplines: ['Finance'],
    solution: 'UK, UAE and India accounting and compliance, consolidated into one clean close.',
    proof: 'Month-end in days, not weeks',
  },
  {
    id: 'no-cfo',
    group: 'See clearly',
    problem: 'You’re flying without a CFO.',
    disciplines: ['Finance'],
    solution: 'Fractional CFO: P&L strategy, projections and board-ready reporting.',
    proof: 'Investor-ready in 30 days',
  },
  {
    id: 'audit',
    group: 'See clearly',
    problem: 'Audit season is chaos.',
    disciplines: ['Finance'],
    solution: 'Audit-ready systems and controls, maintained year-round.',
    proof: 'Clean audit, no scramble',
  },
  {
    id: 'manual',
    group: 'Run leaner',
    problem: 'Your team drowns in manual work.',
    disciplines: ['Software', 'AI'],
    solution: 'Automations and integrations that remove the repetitive work entirely.',
    proof: 'Hours reclaimed every week',
  },
  {
    id: 'silos',
    group: 'Run leaner',
    problem: 'Your data lives in ten disconnected tools.',
    disciplines: ['Software'],
    solution: 'Integrations and a single source of truth across your stack.',
    proof: 'One system, all your data',
  },
  {
    id: 'ai-agents',
    group: 'Run leaner',
    problem: 'You answer the same questions all day.',
    disciplines: ['AI'],
    solution: 'AI agents and assistants for support, ops and internal knowledge.',
    proof: '24/7 answers, leaner headcount',
  },
  {
    id: 'call-centre',
    group: 'Run leaner',
    problem: 'Your call centre can’t keep up.',
    disciplines: ['AI', 'Business'],
    solution: 'Call-centre operations design, augmented with AI.',
    proof: 'Faster response, lower cost',
  },
  {
    id: 'spreadsheets',
    group: 'Scale confidently',
    problem: 'Spreadsheets are holding you back.',
    disciplines: ['Software'],
    solution: 'Custom software and SaaS to replace the fragile sheets you’ve outgrown.',
    proof: 'A system you can grow on',
  },
  {
    id: 'app',
    group: 'Scale confidently',
    problem: 'You need an app or site that performs.',
    disciplines: ['Software'],
    solution: 'Apps and high-performance websites, designed and engineered end to end.',
    proof: 'Shipped fast, built to convert',
  },
  {
    id: 'sales',
    group: 'Scale confidently',
    problem: 'Sales is ad-hoc, not a system.',
    disciplines: ['Business', 'Software'],
    solution: 'CRM and business-development systems that make revenue repeatable.',
    proof: 'A pipeline you can rely on',
  },
  {
    id: 'scaling',
    group: 'Scale confidently',
    problem: 'Growth keeps breaking your operations.',
    disciplines: ['Finance', 'Software', 'AI'],
    solution: 'Finance and operations that scale together — no cracks as you grow.',
    proof: 'Scale without the breakage',
  },
];
