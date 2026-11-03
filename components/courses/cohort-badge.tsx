import type { CourseView } from '@/lib/courses/types';
import type { Dictionary } from '@/lib/dictionaries';
import { cn, interpolate } from '@/lib/utils';

type CohortBadgeProps = {
  course: CourseView;
  detail: Dictionary['courses']['detail'];
  className?: string;
};

export function CohortBadge({ course, detail, className }: CohortBadgeProps) {
  const full = course.seatsLeft <= 0;

  return (
    <p
      className={cn(
        'inline-flex flex-wrap items-center gap-x-3 gap-y-1.5 border border-line/70 bg-surface-sunken/60 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em]',
        className
      )}
    >
      <span className="inline-flex items-center gap-1.5 text-accent">
        <span
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-highlight"
          aria-hidden="true"
        />
        {detail.cohortEnrolling}
      </span>
      <span className="text-line" aria-hidden="true">
        ·
      </span>
      <span className="text-ink">
        {interpolate(detail.cohortStarts, { date: course.nextCohort })}
      </span>
      <span className="text-line" aria-hidden="true">
        ·
      </span>
      <span className={full ? 'text-rubric' : 'text-ink'}>
        {full
          ? detail.seatsFull
          : interpolate(detail.seatsRemaining, { count: course.seatsLeft })}
      </span>
    </p>
  );
}
