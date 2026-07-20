'use client';

import { useEffect, type RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useStory } from './StoryProvider';

/**
 * Registers a scene's section as a chapter. When it scrolls into the viewport
 * band, it becomes the active chapter — driving the chapter indicator and any
 * progress-aware navigation. Each scene owns its own scrubbed timeline; this
 * only tracks "where in the film are we."
 */
export function useChapter(ref: RefObject<HTMLElement | null>, index: number, label: string): void {
  const { setActive } = useStory();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    gsap.registerPlugin(ScrollTrigger);
    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => setActive({ index, label }),
      onEnterBack: () => setActive({ index, label }),
    });
    return () => trigger.kill();
  }, [ref, index, label, setActive]);
}
