'use client';

import { useMemo, useState } from 'react';
import { CourseDrawerModal } from '@/components/courses/course-drawer-modal';
import {
  courseTracks,
  courses,
  matchesAgeFilter,
  type AgeFilter,
  type CourseId,
  type CourseTrack
} from '@/content/courses';
import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n';
import { cn, interpolate } from '@/lib/utils';

type CourseMatrixProps = {
  coursesDict: Dictionary['courses'];
  waitlist: Dictionary['waitlist'];
  locale: Locale;
};

type TrackFilter = CourseTrack | 'all';

export function CourseMatrix({ coursesDict, waitlist, locale }: CourseMatrixProps) {
  const [track, setTrack] = useState<TrackFilter>('all');
  const [age, setAge] = useState<AgeFilter>('any');
  const [selectedId, setSelectedId] = useState<CourseId | null>(null);

  const filtered = useMemo(
    () =>
      courses.filter(
        (course) =>
          (track === 'all' || course.track === track) && matchesAgeFilter(course, age)
      ),
    [track, age]
  );

  const hasFilters = track !== 'all' || age !== 'any';

  const trackOptions: { value: TrackFilter; label: string }[] = [
    { value: 'all', label: coursesDict.filters.allTracks },
    ...courseTracks.map((value) => ({ value, label: coursesDict.tracks[value] }))
  ];

  const ageOptions: { value: AgeFilter; label: string }[] = [
    { value: 'any', label: coursesDict.filters.anyAge },
    { value: 'kids', label: coursesDict.ageRanges.kids },
    { value: 'juniors', label: coursesDict.ageRanges.juniors }
  ];

  function reset() {
    setTrack('all');
    setAge('any');
  }

  return (
    <>
      <section id="courses" className="section-anchor py-20 lg:py-28">
        <div className="section-shell">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-accent">
                {coursesDict.eyebrow}
              </p>
              <h2 className="mt-4 font-serif text-4xl leading-tight text-ink md:text-5xl">
                {coursesDict.title}
              </h2>
            </div>
            <p className="max-w-2xl text-lg leading-relaxed text-ink-muted lg:col-span-6 lg:col-start-7">
              {coursesDict.intro}
            </p>
          </div>

          <div className="mt-12 flex flex-col gap-5 border-y border-line/70 py-5">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-muted">
                {coursesDict.filters.trackLabel}
              </span>
              {trackOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={track === option.value}
                  onClick={() => setTrack(option.value)}
                  className={cn(
                    'border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] transition',
                    track === option.value
                      ? 'border-accent bg-accent text-accent-ink'
                      : 'border-line/80 text-ink-muted hover:border-accent hover:text-accent'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.22em] text-ink-muted">
                {coursesDict.filters.ageLabel}
              </span>
              {ageOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={age === option.value}
                  onClick={() => setAge(option.value)}
                  className={cn(
                    'border px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] transition',
                    age === option.value
                      ? 'border-accent bg-accent text-accent-ink'
                      : 'border-line/80 text-ink-muted hover:border-accent hover:text-accent'
                  )}
                >
                  {option.label}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted">
                {interpolate(coursesDict.filters.results, { count: filtered.length })}
              </p>
              {hasFilters ? (
                <button
                  type="button"
                  onClick={reset}
                  className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent underline-offset-4 hover:underline"
                >
                  {coursesDict.filters.reset}
                </button>
              ) : null}
            </div>
          </div>

          {filtered.length > 0 ? (
            <ol className="border-b border-line/70">
              {filtered.map((course, index) => {
                const item = coursesDict.items[course.id];

                return (
                  <li key={course.id} className="border-t border-line/70">
                    <button
                      type="button"
                      onClick={() => setSelectedId(course.id)}
                      className="group grid w-full grid-cols-1 gap-2 py-6 text-left transition hover:bg-surface-sunken/60 sm:grid-cols-[2.5rem_1fr_auto] sm:items-baseline lg:grid-cols-12 lg:gap-4"
                    >
                      <span className="font-mono text-[10px] tracking-[0.2em] text-ink-muted lg:col-span-1">
                        {String(index + 1).padStart(2, '0')}
                      </span>
                      <span className="font-serif text-2xl leading-snug text-ink transition group-hover:text-accent lg:col-span-4">
                        {item.title}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted lg:col-span-2">
                        {coursesDict.tracks[course.track]} ·{' '}
                        {coursesDict.ageRanges[course.ageBracket]}
                      </span>
                      <span className="max-w-xl text-sm leading-relaxed text-ink-muted lg:col-span-4">
                        {item.description}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-accent lg:col-span-1 lg:text-right">
                        {coursesDict.syllabusCta} →
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>
          ) : (
            <div className="border-b border-line/70 py-16 text-center">
              <p className="font-serif text-2xl text-ink">{coursesDict.filters.empty}</p>
              <button
                type="button"
                onClick={reset}
                className="mt-4 font-mono text-[9px] uppercase tracking-[0.2em] text-accent underline-offset-4 hover:underline"
              >
                {coursesDict.filters.reset}
              </button>
            </div>
          )}
        </div>
      </section>

      <CourseDrawerModal
        courseId={selectedId}
        coursesDict={coursesDict}
        waitlist={waitlist}
        locale={locale}
        onClose={() => setSelectedId(null)}
      />
    </>
  );
}
