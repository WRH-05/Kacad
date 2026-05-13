import { getDictionary } from '../../../lib/dictionaries';
import { isLocale, type Locale } from '../../../lib/i18n';

export default async function BecomeATutorPage({
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
    <main className="mx-auto min-h-screen max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-semibold text-ink">{dictionary.tutor.title}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-700">{dictionary.tutor.intro}</p>
      <div className="mt-8 rounded-3xl border border-navy/10 bg-white p-6 shadow-glow">
        <span className="inline-flex rounded-full bg-gold px-4 py-2 text-sm font-semibold text-navy">
          {dictionary.tutor.cta}
        </span>
      </div>
    </main>
  );
}