'use client';

import { useEffect, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { WaitlistForm } from '@/components/forms/waitlist-form';
import { courses, type CourseId } from '@/content/courses';
import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n';
import { interpolate } from '@/lib/utils';

type CourseDrawerModalProps = {
  courseId: CourseId | null;
  coursesDict: Dictionary['courses'];
  waitlist: Dictionary['waitlist'];
  locale: Locale;
  onClose: () => void;
};

export function CourseDrawerModal({
  courseId,
  coursesDict,
  waitlist,
  locale,
  onClose
}: CourseDrawerModalProps) {
  // Keep the last course mounted while Radix plays its closing animation.
  const [lastId, setLastId] = useState<CourseId | null>(courseId);

  useEffect(() => {
    if (courseId) setLastId(courseId);
  }, [courseId]);

  const activeId = courseId ?? lastId;

  if (!activeId) return null;

  const course = courses.find((entry) => entry.id === activeId);
  if (!course) return null;

  const item = coursesDict.items[activeId];

  return (
    <Dialog.Root
      open={courseId !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[60] bg-ink/60 backdrop-blur-sm data-[state=closed]:animate-[overlay-out_150ms_ease-in] data-[state=open]:animate-[overlay-in_200ms_ease-out] motion-reduce:animate-none" />
        <Dialog.Content className="fixed inset-y-0 right-0 z-[70] w-full max-w-xl overflow-y-auto border-l border-line/70 bg-surface p-6 shadow-drawer data-[state=closed]:animate-[drawer-out_180ms_ease-in] data-[state=open]:animate-[drawer-in_240ms_ease-out] motion-reduce:animate-none sm:p-8">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">
                {coursesDict.tracks[course.track]} / {coursesDict.ageRanges[course.ageBracket]}
              </p>
              <Dialog.Title className="mt-3 font-serif text-3xl leading-tight text-ink sm:text-4xl">
                {item.title}
              </Dialog.Title>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={waitlist.close}
                className="flex h-9 w-9 shrink-0 items-center justify-center border border-line/70 text-lg text-ink-muted transition hover:border-accent hover:text-accent"
              >
                <span aria-hidden="true">×</span>
              </button>
            </Dialog.Close>
          </div>

          <Dialog.Description className="mt-4 text-base leading-relaxed text-ink-muted">
            {item.lede}
          </Dialog.Description>

          <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-y border-line/70 py-4 text-xs sm:grid-cols-4">
            <div>
              <dt className="font-mono text-[8px] uppercase tracking-[0.2em] text-ink-muted">
                {coursesDict.filters.trackLabel}
              </dt>
              <dd className="mt-1 text-ink">{coursesDict.tracks[course.track]}</dd>
            </div>
            <div>
              <dt className="font-mono text-[8px] uppercase tracking-[0.2em] text-ink-muted">
                {coursesDict.filters.ageLabel}
              </dt>
              <dd className="mt-1 text-ink">{coursesDict.ageRanges[course.ageBracket]}</dd>
            </div>
            <div>
              <dt className="font-mono text-[8px] uppercase tracking-[0.2em] text-ink-muted">
                {coursesDict.meta.levelLabel}
              </dt>
              <dd className="mt-1 text-ink">{coursesDict.levels[course.level]}</dd>
            </div>
            <div>
              <dt className="font-mono text-[8px] uppercase tracking-[0.2em] text-ink-muted">
                {coursesDict.meta.durationLabel}
              </dt>
              <dd className="mt-1 text-ink">
                {interpolate(coursesDict.meta.weeks, { weeks: course.durationWeeks })} ·{' '}
                {interpolate(coursesDict.meta.sessions, {
                  sessions: course.sessionsPerWeek
                })}
              </dd>
            </div>
          </dl>

          <div className="mt-5 flex flex-wrap gap-2">
            {item.highlights.map((highlight) => (
              <span
                key={highlight}
                className="border border-line/70 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-ink-muted"
              >
                {highlight}
              </span>
            ))}
          </div>

          <section className="mt-8 border-t border-line/70 pt-6">
            <h3 className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">
              {coursesDict.outcomesLabel}
            </h3>
            <ul className="mt-4 space-y-3">
              {item.outcomes.map((outcome) => (
                <li key={outcome} className="flex gap-3 text-sm leading-relaxed text-ink-muted">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-highlight" aria-hidden="true" />
                  {outcome}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-8 border-t border-line/70 pt-6">
            <h3 className="font-mono text-[9px] uppercase tracking-[0.22em] text-accent">
              {coursesDict.modulesLabel}
            </h3>
            <ol className="mt-4 border-y border-line/60">
              {item.modules.map((module, index) => (
                <li
                  key={module}
                  className="flex gap-4 border-b border-line/60 py-3 text-sm leading-relaxed text-ink last:border-b-0"
                >
                  <span className="font-mono text-[10px] text-accent">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <span>{module}</span>
                </li>
              ))}
            </ol>
          </section>

          <section className="mt-8 border-t border-line/70 pt-6">
            <h3 className="font-serif text-2xl text-ink">{waitlist.title}</h3>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">{waitlist.subtitle}</p>
            <div className="mt-5">
              <WaitlistForm
                key={activeId}
                courseId={activeId}
                courseLabel={item.title}
                labels={waitlist}
                locale={locale}
              />
            </div>
          </section>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
