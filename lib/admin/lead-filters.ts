import type { Route } from 'next';
import { isCourseSlug } from '@/content/courses';
import { isLeadStatus, type LeadStatus } from '@/lib/courses/admin';

export const leadTimePresets = ['all', 'today', '7d', '30d', 'custom'] as const;
export type LeadTimePreset = (typeof leadTimePresets)[number];

export const leadSortKeys = ['received', 'name'] as const;
export type LeadSortKey = (typeof leadSortKeys)[number];

export type SortDir = 'asc' | 'desc';

export type LeadTime = {
  preset: LeadTimePreset;
  from: string | null;
  to: string | null;
};

export type LeadSort = {
  key: LeadSortKey;
  dir: SortDir;
};

export type LeadFilters = {
  status: LeadStatus | 'all';
  course: string | null;
  time: LeadTime;
  sort: LeadSort;
};

export type LeadBounds = {
  startIso: string | null;
  endIso: string | null;
};

export type AdminQueryParams = {
  tab: 'courses' | 'leads';
  filters: LeadFilters;
  page: number;
};

type SearchParams = Record<string, string | string[] | undefined>;

const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/** Africa/Algiers is UTC+1 all year (no DST). */
const ALGIERS_OFFSET_MS = 60 * 60 * 1000;

const TIME_LABELS: Record<LeadTimePreset, string> = {
  all: 'All Time',
  today: 'Today',
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
  custom: 'Custom range'
};

function first(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function pick<T extends string>(value: unknown, allowed: readonly T[]): T | null {
  return typeof value === 'string' && (allowed as readonly string[]).includes(value)
    ? (value as T)
    : null;
}

/** Accepts only real `yyyy-mm-dd` calendar dates (rejects 2026-02-30). */
export function isValidDate(value: string | null | undefined): value is string {
  if (typeof value !== 'string') return false;

  const match = DATE_PATTERN.exec(value);
  if (!match) return false;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const probe = new Date(Date.UTC(year, month - 1, day));

  return (
    probe.getUTCFullYear() === year &&
    probe.getUTCMonth() === month - 1 &&
    probe.getUTCDate() === day
  );
}

export function defaultDirForSort(key: LeadSortKey): SortDir {
  return key === 'name' ? 'asc' : 'desc';
}

export function leadTimeLabel(preset: LeadTimePreset): string {
  return TIME_LABELS[preset];
}

export function parseAdminParams(params: SearchParams): AdminQueryParams {
  const tab = first(params.tab) === 'leads' ? 'leads' : 'courses';

  const statusParam = first(params.status);
  const status: LeadStatus | 'all' =
    statusParam && isLeadStatus(statusParam) ? statusParam : 'all';

  const courseParam = first(params.course);
  const course = courseParam && isCourseSlug(courseParam) ? courseParam : null;

  const preset = pick(first(params.time), leadTimePresets) ?? 'all';
  const fromParam = first(params.from);
  const toParam = first(params.to);
  const from = preset === 'custom' && isValidDate(fromParam) ? fromParam : null;
  const to = preset === 'custom' && isValidDate(toParam) ? toParam : null;

  const key = pick(first(params.sort), leadSortKeys) ?? 'received';
  const dir = pick(first(params.dir), ['asc', 'desc'] as const) ?? defaultDirForSort(key);

  const requestedPage = Number.parseInt(first(params.page) ?? '1', 10);
  const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  return {
    tab,
    filters: { status, course, time: { preset, from, to }, sort: { key, dir } },
    page
  };
}

function localCalendarDate(now: Date): string {
  return new Date(now.getTime() + ALGIERS_OFFSET_MS).toISOString().slice(0, 10);
}

function addDays(date: string, delta: number): string {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day + delta)).toISOString().slice(0, 10);
}

/** Local midnight expressed as UTC ISO (e.g. 2026-11-05 00:00 Algiers = 2026-11-04T23:00Z). */
function startOfDayIso(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day) - ALGIERS_OFFSET_MS).toISOString();
}

/** Exclusive upper bound: the next local midnight. */
function startOfNextDayIso(date: string): string {
  const [year, month, day] = date.split('-').map(Number);
  return new Date(Date.UTC(year, month - 1, day + 1) - ALGIERS_OFFSET_MS).toISOString();
}

/**
 * Resolves a time preset into half-open `[startIso, endIso)` UTC bounds.
 * Presets follow Algiers calendar days, not UTC days.
 */
export function resolveLeadBounds(time: LeadTime, now: Date): LeadBounds {
  const today = localCalendarDate(now);

  switch (time.preset) {
    case 'today':
      return { startIso: startOfDayIso(today), endIso: startOfNextDayIso(today) };
    case '7d':
      return { startIso: startOfDayIso(addDays(today, -6)), endIso: startOfNextDayIso(today) };
    case '30d':
      return { startIso: startOfDayIso(addDays(today, -29)), endIso: startOfNextDayIso(today) };
    case 'custom': {
      const from = isValidDate(time.from) ? time.from : null;
      const to = isValidDate(time.to) ? time.to : null;

      if (from && to && from > to) {
        return { startIso: startOfDayIso(to), endIso: startOfNextDayIso(from) };
      }

      return {
        startIso: from ? startOfDayIso(from) : null,
        endIso: to ? startOfNextDayIso(to) : null
      };
    }
    default:
      return { startIso: null, endIso: null };
  }
}

/** Builds a canonical `/admin` query string, omitting default values. */
export function buildAdminQuery(filters: LeadFilters, page = 1): Record<string, string> {
  const query: Record<string, string> = { tab: 'leads' };

  if (filters.status !== 'all') query.status = filters.status;
  if (filters.course) query.course = filters.course;
  if (filters.time.preset !== 'all') query.time = filters.time.preset;

  if (filters.time.preset === 'custom') {
    if (filters.time.from) query.from = filters.time.from;
    if (filters.time.to) query.to = filters.time.to;
  }

  if (filters.sort.key !== 'received') query.sort = filters.sort.key;
  if (filters.sort.dir !== defaultDirForSort(filters.sort.key)) query.dir = filters.sort.dir;
  if (page > 1) query.page = String(page);

  return query;
}

export function hrefFor(query: Record<string, string>): Route {
  const search = new URLSearchParams(query).toString();

  return (search ? `/admin?${search}` : '/admin') as Route;
}

export function toggleLeadSort(sort: LeadSort, key: LeadSortKey): LeadSort {
  if (sort.key === key) {
    return { key, dir: sort.dir === 'asc' ? 'desc' : 'asc' };
  }

  return { key, dir: defaultDirForSort(key) };
}
