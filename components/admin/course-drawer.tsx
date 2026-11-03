'use client';

import { useEffect, useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import type { AdminCourse } from '@/lib/courses/admin';
import { createClient } from '@/lib/supabase/client';

type CourseDrawerProps = {
  course: AdminCourse;
  onClose: () => void;
};

const inputClass =
  'w-full border border-line/80 bg-surface-raised px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 focus:border-accent focus:ring-accent/20';
const labelClass =
  'mb-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted';

function LocalizedField(props: {
  id: string;
  label: string;
  en: string;
  fr: string;
  onEn: (value: string) => void;
  onFr: (value: string) => void;
  multiline?: boolean;
  rows?: number;
}) {
  const { id, label, en, fr, onEn, onFr, multiline = false, rows = 3 } = props;

  return (
    <fieldset>
      <legend className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink">
        {label}
      </legend>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor={`${id}-en`} className={labelClass}>
            EN
          </label>
          {multiline ? (
            <textarea
              id={`${id}-en`}
              rows={rows}
              value={en}
              onChange={(event) => onEn(event.target.value)}
              className={inputClass}
            />
          ) : (
            <input
              id={`${id}-en`}
              type="text"
              value={en}
              onChange={(event) => onEn(event.target.value)}
              className={inputClass}
            />
          )}
        </div>
        <div>
          <label htmlFor={`${id}-fr`} className={labelClass}>
            FR
          </label>
          {multiline ? (
            <textarea
              id={`${id}-fr`}
              rows={rows}
              value={fr}
              onChange={(event) => onFr(event.target.value)}
              className={inputClass}
            />
          ) : (
            <input
              id={`${id}-fr`}
              type="text"
              value={fr}
              onChange={(event) => onFr(event.target.value)}
              className={inputClass}
            />
          )}
        </div>
      </div>
    </fieldset>
  );
}

export function CourseDrawer({ course, onClose }: CourseDrawerProps) {
  const router = useRouter();

  const [titleEn, setTitleEn] = useState(course.titleEn);
  const [titleFr, setTitleFr] = useState(course.titleFr);
  const [descriptionEn, setDescriptionEn] = useState(course.descriptionEn);
  const [descriptionFr, setDescriptionFr] = useState(course.descriptionFr);
  const [cohortEn, setCohortEn] = useState(course.nextCohortEn);
  const [cohortFr, setCohortFr] = useState(course.nextCohortFr);
  const [scheduleEn, setScheduleEn] = useState(course.scheduleEn);
  const [scheduleFr, setScheduleFr] = useState(course.scheduleFr);
  const [seats, setSeats] = useState(String(course.seatsLeft));
  const [file, setFile] = useState<File | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose();
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const seatsNumber = Number(seats);

    if (!Number.isInteger(seatsNumber) || seatsNumber < 0 || seatsNumber > 999) {
      setError('Seats left must be a whole number between 0 and 999.');
      return;
    }

    setPending(true);

    try {
      let brochureUrl = course.brochureUrl;

      if (file) {
        const isPdf =
          file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');

        if (!isPdf) {
          setError('Choose a PDF file.');
          setPending(false);
          return;
        }

        if (file.size > 10 * 1024 * 1024) {
          setError('The PDF must be 10 MB or smaller.');
          setPending(false);
          return;
        }

        const supabase = createClient();
        const {
          data: { user }
        } = await supabase.auth.getUser();

        if (!user) {
          setError('Your session expired. Sign in again.');
          setPending(false);
          return;
        }

        const path = `${course.id}/syllabus-${Date.now()}.pdf`;
        const { error: uploadError } = await supabase.storage
          .from('brochures')
          .upload(path, file, { contentType: 'application/pdf', upsert: false });

        if (uploadError) {
          setError(`Upload failed: ${uploadError.message}`);
          setPending(false);
          return;
        }

        brochureUrl = supabase.storage.from('brochures').getPublicUrl(path).data.publicUrl;
      }

      const response = await fetch('/api/admin/courses', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          id: course.id,
          title: { en: titleEn, fr: titleFr },
          description: { en: descriptionEn, fr: descriptionFr },
          next_cohort: { en: cohortEn, fr: cohortFr },
          schedule: { en: scheduleEn, fr: scheduleFr },
          seats_left: seatsNumber,
          brochure_url: brochureUrl
        })
      });

      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        code?: string;
        fields?: Record<string, string>;
      };

      if (!response.ok || !data.ok) {
        setError(
          data.code === 'forbidden'
            ? 'You do not have permission to edit courses.'
            : 'Could not save. Check the fields and try again.'
        );
        setPending(false);
        return;
      }

      onClose();
      router.refresh();
    } catch {
      setError('Network error. Check your connection and try again.');
      setPending(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby="course-drawer-title"
    >
      <button
        type="button"
        aria-label="Close course editor"
        onClick={onClose}
        className="absolute inset-0 bg-ink/50"
      />

      <div className="relative h-full w-full max-w-xl overflow-y-auto border-l-2 border-ink bg-surface p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 border-b border-line/70 pb-5">
          <div>
            <p className="font-mono text-[9px] uppercase tracking-[0.24em] text-accent">
              Edit course
            </p>
            <h2
              id="course-drawer-title"
              className="mt-2 font-serif text-2xl leading-tight text-ink"
            >
              {course.titleEn}
            </h2>
            <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.16em] text-ink-muted">
              {course.id} · {course.track}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="border border-line/80 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-ink transition hover:border-ink"
          >
            Close ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-7">
          <LocalizedField
            id="course-title"
            label="Title"
            en={titleEn}
            fr={titleFr}
            onEn={setTitleEn}
            onFr={setTitleFr}
          />

          <LocalizedField
            id="course-description"
            label="Short description"
            en={descriptionEn}
            fr={descriptionFr}
            onEn={setDescriptionEn}
            onFr={setDescriptionFr}
            multiline
            rows={3}
          />

          <LocalizedField
            id="course-cohort"
            label="Next cohort"
            en={cohortEn}
            fr={cohortFr}
            onEn={setCohortEn}
            onFr={setCohortFr}
          />

          <LocalizedField
            id="course-schedule"
            label="Schedule"
            en={scheduleEn}
            fr={scheduleFr}
            onEn={setScheduleEn}
            onFr={setScheduleFr}
          />

          <div>
            <label htmlFor="course-seats" className={labelClass}>
              Seats left
            </label>
            <input
              id="course-seats"
              type="number"
              min={0}
              max={999}
              step={1}
              value={seats}
              onChange={(event) => setSeats(event.target.value)}
              className={`${inputClass} max-w-[10rem]`}
            />
          </div>

          <div>
            <label htmlFor="course-brochure" className={labelClass}>
              Syllabus PDF
            </label>
            <input
              id="course-brochure"
              type="file"
              accept="application/pdf,.pdf"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="block w-full border border-line/80 bg-surface-raised px-3 py-2.5 text-xs text-ink file:mr-4 file:border-0 file:bg-ink file:px-3 file:py-1.5 file:font-mono file:text-[9px] file:uppercase file:tracking-[0.16em] file:text-surface"
            />
            <p className="mt-2 text-xs leading-relaxed text-ink-muted">
              PDF only, 10 MB maximum. Leave empty to keep the current file.
            </p>
            {course.brochureUrl ? (
              <a
                href={course.brochureUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block font-mono text-[9px] uppercase tracking-[0.16em] text-accent transition hover:opacity-70"
              >
                Current PDF ↗
              </a>
            ) : null}
          </div>

          {error ? (
            <p
              role="alert"
              className="border border-rubric/40 bg-rubric/5 px-3 py-2 text-xs leading-relaxed text-rubric"
            >
              {error}
            </p>
          ) : null}

          <div className="flex flex-col gap-3 border-t border-line/70 pt-5 sm:flex-row">
            <button
              type="submit"
              disabled={pending}
              className="flex-1 bg-accent px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-accent-ink transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending ? 'Saving…' : 'Save changes'}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={pending}
              className="border border-line/80 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-ink transition hover:border-ink disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
