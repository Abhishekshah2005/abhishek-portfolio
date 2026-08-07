import type { Metadata, Viewport } from "next";
import "@fontsource-variable/archivo";
import "@fontsource-variable/space-grotesk";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Cursor } from "@/components/ui/Cursor";
import { CursorGlow } from "@/components/ui/CursorGlow";
import { ScrollProgress } from "@/components/ui/motion";
import { person } from "@/lib/content";
import {
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_URL,
  buildFaqGraph,
  buildServiceGraph,
} from "@/lib/seo";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_TITLE} — ${person.name}`,
    template: `%s — ${person.name}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "company registration Dubai",
    "UAE company formation",
    "UAE free zone company",
    "UAE corporate tax registration",
    "UK confirmation statement filing",
    "UK company accounts and payroll",
    "US LLC formation for non-residents",
    "Form 5472 filing",
    "fractional CFO",
    "Xero bookkeeping",
    "financial automation",
    "Abhishek Shah",
  ],
  authors: [{ name: person.name }],
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_TITLE} — ${person.name}`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    siteName: person.name,
    type: "website",
    locale: "en_GB",
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_TITLE} — ${person.name}`,
    description: SITE_DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  // Never block zoom — pinch-to-zoom is an accessibility requirement.
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Structured data is built from the same content the page renders, so it
  // can never assert a service or fact the visible copy doesn't back up.
  const serviceGraph = buildServiceGraph();
  const faqGraph = buildFaqGraph();

  return (
    <html lang="en">
      {/* No manual <head> here — Next.js owns it via the `metadata` export.
          JSON-LD is valid in <body> too (Google reads it either way), which
          avoids any risk of two heads colliding. */}
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceGraph) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqGraph) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[1001] focus:rounded-full focus:bg-lime focus:px-5 focus:py-3 focus:text-coal focus:no-underline"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <ScrollProgress />
          <CursorGlow />
          <Cursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
