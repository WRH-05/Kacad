'use client';

import { useState } from 'react';
import type { AdminLead } from '@/lib/courses/admin';
import { LeadDrawer } from './lead-drawer';

export function LeadsTable({ leads }: { leads: AdminLead[] }) {
  const [selected, setSelected] = useState<AdminLead | null>(null);

  if (leads.length === 0) {
    return (
      <div className="mt-8 border border-line/70 py-16 text-center">
        <p className="font-serif text-2xl text-ink">No leads yet.</p>
        <p className="mt-2 text-sm text-ink-muted">
          Syllabus requests from the course pages will appear here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mt-8 border-t border-line/70">
        <div className="hidden grid-cols-[9rem_11rem_1fr_5rem_10rem_6rem] gap-4 border-b border-line/70 py-3 font-mono text-[8px] uppercase tracking-[0.2em] text-ink-muted lg:grid">
          <span>Name</span>
          <span>Contact</span>
          <span>Course</span>
          <span>Age</span>
          <span>Received</span>
          <span className="text-right">Details</span>
        </div>

        {leads.map((lead) => (
          <button
            key={lead.id}
            type="button"
            onClick={() => setSelected(lead)}
            className="grid w-full gap-2 border-b border-line/70 py-4 text-left transition hover:bg-surface-sunken/60 lg:grid-cols-[9rem_11rem_1fr_5rem_10rem_6rem] lg:items-center lg:gap-4"
          >
            <span className="font-serif text-lg leading-snug text-ink">{lead.name}</span>
            <span className="break-all font-mono text-[10px] leading-relaxed text-ink">
              {lead.contact}
            </span>
            <span className="text-sm leading-relaxed text-ink-muted">{lead.courseTitle}</span>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">
              {lead.ageGroup}
            </span>
            <span className="font-mono text-[9px] tracking-[0.06em] text-ink-muted">
              {lead.createdAt}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-accent lg:text-right">
              View →
            </span>
          </button>
        ))}
      </div>

      {selected ? (
        <LeadDrawer lead={selected} onClose={() => setSelected(null)} />
      ) : null}
    </>
  );
}
