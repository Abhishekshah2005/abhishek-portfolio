import { SiteHeader, Hero } from '@/sections/home';

/**
 * Home — the premium first impression for Abhishek Shah (Finance × Technology ×
 * AI). Header + hero for now; further sections (Services, Work, About, Contact)
 * are built and polished one at a time on top of this.
 */
export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <Hero />
    </>
  );
}
