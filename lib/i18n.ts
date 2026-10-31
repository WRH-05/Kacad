import type { Route } from 'next';

export const locales = ['en', 'fr'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/**
 * Swap the locale segment of a pathname, preserving the rest of the path.
 * Hash and query strings are not part of `usePathname()`, so section anchors
 * are intentionally dropped when switching locales.
 */
export function buildLocaleHref(pathname: string, targetLocale: Locale): Route {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && isLocale(segments[0])) {
    segments[0] = targetLocale;
  } else {
    segments.unshift(targetLocale);
  }
  return `/${segments.join('/')}` as Route;
}
