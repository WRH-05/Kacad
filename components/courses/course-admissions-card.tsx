import { WaitlistForm } from '@/components/forms/waitlist-form';
import { whatsappHref } from '@/content/contact';
import type { Course, CourseId } from '@/content/courses';
import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n';
import { interpolate } from '@/lib/utils';

type CourseAdmissionsCardProps = {
  course: Course;
  item: Dictionary['courses']['items'][CourseId];
  courses: Dictionary['courses'];
  waitlist: Dictionary['waitlist'];
  locale: Locale;
};

export function CourseAdmissionsCard({
  course,
  item,
  courses,
  waitlist,
  locale
}: CourseAdmissionsCardProps) {
  const detail = courses.detail;

  return (
    <aside className="rounded-none border border-line bg-surface p-6 sm:p-8">
      <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">
        {courses.tracks[course.track]} · {courses.ageRanges[course.ageBracket]}
      </p>
      <h2 className="mt-3 font-serif text-2xl leading-tight text-ink">
        {detail.admissionsTitle}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-muted">{detail.admissionsIntro}</p>

      <div className="mt-6">
        <WaitlistForm
          courseId={course.id}
          courseLabel={item.title}
          labels={waitlist}
          locale={locale}
          submitLabel={detail.submitLabel}
          hideCourseField
          autoDownload
        />
      </div>

      <a
        href={whatsappHref(interpolate(detail.whatsappPrefill, { course: item.title }))}
        target="_blank"
        rel="noreferrer"
        className="mt-6 flex items-center justify-between gap-4 border border-line/70 px-4 py-3 font-mono text-[9px] uppercase tracking-[0.18em] text-ink transition hover:border-accent hover:text-accent"
      >
        {detail.whatsappCta}
        <span aria-hidden="true">↗</span>
      </a>
    </aside>
  );
}
