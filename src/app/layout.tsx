import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { ExperienceShell } from '@/experience';
import { cn } from '@/lib';
import './globals.css';

export const metadata: Metadata = {
  title: 'Abhishek — Interactive Portfolio',
  description: 'A premium, scroll-driven 3D portfolio experience.',
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#05050a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  colorScheme: 'dark',
};

/**
 * Root layout. Self-hosts the type families and mounts the global experience
 * shell (engine, providers, scene stage, overlays, cursor, preloader) around
 * all content. No portfolio sections live here.
 */
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={cn(GeistSans.variable, GeistMono.variable)}>
      <body>
        <ExperienceShell>{children}</ExperienceShell>
      </body>
    </html>
  );
}
