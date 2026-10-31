import { notFound } from 'next/navigation';
import { Contact } from '@/components/sections/contact';
import { getDictionary } from '@/lib/dictionaries';
import { isLocale, type Locale } from '@/lib/i18n';

export const revalidate = 60;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!isLocale(locale)) return {};

  const dictionary = await getDictionary(locale as Locale);

  return {
    title: dictionary.contact.meta.title,
    description: dictionary.contact.meta.description
  };
}

export default async function ContactPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const dictionary = await getDictionary(locale as Locale);

  return (
    <main>
      <Contact
        contact={dictionary.contact}
        socialLabels={dictionary.footer.social}
        locale={locale as Locale}
      />
    </main>
  );
}
