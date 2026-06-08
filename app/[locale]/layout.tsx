import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { SiteNavbar } from '../../components/site-navbar';
import { SiteFooter } from '../../components/site-footer';
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

  const dictionary = await getDictionary(locale as Locale);

  return (
    <>
      <SiteNavbar locale={locale as Locale} nav={dictionary.nav} />
      {children}
      <SiteFooter locale={locale as Locale} nav={dictionary.nav} footer={dictionary.footer} />
    </>
  );
}