/**
 * ATLAS boot sequence definition.
 *
 * Each phase is one line in the boot log with a short status label and a
 * target progress value. The final phase is revealed only after the engine is
 * genuinely ready (the sequence holds on the phase before it). `cue` marks
 * where an audio sting will fire in a later phase — audio is NOT implemented
 * yet (see {@link useBootAudio}).
 */
export type BootAudioCue =
  | 'boot' // cold-start low sub-bass hit
  | 'chime' // per-subsystem soft tick
  | 'stream' // asset streaming texture
  | 'sync' // synchronizing pulse loop
  | 'link' // operator link resolved chord
  | 'welcome' // welcome swell
  | 'launch'; // dissolve-into-world whoosh

export interface BootPhase {
  id: string;
  /** Boot-log line (decoded via scramble). */
  label: string;
  /** Short HUD status token. */
  status: string;
  /** Progress checkpoint 0–1. */
  progress: number;
  /** Audio cue that will trigger here later. */
  cue: BootAudioCue;
}

/**
 * The last entry (`link`) is post-hold: shown only once the engine reports
 * ready. Everything before it plays on the choreographed timeline, and the
 * sequence waits on `sync` until real load completes.
 */
export const BOOT_PHASES: BootPhase[] = [
  { id: 'cold-start', label: 'cold start :: signal detected', status: 'COLD START', progress: 0.06, cue: 'boot' },
  { id: 'kernel', label: 'atlas kernel :: online', status: 'KERNEL', progress: 0.16, cue: 'chime' },
  { id: 'neural', label: 'neural core :: initializing', status: 'NEURAL CORE', progress: 0.27, cue: 'chime' },
  { id: 'engine', label: 'render engine :: mounting', status: 'RENDER ENGINE', progress: 0.4, cue: 'chime' },
  { id: 'shaders', label: 'shader pipeline :: compiling', status: 'SHADERS', progress: 0.52, cue: 'chime' },
  { id: 'assets', label: 'assets :: streaming', status: 'ASSETS', progress: 0.64, cue: 'stream' },
  { id: 'geometry', label: 'world geometry :: constructing', status: 'WORLD', progress: 0.74, cue: 'chime' },
  { id: 'camera', label: 'camera rig :: calibrating', status: 'CAMERA', progress: 0.83, cue: 'chime' },
  { id: 'lighting', label: 'volumetric lighting :: online', status: 'LIGHTING', progress: 0.89, cue: 'chime' },
  { id: 'sync', label: 'signal link :: synchronizing', status: 'SYNCHRONIZING', progress: 0.93, cue: 'sync' },
  { id: 'link', label: 'operator link :: established', status: 'OPERATOR LINK', progress: 1, cue: 'link' },
];

/** Index of the phase the sequence holds on until the engine is ready. */
export const BOOT_HOLD_INDEX = BOOT_PHASES.length - 2; // 'sync'

export const BOOT_VERSION = 'ATLAS OS v0.7 // build 2026.07';

/** Per-phase choreography step (seconds) and intro length. */
export const BOOT_TIMING = {
  intro: 0.8,
  step: 0.42,
  minVisibleMs: 2600,
  skipHintDelayMs: 1200,
  safetyTimeoutMs: 14000,
} as const;
