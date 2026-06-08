import Link from 'next/link';
import type { Route } from 'next';
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
    <main className="py-20 lg:py-28">
      <div className="section-shell max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-terracotta">
          Kennedy School
        </p>
        <h1 className="mt-3 font-display text-4xl font-semibold text-ink md:text-5xl">
          {dictionary.tutor.title}
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-slate-600">{dictionary.tutor.intro}</p>

        <div className="mt-10 rounded-2xl border border-navy/8 bg-white p-8 shadow-card">
          <p className="text-sm text-slate-600">
            {locale === 'fr'
              ? 'Les candidatures seront ouvertes prochainement. Contactez-nous pour exprimer votre intérêt.'
              : 'Applications will open soon. Contact us to express your interest.'}
          </p>
          <Link
            href={`/${locale}#courses` as Route}
            className="mt-6 inline-flex rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-navy transition hover:bg-gold/90"
          >
            {dictionary.tutor.cta}
          </Link>
        </div>
      </div>
    </main>
  );
}
