import { whatsappHref } from '@/content/contact';
import type { CourseView } from '@/lib/courses/types';
import type { Dictionary } from '@/lib/dictionaries';
import { interpolate } from '@/lib/utils';

type OpenStudioInviteProps = {
  course: CourseView;
  detail: Dictionary['courses']['detail'];
};

export function OpenStudioInvite({ course, detail }: OpenStudioInviteProps) {
  const href = whatsappHref(
    interpolate(detail.openStudioPrefill, { course: course.copy.title })
  );

  return (
    <section className="border border-line/70 bg-surface-sunken/60 p-6 sm:p-8">
      <div className="grid gap-6 sm:grid-cols-12 sm:items-end">
        <div className="sm:col-span-8">
          <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-accent">
            {detail.openStudioEyebrow}
          </p>
          <h2 className="mt-3 font-serif text-3xl leading-tight text-ink">
            {detail.openStudioTitle}
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-relaxed text-ink-muted">
            {detail.openStudioBody}
          </p>
        </div>

        <div className="sm:col-span-4 sm:text-right">
          <p className="font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted">
            {course.schedule}
          </p>
          <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex items-center justify-center gap-3 bg-accent px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-accent-ink transition hover:bg-accent/90"
          >
            <span aria-hidden="true" className="text-accent-ink/50">
              [
            </span>
            <span>{detail.openStudioCta}</span>
            <span aria-hidden="true">↗</span>
            <span aria-hidden="true" className="text-accent-ink/50">
              ]
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
