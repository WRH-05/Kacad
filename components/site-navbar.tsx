'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { type Locale, locales } from '@/lib/i18n';

type NavLabels = {
  home: string;
  courses: string;
  testimonials: string;
  whyUs: string;
  tutor: string;
};

type SiteNavbarProps = {
  locale: Locale;
  nav: NavLabels;
};

const localeLabels: Record<Locale, string> = {
  en: 'EN',
  fr: 'FR'
};

function buildLocaleHref(pathname: string, targetLocale: Locale): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && locales.includes(segments[0] as Locale)) {
    segments[0] = targetLocale;
  } else {
    segments.unshift(targetLocale);
  }
  return `/${segments.join('/')}`;
}

export function SiteNavbar({ locale, nav }: SiteNavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links: { href: Route; label: string }[] = [
    { href: `/${locale}` as Route, label: nav.home },
    { href: `/${locale}#courses` as Route, label: nav.courses },
    { href: `/${locale}#testimonials` as Route, label: nav.testimonials },
    { href: `/${locale}#why-us` as Route, label: nav.whyUs },
    { href: `/${locale}/become-a-tutor` as Route, label: nav.tutor }
  ];

  const linkClassName =
    'rounded-md px-3 py-2 text-sm font-medium text-navy/80 transition-colors hover:bg-sand hover:text-navy';

  return (
    <header className="sticky top-0 z-50 border-b border-navy/8 bg-cream/90 shadow-card backdrop-blur-md">
      <div className="section-shell flex items-center justify-between gap-4 py-4">
        <Link
          href={`/${locale}` as Route}
          className="font-display text-lg font-semibold tracking-tight text-navy"
        >
          Kennedy School
        </Link>

        <nav className="hidden items-center gap-0.5 lg:flex" aria-label="Main navigation">
          {links.map((link) => (
            <Link key={link.label} href={link.href} className={linkClassName}>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 rounded-full border border-navy/8 bg-white px-1 py-1">
            {locales.map((loc) => (
              <Link
                key={loc}
                href={buildLocaleHref(pathname, loc) as Route}
                className={`rounded-full px-2.5 py-1 text-xs font-semibold transition-colors ${
                  loc === locale
                    ? 'bg-navy text-white'
                    : 'text-navy/60 hover:bg-sand hover:text-navy'
                }`}
                aria-current={loc === locale ? 'page' : undefined}
              >
                {localeLabels[loc]}
              </Link>
            ))}
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-navy/10 p-2 text-navy lg:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            <span className="sr-only">{mobileOpen ? 'Close menu' : 'Open menu'}</span>
            <svg
              className="h-5 w-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              {mobileOpen ? (
                <path strokeLinecap="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <nav
          className="border-t border-navy/8 bg-cream px-6 py-4 lg:hidden"
          aria-label="Mobile navigation"
        >
          <ul className="flex flex-col gap-1">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className={`block ${linkClassName}`}
                  onClick={() => setMobileOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
