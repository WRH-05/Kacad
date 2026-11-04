import 'server-only';
import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { courseIds, courses as staticCourses } from '@/content/courses';
import { normalizeDynamicCourse, normalizeStaticCourse } from '@/lib/courses/normalize';
import type { CourseRow, CourseView } from '@/lib/courses/types';
import { getDictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n';
import { createPublicClient } from '@/lib/supabase/public';

const staticById = new Map(staticCourses.map((course) => [course.id, course]));
const staticIds = new Set<string>(courseIds);

async function fetchCourseRows(): Promise<CourseRow[]> {
  const client = createPublicClient();

  if (!client) {
    return [];
  }

  try {
    const { data, error } = await client
      .from('courses')
      .select('*')
      .order('id')
      .abortSignal(AbortSignal.timeout(4000));

    if (error) {
      console.error('[courses] Supabase read failed:', error.message);
      return [];
    }

    return (data ?? []) as unknown as CourseRow[];
  } catch (error) {
    console.error('[courses] Supabase read threw:', error);
    return [];
  }
}

const getCourseRows = unstable_cache(fetchCourseRows, ['courses'], {
  tags: ['courses'],
  revalidate: 60
});

export const getCourses = cache(async (locale: Locale): Promise<CourseView[]> => {
  const [rows, dictionary] = await Promise.all([getCourseRows(), getDictionary(locale)]);
  const byId = new Map(rows.map((row) => [row.id, row]));

  const curated = courseIds.map((id) => {
    const base = staticById.get(id);

    if (!base) {
      throw new Error(`Missing static definition for course "${id}"`);
    }

    return normalizeStaticCourse(base, byId.get(id), dictionary, locale);
  });

  const dynamic = rows
    .filter((row) => !staticIds.has(row.id))
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((row) => normalizeDynamicCourse(row, locale))
    .filter((course): course is CourseView => course !== null);

  return [...curated, ...dynamic];
});

export const getCourseView = cache(
  async (locale: Locale, slug: string): Promise<CourseView | null> => {
    const allCourses = await getCourses(locale);

    return allCourses.find((course) => course.id === slug) ?? null;
  }
);
