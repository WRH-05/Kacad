import Link from 'next/link';
import type { Route } from 'next';
import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n';

type HeroSectionProps = {
  locale: Locale;
  hero: Dictionary['hero'];
};

export function HeroSection({ locale, hero }: HeroSectionProps) {
  return (
    <section className="section-anchor relative overflow-hidden bg-hero-gradient py-20 lg:py-28">
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-60" aria-hidden="true" />
      <div className="section-shell relative grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-terracotta">
            {hero.eyebrow}
          </p>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight text-ink md:text-5xl lg:text-6xl">
            {hero.title}
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">{hero.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={`/${locale}#courses` as Route}
              className="rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white shadow-soft transition hover:-translate-y-0.5 hover:shadow-glow"
            >
              {hero.ctaPrimary}
            </Link>
            <Link
              href={`/${locale}/become-a-tutor` as Route}
              className="rounded-full border border-navy/15 bg-white/80 px-6 py-3 text-sm font-semibold text-navy transition hover:-translate-y-0.5 hover:bg-white"
            >
              {hero.ctaSecondary}
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 lg:col-span-5 lg:grid-cols-1">
          {[
            { value: hero.statCourses, label: hero.statCoursesLabel },
            { value: hero.statAges, label: hero.statAgesLabel },
            { value: hero.statLanguages, label: hero.statLanguagesLabel }
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-navy/8 bg-white/70 p-5 shadow-card backdrop-blur transition hover:-translate-y-0.5"
            >
              <p className="font-display text-3xl font-semibold text-navy">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
