import type { Course } from '@/content/courses';
import type { Dictionary } from '@/lib/dictionaries';
import { interpolate } from '@/lib/utils';

type CourseSpecBarProps = {
  course: Course;
  courses: Dictionary['courses'];
};

export function CourseSpecBar({ course, courses }: CourseSpecBarProps) {
  const detail = courses.detail;

  const specs = [
    {
      label: detail.durationLabel,
      value: interpolate(courses.meta.weeks, { weeks: course.durationWeeks })
    },
    {
      label: detail.rhythmLabel,
      value: interpolate(courses.meta.sessions, { sessions: course.sessionsPerWeek })
    },
    {
      label: detail.levelLabel,
      value: courses.levels[course.level]
    },
    {
      label: detail.locationLabel,
      value: detail.locationValue
    }
  ];

  return (
    <dl className="grid grid-cols-2 gap-x-6 gap-y-5 border-y border-line/70 py-5 sm:grid-cols-4">
      {specs.map((spec) => (
        <div key={spec.label}>
          <dt className="font-mono text-[8px] uppercase tracking-[0.2em] text-ink-muted">
            {spec.label}
          </dt>
          <dd className="mt-1.5 text-sm text-ink">{spec.value}</dd>
        </div>
      ))}
    </dl>
  );
}
