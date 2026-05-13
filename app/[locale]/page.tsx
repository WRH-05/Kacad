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
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
      <section className="space-y-6">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-navy">
          {dictionary.hero.eyebrow}
        </p>
        <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-ink md:text-6xl">
          {dictionary.hero.title}
        </h1>
        <p className="max-w-2xl text-lg leading-8 text-slate-700">{dictionary.hero.subtitle}</p>
        <div className="flex flex-wrap gap-3">
          <span className="rounded-full bg-navy px-5 py-3 text-sm font-medium text-white shadow-glow">
            {dictionary.hero.ctaPrimary}
          </span>
          <span className="rounded-full border border-navy/15 bg-white px-5 py-3 text-sm font-medium text-navy">
            {dictionary.hero.ctaSecondary}
          </span>
        </div>
        <div className="rounded-3xl border border-navy/10 bg-white/80 p-6 shadow-glow backdrop-blur">
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-gold">
            {dictionary.trainings.title}
          </p>
          <p className="mt-2 text-base text-slate-700">{dictionary.trainings.intro}</p>
          <p className="mt-4 text-sm text-slate-500">Scaffold active. Detailed section components will be added next.</p>
        </div>
      </section>
    </main>
  );
}