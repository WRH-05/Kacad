import Link from 'next/link';
import { whatsappHref } from '@/content/contact';
import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n';
import { routes } from '@/lib/routes';

type ContactCtaProps = {
  contact: Dictionary['contact'];
  locale: Locale;
};

export function ContactCta({ contact, locale }: ContactCtaProps) {
  return (
    <section className="border-y border-line/60 bg-accent py-12 text-accent-ink">
      <div className="section-shell flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.28em] text-accent-ink/70">
            {contact.eyebrow}
          </p>
          <h2 className="mt-3 font-serif text-3xl leading-tight md:text-4xl">
            {contact.title}
          </h2>
          <p className="mt-3 text-sm text-accent-ink/70">{contact.hoursCta}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href={routes.contact(locale)}
            className="inline-flex items-center gap-3 bg-accent-ink px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-accent transition hover:bg-accent-ink/90"
          >
            {contact.visitCta}
            <span aria-hidden="true">→</span>
          </Link>
          <a
            href={whatsappHref(contact.whatsappPrefill)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-3 border border-accent-ink/40 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-accent-ink transition hover:border-accent-ink"
          >
            {contact.whatsappLabel}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </section>
  );
}
