import { CoursesSection } from '../../components/sections/courses-section';
import { HeroSection } from '../../components/sections/hero-section';
import { TestimonialsSection } from '../../components/sections/testimonials-section';
import { WhyUsSection } from '../../components/sections/why-us-section';
import { getDictionary } from '../../lib/dictionaries';
import { isLocale, type Locale } from '../../lib/i18n';

export default async function LocaleHomePage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    return null;
  }

  const dictionary = await getDictionary(locale as Locale);

  return (
    <main>
      <HeroSection locale={locale as Locale} hero={dictionary.hero} />
      <CoursesSection
        locale={locale as Locale}
        coursesDict={dictionary.courses}
        registration={dictionary.registration}
      />
      <TestimonialsSection testimonialsDict={dictionary.testimonials} />
      <WhyUsSection whyUs={dictionary.whyUs} />
    </main>
  );
}
