import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { Analytics } from '@vercel/analytics/next';
import '../../styles/globals.css';
import { FloatingWhatsApp } from '../../components/floating-whatsapp';
import { SiteNavbar } from '../../components/site-navbar';
import { SiteFooter } from '../../components/site-footer';
import { getCourses } from '@/lib/courses-data';
import { dmSans, fraunces, plexMono } from '@/lib/fonts';
import { getDictionary } from '../../lib/dictionaries';
import { type Locale, isLocale, locales } from '../../lib/i18n';

export const revalidate = 60;

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
  const courseViews = await getCourses(locale as Locale);
  const programmes = courseViews.map((course) => ({
    id: course.id,
    track: course.track,
    title: course.copy.title,
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
        <FloatingWhatsApp
          programmes={programmes}
          prefillTemplate={dictionary.courses.detail.whatsappPrefill}
          label={dictionary.courses.detail.floatingWhatsapp}
          ariaLabel={dictionary.courses.detail.floatingWhatsappAria}
        />
        <Analytics />
      </body>
    </html>
  );
}
