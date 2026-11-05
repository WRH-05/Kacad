'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  buildAdminQuery,
  defaultDirForSort,
  hrefFor,
  toggleLeadSort,
  type LeadFilters,
  type LeadSortKey
} from '@/lib/admin/lead-filters';
import type { AdminCourse, AdminLead, LeadCounts, LeadStatus } from '@/lib/courses/admin';
import { ConfirmDialog } from './confirm-dialog';
import { LeadDrawer } from './lead-drawer';
import { LeadTimeFilter } from './lead-time-filter';
import { LeadsLiveSync } from './leads-live-sync';
import { RowMenu } from './row-menu';
import { SortGlyph } from './sort-glyph';

type LeadsTableProps = {
  leads: AdminLead[];
  counts: LeadCounts;
  total: number;
  page: number;
  pageCount: number;
  filters: LeadFilters;
  courses: AdminCourse[];
  totalLeads: number;
};

const PAGE_SIZE = 20;

const statusTabs: { value: LeadStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'enrolled', label: 'Enrolled' },
  { value: 'archived', label: 'Archived' }
];

const statusStyles: Record<LeadStatus, string> = {
  new: 'border-accent/40 text-accent',
  contacted: 'border-highlight/70 text-highlight-ink',
  enrolled: 'border-ink bg-ink text-surface',
  archived: 'border-line text-ink-muted'
};

function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span
      className={`inline-flex border px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.16em] ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}

function sortAriaLabel(key: LeadSortKey, label: string, filters: LeadFilters) {
  const active = filters.sort.key === key;
  const nextDir = active ? (filters.sort.dir === 'asc' ? 'desc' : 'asc') : defaultDirForSort(key);

  return `Sort by ${label} ${nextDir === 'asc' ? 'ascending' : 'descending'}`;
}

export function LeadsTable({
  leads,
  counts,
  total,
  page,
  pageCount,
  filters,
  courses,
  totalLeads
}: LeadsTableProps) {
  const router = useRouter();
  const [selected, setSelected] = useState<AdminLead | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminLead | null>(null);
  const [deletePending, setDeletePending] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const paused = selected !== null || menuOpen || deleteTarget !== null;
  const start = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end = Math.min(page * PAGE_SIZE, total);

  async function updateStatus(lead: AdminLead, status: LeadStatus) {
    setPendingId(lead.id);
    setActionError(null);

    try {
      const response = await fetch('/api/admin/leads', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ id: lead.id, status })
      });
      const data = (await response.json().catch(() => ({}))) as { ok?: boolean };

      if (!response.ok || !data.ok) {
        setActionError('Could not update this lead. Try again.');
      } else {
        router.refresh();
      }
    } catch {
      setActionError('Network error. Check your connection and try again.');
    } finally {
      setPendingId(null);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;

    setDeletePending(true);
    setDeleteError(null);

    try {
      const response = await fetch(
        `/api/admin/leads?id=${encodeURIComponent(deleteTarget.id)}`,
        { method: 'DELETE' }
      );
      const data = (await response.json().catch(() => ({}))) as { ok?: boolean };

      if (!response.ok || !data.ok) {
        setDeleteError('Could not delete this lead. Try again.');
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
    <>
      <LeadsLiveSync paused={paused} />

      <div className="mt-8 border-t border-line/70 pt-5">
        <div className="flex flex-wrap gap-2">
          {statusTabs.map((tab) => {
            const active = filters.status === tab.value;

            return (
              <Link
                key={tab.value}
                href={hrefFor(buildAdminQuery({ ...filters, status: tab.value }, 1))}
                scroll={false}
                aria-current={active ? 'page' : undefined}
                className={
                  active
                    ? 'border border-ink bg-ink px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-surface'
                    : 'border border-line/80 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted transition hover:border-ink hover:text-ink'
                }
              >
                {tab.label}
                <span className="ml-2 text-[8px] opacity-70">{counts[tab.value]}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">
              Course
              <select
                value={filters.course ?? ''}
                onChange={(event) => {
                  const course = event.target.value || null;
                  router.push(hrefFor(buildAdminQuery({ ...filters, course }, 1)));
                }}
                className="border border-line/80 bg-surface px-2 py-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-ink focus:border-accent focus:ring-accent/20"
              >
                <option value="">All courses</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.titleEn}
                  </option>
                ))}
                {filters.course && !courses.some((course) => course.id === filters.course) ? (
                  <option value={filters.course}>{filters.course}</option>
                ) : null}
              </select>
            </label>

            <LeadTimeFilter filters={filters} />
          </div>

          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">
            {total === 0 ? 'No leads' : `Showing ${start}–${end} of ${total}`}
          </p>
        </div>
      </div>

      {actionError ? (
        <p
          role="alert"
          className="mt-4 border border-rubric/40 bg-rubric/5 px-3 py-2 text-xs leading-relaxed text-rubric"
        >
          {actionError}
        </p>
      ) : null}

      {leads.length === 0 ? (
        <div className="mt-6 border border-line/70 py-16 text-center">
          <p className="font-serif text-2xl text-ink">
            {totalLeads === 0
              ? filters.time.preset === 'all'
                ? 'No leads yet.'
                : 'No leads in this period.'
              : 'No leads match these filters.'}
          </p>
          <p className="mt-2 text-sm text-ink-muted">
            {totalLeads === 0
              ? filters.time.preset === 'all'
                ? 'Syllabus requests from the course pages will appear here.'
                : 'Try a wider time range.'
              : 'Try another status, course or time range.'}
          </p>
          {totalLeads > 0 ? (
            <Link
              href={hrefFor({ tab: 'leads' })}
              className="mt-5 inline-block border border-line/80 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-ink transition hover:border-ink"
            >
              Clear filters
            </Link>
          ) : null}
        </div>
      ) : (
        <div className="mt-6 border-t border-line/70">
          <div className="hidden grid-cols-[9rem_11rem_1fr_6rem_9rem_2.5rem] gap-4 border-b border-line/70 py-3 font-mono text-xs uppercase tracking-wider text-ink-muted lg:grid">
            <Link
              href={hrefFor(
                buildAdminQuery(
                  { ...filters, sort: toggleLeadSort(filters.sort, 'name') },
                  page
                )
              )}
              scroll={false}
              replace
              aria-label={sortAriaLabel('name', 'name', filters)}
              className="inline-flex items-center gap-1 transition hover:text-ink"
            >
              Name <SortGlyph active={filters.sort.key === 'name'} dir={filters.sort.dir} />
            </Link>
            <span>Contact</span>
            <span>Course</span>
            <span>Status</span>
            <Link
              href={hrefFor(
                buildAdminQuery(
                  { ...filters, sort: toggleLeadSort(filters.sort, 'received') },
                  page
                )
              )}
              scroll={false}
              replace
              aria-label={sortAriaLabel('received', 'received date', filters)}
              className="inline-flex items-center gap-1 transition hover:text-ink"
            >
              Received{' '}
              <SortGlyph
                active={filters.sort.key === 'received'}
                dir={filters.sort.dir}
              />
            </Link>
            <span className="text-right">Actions</span>
          </div>

          {leads.map((lead) => (
            <div
              key={lead.id}
              className="grid w-full gap-2 border-b border-line/70 py-4 lg:grid-cols-[9rem_11rem_1fr_6rem_9rem_2.5rem] lg:items-center lg:gap-4"
            >
              <button
                type="button"
                onClick={() => setSelected(lead)}
                className="grid w-full gap-2 text-left transition hover:bg-surface-sunken/60 lg:col-span-5 lg:grid-cols-[9rem_11rem_1fr_6rem_9rem] lg:items-center lg:gap-4"
              >
                <span className="font-serif text-lg leading-snug text-ink">{lead.name}</span>
                <span className="break-all font-mono text-[10px] leading-relaxed text-ink">
                  {lead.contact}
                </span>
                <span className="text-sm leading-relaxed text-ink-muted">{lead.courseTitle}</span>
                <span>
                  <StatusBadge status={lead.status} />
                </span>
                <span className="font-mono text-[9px] tracking-[0.06em] text-ink-muted">
                  {lead.createdAt}
                </span>
              </button>

              <div className="lg:text-right">
                <RowMenu
                  label={`Actions for ${lead.name}`}
                  onOpenChange={setMenuOpen}
                  items={[
                    {
                      label: 'Mark as Contacted',
                      disabled: pendingId === lead.id || lead.status === 'contacted',
                      onSelect: () => updateStatus(lead, 'contacted')
                    },
                    {
                      label: 'Mark as Enrolled',
                      disabled: pendingId === lead.id || lead.status === 'enrolled',
                      onSelect: () => updateStatus(lead, 'enrolled')
                    },
                    {
                      label: 'Mark as Archived',
                      disabled: pendingId === lead.id || lead.status === 'archived',
                      onSelect: () => updateStatus(lead, 'archived')
                    },
                    {
                      label: 'Delete Lead',
                      destructive: true,
                      disabled: pendingId === lead.id,
                      onSelect: () => {
                        setDeleteError(null);
                        setDeleteTarget(lead);
                      }
                    }
                  ]}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {pageCount > 1 ? (
        <div className="mt-6 flex items-center justify-between gap-4">
          {page > 1 ? (
            <Link
              href={hrefFor(buildAdminQuery(filters, page - 1))}
              scroll={false}
              className="border border-line/80 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-ink transition hover:border-ink"
            >
              ← Previous
            </Link>
          ) : (
            <span className="border border-line/40 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted/50">
              ← Previous
            </span>
          )}

          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">
            Page {page} of {pageCount}
          </span>

          {page < pageCount ? (
            <Link
              href={hrefFor(buildAdminQuery(filters, page + 1))}
              scroll={false}
              className="border border-line/80 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-ink transition hover:border-ink"
            >
              Next →
            </Link>
          ) : (
            <span className="border border-line/40 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted/50">
              Next →
            </span>
          )}
        </div>
      ) : null}

      {selected ? (
        <LeadDrawer
          lead={selected}
          onClose={() => setSelected(null)}
          onUpdated={() => router.refresh()}
        />
      ) : null}

      <ConfirmDialog
        open={deleteTarget !== null}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteTarget(null);
            setDeleteError(null);
          }
        }}
        title="Delete lead"
        confirmLabel="Delete Lead"
        destructive
        pending={deletePending}
        error={deleteError}
        onConfirm={confirmDelete}
      >
        {deleteTarget ? (
          <>
            Permanently delete the lead from{' '}
            <strong className="text-ink">{deleteTarget.name}</strong>? This removes their contact
            details and notes from the CRM. This action cannot be undone.
          </>
        ) : null}
      </ConfirmDialog>
    </>
  );
}
