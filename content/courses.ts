export const courseTracks = ['tech', 'arts', 'languages'] as const;
export type CourseTrack = (typeof courseTracks)[number];

export const ageBrackets = ['kids', 'juniors', 'all'] as const;
export type AgeBracket = (typeof ageBrackets)[number];

/** Filter values are intentionally distinct from course age brackets. */
export type AgeFilter = 'any' | 'kids' | 'juniors';

export const courseLevels = ['foundation', 'intermediate', 'advanced', 'all-levels'] as const;
export type CourseLevel = (typeof courseLevels)[number];

export const courseIds = [
  'robotics-kids',
  'robotics-juniors',
  'ai-fluency',
  'python-programming',
  'technical-english',
  'german-mobility',
  'audiovisual-training',
  'multimedia'
] as const;

export type CourseId = (typeof courseIds)[number];

export type Course = {
  id: CourseId;
  track: CourseTrack;
  ageBracket: AgeBracket;
  level: CourseLevel;
  durationWeeks: number;
  sessionsPerWeek: number;
  brochurePath?: string;
  featured?: boolean;
};

/** Structural course shape for DB-backed programmes with non-static ids. */
export type CourseSpec = Omit<Course, 'id'> & { id: string };

/**
 * Slug ids are created by the admin CMS, so they are validated by shape rather
 * than by membership in the static `courseIds` list.
 */
export const COURSE_SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isCourseSlug(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length >= 2 &&
    value.length <= 80 &&
    COURSE_SLUG_RE.test(value)
  );
}

export const courses: readonly Course[] = [
  {
    id: 'robotics-kids',
    track: 'tech',
    ageBracket: 'kids',
    level: 'foundation',
    durationWeeks: 8,
    sessionsPerWeek: 2,
    featured: true
  },
  {
    id: 'robotics-juniors',
    track: 'tech',
    ageBracket: 'juniors',
    level: 'intermediate',
    durationWeeks: 12,
    sessionsPerWeek: 2
  },
  {
    id: 'ai-fluency',
    track: 'tech',
    ageBracket: 'all',
    level: 'all-levels',
    durationWeeks: 8,
    sessionsPerWeek: 2,
    featured: true
  },
  {
    id: 'python-programming',
    track: 'tech',
    ageBracket: 'juniors',
    level: 'foundation',
    durationWeeks: 12,
    sessionsPerWeek: 2
  },
  {
    id: 'technical-english',
    track: 'languages',
    ageBracket: 'all',
    level: 'all-levels',
    durationWeeks: 12,
    sessionsPerWeek: 2
  },
  {
    id: 'german-mobility',
    track: 'languages',
    ageBracket: 'all',
    level: 'all-levels',
    durationWeeks: 12,
    sessionsPerWeek: 2
  },
  {
    id: 'audiovisual-training',
    track: 'arts',
    ageBracket: 'juniors',
    level: 'intermediate',
    durationWeeks: 10,
    sessionsPerWeek: 2
  },
  {
    id: 'multimedia',
    track: 'arts',
    ageBracket: 'all',
    level: 'foundation',
    durationWeeks: 8,
    sessionsPerWeek: 2,
    featured: true
  }
];

export function isCourseId(value: unknown): value is CourseId {
  return typeof value === 'string' && (courseIds as readonly string[]).includes(value);
}

export function matchesAgeFilter(
  course: Pick<CourseSpec, 'ageBracket'>,
  filter: AgeFilter
): boolean {
  return filter === 'any' || course.ageBracket === filter || course.ageBracket === 'all';
}
