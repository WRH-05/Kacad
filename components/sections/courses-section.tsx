'use client';

import { useState } from 'react';
import { CourseRegistrationModal } from '@/components/course-registration-modal';
import { courses, type CourseId } from '@/content/courses';
import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n';

type CoursesSectionProps = {
  locale: Locale;
  coursesDict: Dictionary['courses'];
  registration: Dictionary['registration'];
};

const categoryColors: Record<string, string> = {
  STEM: 'bg-navy/8 text-navy',
  Languages: 'bg-terracotta/10 text-terracotta',
  Creative: 'bg-gold/15 text-navy'
};

export function CoursesSection({ locale, coursesDict, registration }: CoursesSectionProps) {
  const [selectedCourse, setSelectedCourse] = useState<{
    id: CourseId;
    name: string;
  } | null>(null);

  return (
    <>
      <section id="courses" className="section-anchor py-20 lg:py-28">
        <div className="section-shell">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-terracotta">
              Kennedy School
            </p>
            <h2 className="mt-3 font-display text-3xl font-semibold text-ink md:text-4xl">
              {coursesDict.title}
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-slate-600">{coursesDict.intro}</p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course, index) => {
              const item = coursesDict.items[course.id];
              const ageLabel = coursesDict.ageRanges[course.ageRangeKey];
              const categoryLabel = coursesDict.categories[course.category];
              const isWide = index === 0 || index === 4;

              return (
                <article
                  key={course.id}
                  className={`group flex flex-col rounded-2xl border border-navy/8 bg-white p-6 shadow-card transition hover:-translate-y-1 hover:shadow-soft ${
                    isWide ? 'sm:col-span-2 lg:col-span-1' : ''
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${categoryColors[course.category]}`}
                    >
                      {categoryLabel}
                    </span>
                    <span className="text-xs font-medium text-slate-500">{ageLabel}</span>
                  </div>

                  <h3 className="mt-4 font-display text-xl font-semibold text-navy">{item.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
                    {item.description}
                  </p>

                  {course.tags ? (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {course.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-md bg-sand px-2 py-0.5 text-xs font-medium text-slate-600"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  ) : null}

                  <button
                    type="button"
                    onClick={() => setSelectedCourse({ id: course.id, name: item.title })}
                    className="mt-6 w-full rounded-full border border-navy/15 bg-cream px-4 py-2.5 text-sm font-semibold text-navy transition group-hover:border-navy/25 group-hover:bg-navy group-hover:text-white"
                  >
                    {coursesDict.register}
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <CourseRegistrationModal
        locale={locale}
        registration={registration}
        courseId={selectedCourse?.id ?? null}
        courseName={selectedCourse?.name ?? ''}
        open={selectedCourse !== null}
        onClose={() => setSelectedCourse(null)}
      />
    </>
  );
}
