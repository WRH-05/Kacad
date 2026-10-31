'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { AsteriskLogo } from '@/components/brand/asterisk-logo';
import type { Dictionary } from '@/lib/dictionaries';
import { buildLocaleHref, type Locale, locales } from '@/lib/i18n';
import { routes } from '@/lib/routes';
import { cn } from '@/lib/utils';

type SiteNavbarProps = {
  locale: Locale;
  nav: Dictionary['nav'];
};

const localeLabels: Record<Locale, string> = {
  en: 'EN',
  fr: 'FR'
};

export function SiteNavbar({ locale, nav }: SiteNavbarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const links = [
    { href: routes.home(locale), label: nav.home },
    { href: routes.section(locale, 'courses'), label: nav.courses },
    { href: routes.section(locale, 'hub'), label: nav.hub },
    { href: routes.section(locale, 'method'), label: nav.method },
    { href: routes.contact(locale), label: nav.contact }
  ];

  const contactPath = routes.contact(locale);

  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-surface/90 backdrop-blur-md">
      <div className="section-shell flex items-center justify-between gap-4 py-4">
        <Link href={routes.home(locale)} className="group flex items-center gap-3">
          <AsteriskLogo decorative animated className="h-8 w-8 shrink-0" />
          <span className="flex flex-col">
            <span className="font-serif text-lg leading-none text-ink">
              Kennedy Academy
            </span>
            <span className="mt-1 font-mono text-[8px] uppercase tracking-[0.24em] text-ink-muted">
              El Biar · Algiers
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex" aria-label={nav.aria.main}>
          {links.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              aria-current={link.href === contactPath && pathname === contactPath ? 'page' : undefined}
              className={cn(
                'font-mono text-[9px] uppercase tracking-[0.18em] transition',
                link.href === contactPath && pathname === contactPath
                  ? 'text-accent'
                  : 'text-ink-muted hover:text-accent'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div
            className="flex items-center gap-1 rounded-none border border-line/70 p-1"
            aria-label={nav.aria.switchLanguage}
          >
            {locales.map((loc) => (
              <Link
                key={loc}
                href={buildLocaleHref(pathname, loc)}
                aria-current={loc === locale ? 'page' : undefined}
                className={cn(
                  'rounded-none px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] transition',
                  loc === locale
                    ? 'bg-accent text-accent-ink'
                    : 'text-ink-muted hover:text-accent'
                )}
              >
                {localeLabels[loc]}
              </Link>
            ))}
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-none border border-line/70 p-2 text-ink lg:hidden"
            aria-label={mobileOpen ? nav.aria.closeMenu : nav.aria.openMenu}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            <svg
              className="h-4 w-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
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
          className="border-t border-line/60 bg-surface px-6 py-4 lg:hidden"
          aria-label={nav.aria.mobile}
        >
          <ul className="flex flex-col">
            {links.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="block border-b border-line/50 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted transition hover:text-accent"
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
