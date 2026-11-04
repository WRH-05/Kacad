import 'server-only';
import { unstable_cache } from 'next/cache';
import { cache } from 'react';
import { normalizeCourse } from '@/lib/courses/normalize';
import type { CourseRow, CourseView } from '@/lib/courses/types';
import type { Locale } from '@/lib/i18n';
import { createPublicClient } from '@/lib/supabase/public';

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

/** Supabase is the single source of truth: no static fallback merge. */
export const getCourses = cache(async (locale: Locale): Promise<CourseView[]> => {
  const rows = await getCourseRows();

  return rows
    .map((row) => normalizeCourse(row, locale))
    .filter((course): course is CourseView => course !== null);
});

export const getCourseView = cache(
  async (locale: Locale, slug: string): Promise<CourseView | null> => {
    const allCourses = await getCourses(locale);

    return allCourses.find((course) => course.id === slug) ?? null;
  }
);
