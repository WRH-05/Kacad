import {
  ageBrackets,
  courseLevels,
  courseTracks,
  isCourseSlug,
  type AgeBracket,
  type CourseLevel,
  type CourseTrack
} from '@/content/courses';
import type { TablesInsert, TablesUpdate } from '@/types/database';
import type { CourseCapstone, CourseModule, Localized, LocalizedList } from './types';

export type LoginState = {
  error: string | null;
};

export type AdminModule = {
  titleEn: string;
  titleFr: string;
  descriptionEn: string;
  descriptionFr: string;
};

export type AdminCourse = {
  id: string;
  track: CourseTrack;
  ageBracket: AgeBracket;
  level: CourseLevel;
  durationWeeks: number;
  sessionsPerWeek: number;
  featured: boolean;
  titleEn: string;
  titleFr: string;
  descriptionEn: string;
  descriptionFr: string;
  ledeEn: string;
  ledeFr: string;
  highlightsEn: string;
  highlightsFr: string;
  nextCohortEn: string;
  nextCohortFr: string;
  scheduleEn: string;
  scheduleFr: string;
  outcomesEn: string;
  outcomesFr: string;
  toolsEn: string;
  toolsFr: string;
  modules: AdminModule[];
  capstoneTitleEn: string;
  capstoneTitleFr: string;
  capstoneDescriptionEn: string;
  capstoneDescriptionFr: string;
  capstoneDeliverableEn: string;
  capstoneDeliverableFr: string;
  mentorNameEn: string;
  mentorNameFr: string;
  mentorRoleEn: string;
  mentorRoleFr: string;
  mentorBioEn: string;
  mentorBioFr: string;
  mentorPortraitUrl: string | null;
  seatsLeft: number;
  brochureUrl: string | null;
};

export const leadStatuses = ['new', 'contacted', 'enrolled', 'archived'] as const;
export type LeadStatus = (typeof leadStatuses)[number];

export const REMOVED_COURSE_LABEL = 'Programme removed';

export type LeadCounts = Record<LeadStatus | 'all', number>;

export function isLeadStatus(value: unknown): value is LeadStatus {
  return typeof value === 'string' && (leadStatuses as readonly string[]).includes(value);
}

export type AdminLead = {
  id: string;
  name: string;
  contact: string;
  courseId: string | null;
  courseTitle: string;
  ageGroup: string;
  locale: string;
  notes: string | null;
  status: LeadStatus;
  createdAt: string;
};

type FieldErrors = Record<string, string>;

export type ParseCourseCreateResult =
  | { ok: true; value: TablesInsert<'courses'> }
  | { ok: false; fields: FieldErrors };

export type ParseCourseUpdateResult =
  | { ok: true; id: string; update: TablesUpdate<'courses'> }
  | { ok: false; fields: FieldErrors };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function clip(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function localized(value: unknown, locale: 'en' | 'fr'): string {
  if (!isRecord(value)) return '';
  const candidate = value[locale];
  return typeof candidate === 'string' ? candidate : '';
}

function localizedEntry(value: unknown, locale: 'en' | 'fr'): Record<string, unknown> | null {
  if (!isRecord(value)) return null;
  const entry = value[locale];
  return isRecord(entry) ? entry : null;
}

function localizedList(value: unknown, locale: 'en' | 'fr'): string[] {
  if (!isRecord(value)) return [];
  const list = value[locale];
  if (!Array.isArray(list)) return [];
  return list.filter((item): item is string => typeof item === 'string');
}

function localizedModules(value: unknown, locale: 'en' | 'fr'): CourseModule[] {
  if (!isRecord(value)) return [];
  const list = value[locale];
  if (!Array.isArray(list)) return [];

  return list
    .filter(isRecord)
    .map((module) => ({
      title: typeof module.title === 'string' ? module.title : '',
      description: typeof module.description === 'string' ? module.description : ''
    }))
    .filter((module) => module.title || module.description);
}

function listToText(value: unknown, locale: 'en' | 'fr', separator: string): string {
  return localizedList(value, locale).join(separator);
}

function modulesForAdmin(value: unknown): AdminModule[] {
  const en = localizedModules(value, 'en');
  const fr = localizedModules(value, 'fr');
  const count = Math.max(en.length, fr.length);

  return Array.from({ length: count }, (_, index) => ({
    titleEn: en[index]?.title ?? '',
    titleFr: fr[index]?.title ?? '',
    descriptionEn: en[index]?.description ?? '',
    descriptionFr: fr[index]?.description ?? ''
  }));
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

export function mapAdminCourse(row: unknown): AdminCourse | null {
  if (!isRecord(row) || !isCourseSlug(row.id)) return null;

  const enCapstone = localizedEntry(row.capstone, 'en');
  const frCapstone = localizedEntry(row.capstone, 'fr');
  const enMentor = localizedEntry(row.mentor, 'en');
  const frMentor = localizedEntry(row.mentor, 'fr');
  const mentorRecord = isRecord(row.mentor) ? row.mentor : null;

  return {
    id: row.id,
    track: isCourseTrack(row.track) ? row.track : 'tech',
    ageBracket: isAgeBracket(row.age_bracket) ? row.age_bracket : 'all',
    level: isCourseLevel(row.level) ? row.level : 'foundation',
    durationWeeks:
      typeof row.duration_weeks === 'number' && row.duration_weeks > 0 ? row.duration_weeks : 8,
    sessionsPerWeek:
      typeof row.sessions_per_week === 'number' && row.sessions_per_week > 0
        ? row.sessions_per_week
        : 2,
    featured: row.featured === true,
    titleEn: localized(row.title, 'en'),
    titleFr: localized(row.title, 'fr'),
    descriptionEn: localized(row.description, 'en'),
    descriptionFr: localized(row.description, 'fr'),
    ledeEn: localized(row.lede, 'en'),
    ledeFr: localized(row.lede, 'fr'),
    highlightsEn: listToText(row.highlights, 'en', ', '),
    highlightsFr: listToText(row.highlights, 'fr', ', '),
    nextCohortEn: localized(row.next_cohort, 'en'),
    nextCohortFr: localized(row.next_cohort, 'fr'),
    scheduleEn: localized(row.schedule, 'en'),
    scheduleFr: localized(row.schedule, 'fr'),
    outcomesEn: listToText(row.outcomes, 'en', '\n'),
    outcomesFr: listToText(row.outcomes, 'fr', '\n'),
    toolsEn: listToText(row.tools, 'en', ', '),
    toolsFr: listToText(row.tools, 'fr', ', '),
    modules: modulesForAdmin(row.modules),
    capstoneTitleEn: typeof enCapstone?.title === 'string' ? enCapstone.title : '',
    capstoneTitleFr: typeof frCapstone?.title === 'string' ? frCapstone.title : '',
    capstoneDescriptionEn:
      typeof enCapstone?.description === 'string' ? enCapstone.description : '',
    capstoneDescriptionFr:
      typeof frCapstone?.description === 'string' ? frCapstone.description : '',
    capstoneDeliverableEn:
      typeof enCapstone?.deliverable === 'string' ? enCapstone.deliverable : '',
    capstoneDeliverableFr:
      typeof frCapstone?.deliverable === 'string' ? frCapstone.deliverable : '',
    mentorNameEn: typeof enMentor?.name === 'string' ? enMentor.name : '',
    mentorNameFr: typeof frMentor?.name === 'string' ? frMentor.name : '',
    mentorRoleEn: typeof enMentor?.role === 'string' ? enMentor.role : '',
    mentorRoleFr: typeof frMentor?.role === 'string' ? frMentor.role : '',
    mentorBioEn: typeof enMentor?.bio === 'string' ? enMentor.bio : '',
    mentorBioFr: typeof frMentor?.bio === 'string' ? frMentor.bio : '',
    mentorPortraitUrl:
      mentorRecord && typeof mentorRecord.portrait_path === 'string'
        ? mentorRecord.portrait_path
        : null,
    seatsLeft:
      typeof row.seats_left === 'number' && Number.isInteger(row.seats_left) && row.seats_left >= 0
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

  const courseId = typeof row.course_id === 'string' ? row.course_id : null;
  const createdAt = typeof row.created_at === 'string' ? row.created_at : '';

  return {
    id: row.id,
    name: typeof row.name === 'string' ? row.name : '',
    contact: typeof row.contact === 'string' ? row.contact : '',
    courseId,
    courseTitle: courseId
      ? courseTitleById.get(courseId) ?? courseId
      : REMOVED_COURSE_LABEL,
    ageGroup: typeof row.age_group === 'string' ? row.age_group : '',
    locale: typeof row.locale === 'string' ? row.locale : 'en',
    notes: typeof row.notes === 'string' ? row.notes : null,
    status: isLeadStatus(row.status) ? row.status : 'new',
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

function parseLocalized(value: unknown, max: number): Localized | null {
  if (!isRecord(value)) return null;

  const en = clip(value.en, max);
  const fr = clip(value.fr, max);

  if (!en && !fr) return null;

  return { en: en || fr, fr: fr || en };
}

function parseLocalizedList(
  value: unknown,
  maxItems: number,
  maxLength: number
): LocalizedList | null {
  if (!isRecord(value)) return null;

  const parse = (locale: 'en' | 'fr'): string[] | null => {
    const list = value[locale];
    if (!Array.isArray(list)) return null;
    if (list.length > maxItems) return null;

    return list
      .filter((item): item is string => typeof item === 'string')
      .map((item) => item.trim().slice(0, maxLength))
      .filter(Boolean);
  };

  const en = parse('en');
  const fr = parse('fr');

  if (!en || !fr) return null;

  return { en, fr };
}

function parseModules(value: unknown): { en: CourseModule[]; fr: CourseModule[] } | null {
  if (!isRecord(value)) return null;

  const parse = (locale: 'en' | 'fr'): CourseModule[] | null => {
    const list = value[locale];
    if (!Array.isArray(list)) return null;
    if (list.length > 12) return null;

    return list
      .filter(isRecord)
      .map((module) => ({
        title: clip(module.title, 120),
        description: clip(module.description, 600)
      }))
      .filter((module) => module.title || module.description);
  };

  const en = parse('en');
  const fr = parse('fr');

  if (!en || !fr) return null;

  return { en, fr };
}

function parseCapstone(value: unknown): { en: CourseCapstone; fr: CourseCapstone } | null {
  if (!isRecord(value)) return null;

  const parse = (locale: 'en' | 'fr'): CourseCapstone | null => {
    const entry = value[locale];
    if (!isRecord(entry)) return null;

    const title = clip(entry.title, 160);
    const description = clip(entry.description, 2000);
    const deliverable = clip(entry.deliverable, 800);

    if (!title && !description && !deliverable) return null;

    return {
      title: title || description,
      description: description || title,
      ...(deliverable ? { deliverable } : {})
    };
  };

  const en = parse('en');
  const fr = parse('fr');

  if (!en || !fr) return null;

  return { en, fr };
}

function parseMentor(value: unknown): {
  name: Localized;
  role: Localized;
  bio: Localized;
  portrait_path: string | null;
} | null {
  if (!isRecord(value)) return null;

  const name = parseLocalized(value.name, 160);
  const role = parseLocalized(value.role, 160);
  const bio = parseLocalized(value.bio, 2000);
  const portrait = value.portrait_path;

  let portraitPath: string | null;

  if (portrait === undefined || portrait === null) {
    portraitPath = null;
  } else if (typeof portrait === 'string' && isAllowedPortraitUrl(portrait)) {
    portraitPath = portrait;
  } else {
    return null;
  }

  if (!name || !role || !bio) return null;

  return { name, role, bio, portrait_path: portraitPath };
}

function parseSlug(value: unknown): string | null {
  return isCourseSlug(value) ? value : null;
}

function parseEnum<T extends string>(value: unknown, allowed: readonly T[]): T | null {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : null;
}

function parseInteger(value: unknown): number | null {
  return typeof value === 'number' && Number.isInteger(value) ? value : null;
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

function isAllowedPortraitUrl(value: string): boolean {
  if (value.startsWith('/images/') || value.startsWith('/mentors/')) return true;

  try {
    const url = new URL(value);
    return (
      url.protocol === 'https:' &&
      url.pathname.startsWith('/storage/v1/object/public/mentors/')
    );
  } catch {
    return false;
  }
}

function emptyList(): LocalizedList {
  return { en: [], fr: [] };
}

function emptyModules(): { en: CourseModule[]; fr: CourseModule[] } {
  return { en: [], fr: [] };
}

export function parseCourseCreate(body: unknown): ParseCourseCreateResult {
  if (!isRecord(body)) {
    return { ok: false, fields: { _form: 'invalid' } };
  }

  const fields: FieldErrors = {};

  const id = parseSlug(body.id);
  const track = parseEnum(body.track, courseTracks);
  const ageBracket = parseEnum(body.age_bracket, ageBrackets);
  const level = parseEnum(body.level, courseLevels);
  const title = parseLocalized(body.title, 160);
  const description = parseLocalized(body.description, 2000);
  const lede = parseLocalized(body.lede, 600);
  const highlights =
    body.highlights === undefined ? emptyList() : parseLocalizedList(body.highlights, 20, 80);
  const outcomes =
    body.outcomes === undefined ? emptyList() : parseLocalizedList(body.outcomes, 30, 300);
  const tools =
    body.tools === undefined ? emptyList() : parseLocalizedList(body.tools, 30, 80);
  const modules = body.modules === undefined ? emptyModules() : parseModules(body.modules);
  const nextCohort =
    body.next_cohort === undefined ? null : parseLocalized(body.next_cohort, 120);
  const schedule = body.schedule === undefined ? null : parseLocalized(body.schedule, 120);
  const capstone =
    body.capstone === undefined || body.capstone === null ? null : parseCapstone(body.capstone);
  const mentor =
    body.mentor === undefined || body.mentor === null ? null : parseMentor(body.mentor);
  const seats = body.seats_left === undefined ? 6 : parseInteger(body.seats_left);
  const duration = body.duration_weeks === undefined ? 8 : parseInteger(body.duration_weeks);
  const sessions =
    body.sessions_per_week === undefined ? 2 : parseInteger(body.sessions_per_week);
  const featured = body.featured === undefined ? false : body.featured;

  if (!id) fields.id = 'invalid';
  if (!track) fields.track = 'invalid';
  if (!ageBracket) fields.age_bracket = 'invalid';
  if (!level) fields.level = 'invalid';
  if (!title) fields.title = 'invalid';
  if (!description) fields.description = 'invalid';
  if (!lede) fields.lede = 'invalid';
  if (!highlights) fields.highlights = 'invalid';
  if (!outcomes) fields.outcomes = 'invalid';
  if (!tools) fields.tools = 'invalid';
  if (!modules) fields.modules = 'invalid';
  if (body.next_cohort !== undefined && !nextCohort) fields.next_cohort = 'invalid';
  if (body.schedule !== undefined && !schedule) fields.schedule = 'invalid';
  if (body.capstone !== undefined && body.capstone !== null && !capstone) {
    fields.capstone = 'invalid';
  }
  if (body.mentor !== undefined && body.mentor !== null && !mentor) {
    fields.mentor = 'invalid';
  }
  if (seats === null || seats < 0 || seats > 999) fields.seats_left = 'invalid';
  if (duration === null || duration < 1 || duration > 52) fields.duration_weeks = 'invalid';
  if (sessions === null || sessions < 1 || sessions > 14) {
    fields.sessions_per_week = 'invalid';
  }
  if (typeof featured !== 'boolean') fields.featured = 'invalid';

  let brochureUrl: string | null = null;

  if (body.brochure_url !== undefined && body.brochure_url !== null) {
    if (
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
    value: {
      id: id!,
      track: track!,
      age_bracket: ageBracket!,
      level: level!,
      duration_weeks: duration as number,
      sessions_per_week: sessions as number,
      featured: featured as boolean,
      title: title!,
      description: description!,
      lede: lede!,
      highlights: highlights!,
      outcomes: outcomes!,
      tools: tools!,
      modules: modules!,
      next_cohort: nextCohort,
      schedule,
      capstone,
      mentor,
      seats_left: seats as number,
      brochure_url: brochureUrl
    }
  };
}

export function parseCourseUpdate(body: unknown): ParseCourseUpdateResult {
  if (!isRecord(body)) {
    return { ok: false, fields: { _form: 'invalid' } };
  }

  const id = parseSlug(body.id);

  if (!id) {
    return { ok: false, fields: { id: 'invalid' } };
  }

  const fields: FieldErrors = {};
  const update: TablesUpdate<'courses'> = {};

  if (body.track !== undefined) {
    const track = parseEnum(body.track, courseTracks);
    if (track) update.track = track;
    else fields.track = 'invalid';
  }

  if (body.age_bracket !== undefined) {
    const ageBracket = parseEnum(body.age_bracket, ageBrackets);
    if (ageBracket) update.age_bracket = ageBracket;
    else fields.age_bracket = 'invalid';
  }

  if (body.level !== undefined) {
    const level = parseEnum(body.level, courseLevels);
    if (level) update.level = level;
    else fields.level = 'invalid';
  }

  if (body.duration_weeks !== undefined) {
    const duration = parseInteger(body.duration_weeks);
    if (duration !== null && duration >= 1 && duration <= 52) update.duration_weeks = duration;
    else fields.duration_weeks = 'invalid';
  }

  if (body.sessions_per_week !== undefined) {
    const sessions = parseInteger(body.sessions_per_week);
    if (sessions !== null && sessions >= 1 && sessions <= 14) {
      update.sessions_per_week = sessions;
    } else {
      fields.sessions_per_week = 'invalid';
    }
  }

  if (body.featured !== undefined) {
    if (typeof body.featured === 'boolean') update.featured = body.featured;
    else fields.featured = 'invalid';
  }

  if (body.title !== undefined) {
    const title = parseLocalized(body.title, 160);
    if (title) update.title = title;
    else fields.title = 'invalid';
  }

  if (body.description !== undefined) {
    const description = parseLocalized(body.description, 2000);
    if (description) update.description = description;
    else fields.description = 'invalid';
  }

  if (body.lede !== undefined) {
    const lede = parseLocalized(body.lede, 600);
    if (lede) update.lede = lede;
    else fields.lede = 'invalid';
  }

  if (body.highlights !== undefined) {
    const highlights = parseLocalizedList(body.highlights, 20, 80);
    if (highlights) update.highlights = highlights;
    else fields.highlights = 'invalid';
  }

  if (body.outcomes !== undefined) {
    const outcomes = parseLocalizedList(body.outcomes, 30, 300);
    if (outcomes) update.outcomes = outcomes;
    else fields.outcomes = 'invalid';
  }

  if (body.tools !== undefined) {
    const tools = parseLocalizedList(body.tools, 30, 80);
    if (tools) update.tools = tools;
    else fields.tools = 'invalid';
  }

  if (body.modules !== undefined) {
    const modules = parseModules(body.modules);
    if (modules) update.modules = modules;
    else fields.modules = 'invalid';
  }

  if (body.next_cohort !== undefined) {
    if (body.next_cohort === null) {
      update.next_cohort = null;
    } else {
      const nextCohort = parseLocalized(body.next_cohort, 120);
      if (nextCohort) update.next_cohort = nextCohort;
      else fields.next_cohort = 'invalid';
    }
  }

  if (body.schedule !== undefined) {
    if (body.schedule === null) {
      update.schedule = null;
    } else {
      const schedule = parseLocalized(body.schedule, 120);
      if (schedule) update.schedule = schedule;
      else fields.schedule = 'invalid';
    }
  }

  if (body.capstone !== undefined) {
    if (body.capstone === null) {
      update.capstone = null;
    } else {
      const capstone = parseCapstone(body.capstone);
      if (capstone) update.capstone = capstone;
      else fields.capstone = 'invalid';
    }
  }

  if (body.mentor !== undefined) {
    if (body.mentor === null) {
      update.mentor = null;
    } else {
      const mentor = parseMentor(body.mentor);
      if (mentor) update.mentor = mentor;
      else fields.mentor = 'invalid';
    }
  }

  if (body.seats_left !== undefined) {
    const seats = parseInteger(body.seats_left);
    if (seats !== null && seats >= 0 && seats <= 999) update.seats_left = seats;
    else fields.seats_left = 'invalid';
  }

  if (body.brochure_url !== undefined) {
    if (body.brochure_url === null) {
      update.brochure_url = null;
    } else if (
      typeof body.brochure_url === 'string' &&
      body.brochure_url.length <= 1000 &&
      isAllowedBrochureUrl(body.brochure_url)
    ) {
      update.brochure_url = body.brochure_url;
    } else {
      fields.brochure_url = 'invalid';
    }
  }

  if (Object.keys(fields).length > 0) {
    return { ok: false, fields };
  }

  if (Object.keys(update).length === 0) {
    return { ok: false, fields: { _form: 'empty' } };
  }

  return { ok: true, id, update };
}
