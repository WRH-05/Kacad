import type { Course, CourseId } from '@/content/courses';
import type { Dictionary } from '@/lib/dictionaries';

export type Localized = { en: string; fr: string };
export type LocalizedList = { en: string[]; fr: string[] };

export type CourseModule = {
  title: string;
  description: string;
};

export type CourseMentorRow = {
  name: Localized;
  role: Localized;
  bio: Localized;
  portrait_path: string | null;
};

export type CourseMentorView = {
  name: string;
  role: string;
  bio: string;
  portraitPath: string | null;
};

export type CourseCapstone = {
  title: string;
  description: string;
  deliverable?: string;
};

/** Shape of a `public.courses` row after JSON parsing. */
export type CourseRow = {
  id: string;
  track: string;
  age_bracket: string;
  level: string;
  duration_weeks: number;
  sessions_per_week: number;
  featured: boolean;
  seats_left: number | null;
  next_cohort: Localized | null;
  schedule: Localized | null;
  title: Localized;
  description: Localized;
  lede: Localized;
  highlights: LocalizedList;
  outcomes: LocalizedList;
  tools: LocalizedList;
  modules: { en: CourseModule[]; fr: CourseModule[] };
  capstone: { en: CourseCapstone; fr: CourseCapstone } | null;
  mentor: CourseMentorRow | null;
  brochure_url: string | null;
};

export type CourseCopy = Omit<
  Dictionary['courses']['items'][CourseId],
  'capstone'
> & {
  capstone: Dictionary['courses']['items'][CourseId]['capstone'] & {
    deliverable?: string;
  };
};

export type CourseView = Course & {
  seatsLeft: number;
  nextCohort: string;
  schedule: string;
  brochureUrl: string;
  copy: CourseCopy;
  mentor: CourseMentorView | null;
};
