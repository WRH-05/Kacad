import type { AdminCourse } from '@/lib/courses/admin';

export const courseSortKeys = ['course', 'cohort', 'seats'] as const;
export type CourseSortKey = (typeof courseSortKeys)[number];
export type SortDirection = 'asc' | 'desc';

const collator = new Intl.Collator('en', { numeric: true, sensitivity: 'base' });

/** Parses free-text cohorts such as "18 April 2026"; unparseable values return null. */
function cohortTimestamp(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;

  const parsed = Date.parse(trimmed);
  return Number.isNaN(parsed) ? null : parsed;
}

function byTitle(a: AdminCourse, b: AdminCourse): number {
  return collator.compare(a.titleEn, b.titleEn) || collator.compare(a.id, b.id);
}

export function sortCourses(
  courses: AdminCourse[],
  key: CourseSortKey | null,
  dir: SortDirection
): AdminCourse[] {
  if (!key) return courses;

  const sign = dir === 'asc' ? 1 : -1;

  return [...courses].sort((a, b) => {
    if (key === 'seats') {
      return sign * (a.seatsLeft - b.seatsLeft) || byTitle(a, b);
    }

    if (key === 'cohort') {
      const aTime = cohortTimestamp(a.nextCohortEn);
      const bTime = cohortTimestamp(b.nextCohortEn);

      if (aTime === null && bTime === null) return byTitle(a, b);
      if (aTime === null) return 1;
      if (bTime === null) return -1;

      return sign * (aTime - bTime) || byTitle(a, b);
    }

    return sign * collator.compare(a.titleEn, b.titleEn) || byTitle(a, b);
  });
}
