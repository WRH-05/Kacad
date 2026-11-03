import Link from 'next/link';
import { notFound } from 'next/navigation';
import { TrackEmblem } from '@/components/brand/track-emblem';
import { CohortBadge } from '@/components/courses/cohort-badge';
import { CourseAdmissionsCard } from '@/components/courses/course-admissions-card';
import { CourseMentor } from '@/components/courses/course-mentor';
import { CourseSpecBar } from '@/components/courses/course-spec-bar';
import { CourseSyllabus } from '@/components/courses/course-syllabus';
import { OpenStudioInvite } from '@/components/courses/open-studio-invite';
import { courseIds, isCourseId } from '@/content/courses';
import { getCourseView } from '@/lib/courses-data';
import { getDictionary } from '@/lib/dictionaries';
import { isLocale, type Locale } from '@/lib/i18n';
import { routes } from '@/lib/routes';

export const revalidate = 60;

export function generateStaticParams() {
  // The [locale] layout already generates the locale params; Next merges them
  // with these slug params, producing 8 slugs × 2 locales.
  return courseIds.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!isLocale(locale) || !isCourseId(slug)) return {};

  const view = await getCourseView(locale, slug);

  if (!view) return {};

  return {
    title: { absolute: `${view.copy.title} — Kennedy Academy` },
    description: view.copy.description
  };
}

export default async function CoursePage({
  params
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  if (!isLocale(locale) || !isCourseId(slug)) {
    notFound();
  }

  const course = await getCourseView(locale, slug);
  if (!course) {
    notFound();
  }

  const dictionary = await getDictionary(locale as Locale);
  const copy = course.copy;
  const detail = dictionary.courses.detail;

  return (
    <main className="pb-24">
      <article className="section-shell pt-12 lg:pt-16">
        <nav
          aria-label={detail.breadcrumbLabel}
          className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted"
        >
          <Link
            href={routes.section(locale as Locale, 'courses')}
            className="transition hover:text-accent"
          >
            {detail.breadcrumbRoot}
          </Link>
          <span className="mx-2 text-line" aria-hidden="true">
            /
          </span>
          <span>{dictionary.courses.tracks[course.track]}</span>
          <span className="mx-2 text-line" aria-hidden="true">
            /
          </span>
          <span>{dictionary.courses.ageRanges[course.ageBracket]}</span>
        </nav>

        <header className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-3">
              <TrackEmblem track={course.track} className="h-6 w-6" />
              <p className="font-mono text-[10px] uppercase tracking-[0.24em] text-ink-muted">
                {dictionary.courses.tracks[course.track]}
              </p>
            </div>
            <h1 className="mt-5 max-w-3xl font-serif text-4xl font-light leading-[1.02] tracking-[-0.03em] text-ink sm:text-5xl lg:text-6xl">
              {copy.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink-muted">{copy.lede}</p>
            <div className="mt-6">
              <CohortBadge course={course} detail={detail} />
            </div>
          </div>

          <ul className="flex flex-wrap gap-2 lg:col-span-4 lg:justify-end">
            {copy.highlights.map((highlight) => (
              <li
                key={highlight}
                className="border border-line/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted"
              >
                {highlight}
              </li>
            ))}
          </ul>
        </header>

        <div className="mt-10">
          <CourseSpecBar course={course} courses={dictionary.courses} />
        </div>

        {course.mentor ? (
          <div className="mt-12">
            <CourseMentor mentor={course.mentor} detail={detail} />
          </div>
        ) : null}

        <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="order-2 lg:order-1 lg:col-span-7">
            <CourseSyllabus track={course.track} item={copy} courses={dictionary.courses} />
          </div>

          <div className="order-1 self-start lg:order-2 lg:col-span-5 lg:sticky lg:top-24">
            <CourseAdmissionsCard
              course={course}
              item={copy}
              courses={dictionary.courses}
              waitlist={dictionary.waitlist}
              locale={locale as Locale}
            />
          </div>
        </div>

        <div className="mt-14">
          <OpenStudioInvite course={course} detail={detail} />
        </div>

        <div className="mt-16 border-t border-line/70 pt-6">
          <Link
            href={routes.section(locale as Locale, 'courses')}
            className="inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.2em] text-accent transition hover:text-accent/80"
          >
            <span aria-hidden="true">←</span>
            {detail.backToProgrammes}
          </Link>
        </div>
      </article>
    </main>
  );
}
