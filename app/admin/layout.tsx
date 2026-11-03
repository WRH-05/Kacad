import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import '../../styles/globals.css';
import { dmSans, fraunces, plexMono } from '@/lib/fonts';

export const metadata: Metadata = {
  title: {
    default: 'Admin — Kennedy Academy',
    template: '%s · Kennedy Academy Admin'
  },
  robots: { index: false, follow: false }
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" dir="ltr" data-era="porcelain">
      <body
        className={`${dmSans.variable} ${fraunces.variable} ${plexMono.variable} bg-surface font-sans text-ink antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
