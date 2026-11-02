import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { DM_Sans, Fraunces, IBM_Plex_Mono } from 'next/font/google';
import '../../styles/globals.css';
import { SiteNavbar } from '../../components/site-navbar';
import { SiteFooter } from '../../components/site-footer';
import { courses } from '@/content/courses';
import { getDictionary } from '../../lib/dictionaries';
import { type Locale, isLocale, locales } from '../../lib/i18n';

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap'
});

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  style: ['normal', 'italic'],
  display: 'swap'
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-ibm-plex-mono',
  display: 'swap'
});

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const isFrench = locale === 'fr';

  return {
    title: {
      default: isFrench
        ? 'Kennedy Academy — El Biar, Alger'
        : 'Kennedy Academy — El Biar, Algiers',
      template: '%s · Kennedy Academy'
    },
    description: isFrench
      ? "Une académie de technologie, d'arts numériques et de langues à El Biar, Alger — et un hub créatif ouvert aux jeunes créateurs."
      : 'A technology, digital arts and languages academy in El Biar, Algiers — and an open creative hub for young makers.',
    icons: { icon: '/favicon.ico' }
  };
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
  const programmes = courses.map((course) => ({
    id: course.id,
    track: course.track,
    title: dictionary.courses.items[course.id].title,
    ageLabel: dictionary.courses.ageRanges[course.ageBracket]
  }));

  return (
    <html lang={locale} dir="ltr" data-era="porcelain">
      <body
        className={`${dmSans.variable} ${fraunces.variable} ${plexMono.variable} bg-surface font-sans text-ink antialiased`}
      >
        <SiteNavbar locale={locale as Locale} nav={dictionary.nav} programmes={programmes} />
        {children}
        <SiteFooter locale={locale as Locale} nav={dictionary.nav} footer={dictionary.footer} />
      </body>
    </html>
  );
}
