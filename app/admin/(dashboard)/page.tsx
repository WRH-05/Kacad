import type { Metadata } from 'next';
import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { isCourseSlug } from '@/content/courses';
import {
  isLeadStatus,
  mapAdminCourse,
  mapAdminLead,
  type AdminCourse,
  type AdminLead,
  type LeadCounts,
  type LeadStatus
} from '@/lib/courses/admin';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dashboard'
};

const PAGE_SIZE = 20;

type SearchParams = Record<string, string | string[] | undefined>;

function readParam(value: string | string[] | undefined): string | undefined {
  return Array.isArray(value) ? value[0] : value;
}

export default async function AdminDashboardPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const tab = readParam(params.tab) === 'leads' ? 'leads' : 'courses';

  const statusParam = readParam(params.status);
  const status: LeadStatus | 'all' = statusParam && isLeadStatus(statusParam) ? statusParam : 'all';

  const courseParam = readParam(params.course);
  const course = courseParam && isCourseSlug(courseParam) ? courseParam : null;

  const requestedPage = Number.parseInt(readParam(params.page) ?? '1', 10);
  const requested = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const supabase = await createClient();

  const countFor = async (leadStatus?: LeadStatus | 'all') => {
    let query = supabase
      .from('waitlist_leads')
      .select('*', { count: 'exact', head: true });

    if (course) query = query.eq('course_id', course);
    if (leadStatus && leadStatus !== 'all') query = query.eq('status', leadStatus);

    const { count } = await query;

    return count ?? 0;
  };

  const [coursesResult, totalResult, allCount, newCount, contactedCount, enrolledCount, archivedCount] =
    await Promise.all([
      supabase.from('courses').select('*').order('id'),
      supabase.from('waitlist_leads').select('*', { count: 'exact', head: true }),
      countFor('all'),
      countFor('new'),
      countFor('contacted'),
      countFor('enrolled'),
      countFor('archived')
    ]);

  const counts: LeadCounts = {
    all: allCount,
    new: newCount,
    contacted: contactedCount,
    enrolled: enrolledCount,
    archived: archivedCount
  };

  const filteredTotal = counts[status];
  const pageCount = Math.max(1, Math.ceil(filteredTotal / PAGE_SIZE));
  const page = Math.min(requested, pageCount);

  let leadsQuery = supabase
    .from('waitlist_leads')
    .select('*')
    .order('created_at', { ascending: false })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  if (course) leadsQuery = leadsQuery.eq('course_id', course);
  if (status !== 'all') leadsQuery = leadsQuery.eq('status', status);

  const leadsResult = await leadsQuery;

  const courses = (coursesResult.data ?? [])
    .map((row) => mapAdminCourse(row))
    .filter((entry): entry is AdminCourse => entry !== null);

  const titleById = new Map<string, string>(
    courses.map((entry) => [entry.id, entry.titleEn])
  );

  const leads = (leadsResult.data ?? [])
    .map((row) => mapAdminLead(row, titleById))
    .filter((lead): lead is AdminLead => lead !== null);

  const loadError =
    coursesResult.error?.message ?? leadsResult.error?.message ?? null;

  return (
    <AdminDashboard
      courses={courses}
      leads={leads}
      leadCounts={counts}
      leadTotal={totalResult.count ?? 0}
      page={page}
      pageCount={pageCount}
      filters={{ status, course }}
      tab={tab}
      loadError={loadError}
    />
  );
}
