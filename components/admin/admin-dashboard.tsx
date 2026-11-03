'use client';

import { useState } from 'react';
import type { AdminCourse, AdminLead } from '@/lib/courses/admin';
import { CourseDrawer } from './course-drawer';
import { LeadsTable } from './leads-table';

type AdminDashboardProps = {
  courses: AdminCourse[];
  leads: AdminLead[];
  loadError: string | null;
};

type Tab = 'courses' | 'leads';

export function AdminDashboard({ courses, leads, loadError }: AdminDashboardProps) {
  const [tab, setTab] = useState<Tab>('courses');
  const [editing, setEditing] = useState<AdminCourse | null>(null);

  const totalSeats = courses.reduce((sum, course) => sum + course.seatsLeft, 0);

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
            ['Leads', String(leads.length)]
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
        <button
          type="button"
          aria-pressed={tab === 'courses'}
          onClick={() => setTab('courses')}
          className={
            tab === 'courses'
              ? 'border border-ink bg-ink px-4 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-surface'
              : 'border border-line/80 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted transition hover:border-ink hover:text-ink'
          }
        >
          Courses CMS
        </button>
        <button
          type="button"
          aria-pressed={tab === 'leads'}
          onClick={() => setTab('leads')}
          className={
            tab === 'leads'
              ? 'border border-ink bg-ink px-4 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-surface'
              : 'border border-line/80 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted transition hover:border-ink hover:text-ink'
          }
        >
          Admissions Leads
          {leads.length > 0 ? (
            <span className="ml-2 text-[8px]">({leads.length})</span>
          ) : null}
        </button>
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
        <div className="mt-8 border-t border-line/70">
          <div className="hidden grid-cols-[1fr_7rem_11rem_5rem_5rem] gap-4 border-b border-line/70 py-3 font-mono text-[8px] uppercase tracking-[0.2em] text-ink-muted lg:grid">
            <span>Course</span>
            <span>Track</span>
            <span>Next cohort</span>
            <span>Seats</span>
            <span className="text-right">Action</span>
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
                <button
                  type="button"
                  onClick={() => setEditing(course)}
                  className="border border-line/80 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-ink transition hover:border-accent hover:text-accent"
                >
                  [ Edit ]
                </button>
              </div>
            </div>
          ))}

          {courses.length === 0 ? (
            <p className="py-16 text-center text-sm text-ink-muted">
              No courses found. Seed the database, then reload.
            </p>
          ) : null}
        </div>
      ) : (
        <LeadsTable leads={leads} />
      )}

      {editing ? <CourseDrawer course={editing} onClose={() => setEditing(null)} /> : null}
    </main>
  );
}
