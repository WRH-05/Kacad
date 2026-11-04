import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
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
      ? "Un atelier d'excellence en technologie, arts numériques et langues à El Biar, Alger — pour étudiants universitaires, fondateurs, chercheurs, professionnels internationaux et Junior Fellows."
      : 'An elite technology, digital arts and languages atelier in El Biar, Algiers — for university students, founders, researchers, international professionals and Junior Fellows.',
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
        <SiteNavbar
          locale={locale as Locale}
          nav={dictionary.nav}
          programmes={programmes}
          whatsappPrefill={dictionary.contact.whatsappPrefill}
        />
        {children}
        <SiteFooter
          locale={locale as Locale}
          nav={dictionary.nav}
          footer={dictionary.footer}
          whatsappPrefill={dictionary.contact.whatsappPrefill}
        />
        <FloatingWhatsApp
          programmes={programmes}
          coursePrefill={dictionary.courses.detail.floatingPrefill}
          generalPrefill={dictionary.contact.whatsappPrefill}
          label={dictionary.courses.detail.floatingWhatsapp}
          ariaLabel={dictionary.courses.detail.floatingWhatsappAria}
        />
      </body>
    </html>
  );
}
