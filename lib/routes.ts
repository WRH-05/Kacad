import type { Route } from 'next';
import type { Locale } from './i18n';

export type SectionId = 'courses' | 'hub' | 'method' | 'voices';

export const routes = {
  home: (locale: Locale) => `/${locale}` as Route,
  contact: (locale: Locale) => `/${locale}/contact` as Route,
  course: (locale: Locale, slug: string) => `/${locale}/courses/${slug}` as Route,
  section: (locale: Locale, id: SectionId) => `/${locale}#${id}` as Route
};
