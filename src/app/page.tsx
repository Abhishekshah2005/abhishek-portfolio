import { SiteHeader, Hero, Combination } from '@/sections/home';
import { StoryProvider, ChapterIndicator, ProgressRail } from '@/story';

/**
 * Home — one continuous, directed film for Abhishek Shah (Finance × Technology ×
 * AI). The Scroll Storytelling engine (StoryProvider) tracks chapters while each
 * scene owns its scrubbed timeline and transforms into the next. Scenes 00
 * (Arrival) → 01 (The Combination) are live; later scenes plug into the same
 * engine.
 */
export default function HomePage() {
  return (
    <StoryProvider>
      <ProgressRail />
      <SiteHeader />
      <ChapterIndicator />
      <Hero />
      <Combination />
    </StoryProvider>
  );
}
