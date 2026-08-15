import type { Metadata } from "next";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { WorkContent } from "@/components/work/WorkContent";
import { SITE_URL } from "@/lib/seo";

const TITLE = "Work — OpsRail, Black Tiger & Client Sites";
const DESCRIPTION =
  "OpsRail (order-to-cash SaaS for distributors) and Black Tiger (a security-workforce CRM with a GPS guard app) — two products founded and built solo — plus named client sites, each with a working link.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/work" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/work`,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function WorkPage() {
  return (
    <>
      <Header started />
      <main id="main">
        <WorkContent />
      </main>
      <Footer />
    </>
  );
}
