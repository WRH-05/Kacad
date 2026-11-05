import type { Metadata } from 'next';
import { AdminDashboard } from '@/components/admin/admin-dashboard';
import { parseAdminParams, resolveLeadBounds } from '@/lib/admin/lead-filters';
import {
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

export default async function AdminDashboardPage({
  searchParams
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const { tab, filters, page: requestedPage } = parseAdminParams(params);
  const bounds = resolveLeadBounds(filters.time, new Date());

  const supabase = await createClient();

  const countLeads = async (
    options: { status?: LeadStatus | 'all'; ignoreCourse?: boolean } = {}
  ): Promise<number> => {
    let query = supabase.from('waitlist_leads').select('*', { count: 'exact', head: true });

    if (!options.ignoreCourse && filters.course) {
      query = query.eq('course_id', filters.course);
    }
    if (options.status && options.status !== 'all') {
      query = query.eq('status', options.status);
    }
    if (bounds.startIso) query = query.gte('created_at', bounds.startIso);
    if (bounds.endIso) query = query.lt('created_at', bounds.endIso);

    const { count } = await query;

    return count ?? 0;
  };

  const [
    coursesResult,
    totalCount,
    allCount,
    newCount,
    contactedCount,
    enrolledCount,
    archivedCount
  ] = await Promise.all([
    supabase.from('courses').select('*').order('id'),
    countLeads({ ignoreCourse: true }),
    countLeads({ status: 'all' }),
    countLeads({ status: 'new' }),
    countLeads({ status: 'contacted' }),
    countLeads({ status: 'enrolled' }),
    countLeads({ status: 'archived' })
  ]);

  const counts: LeadCounts = {
    all: allCount,
    new: newCount,
    contacted: contactedCount,
    enrolled: enrolledCount,
    archived: archivedCount
  };

  const filteredTotal = counts[filters.status];
  const pageCount = Math.max(1, Math.ceil(filteredTotal / PAGE_SIZE));
  const page = Math.min(requestedPage, pageCount);

  let filterQuery = supabase.from('waitlist_leads').select('*');

  if (filters.course) filterQuery = filterQuery.eq('course_id', filters.course);
  if (filters.status !== 'all') filterQuery = filterQuery.eq('status', filters.status);
  if (bounds.startIso) filterQuery = filterQuery.gte('created_at', bounds.startIso);
  if (bounds.endIso) filterQuery = filterQuery.lt('created_at', bounds.endIso);

  const leadsResult = await filterQuery
    .order(filters.sort.key === 'name' ? 'name' : 'created_at', {
      ascending: filters.sort.dir === 'asc'
    })
    .order('id', { ascending: true })
    .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

  const courses = (coursesResult.data ?? [])
    .map((row) => mapAdminCourse(row))
    .filter((entry): entry is AdminCourse => entry !== null);

  const titleById = new Map<string, string>(
    courses.map((entry) => [entry.id, entry.titleEn])
  );

  const leads = (leadsResult.data ?? [])
    .map((row) => mapAdminLead(row, titleById))
    .filter((lead): lead is AdminLead => lead !== null);

  const loadError = coursesResult.error?.message ?? leadsResult.error?.message ?? null;

  return (
    <AdminDashboard
      courses={courses}
      leads={leads}
      leadCounts={counts}
      leadTotal={totalCount}
      page={page}
      pageCount={pageCount}
      filters={filters}
      tab={tab}
      loadError={loadError}
    />
  );
}
