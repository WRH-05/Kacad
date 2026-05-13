import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { getDictionary } from '../../lib/dictionaries';
import { type Locale, isLocale, locales } from '../../lib/i18n';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  await getDictionary(locale as Locale);

  return <>{children}</>;
}