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
  'languages',
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
    id: 'languages',
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

export function matchesAgeFilter(course: Course, filter: AgeFilter): boolean {
  return filter === 'any' || course.ageBracket === filter || course.ageBracket === 'all';
}
