import Link from 'next/link';
import { AsteriskLogo } from '@/components/brand/asterisk-logo';
import { DitherBackground } from '@/components/ui/dither-background';
import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n';
import { routes } from '@/lib/routes';

type HeroProps = {
  locale: Locale;
  hero: Dictionary['hero'];
};

export function Hero({ locale, hero }: HeroProps) {
  return (
    <section className="relative isolate min-h-[85vh] overflow-hidden bg-white">
      <DitherBackground />

      {/* Readability scrim: stronger vertical layer on mobile, horizontal on desktop. */}
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-b from-surface/95 via-surface/90 to-surface/85 lg:bg-gradient-to-r lg:from-surface/95 lg:via-surface/75 lg:to-transparent"
        aria-hidden="true"
      />

      <div className="section-shell relative z-10 grid min-h-[85vh] items-center gap-16 py-20 lg:grid-cols-12 lg:gap-8 lg:py-28">
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
        </div>

        <div className="relative flex items-center justify-center lg:col-span-5 lg:justify-end">
          <div
            className="pointer-events-none absolute h-64 w-64 rounded-full bg-surface/70 blur-3xl"
            aria-hidden="true"
          />
          <AsteriskLogo
            dock
            animated
            decorative
            className="relative h-52 w-52 text-accent drop-shadow-logo sm:h-64 sm:w-64 lg:h-[22rem] lg:w-[22rem]"
          />
        </div>
      </div>
    </section>
  );
}
