import Link from 'next/link';
import { SocialIcon } from '@/components/ui/social-icons';
import { contactInfo, whatsappHref } from '@/content/contact';
import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n';
import { routes } from '@/lib/routes';
import { interpolate } from '@/lib/utils';

type SiteFooterProps = {
  locale: Locale;
  nav: Dictionary['nav'];
  footer: Dictionary['footer'];
};

function socialLabel(id: 'instagram' | 'facebook' | 'maps', labels: Dictionary['footer']['social']) {
  if (id === 'instagram') return labels.instagram;
  if (id === 'facebook') return labels.facebook;
  return labels.location;
}

export function SiteFooter({ locale, nav, footer }: SiteFooterProps) {
  const year = new Date().getFullYear();

  const links = [
    { href: routes.home(locale), label: nav.home },
    { href: routes.section(locale, 'courses'), label: nav.programmes },
    { href: routes.section(locale, 'hub'), label: nav.hub },
    { href: routes.section(locale, 'method'), label: nav.method },
    { href: routes.contact(locale), label: nav.contact }
  ];

  return (
    <footer className="border-t border-line/70 bg-ink text-surface">
      <div className="section-shell grid gap-10 py-14 md:grid-cols-12 md:gap-8">
        <div className="md:col-span-5">
          <p className="font-serif text-2xl text-surface">Kennedy Academy</p>
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-surface/65">
            {footer.love}
          </p>
          <address className="mt-6 not-italic text-sm leading-relaxed text-surface/65">
            {contactInfo.address.line1}, {contactInfo.address.city}
            <br />
            {contactInfo.address.country}
          </address>
        </div>

        <div className="md:col-span-3">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-surface/45">
            {footer.navigation}
          </p>
          <ul className="mt-4 space-y-2">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="text-sm text-surface/70 transition hover:text-highlight"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-4">
          <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-surface/45">
            {footer.connect}
          </p>
          <ul className="mt-4 space-y-2">
            <li>
              <a
                href={whatsappHref()}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-surface/70 transition hover:text-highlight"
              >
                WhatsApp · {contactInfo.phone.display}
              </a>
            </li>
            <li>
              <a
                href={`mailto:${contactInfo.email}`}
                className="text-sm text-surface/70 transition hover:text-highlight"
              >
                {contactInfo.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${contactInfo.phone.tel}`}
                className="text-sm text-surface/70 transition hover:text-highlight"
              >
                {contactInfo.phone.display}
              </a>
            </li>
          </ul>

          <div className="mt-6 flex flex-wrap gap-2">
            {contactInfo.socials.map((social) => (
              <a
                key={social.id}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={socialLabel(social.id, footer.social)}
                className="flex h-9 w-9 items-center justify-center border border-surface/15 text-surface/60 transition hover:border-highlight hover:text-highlight"
              >
                <SocialIcon id={social.id} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-surface/10">
        <div className="section-shell py-5">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-surface/40">
            {interpolate(footer.copyright, { year })}
          </p>
        </div>
      </div>
    </footer>
  );
}
