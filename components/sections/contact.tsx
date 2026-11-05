import Image from 'next/image';
import { InquiryForm } from '@/components/forms/inquiry-form';
import { SocialIcon } from '@/components/ui/social-icons';
import { contactInfo, whatsappHref } from '@/content/contact';
import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n';
import { ContactFaq } from './contact-faq';

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
      <div className="section-shell grid gap-12 lg:grid-cols-12 lg:items-start lg:gap-8">
        <div className="lg:col-span-5">
          <p className="font-mono text-xs uppercase tracking-wider text-ink-muted">
            {contact.eyebrow}
          </p>
          <h1 className="mt-4 font-serif text-4xl font-normal tracking-tight text-ink lg:text-5xl">
            {contact.title}
          </h1>
          <p className="mt-5 max-w-md leading-relaxed text-ink-muted">{contact.intro}</p>

          <dl className="mt-8 grid gap-x-8 gap-y-6 border-t border-line/40 pt-6 sm:grid-cols-2">
            <div>
              <dt className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                {contact.addressLabel}
              </dt>
              <dd className="mt-2">
                <a
                  href={contactInfo.address.mapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-xs uppercase tracking-wider text-ink underline-offset-4 transition hover:text-accent hover:underline"
                >
                  {contactInfo.address.line1}, {contactInfo.address.city} /{' '}
                  {contactInfo.address.country}
                </a>
                <p className="mt-2 text-xs leading-relaxed text-ink-muted">
                  {contact.location.body}
                </p>
              </dd>
            </div>

            <div>
              <dt className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                {contact.hoursTitle}
              </dt>
              <dd className="mt-2 font-mono text-xs uppercase tracking-wider tabular-nums text-ink">
                {contact.hoursWeekdays} · {contact.hoursTime}
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                {contact.directLines}
              </dt>
              <dd className="mt-2">
                <div className="flex items-baseline justify-between gap-4 border-y border-line/40 py-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                    {contact.whatsappLabel}
                  </span>
                  <a
                    href={whatsappHref(contact.whatsappPrefill)}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-xs tabular-nums text-ink transition hover:text-accent"
                  >
                    {contactInfo.phone.display}
                  </a>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-line/40 py-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                    {contact.phoneLabel}
                  </span>
                  <a
                    href={`tel:${contactInfo.phone.tel}`}
                    className="font-mono text-xs tabular-nums text-ink transition hover:text-accent"
                  >
                    {contactInfo.phone.display}
                  </a>
                </div>
                <div className="flex items-baseline justify-between gap-4 border-b border-line/40 py-3">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-ink-muted">
                    {contact.emailLabel}
                  </span>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="font-mono text-xs text-ink transition hover:text-accent"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              </dd>
            </div>

            <div className="sm:col-span-2">
              <dt className="font-mono text-xs uppercase tracking-wider text-ink-muted">
                {contact.socialsTitle}
              </dt>
              <dd className="mt-3 flex flex-wrap items-center gap-4">
                {contactInfo.socials.map((social) => (
                  <a
                    key={social.id}
                    href={social.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={socialLabel(social.id, socialLabels)}
                    className="text-ink-muted transition hover:text-accent"
                  >
                    <SocialIcon id={social.id} />
                  </a>
                ))}
              </dd>
            </div>
          </dl>

          <div className="mt-8 aspect-[16/10] w-full overflow-hidden border border-line/40 bg-surface-raised relative">
            <Image
              src="/images/hub/cafe-coworking.webp"
              alt="Kennedy Academy Atelier El Biar"
              fill
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover grayscale contrast-125 hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <div className="border border-line/40 bg-surface-raised p-6 sm:p-8">
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
        <div className="mt-24 grid grid-cols-1 gap-8 border-t border-line/40 pt-16 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-4">
            <p className="font-mono text-xs uppercase tracking-wider text-ink-muted">
              {contact.faq.eyebrow}
            </p>
            <h2 className="mt-3 font-serif text-3xl font-normal text-ink">{contact.faq.title}</h2>
            <p className="mt-4 text-sm leading-relaxed text-ink-muted">{contact.faq.lede}</p>
          </div>
          <div className="lg:col-span-8">
            <ContactFaq items={contact.faq.items} />
          </div>
        </div>
      </div>
    </section>
  );
}
