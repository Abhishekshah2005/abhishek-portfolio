import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { ExperienceShell } from '@/experience';
import { cn } from '@/lib';
import './globals.css';

const SITE_URL = 'https://abhishekshah.com';
const TAGLINE = 'Finance × Technology × AI — build, automate, and scale your business.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Abhishek Shah — Finance, Technology & AI',
    template: '%s — Abhishek Shah',
  },
  description:
    'Abhishek Shah blends chartered-grade finance (UK, Dubai, India accounting, CFO strategy) with AI, automation, and custom software to help businesses build, automate, and scale.',
  keywords: [
    'Abhishek Shah',
    'CFO services',
    'AI solutions',
    'AI agents',
    'business automation',
    'SaaS development',
    'custom software',
    'UK accounting',
    'Dubai accounting',
    'financial projections',
  ],
  authors: [{ name: 'Abhishek Shah' }],
  creator: 'Abhishek Shah',
  openGraph: {
    type: 'website',
    url: SITE_URL,
    siteName: 'Abhishek Shah',
    title: 'Abhishek Shah — Finance, Technology & AI',
    description: TAGLINE,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abhishek Shah — Finance, Technology & AI',
    description: TAGLINE,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#08080a',
  width: 'device-width',
  initialScale: 1,
  colorScheme: 'dark',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cn(GeistSans.variable, GeistMono.variable)}>
      <body>
        <ExperienceShell>{children}</ExperienceShell>
      </body>
    </html>
  );
}
