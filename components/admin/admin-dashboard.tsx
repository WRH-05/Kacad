'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import type { Route } from 'next';
import type {
  AdminCourse,
  AdminLead,
  LeadCounts,
  LeadStatus
} from '@/lib/courses/admin';
import { ConfirmDialog } from './confirm-dialog';
import { LeadsTable } from './leads-table';
import { RowMenu } from './row-menu';

type AdminDashboardProps = {
  courses: AdminCourse[];
  leads: AdminLead[];
  leadCounts: LeadCounts;
  leadTotal: number;
  page: number;
  pageCount: number;
  filters: { status: LeadStatus | 'all'; course: string | null };
  tab: 'courses' | 'leads';
  loadError: string | null;
};

const tabClass = (active: boolean) =>
  active
    ? 'border border-ink bg-ink px-4 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-surface'
    : 'border border-line/80 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted transition hover:border-ink hover:text-ink';

export function AdminDashboard({
  courses,
  leads,
  leadCounts,
  leadTotal,
  page,
  pageCount,
  filters,
  tab,
  loadError
}: AdminDashboardProps) {
  const router = useRouter();
  const [deleteTarget, setDeleteTarget] = useState<AdminCourse | null>(null);
  const [deletePending, setDeletePending] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const totalSeats = courses.reduce((sum, course) => sum + course.seatsLeft, 0);

  function requestDelete(course: AdminCourse) {
    setDeleteError(null);
    setDeleteTarget(course);
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    setDeletePending(true);
    setDeleteError(null);

    try {
      const response = await fetch(
        `/api/admin/courses?id=${encodeURIComponent(deleteTarget.id)}`,
        { method: 'DELETE' }
      );
      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        code?: string;
        activeLeads?: number;
      };

      if (!response.ok || !data.ok) {
        if (data.code === 'active_leads') {
          setDeleteError(
            `This programme has ${data.activeLeads ?? 0} active lead(s) with status New or Contacted. Move them to Enrolled or Archived first.`
          );
        } else if (data.code === 'forbidden') {
          setDeleteError('You do not have permission to delete programmes.');
        } else if (data.code === 'not_found') {
          setDeleteTarget(null);
          router.refresh();
        } else {
          setDeleteError('Could not delete this programme. Try again.');
        }
        setDeletePending(false);
        return;
      }

      setDeleteTarget(null);
      setDeletePending(false);
      router.refresh();
    } catch {
      setDeleteError('Network error. Check your connection and try again.');
      setDeletePending(false);
    }
  }

  return (
    <main className="section-shell py-10 lg:py-14">
      <div className="flex flex-col gap-8 border-b border-line/70 pb-7 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-ink-muted">
            Operations
          </p>
          <h1 className="mt-2 font-serif text-4xl leading-tight text-ink">
            Course &amp; admissions desk
          </h1>
        </div>

        <dl className="flex flex-wrap gap-x-10 gap-y-4">
          {[
            ['Courses', String(courses.length)],
            ['Seats left', String(totalSeats)],
            ['Leads', String(leadTotal)]
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="font-mono text-[8px] uppercase tracking-[0.2em] text-ink-muted">
                {label}
              </dt>
              <dd className="mt-1 font-serif text-3xl leading-none text-ink">{value}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/admin" aria-current={tab === 'courses' ? 'page' : undefined} className={tabClass(tab === 'courses')}>
          Courses CMS
        </Link>
        <Link
          href={{ pathname: '/admin', query: { tab: 'leads' } }}
          aria-current={tab === 'leads' ? 'page' : undefined}
          className={tabClass(tab === 'leads')}
        >
          Admissions Leads
          {leadTotal > 0 ? <span className="ml-2 text-[8px]">({leadTotal})</span> : null}
        </Link>
      </div>

      {loadError ? (
        <p
          role="alert"
          className="mt-6 border border-rubric/40 bg-rubric/5 px-4 py-3 text-xs leading-relaxed text-rubric"
        >
          Could not load admin data: {loadError}
        </p>
      ) : null}

      {tab === 'courses' ? (
        <>
          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line/70 pt-5">
            <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted">
              {courses.length} programme{courses.length === 1 ? '' : 's'}
            </p>
            <Link
              href="/admin/courses/new"
              className="bg-ink px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.18em] text-surface transition hover:bg-ink/90"
            >
              [ + Add New Programme ]
            </Link>
          </div>

          <div className="mt-5 border-t border-line/70">
            <div className="hidden grid-cols-[1fr_7rem_11rem_5rem_5rem] gap-4 border-b border-line/70 py-3 font-mono text-[8px] uppercase tracking-[0.2em] text-ink-muted lg:grid">
              <span>Course</span>
              <span>Track</span>
              <span>Next cohort</span>
              <span>Seats</span>
              <span className="text-right">Actions</span>
            </div>

            {courses.map((course) => (
              <div
                key={course.id}
                className="grid gap-2 border-b border-line/70 py-4 lg:grid-cols-[1fr_7rem_11rem_5rem_5rem] lg:items-center lg:gap-4"
              >
                <div>
                  <p className="font-serif text-xl leading-snug text-ink">{course.titleEn}</p>
                  <p className="mt-0.5 font-mono text-[8px] uppercase tracking-[0.16em] text-ink-muted">
                    {course.id}
                  </p>
                </div>
                <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">
                  {course.track}
                </p>
                <p className="text-sm text-ink">{course.nextCohortEn || '—'}</p>
                <p
                  className={
                    course.seatsLeft <= 2
                      ? 'font-mono text-[11px] text-rubric'
                      : 'font-mono text-[11px] text-ink'
                  }
                >
                  {course.seatsLeft}
                </p>
                <div className="lg:text-right">
                  <RowMenu
                    label={`Actions for ${course.titleEn}`}
                    items={[
                      {
                        label: 'Edit Programme',
                        onSelect: () =>
                          router.push(`/admin/courses/${course.id}/edit` as Route)
                      },
                      {
                        label: 'Delete Programme',
                        destructive: true,
                        onSelect: () => requestDelete(course)
                      }
                    ]}
                  />
                </div>
              </div>
            ))}

            {courses.length === 0 ? (
              <div className="py-16 text-center">
                <p className="font-serif text-2xl text-ink">No programmes yet.</p>
                <p className="mt-2 text-sm text-ink-muted">
                  Add the first programme to publish it across the site.
                </p>
                <Link
                  href="/admin/courses/new"
                  className="mt-5 inline-block bg-ink px-4 py-2.5 font-mono text-[9px] uppercase tracking-[0.18em] text-surface transition hover:bg-ink/90"
                >
                  [ + Add New Programme ]
                </Link>
              </div>
            ) : null}
          </div>
        </>
      ) : (
        <LeadsTable
          leads={leads}
          counts={leadCounts}
          total={leadCounts[filters.status]}
          page={page}
          pageCount={pageCount}
          filters={filters}
          courses={courses}
          totalLeads={leadTotal}
        />
      )}

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
            setDeleteError(null);
          }
        }}
        title="Delete programme"
        confirmLabel="Delete Permanently"
        destructive
        pending={deletePending}
        error={deleteError}
        onConfirm={confirmDelete}
      >
        {deleteTarget ? (
          <>
            Are you sure you want to permanently delete{' '}
            <strong className="text-ink">{deleteTarget.titleEn}</strong>? This will remove the
            course from the public site, the Mega-Menu, and the database. This action cannot be
            undone.
          </>
        ) : null}
      </ConfirmDialog>
    </main>
  );
}
