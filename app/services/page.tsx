import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { ServicesContent } from "@/components/services/ServicesContent";
import { SITE_URL } from "@/lib/seo";

const TITLE = "Services — Fractional CFO, Bookkeeping, Automation & More";
const DESCRIPTION =
  "Fractional CFO, bookkeeping & audit support, financial modelling, automation & AI agents, custom software and scaling operations — what's included, who it's for, and how each engagement actually runs.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/services" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/services`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function ServicesPage() {
  return (
    <>
      <Header started />
      <main id="main">
        <ServicesContent />
      </main>
      <Footer />
    </>
  );
}
