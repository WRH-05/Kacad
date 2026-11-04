'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { WhatsAppIcon } from '@/components/ui/whatsapp-icon';
import type { AdminLead } from '@/lib/courses/admin';
import { isLocale } from '@/lib/i18n';
import { leadContactAction } from '@/lib/leads';
import { routes } from '@/lib/routes';
import { SideDrawer } from './side-drawer';

const ageLabels: Record<string, string> = {
  kids: 'Junior Fellows · 7–11',
  juniors: 'Junior Fellows · 12–17',
  adults: 'Adults · 18+'
};

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="grid gap-1 py-3 sm:grid-cols-[8rem_1fr] sm:gap-4">
      <dt className="font-mono text-[8px] uppercase tracking-[0.2em] text-ink-muted">{label}</dt>
      <dd className="text-sm leading-relaxed text-ink">{children}</dd>
    </div>
  );
}

export function LeadDrawer({ lead, onClose }: { lead: AdminLead; onClose: () => void }) {
  const action = leadContactAction(lead.contact, lead.name);
  const locale = isLocale(lead.locale) ? lead.locale : 'en';
  const courseHref = lead.courseId ? routes.course(locale, lead.courseId) : null;

  return (
    <SideDrawer
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      title={lead.name}
      description={`${lead.courseTitle} · ${lead.ageGroup}`}
    >
      <dl className="divide-y divide-line/70 border-y border-line/70">
        <Row label="Contact">
          <span className="break-all font-mono text-sm">{lead.contact}</span>
        </Row>
        <Row label="Course">
          {courseHref ? (
            <Link
              href={courseHref}
              target="_blank"
              rel="noreferrer"
              className="text-accent transition hover:opacity-70"
            >
              {lead.courseTitle} ↗
            </Link>
          ) : (
            lead.courseTitle
          )}
        </Row>
        <Row label="Profile">{ageLabels[lead.ageGroup] ?? lead.ageGroup}</Row>
        <Row label="Language">{isLocale(lead.locale) ? lead.locale.toUpperCase() : lead.locale}</Row>
        <Row label="Received">{lead.createdAt}</Row>
      </dl>

      <div className="mt-6">
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted">
          Notes / message
        </p>
        <p className="mt-2 whitespace-pre-wrap border border-line/70 bg-surface-sunken/60 p-4 text-sm leading-relaxed text-ink">
          {lead.notes?.trim() || 'No note submitted.'}
        </p>
      </div>

      {action ? (
        <a
          href={action.href}
          target={action.kind === 'whatsapp' ? '_blank' : undefined}
          rel="noreferrer"
          className={
            action.kind === 'whatsapp'
              ? 'mt-6 inline-flex items-center gap-3 border border-ink bg-ink px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-surface transition hover:bg-ink/90'
              : 'mt-6 inline-flex items-center gap-3 border border-line/80 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-ink transition hover:border-accent hover:text-accent'
          }
        >
          {action.kind === 'whatsapp' ? (
            <WhatsAppIcon className="h-5 w-5 text-[#25D366]" />
          ) : null}
          [ {action.label} ]
        </a>
      ) : null}
    </SideDrawer>
  );
}
