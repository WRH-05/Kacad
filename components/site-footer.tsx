import Link from 'next/link';
import type { Route } from 'next';
import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n';

type SiteFooterProps = {
  locale: Locale;
  nav: Dictionary['nav'];
  footer: Dictionary['footer'];
};

const socialLinks = [
  {
    key: 'instagram' as const,
    href: 'https://www.instagram.com/_kennedy_school/',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    )
  },
  {
    key: 'facebook' as const,
    href: 'https://www.facebook.com/profile.php?id=61579050274266',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    )
  },
  {
    key: 'location' as const,
    href: 'https://maps.app.goo.gl/G7XiafZ4RPGWvTHH8',
    icon: (
      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s7-4.5 7-10a7 7 0 1 0-14 0c0 5.5 7 10 7 10z" />
        <circle cx="12" cy="11" r="2.5" />
      </svg>
    )
  }
];

export function SiteFooter({ locale, nav, footer }: SiteFooterProps) {
  const year = new Date().getFullYear();

  const navLinks: { href: Route; label: string }[] = [
    { href: `/${locale}` as Route, label: nav.home },
    { href: `/${locale}#courses` as Route, label: nav.courses },
    { href: `/${locale}#testimonials` as Route, label: nav.testimonials },
    { href: `/${locale}#why-us` as Route, label: nav.whyUs },
    { href: `/${locale}/become-a-tutor` as Route, label: nav.tutor }
  ];

  const linkClassName = 'text-sm text-white/75 transition hover:text-gold';

  return (
    <footer className="border-t border-navy/8 bg-navy text-white">
      <div className="section-shell py-14 lg:py-16">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 lg:gap-12">
          <div>
            <p className="font-display text-xl font-semibold">Kennedy School</p>
            <p className="mt-2 text-sm text-white/70">{footer.tagline}</p>
            <p className="mt-4 text-sm leading-relaxed text-white/85">
              {footer.love}{' '}
              <span className="text-gold" aria-hidden="true">
                ♥
              </span>
            </p>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              {footer.navigation}
            </h2>
            <nav className="mt-4" aria-label="Footer navigation">
              <ul className="flex flex-col gap-2">
                {navLinks.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className={linkClassName}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
              {footer.connect}
            </h2>
            <ul className="mt-4 flex flex-col gap-3">
              {socialLinks.map((item) => (
                <li key={item.key}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 text-sm text-white/85 transition hover:text-gold"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-white/5">
                      {item.icon}
                    </span>
                    {footer.social[item.key]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-white/10 pt-6 text-center text-xs text-white/50">
          {footer.copyright.replace('{year}', String(year))}
        </div>
      </div>
    </footer>
  );
}
