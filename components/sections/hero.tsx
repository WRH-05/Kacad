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
    <section className="relative isolate min-h-[85vh] overflow-hidden border-b border-line/40 bg-white">
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

          <h1 className="mt-8 font-serif text-5xl font-light leading-[0.95] tracking-[-0.035em] text-ink sm:text-6xl lg:text-[5rem] xl:text-[5.5rem]">
            {hero.titleLead}
            <br />
            <em className="font-normal italic text-accent">{hero.titleEmphasis}</em>
          </h1>

          <p className="mt-10 max-w-xl text-lg leading-relaxed text-ink-muted">
            {hero.subtitle}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href={routes.section(locale, 'courses')}
              className="inline-flex items-center gap-3 rounded-none border border-accent bg-accent px-7 py-3.5 font-mono text-[10px] uppercase tracking-[0.2em] text-accent-ink transition-colors hover:bg-transparent hover:text-accent"
            >
              {hero.ctaPrimary}
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href={routes.section(locale, 'hub')}
              className="inline-flex items-center gap-3 rounded-none border border-line bg-surface/80 px-7 py-3.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ink transition-colors hover:border-ink hover:bg-ink hover:text-surface"
            >
              {hero.ctaSecondary}
            </Link>
          </div>
        </div>

        <div className="relative flex flex-col items-center lg:col-span-5 lg:ml-auto">
          <div className="relative flex items-center justify-center">
            <div
              className="pointer-events-none absolute left-1/2 top-1/2 h-60 w-60 -translate-x-1/2 -translate-y-1/2 border border-line/40 sm:h-72 sm:w-72 lg:h-[25rem] lg:w-[25rem]"
              aria-hidden="true"
            />
            <AsteriskLogo
              dock
              animated
              decorative
              className="relative h-52 w-52 drop-shadow-logo sm:h-64 sm:w-64 lg:h-[22rem] lg:w-[22rem]"
            />
          </div>

          <div className="mt-8 flex items-center justify-center gap-2 text-[11px] font-mono uppercase tracking-[0.2em] text-ink-muted">
            <span>{hero.atelier}</span>
            <span>/</span>
            <span>{hero.city}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
