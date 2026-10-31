import { notFound } from 'next/navigation';
import { CampusHub } from '@/components/sections/campus-hub';
import { ContactCta } from '@/components/sections/contact-cta';
import { CourseMatrix } from '@/components/sections/course-matrix';
import { Hero } from '@/components/sections/hero';
import { KennedyMethod } from '@/components/sections/kennedy-method';
import { TestimonialMarquee } from '@/components/sections/testimonial-marquee';
import { contactInfo, timeZone } from '@/content/contact';
import { hubSpaces } from '@/content/hub';
import { getDictionary } from '@/lib/dictionaries';
import { getOpenState } from '@/lib/hours';
import { isLocale, type Locale } from '@/lib/i18n';

export const revalidate = 60;

export default async function LocaleHomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale as Locale);
  const initialStatus = getOpenState(new Date(), contactInfo.hours, timeZone);

  return (
    <main>
      <Hero
        locale={locale as Locale}
        hero={dictionary.hero}
        statusLabels={dictionary.hub.status}
        initialStatus={initialStatus}
      />
      <CampusHub hub={dictionary.hub} spaces={hubSpaces} />
      <CourseMatrix
        coursesDict={dictionary.courses}
        waitlist={dictionary.waitlist}
        locale={locale as Locale}
      />
      <KennedyMethod method={dictionary.method} />
      <TestimonialMarquee testimonialsDict={dictionary.testimonials} />
      <ContactCta contact={dictionary.contact} locale={locale as Locale} />
    </main>
  );
}
