import type { CourseId } from '@/content/courses';
import type { Locale } from './i18n';

export type Dictionary = typeof import('../messages/en.json');

type SameKeys<A extends string, B extends string> = [A] extends [B]
  ? [B] extends [A]
    ? true
    : false
  : false;

type Assert<T extends true> = T;

/** Fails type-checking if a CourseId gains or loses copy in messages/en.json. */
export type CourseCopyParity = Assert<
  SameKeys<CourseId, keyof Dictionary['courses']['items']>
>;

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  switch (locale) {
    case 'fr':
      return import('../messages/fr.json').then((module) => module.default);
    default:
      return import('../messages/en.json').then((module) => module.default);
  }
}