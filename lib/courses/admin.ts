import { isCourseId, type CourseId } from '@/content/courses';

export type LoginState = {
  error: string | null;
};

export type AdminCourse = {
  id: CourseId;
  titleEn: string;
  titleFr: string;
  descriptionEn: string;
  descriptionFr: string;
  track: string;
  nextCohortEn: string;
  nextCohortFr: string;
  scheduleEn: string;
  scheduleFr: string;
  seatsLeft: number;
  brochureUrl: string | null;
};

export type AdminLead = {
  id: string;
  name: string;
  contact: string;
  courseId: string;
  courseTitle: string;
  ageGroup: string;
  locale: string;
  createdAt: string;
};

export type CourseUpdate = {
  title: { en: string; fr: string };
  description: { en: string; fr: string };
  next_cohort: { en: string; fr: string };
  schedule: { en: string; fr: string };
  seats_left: number;
  brochure_url?: string;
};

export type ParseCourseUpdateResult =
  | { ok: true; id: CourseId; update: CourseUpdate }
  | { ok: false; fields: Record<string, string> };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function localized(value: unknown, locale: 'en' | 'fr'): string {
  if (!isRecord(value)) return '';
  const candidate = value[locale];
  return typeof candidate === 'string' ? candidate : '';
}

export function mapAdminCourse(row: unknown): AdminCourse | null {
  if (!isRecord(row) || !isCourseId(row.id)) return null;

  return {
    id: row.id,
    titleEn: localized(row.title, 'en'),
    titleFr: localized(row.title, 'fr'),
    descriptionEn: localized(row.description, 'en'),
    descriptionFr: localized(row.description, 'fr'),
    track: typeof row.track === 'string' ? row.track : '',
    nextCohortEn: localized(row.next_cohort, 'en'),
    nextCohortFr: localized(row.next_cohort, 'fr'),
    scheduleEn: localized(row.schedule, 'en'),
    scheduleFr: localized(row.schedule, 'fr'),
    seatsLeft:
      typeof row.seats_left === 'number' && Number.isInteger(row.seats_left)
        ? row.seats_left
        : 0,
    brochureUrl: typeof row.brochure_url === 'string' ? row.brochure_url : null
  };
}

export function mapAdminLead(
  row: unknown,
  courseTitleById: Map<string, string>
): AdminLead | null {
  if (!isRecord(row) || typeof row.id !== 'string') return null;

  const courseId = typeof row.course_id === 'string' ? row.course_id : '';
  const createdAt = typeof row.created_at === 'string' ? row.created_at : '';

  return {
    id: row.id,
    name: typeof row.name === 'string' ? row.name : '',
    contact: typeof row.contact === 'string' ? row.contact : '',
    courseId,
    courseTitle: courseTitleById.get(courseId) ?? courseId,
    ageGroup: typeof row.age_group === 'string' ? row.age_group : '',
    locale: typeof row.locale === 'string' ? row.locale : 'en',
    createdAt: formatLeadDate(createdAt)
  };
}

function formatLeadDate(value: string): string {
  if (!value) return '—';

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Africa/Algiers'
  }).format(date);
}

function clip(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function parseLocalized(value: unknown, max: number): { en: string; fr: string } | null {
  if (!isRecord(value)) return null;

  const en = clip(value.en, max);
  const fr = clip(value.fr, max);

  if (!en && !fr) return null;

  return { en: en || fr, fr: fr || en };
}

function isAllowedBrochureUrl(value: string): boolean {
  if (value.startsWith('/brochures/')) return true;

  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      url.pathname.startsWith('/storage/v1/object/public/brochures/')
    );
  } catch {
    return false;
  }
}

export function parseCourseUpdate(body: unknown): ParseCourseUpdateResult {
  if (!isRecord(body)) {
    return { ok: false, fields: { _form: 'invalid' } };
  }

  const fields: Record<string, string> = {};
  const { id } = body;

  if (!isCourseId(id)) {
    return { ok: false, fields: { id: 'invalid' } };
  }

  const title = parseLocalized(body.title, 160);
  const description = parseLocalized(body.description, 2000);
  const nextCohort = parseLocalized(body.next_cohort, 120);
  const schedule = parseLocalized(body.schedule, 120);
  const seats = body.seats_left;

  if (!title) fields.title = 'invalid';
  if (!description) fields.description = 'invalid';
  if (!nextCohort) fields.next_cohort = 'invalid';
  if (!schedule) fields.schedule = 'invalid';
  if (typeof seats !== 'number' || !Number.isInteger(seats) || seats < 0 || seats > 999) {
    fields.seats_left = 'invalid';
  }

  let brochureUrl: string | undefined;

  if (body.brochure_url !== undefined) {
    if (body.brochure_url === null) {
      brochureUrl = undefined;
    } else if (
      typeof body.brochure_url === 'string' &&
      body.brochure_url.length <= 1000 &&
      isAllowedBrochureUrl(body.brochure_url)
    ) {
      brochureUrl = body.brochure_url;
    } else {
      fields.brochure_url = 'invalid';
    }
  }

  if (Object.keys(fields).length > 0) {
    return { ok: false, fields };
  }

  return {
    ok: true,
    id,
    update: {
      title: title!,
      description: description!,
      next_cohort: nextCohort!,
      schedule: schedule!,
      seats_left: seats as number,
      ...(brochureUrl ? { brochure_url: brochureUrl } : {})
    }
  };
}
