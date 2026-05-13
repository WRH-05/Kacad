import type { Locale } from './i18n';

export type Dictionary = typeof import('../messages/en.json');

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  switch (locale) {
    case 'fr':
      return import('../messages/fr.json').then((module) => module.default);
    case 'ar':
      return import('../messages/ar.json').then((module) => module.default);
    default:
      return import('../messages/en.json').then((module) => module.default);
  }
}