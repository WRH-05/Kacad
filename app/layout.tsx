import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import { DM_Sans, Fraunces } from 'next/font/google';
import '../styles/globals.css';
import { defaultLocale } from '../lib/i18n';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap'
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  display: 'swap'
});

export const metadata = {
  title: 'Kennedy School',
  description: 'Kennedy School | El Biar Tech & Language Academy'
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const requestHeaders = await headers();
  const locale = requestHeaders.get('x-locale') ?? defaultLocale;

  return (
    <html lang={locale} dir="ltr">
      <body className={`${dmSans.variable} ${fraunces.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
