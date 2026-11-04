import {
  ageBrackets,
  courseLevels,
  courseTracks,
  isCourseSlug,
  type AgeBracket,
  type CourseLevel,
  type CourseTrack
} from '@/content/courses';
import type { Locale } from '@/lib/i18n';
import type {
  CourseCapstone,
  CourseCopy,
  CourseMentorView,
  CourseModule,
  CourseRow,
  CourseView,
  Localized
} from './types';

export const SHARED_BROCHURE_PATH = '/brochures/kennedy-academy-syllabus.pdf';

const defaultCohort: Localized = {
  en: '18 April 2026',
  fr: '18 Avril 2026'
};

const defaultSchedule: Localized = {
  en: 'Saturday 10:00–13:00',
  fr: 'Samedi 10h00–13h00'
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function pickLocalized(value: unknown, locale: Locale): string | null {
  if (!isRecord(value)) return null;

  const candidate = value[locale];
  return typeof candidate === 'string' && candidate.trim().length > 0 ? candidate : null;
}

function pickLocalizedList(value: unknown, locale: Locale): string[] | null {
  if (!isRecord(value)) return null;

  const list = value[locale];
  if (!Array.isArray(list)) return null;

  const strings = list.filter(
    (item): item is string => typeof item === 'string' && item.trim().length > 0
  );

  return strings.length > 0 ? strings : null;
}

function pickModules(value: unknown, locale: Locale): CourseModule[] | null {
  if (!isRecord(value)) return null;

  const list = value[locale];
  if (!Array.isArray(list)) return null;

  const modules = list
    .filter(isRecord)
    .map((module) => ({
      title: typeof module.title === 'string' ? module.title : '',
      description: typeof module.description === 'string' ? module.description : ''
    }))
    .filter((module) => module.title.length > 0 && module.description.length > 0);

  return modules.length > 0 ? modules : null;
}

function pickCapstone(value: unknown, locale: Locale): CourseCapstone | null {
  if (!isRecord(value)) return null;

  const entry = value[locale];
  if (!isRecord(entry)) return null;

  const title = typeof entry.title === 'string' ? entry.title : '';
  const description = typeof entry.description === 'string' ? entry.description : '';

  if (!title || !description) return null;

  return {
    title,
    description,
    deliverable:
      typeof entry.deliverable === 'string' && entry.deliverable.trim().length > 0
        ? entry.deliverable
        : undefined
  };
}

function pickMentor(value: unknown, locale: Locale): CourseMentorView | null {
  if (!isRecord(value)) return null;

  const name = pickLocalized(value.name, locale);
  const role = pickLocalized(value.role, locale);
  const bio = pickLocalized(value.bio, locale);

  if (!name || !role || !bio) return null;

  const portrait =
    typeof value.portrait_path === 'string' &&
    /^(https?:\/\/|\/)/.test(value.portrait_path)
      ? value.portrait_path
      : null;

  return { name, role, bio, portraitPath: portrait };
}

function positiveInteger(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0 ? value : fallback;
}

function isCourseTrack(value: unknown): value is CourseTrack {
  return typeof value === 'string' && (courseTracks as readonly string[]).includes(value);
}

function isAgeBracket(value: unknown): value is AgeBracket {
  return typeof value === 'string' && (ageBrackets as readonly string[]).includes(value);
}

function isCourseLevel(value: unknown): value is CourseLevel {
  return typeof value === 'string' && (courseLevels as readonly string[]).includes(value);
}

function brochureUrl(value: unknown): string {
  if (typeof value === 'string' && /^(https?:\/\/|\/)/.test(value)) {
    return value;
  }

  return SHARED_BROCHURE_PATH;
}

function seatsLeft(value: unknown, fallback: number): number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0 ? value : fallback;
}

/**
 * Supabase is the single source of truth for programmes. A row that is not a
 * complete, valid course returns null and does not surface publicly; a deleted
 * row is simply absent from the fetched set.
 */
export function normalizeCourse(row: CourseRow, locale: Locale): CourseView | null {
  if (!isCourseSlug(row.id)) return null;

  const track = isCourseTrack(row.track) ? row.track : null;
  const ageBracket = isAgeBracket(row.age_bracket) ? row.age_bracket : null;
  const level = isCourseLevel(row.level) ? row.level : null;
  const title = pickLocalized(row.title, locale);
  const description = pickLocalized(row.description, locale);
  const lede = pickLocalized(row.lede, locale);

  if (!track || !ageBracket || !level || !title || !description || !lede) {
    return null;
  }

  const capstone = pickCapstone(row.capstone, locale);

  return {
    id: row.id,
    track,
    ageBracket,
    level,
    durationWeeks: positiveInteger(row.duration_weeks, 8),
    sessionsPerWeek: positiveInteger(row.sessions_per_week, 2),
    featured: Boolean(row.featured),
    seatsLeft: seatsLeft(row.seats_left, 0),
    nextCohort: pickLocalized(row.next_cohort, locale) ?? defaultCohort[locale],
    schedule: pickLocalized(row.schedule, locale) ?? defaultSchedule[locale],
    brochureUrl: brochureUrl(row.brochure_url),
    copy: {
      title,
      description,
      lede,
      highlights: pickLocalizedList(row.highlights, locale) ?? [],
      outcomes: pickLocalizedList(row.outcomes, locale) ?? [],
      tools: pickLocalizedList(row.tools, locale) ?? [],
      modules: pickModules(row.modules, locale) ?? [],
      capstone: capstone ?? { title: '', description: '', deliverable: '' }
    },
    mentor: pickMentor(row.mentor, locale)
  };
}
