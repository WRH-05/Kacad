import type { Metadata } from 'next';
import { AdminDashboard } from '@/components/admin/admin-dashboard';
import {
  mapAdminCourse,
  mapAdminLead,
  type AdminCourse,
  type AdminLead
} from '@/lib/courses/admin';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Dashboard'
};

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [coursesResult, leadsResult] = await Promise.all([
    supabase.from('courses').select('*').order('id'),
    supabase
      .from('waitlist_leads')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100)
  ]);

  const courses = (coursesResult.data ?? [])
    .map((row) => mapAdminCourse(row))
    .filter((course): course is AdminCourse => course !== null);

  const titleById = new Map<string, string>(
    courses.map((course) => [course.id, course.titleEn])
  );

  const leads = (leadsResult.data ?? [])
    .map((row) => mapAdminLead(row, titleById))
    .filter((lead): lead is AdminLead => lead !== null);

  const loadError = coursesResult.error?.message ?? leadsResult.error?.message ?? null;

  return <AdminDashboard courses={courses} leads={leads} loadError={loadError} />;
}
