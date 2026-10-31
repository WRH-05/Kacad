import Link from 'next/link';
import { AsteriskLogo } from '@/components/brand/asterisk-logo';
import { SpaceStatusBadge } from '@/components/ui/space-status-badge';
import type { Dictionary } from '@/lib/dictionaries';
import type { OpenState } from '@/lib/hours';
import { routes } from '@/lib/routes';
import type { Locale } from '@/lib/i18n';

type HeroProps = {
  locale: Locale;
  hero: Dictionary['hero'];
  statusLabels: Dictionary['hub']['status'];
  initialStatus: OpenState;
};

export function Hero({ locale, hero, statusLabels, initialStatus }: HeroProps) {
  const stats = [hero.stats.courses, hero.stats.ages, hero.stats.languages];

  return (
    <section className="relative overflow-hidden bg-hero-wash">
      <div className="section-shell grid gap-16 py-20 lg:grid-cols-12 lg:gap-8 lg:py-28">
        <div className="lg:col-span-7">
          <div className="flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            <span className="h-px w-10 bg-accent/40" aria-hidden="true" />
            {hero.eyebrow}
          </div>

          <h1 className="mt-8 font-serif text-5xl font-light leading-[0.95] tracking-[-0.02em] text-ink sm:text-6xl lg:text-7xl">
            {hero.titleLead}
            <br />
            <em className="font-normal italic text-accent">{hero.titleEmphasis}</em>
          </h1>

          <p className="mt-8 max-w-xl text-lg leading-relaxed text-ink-muted">
            {hero.subtitle}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href={routes.section(locale, 'courses')}
              className="inline-flex items-center gap-3 bg-accent px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.2em] text-accent-ink transition hover:bg-accent/90"
            >
              {hero.ctaPrimary}
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href={routes.section(locale, 'hub')}
              className="inline-flex items-center gap-3 border border-line/80 px-6 py-3.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink transition hover:border-accent hover:text-accent"
            >
              {hero.ctaSecondary}
            </Link>
          </div>

          <dl className="mt-14 grid grid-cols-3 border-y border-line/70">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className={
                  index === 0
                    ? 'py-6'
                    : 'border-l border-line/70 py-6 pl-5 sm:pl-6'
                }
              >
                <dd className="font-serif text-3xl text-ink">{stat.value}</dd>
                <dt className="mt-2 font-mono text-[9px] uppercase leading-relaxed tracking-[0.2em] text-ink-muted">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="lg:col-span-5">
          <div className="relative flex h-full min-h-[24rem] flex-col justify-between border border-line/70 bg-surface-raised/70 p-8 shadow-soft">
            <div className="flex items-start justify-between gap-4">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-ink-muted">
                KA / EL BIAR
              </span>
              <SpaceStatusBadge labels={statusLabels} initial={initialStatus} />
            </div>

            <div className="flex flex-1 items-center justify-center py-10">
              <AsteriskLogo
                className="h-48 w-48 text-accent sm:h-60 sm:w-60"
                animated
              />
            </div>

            <div className="flex items-end justify-between gap-4 border-t border-line/60 pt-4">
              <p className="font-mono text-[9px] uppercase leading-relaxed tracking-[0.22em] text-ink-muted">
                Four Ks
                <br />
                one open room
              </p>
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">
                36.75° N / 3.05° E
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
