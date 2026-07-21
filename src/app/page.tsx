import { SiteHeader, Statement, ProblemIndex, Invitation } from '@/sections/home';

/**
 * Home — "The Index: Problems, Solved." The page leads with the business
 * problems Abhishek solves (tagged Finance / Software / AI, each opening to a
 * solution + proof), so a visitor recognises their own pain, then converts.
 */
export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <Statement />
      <ProblemIndex />
      <Invitation />
    </>
  );
}
