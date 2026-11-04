import { InquiryForm } from '@/components/forms/inquiry-form';
import { SocialIcon } from '@/components/ui/social-icons';
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon';
import { contactInfo, whatsappHref } from '@/content/contact';
import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n';

type ContactProps = {
  contact: Dictionary['contact'];
  socialLabels: Dictionary['footer']['social'];
  locale: Locale;
};

function socialLabel(id: 'instagram' | 'facebook' | 'maps', labels: ContactProps['socialLabels']) {
  if (id === 'instagram') return labels.instagram;
  if (id === 'facebook') return labels.facebook;
  return labels.location;
}

export function Contact({ contact, socialLabels, locale }: ContactProps) {
  return (
    <section id="contact" className="section-anchor py-20 lg:py-28">
      <div className="section-shell grid gap-12 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
            {contact.eyebrow}
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-5xl">
            {contact.title}
          </h1>
          <p className="mt-5 max-w-md leading-relaxed text-ink-muted">{contact.intro}</p>

          <a
            href={whatsappHref(contact.whatsappPrefill)}
            target="_blank"
            rel="noreferrer"
            className="group mt-8 block border border-ink bg-ink p-5 text-surface transition hover:bg-ink/95"
          >
            <span className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.22em] text-highlight">
              <WhatsAppIcon className="h-4 w-4 text-[#25D366]" />
              {contact.liveDesk.eyebrow}
            </span>
            <span className="mt-3 block text-sm leading-relaxed text-surface/85">
              {contact.liveDesk.response}
            </span>
            <span className="mt-4 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-surface">
              {contact.liveDesk.cta}
              <span aria-hidden="true" className="transition group-hover:translate-x-0.5">
                ↗
              </span>
            </span>
          </a>

          <dl className="mt-10 border-t border-line/70">
            <div className="border-b border-line/70 py-5">
              <dt className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-muted">
                {contact.addressLabel}
              </dt>
              <dd className="mt-2">
                <a
                  href={contactInfo.address.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-baseline gap-2 font-serif text-xl text-ink transition hover:text-accent"
                >
                  <span>
                    {contactInfo.address.line1}
                    <br />
                    {contactInfo.address.city}, {contactInfo.address.country}
                  </span>
                  <span
                    aria-hidden="true"
                    className="font-mono text-xs text-accent transition group-hover:translate-x-0.5"
                  >
                    ↗
                  </span>
                </a>
                <span className="mt-2 block font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted">
                  {contact.mapsCta}
                </span>
              </dd>
            </div>

            <div className="border-b border-line/70 py-5">
              <dt className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-muted">
                {contact.emailLabel}
              </dt>
              <dd className="mt-2">
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="text-sm text-ink transition hover:text-accent"
                >
                  {contactInfo.email}
                </a>
              </dd>
            </div>

            <div className="border-b border-line/70 py-5">
              <dt className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-muted">
                {contact.phoneLabel}
              </dt>
              <dd className="mt-2">
                <a
                  href={`tel:${contactInfo.phone.tel}`}
                  className="text-sm text-ink transition hover:text-accent"
                >
                  {contactInfo.phone.display}
                </a>
              </dd>
            </div>

            <div className="border-b border-line/70 py-5">
              <dt className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-muted">
                {contact.whatsappLabel}
              </dt>
              <dd className="mt-2">
                <a
                  href={whatsappHref(contact.whatsappPrefill)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-accent transition hover:text-accent/80"
                >
                  {contact.whatsappCta}
                  <span aria-hidden="true">↗</span>
                </a>
              </dd>
            </div>

            <div className="border-b border-line/70 py-5">
              <dt className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-muted">
                {contact.hoursTitle}
              </dt>
              <dd className="mt-3 space-y-2 text-sm text-ink">
                <div className="flex items-baseline justify-between gap-4">
                  <span>{contact.hoursWeekdays}</span>
                  <span className="font-mono text-xs text-ink-muted">
                    {contact.hoursTime}
                  </span>
                </div>
                <p className="pt-1 text-xs text-ink-muted">{contact.hoursNote}</p>
              </dd>
            </div>
          </dl>

          <div className="mt-8 border-t border-line/70 pt-6">
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-muted">
              {contact.location.title}
            </p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-ink">
              {contact.location.body}
            </p>
            <a
              href={contactInfo.address.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-3 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-accent transition hover:text-accent/80"
            >
              {contact.location.mapsCta}
              <span aria-hidden="true">↗</span>
            </a>
          </div>

          <div className="mt-8">
            <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-muted">
              {contact.socialsTitle}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {contactInfo.socials.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={socialLabel(social.id, socialLabels)}
                  className="flex h-10 w-10 items-center justify-center border border-line/70 text-ink-muted transition hover:border-accent hover:text-accent"
                >
                  <SocialIcon id={social.id} />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <div className="border border-line/70 bg-surface-raised p-6 shadow-soft sm:p-8">
            <h2 className="font-serif text-3xl text-ink">{contact.form.title}</h2>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-ink-muted">
              {contact.form.intro}
            </p>
            <div className="mt-6">
              <InquiryForm labels={contact.form} locale={locale} />
            </div>
          </div>
        </div>
      </div>

      <div className="section-shell">
        <div className="mt-16 rounded-none border-t border-line/40 pt-12">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">
            {contact.faq.eyebrow}
          </p>
          <h2 className="mt-3 font-serif text-3xl text-ink md:text-4xl">{contact.faq.title}</h2>

          <div className="mt-8 divide-y divide-line/40">
            {contact.faq.items.map((item) => (
              <details key={item.question} className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 font-serif text-xl leading-snug text-ink transition hover:text-accent [&::-webkit-details-marker]:hidden">
                  <span>{item.question}</span>
                  <span
                    aria-hidden="true"
                    className="font-mono text-lg transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="max-w-3xl pb-6 pr-8 text-sm leading-relaxed text-ink-muted">
                  {item.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
