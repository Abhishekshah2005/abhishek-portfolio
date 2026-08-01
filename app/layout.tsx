import type { Metadata, Viewport } from "next";
import "@fontsource-variable/archivo";
import "@fontsource-variable/space-grotesk";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { Cursor } from "@/components/ui/Cursor";
import { person } from "@/lib/content";

const description =
  "Abhishek Shah builds the systems that let a business see clearly, run leaner and scale — accounting and fractional CFO work on one side, software and AI on the other.";

export const metadata: Metadata = {
  metadataBase: new URL("https://abhishekshah.com"),
  title: {
    default: `${person.name} — ${person.role}`,
    template: `%s — ${person.name}`,
  },
  description,
  keywords: [
    "fractional CFO",
    "financial automation",
    "AI agents",
    "accounting technology",
    "custom software",
    "Abhishek Shah",
  ],
  authors: [{ name: person.name }],
  openGraph: {
    title: `${person.name} — ${person.role}`,
    description,
    type: "website",
    locale: "en_GB",
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
  return (
    <html lang="en">
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[1001] focus:rounded-full focus:bg-lime focus:px-5 focus:py-3 focus:text-coal focus:no-underline"
        >
          Skip to content
        </a>
        <SmoothScroll>
          <Cursor />
          {children}
        </SmoothScroll>
      </body>
    </html>
  );
}
