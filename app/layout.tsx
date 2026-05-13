import type { ReactNode } from 'react';
import { headers } from 'next/headers';
import '../styles/globals.css';
import { defaultLocale, isRtlLocale } from '../lib/i18n';

export const metadata = {
  title: 'Kennedy School',
  description: 'Kennedy School | El Biar Tech & Language Academy'
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  const requestHeaders = await headers();
  const locale = requestHeaders.get('x-locale') ?? defaultLocale;

  return (
    <html lang={locale} dir={isRtlLocale(locale) ? 'rtl' : 'ltr'}>
      <body>{children}</body>
    </html>
  );
}