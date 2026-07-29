/**
 * The journey: five stages walked left to right as you scroll.
 *
 * The metaphor is the march of progress — but the point isn't the walker,
 * it's what each landscape says about the work. Jungle = instinct and mess.
 * Valley = compounding systems. Every stage carries a real piece of the offer.
 */

export type Stage = {
  id: string;
  /** Shown in the progress rail. */
  label: string;
  kicker: string;
  title: string;
  body: string;
  /** Vertical gradient for the sky, top then bottom. */
  sky: [string, string];
  ground: string;
  fog: string;
  /** Accent used by that stage's foliage/architecture. */
  accent: string;
};

export const STAGES: Stage[] = [
  {
    id: "jungle",
    label: "Origin",
    kicker: "01 — The jungle",
    title: "Every business starts in the undergrowth.",
    body: "Receipts in a shoebox, numbers that only live in someone's head, decisions made on instinct because there's nothing else to go on. It works — right up until it doesn't.",
    sky: ["#cfe3c4", "#f0ead6"],
    ground: "#2f4a2c",
    fog: "#dfe6cf",
    accent: "#3f7a3a",
  },
  {
    id: "village",
    label: "Trade",
    kicker: "02 — The village",
    title: "First, somebody learns the trade.",
    body: "Books that balance. A ledger you can trust. Management accounts that show what actually happened. Unglamorous, and the foundation everything after it stands on.",
    sky: ["#e8d6b5", "#faf1e0"],
    ground: "#8a6b45",
    fog: "#f0e2c8",
    accent: "#b4703c",
  },
  {
    id: "town",
    label: "Craft",
    kicker: "03 — The town",
    title: "Then you build the machine.",
    body: "The repetitive parts stop being done by hand. Software, integrations and AI agents take the load, and the people you hired for judgement finally get to use it.",
    sky: ["#cdd6e8", "#f2f1ee"],
    ground: "#5d5f66",
    fog: "#e4e6ec",
    accent: "#4a5b8c",
  },
  {
    id: "city",
    label: "Scale",
    kicker: "04 — The city",
    title: "Then it has to hold at scale.",
    body: "Three countries, one source of truth. Teams, processes and reporting that don't buckle when the volume doubles — because the systems were built expecting it.",
    sky: ["#b9c6de", "#eef0f4"],
    ground: "#4c4f58",
    fog: "#dce2ec",
    accent: "#2b44ff",
  },
  {
    id: "valley",
    label: "Compound",
    kicker: "05 — The valley",
    title: "And then it compounds.",
    body: "Finance, technology and AI pulling in the same direction, run by someone who speaks all three. That's the whole idea — and it's what I'd like to build with you.",
    sky: ["#bcd8f0", "#f6f8fa"],
    ground: "#6f7a6a",
    fog: "#e6eef6",
    accent: "#ff5a2b",
  },
];

/** World-space length of one stage. The walker crosses all five. */
export const STAGE_LENGTH = 46;
export const WORLD_LENGTH = STAGE_LENGTH * STAGES.length;

/**
 * Scroll progress bridge. Mutable rather than React state — this updates
 * every frame and re-rendering a Canvas tree that often would be absurd.
 */
export const journey = {
  /** 0..1 across the whole walk. Everything else is derived from this. */
  progress: 0,
};

/**
 * World-space X of the walker. Derived rather than stored so the walker, the
 * camera and the ground shadow can never disagree about where he is — no
 * matter which order their frame callbacks happen to run in.
 */
export const walkerX = () => journey.progress * WORLD_LENGTH;

/** Fractional stage index, 0..STAGES.length-1. */
export const stageAt = (progress: number) =>
  Math.min(progress * (STAGES.length - 1), STAGES.length - 1);

/** Smoothstep, for morphs that shouldn't have corners. */
export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = Math.min(Math.max((x - edge0) / (edge1 - edge0), 0), 1);
  return t * t * (3 - 2 * t);
}
