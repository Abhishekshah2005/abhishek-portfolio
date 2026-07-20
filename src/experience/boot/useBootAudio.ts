'use client';

import { useCallback } from 'react';
import { useEngineOptional } from '@/hooks/useEngine';
import type { BootAudioCue } from './bootConfig';

/**
 * Audio-cue trigger points for the boot sequence.
 *
 * Audio is intentionally NOT implemented in this phase. This hook returns a
 * `cue()` function that is wired at every dramatic beat of the boot timeline so
 * that, in a later phase, mapping each {@link BootAudioCue} to an
 * `engine.audio` sound is a one-line change here — the sequence itself needs no
 * edits.
 *
 * Planned mapping (future):
 *   boot    → sub-bass impact on cold start
 *   chime   → soft UI tick per subsystem coming online
 *   stream  → granular texture while assets stream
 *   sync    → looping pulse while holding for real readiness
 *   link    → resolving chord when the operator link establishes
 *   welcome → warm swell under the welcome message
 *   launch  → whoosh as the boot dissolves into the world
 */
export function useBootAudio() {
  const engine = useEngineOptional();

  const cue = useCallback(
    (name: BootAudioCue) => {
      // No-op until the audio phase. Trigger point is preserved for wiring:
      //   engine?.audio.play(BOOT_SOUND_MAP[name])
      if (engine?.config.debug) {
        // eslint-disable-next-line no-console
        console.debug(`[boot:audio] cue → ${name}`);
      }
    },
    [engine],
  );

  return { cue };
}
