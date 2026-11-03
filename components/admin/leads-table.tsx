'use client';

import type { AdminLead } from '@/lib/courses/admin';

type ContactAction = {
  href: string;
  label: string;
};

function contactAction(contact: string): ContactAction | null {
  const trimmed = contact.trim();

  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
    return { href: `mailto:${trimmed}`, label: 'Email ↗' };
  }

  let digits = trimmed.replace(/[^\d]/g, '');

  if (!digits) return null;
  if (digits.startsWith('00')) digits = digits.slice(2);
  if (digits.startsWith('0')) digits = `213${digits.slice(1)}`;

  return { href: `https://wa.me/${digits}`, label: 'Open WhatsApp Chat ↗' };
}

export function LeadsTable({ leads }: { leads: AdminLead[] }) {
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
    <div className="mt-8 border-t border-line/70">
      <div className="hidden grid-cols-[9rem_11rem_1fr_5rem_10rem_11rem] gap-4 border-b border-line/70 py-3 font-mono text-[8px] uppercase tracking-[0.2em] text-ink-muted lg:grid">
        <span>Name</span>
        <span>Contact</span>
        <span>Course</span>
        <span>Age</span>
        <span>Received</span>
        <span className="text-right">Action</span>
      </div>

      {leads.map((lead) => {
        const action = contactAction(lead.contact);

        return (
          <div
            key={lead.id}
            className="grid gap-2 border-b border-line/70 py-4 lg:grid-cols-[9rem_11rem_1fr_5rem_10rem_11rem] lg:items-center lg:gap-4"
          >
            <p className="font-serif text-lg leading-snug text-ink">{lead.name}</p>
            <p className="break-all font-mono text-[10px] leading-relaxed text-ink">
              {lead.contact}
            </p>
            <p className="text-sm leading-relaxed text-ink-muted">{lead.courseTitle}</p>
            <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">
              {lead.ageGroup}
            </p>
            <p className="font-mono text-[9px] tracking-[0.06em] text-ink-muted">{lead.createdAt}</p>
            <div className="lg:text-right">
              {action ? (
                <a
                  href={action.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-block border border-line/80 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.14em] text-ink transition hover:border-accent hover:text-accent"
                >
                  [ {action.label} ]
                </a>
              ) : (
                <span className="font-mono text-[9px] text-ink-muted">—</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
