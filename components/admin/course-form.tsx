'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent, type ReactNode } from 'react';
import {
  ageBrackets,
  courseLevels,
  courseTracks,
  isCourseSlug,
  type AgeBracket,
  type CourseLevel,
  type CourseTrack
} from '@/content/courses';
import type { AdminCourse } from '@/lib/courses/admin';
import { createClient } from '@/lib/supabase/client';

type CourseFormProps = {
  mode: 'create' | 'edit';
  course?: AdminCourse;
};

const inputClass =
  'w-full border border-line/80 bg-surface-raised px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 focus:border-accent focus:ring-accent/20';
const labelClass =
  'mb-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted';

const trackLabels: Record<CourseTrack, string> = {
  tech: 'Technology & AI',
  arts: 'Digital Arts & Media',
  languages: 'Specialized Languages'
};

const ageLabels: Record<AgeBracket, string> = {
  kids: 'Junior Fellows · 7–11',
  juniors: 'Junior Fellows · 12–17',
  all: 'All ages'
};

const levelLabels: Record<CourseLevel, string> = {
  foundation: 'Foundation',
  intermediate: 'Intermediate',
  advanced: 'Advanced',
  'all-levels': 'All levels'
};

function blankCourse(): AdminCourse {
  return {
    id: '',
    track: 'tech',
    ageBracket: 'all',
    level: 'foundation',
    durationWeeks: 8,
    sessionsPerWeek: 2,
    featured: false,
    titleEn: '',
    titleFr: '',
    descriptionEn: '',
    descriptionFr: '',
    ledeEn: '',
    ledeFr: '',
    highlightsEn: '',
    highlightsFr: '',
    nextCohortEn: '18 April 2026',
    nextCohortFr: '18 Avril 2026',
    scheduleEn: 'Saturday 10:00–13:00',
    scheduleFr: 'Samedi 10h00–13h00',
    outcomesEn: '',
    outcomesFr: '',
    toolsEn: '',
    toolsFr: '',
    modules: Array.from({ length: 6 }, () => ({
      titleEn: '',
      titleFr: '',
      descriptionEn: '',
      descriptionFr: ''
    })),
    capstoneTitleEn: '',
    capstoneTitleFr: '',
    capstoneDescriptionEn: '',
    capstoneDescriptionFr: '',
    capstoneDeliverableEn: '',
    capstoneDeliverableFr: '',
    mentorNameEn: '',
    mentorNameFr: '',
    mentorRoleEn: '',
    mentorRoleFr: '',
    mentorBioEn: '',
    mentorBioFr: '',
    mentorPortraitUrl: null,
    seatsLeft: 6,
    brochureUrl: null
  };
}

function splitList(value: string): string[] {
  return value
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function mirror(en: string, fr: string): { en: string; fr: string } {
  const enValue = en.trim();
  const frValue = fr.trim();

  return { en: enValue || frValue, fr: frValue || enValue };
}

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
      <legend className="font-mono text-[9px] uppercase tracking-[0.2em] text-ink">{label}</legend>
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

function Section({
  index,
  title,
  children
}: {
  index: number;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-t border-line/70 pt-6">
      <div className="flex items-baseline gap-3">
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-accent">
          {String(index).padStart(2, '0')}
        </span>
        <h2 className="font-serif text-2xl text-ink">{title}</h2>
      </div>
      <div className="mt-5 space-y-5">{children}</div>
    </section>
  );
}

export function CourseForm({ mode, course }: CourseFormProps) {
  const router = useRouter();
  const [draft, setDraft] = useState<AdminCourse>(() => course ?? blankCourse());
  const [brochureFile, setBrochureFile] = useState<File | null>(null);
  const [portraitFile, setPortraitFile] = useState<File | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update<K extends keyof AdminCourse>(key: K, value: AdminCourse[K]) {
    setDraft((current) => ({ ...current, [key]: value }));
  }

  function updateModule(index: number, key: keyof AdminCourse['modules'][number], value: string) {
    setDraft((current) => ({
      ...current,
      modules: current.modules.map((module, moduleIndex) =>
        moduleIndex === index ? { ...module, [key]: value } : module
      )
    }));
  }

  function addModule() {
    setDraft((current) => ({
      ...current,
      modules: [
        ...current.modules,
        { titleEn: '', titleFr: '', descriptionEn: '', descriptionFr: '' }
      ]
    }));
  }

  function removeModule(index: number) {
    setDraft((current) => ({
      ...current,
      modules:
        current.modules.length <= 1
          ? current.modules
          : current.modules.filter((_, moduleIndex) => moduleIndex !== index)
    }));
  }

  async function uploadBrochure(slug: string): Promise<string | null> {
    if (!brochureFile) return draft.brochureUrl;

    const isPdf =
      brochureFile.type === 'application/pdf' ||
      brochureFile.name.toLowerCase().endsWith('.pdf');

    if (!isPdf) throw new Error('Choose a PDF file for the syllabus.');
    if (brochureFile.size > 10 * 1024 * 1024) {
      throw new Error('The PDF must be 10 MB or smaller.');
    }

    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) throw new Error('Your session expired. Sign in again.');

    const path = `${slug}/syllabus-${Date.now()}.pdf`;
    const { error: uploadError } = await supabase.storage
      .from('brochures')
      .upload(path, brochureFile, { contentType: 'application/pdf', upsert: false });

    if (uploadError) throw new Error(`Upload failed: ${uploadError.message}`);

    return supabase.storage.from('brochures').getPublicUrl(path).data.publicUrl;
  }

  async function uploadPortrait(slug: string): Promise<string | null> {
    if (!portraitFile) return draft.mentorPortraitUrl;

    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    const extension = portraitFile.name.split('.').pop()?.toLowerCase() ?? '';

    if (!allowed.includes(portraitFile.type) && !['jpg', 'jpeg', 'png', 'webp'].includes(extension)) {
      throw new Error('Choose a JPEG, PNG or WebP portrait.');
    }

    if (portraitFile.size > 5 * 1024 * 1024) {
      throw new Error('The portrait must be 5 MB or smaller.');
    }

    const supabase = createClient();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) throw new Error('Your session expired. Sign in again.');

    const safeExtension = ['jpg', 'jpeg', 'png', 'webp'].includes(extension) ? extension : 'jpg';
    const path = `${slug}/portrait-${Date.now()}.${safeExtension}`;
    const { error: uploadError } = await supabase.storage
      .from('mentors')
      .upload(path, portraitFile, {
        contentType: portraitFile.type || 'image/jpeg',
        upsert: false
      });

    if (uploadError) throw new Error(`Portrait upload failed: ${uploadError.message}`);

    return supabase.storage.from('mentors').getPublicUrl(path).data.publicUrl;
  }

  function buildMentor(portraitUrl: string | null) {
    const hasAny = [
      draft.mentorNameEn,
      draft.mentorNameFr,
      draft.mentorRoleEn,
      draft.mentorRoleFr,
      draft.mentorBioEn,
      draft.mentorBioFr
    ].some((value) => value.trim().length > 0);

    if (!hasAny) return null;

    const name = mirror(draft.mentorNameEn, draft.mentorNameFr);
    const role = mirror(draft.mentorRoleEn, draft.mentorRoleFr);
    const bio = mirror(draft.mentorBioEn, draft.mentorBioFr);

    if (!name.en || !role.en || !bio.en) {
      throw new Error('Mentor name, role and bio are required in at least one language.');
    }

    return { name, role, bio, portrait_path: portraitUrl };
  }

  function buildCapstone() {
    const hasAny = [
      draft.capstoneTitleEn,
      draft.capstoneTitleFr,
      draft.capstoneDescriptionEn,
      draft.capstoneDescriptionFr,
      draft.capstoneDeliverableEn,
      draft.capstoneDeliverableFr
    ].some((value) => value.trim().length > 0);

    if (!hasAny) return null;

    const title = mirror(draft.capstoneTitleEn, draft.capstoneTitleFr);
    const description = mirror(draft.capstoneDescriptionEn, draft.capstoneDescriptionFr);
    const deliverable = mirror(draft.capstoneDeliverableEn, draft.capstoneDeliverableFr);

    if (!title.en || !description.en) {
      throw new Error('Capstone title and description are required in at least one language.');
    }

    return {
      en: {
        title: title.en,
        description: description.en,
        ...(deliverable.en ? { deliverable: deliverable.en } : {})
      },
      fr: {
        title: title.fr,
        description: description.fr,
        ...(deliverable.fr ? { deliverable: deliverable.fr } : {})
      }
    };
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const slug = draft.id.trim();

    if (!isCourseSlug(slug)) {
      setError('Enter a valid slug: lowercase letters, numbers and hyphens, 2–80 characters.');
      return;
    }

    if (!draft.titleEn.trim() && !draft.titleFr.trim()) {
      setError('A title is required in at least one language.');
      return;
    }

    if (!draft.descriptionEn.trim() && !draft.descriptionFr.trim()) {
      setError('A short description is required in at least one language.');
      return;
    }

    if (!draft.ledeEn.trim() && !draft.ledeFr.trim()) {
      setError('A lede is required in at least one language.');
      return;
    }

    setPending(true);

    try {
      const brochureUrl = await uploadBrochure(slug);
      const portraitUrl = await uploadPortrait(slug);
      const mentor = buildMentor(portraitUrl);
      const capstone = buildCapstone();

      const enModules = draft.modules
        .map((module) => ({
          title: module.titleEn.trim(),
          description: module.descriptionEn.trim()
        }))
        .filter((module) => module.title || module.description);

      const frModules = draft.modules
        .map((module) => ({
          title: module.titleFr.trim(),
          description: module.descriptionFr.trim()
        }))
        .filter((module) => module.title || module.description);

      const nextCohort = mirror(draft.nextCohortEn, draft.nextCohortFr);
      const schedule = mirror(draft.scheduleEn, draft.scheduleFr);

      const payload = {
        id: slug,
        track: draft.track,
        age_bracket: draft.ageBracket,
        level: draft.level,
        duration_weeks: draft.durationWeeks,
        sessions_per_week: draft.sessionsPerWeek,
        featured: draft.featured,
        title: mirror(draft.titleEn, draft.titleFr),
        description: mirror(draft.descriptionEn, draft.descriptionFr),
        lede: mirror(draft.ledeEn, draft.ledeFr),
        highlights: {
          en: splitList(draft.highlightsEn),
          fr: splitList(draft.highlightsFr)
        },
        ...(nextCohort.en
          ? { next_cohort: nextCohort }
          : mode === 'edit'
            ? { next_cohort: null }
            : {}),
        ...(schedule.en
          ? { schedule }
          : mode === 'edit'
            ? { schedule: null }
            : {}),
        outcomes: {
          en: splitList(draft.outcomesEn),
          fr: splitList(draft.outcomesFr)
        },
        tools: {
          en: splitList(draft.toolsEn),
          fr: splitList(draft.toolsFr)
        },
        modules: { en: enModules, fr: frModules },
        capstone,
        mentor,
        seats_left: draft.seatsLeft,
        brochure_url: brochureUrl
      };

      const response = await fetch('/api/admin/courses', {
        method: mode === 'create' ? 'POST' : 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        code?: string;
        fields?: Record<string, string>;
      };

      if (!response.ok || !data.ok) {
        if (data.code === 'slug_taken') {
          setError('That slug already exists. Choose another one.');
        } else if (data.code === 'forbidden') {
          setError('You do not have permission to edit programmes.');
        } else if (data.code === 'not_found') {
          setError('This programme no longer exists.');
        } else if (data.code === 'validation_failed') {
          setError('Some fields are invalid. Check the copy and structure fields.');
        } else {
          setError('Could not save. Check the fields and try again.');
        }
        setPending(false);
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'Network error. Check your connection and try again.'
      );
      setPending(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="pb-24">
      <div className="sticky top-0 z-30 border-b border-line/70 bg-surface/95 backdrop-blur">
        <div className="section-shell flex flex-wrap items-center justify-between gap-4 py-4">
          <div>
            <Link
              href="/admin"
              className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted transition hover:text-accent"
            >
              ← Back to Courses
            </Link>
            <h1 className="mt-2 font-serif text-3xl leading-tight text-ink">
              {mode === 'create' ? 'New Programme' : draft.titleEn || draft.id}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={pending}
              className="border border-accent bg-accent px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-accent-ink transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {pending
                ? 'Saving…'
                : mode === 'create'
                  ? '[ Publish Programme ]'
                  : '[ Save Programme ]'}
            </button>
          </div>
        </div>
      </div>

      <div className="section-shell mt-10 space-y-10">
        <Section index={1} title="Identity & structure">
          <div>
            <label htmlFor="course-slug" className={labelClass}>
              Slug ID
            </label>
            {mode === 'create' ? (
              <input
                id="course-slug"
                type="text"
                value={draft.id}
                onChange={(event) => update('id', event.target.value.toLowerCase())}
                placeholder="iot-embedded-systems"
                className={inputClass}
              />
            ) : (
              <p className="border border-line/70 bg-surface-sunken px-3 py-2.5 font-mono text-sm text-ink">
                {draft.id}
              </p>
            )}
            <p className="mt-1.5 text-xs leading-relaxed text-ink-muted">
              Lowercase letters, numbers and hyphens. The slug is the public URL and cannot be
              changed after creation.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label htmlFor="course-track" className={labelClass}>
                Track
              </label>
              <select
                id="course-track"
                value={draft.track}
                onChange={(event) => update('track', event.target.value as CourseTrack)}
                className={inputClass}
              >
                {courseTracks.map((track) => (
                  <option key={track} value={track}>
                    {trackLabels[track]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="course-age" className={labelClass}>
                Age bracket
              </label>
              <select
                id="course-age"
                value={draft.ageBracket}
                onChange={(event) => update('ageBracket', event.target.value as AgeBracket)}
                className={inputClass}
              >
                {ageBrackets.map((age) => (
                  <option key={age} value={age}>
                    {ageLabels[age]}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="course-level" className={labelClass}>
                Level
              </label>
              <select
                id="course-level"
                value={draft.level}
                onChange={(event) => update('level', event.target.value as CourseLevel)}
                className={inputClass}
              >
                {courseLevels.map((level) => (
                  <option key={level} value={level}>
                    {levelLabels[level]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label htmlFor="course-duration" className={labelClass}>
                Duration (weeks)
              </label>
              <input
                id="course-duration"
                type="number"
                min={1}
                max={52}
                value={draft.durationWeeks}
                onChange={(event) => update('durationWeeks', Number(event.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="course-sessions" className={labelClass}>
                Sessions / week
              </label>
              <input
                id="course-sessions"
                type="number"
                min={1}
                max={14}
                value={draft.sessionsPerWeek}
                onChange={(event) => update('sessionsPerWeek', Number(event.target.value))}
                className={inputClass}
              />
            </div>
            <div>
              <label htmlFor="course-seats" className={labelClass}>
                Seats left
              </label>
              <input
                id="course-seats"
                type="number"
                min={0}
                max={999}
                value={draft.seatsLeft}
                onChange={(event) => update('seatsLeft', Number(event.target.value))}
                className={inputClass}
              />
            </div>
          </div>

          <label className="flex items-center gap-3 text-sm text-ink">
            <input
              type="checkbox"
              checked={draft.featured}
              onChange={(event) => update('featured', event.target.checked)}
              className="h-4 w-4 border-line text-accent focus:ring-accent/20"
            />
            Feature this programme
          </label>
        </Section>

        <Section index={2} title="Bilingual copy">
          <LocalizedField
            id="course-title"
            label="Title"
            en={draft.titleEn}
            fr={draft.titleFr}
            onEn={(value) => update('titleEn', value)}
            onFr={(value) => update('titleFr', value)}
          />
          <LocalizedField
            id="course-description"
            label="Short description"
            en={draft.descriptionEn}
            fr={draft.descriptionFr}
            onEn={(value) => update('descriptionEn', value)}
            onFr={(value) => update('descriptionFr', value)}
            multiline
          />
          <LocalizedField
            id="course-lede"
            label="Lede"
            en={draft.ledeEn}
            fr={draft.ledeFr}
            onEn={(value) => update('ledeEn', value)}
            onFr={(value) => update('ledeFr', value)}
            multiline
            rows={2}
          />
          <LocalizedField
            id="course-highlights"
            label="Highlights (comma-separated)"
            en={draft.highlightsEn}
            fr={draft.highlightsFr}
            onEn={(value) => update('highlightsEn', value)}
            onFr={(value) => update('highlightsFr', value)}
            multiline
            rows={2}
          />
          <LocalizedField
            id="course-outcomes"
            label="Outcomes (one per line)"
            en={draft.outcomesEn}
            fr={draft.outcomesFr}
            onEn={(value) => update('outcomesEn', value)}
            onFr={(value) => update('outcomesFr', value)}
            multiline
            rows={5}
          />
        </Section>

        <Section index={3} title="Cohort & schedule">
          <LocalizedField
            id="course-cohort"
            label="Next cohort"
            en={draft.nextCohortEn}
            fr={draft.nextCohortFr}
            onEn={(value) => update('nextCohortEn', value)}
            onFr={(value) => update('nextCohortFr', value)}
          />
          <LocalizedField
            id="course-schedule"
            label="Schedule slot"
            en={draft.scheduleEn}
            fr={draft.scheduleFr}
            onEn={(value) => update('scheduleEn', value)}
            onFr={(value) => update('scheduleFr', value)}
          />
        </Section>

        <Section index={4} title="Mentor">
          <LocalizedField
            id="mentor-name"
            label="Mentor name"
            en={draft.mentorNameEn}
            fr={draft.mentorNameFr}
            onEn={(value) => update('mentorNameEn', value)}
            onFr={(value) => update('mentorNameFr', value)}
          />
          <LocalizedField
            id="mentor-role"
            label="Role / credentials"
            en={draft.mentorRoleEn}
            fr={draft.mentorRoleFr}
            onEn={(value) => update('mentorRoleEn', value)}
            onFr={(value) => update('mentorRoleFr', value)}
          />
          <LocalizedField
            id="mentor-bio"
            label="Bio"
            en={draft.mentorBioEn}
            fr={draft.mentorBioFr}
            onEn={(value) => update('mentorBioEn', value)}
            onFr={(value) => update('mentorBioFr', value)}
            multiline
            rows={4}
          />

          <div>
            <label htmlFor="mentor-portrait" className={labelClass}>
              Portrait
            </label>
            <input
              id="mentor-portrait"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => setPortraitFile(event.target.files?.[0] ?? null)}
              className="block w-full border border-line/80 bg-surface-raised px-3 py-2.5 text-xs text-ink file:mr-4 file:border-0 file:bg-ink file:px-3 file:py-1.5 file:font-mono file:text-[9px] file:uppercase file:tracking-[0.16em] file:text-surface"
            />
            <p className="mt-2 text-xs leading-relaxed text-ink-muted">
              JPEG, PNG or WebP, 5 MB maximum. Leave empty to keep the current portrait.
            </p>
            {draft.mentorPortraitUrl ? (
              <div className="mt-3 flex items-center gap-4">
                <Image
                  src={draft.mentorPortraitUrl}
                  alt="Current mentor portrait"
                  width={96}
                  height={120}
                  unoptimized
                  className="aspect-[4/5] w-20 border border-line/70 object-cover grayscale"
                />
                <a
                  href={draft.mentorPortraitUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-[9px] uppercase tracking-[0.16em] text-accent transition hover:opacity-70"
                >
                  Current portrait ↗
                </a>
              </div>
            ) : null}
          </div>
        </Section>

        <Section index={5} title="Tools & hardware">
          <LocalizedField
            id="course-tools"
            label="Tools (comma-separated)"
            en={draft.toolsEn}
            fr={draft.toolsFr}
            onEn={(value) => update('toolsEn', value)}
            onFr={(value) => update('toolsFr', value)}
            multiline
            rows={3}
          />
        </Section>

        <Section index={6} title="Modules">
          <div className="space-y-4">
            {draft.modules.map((module, index) => (
              <div key={index} className="border border-line/70 bg-surface-raised/40 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-ink-muted">
                    Module {String(index + 1).padStart(2, '0')}
                  </p>
                  <button
                    type="button"
                    onClick={() => removeModule(index)}
                    disabled={draft.modules.length <= 1}
                    className="font-mono text-[8px] uppercase tracking-[0.16em] text-rubric transition hover:opacity-70 disabled:opacity-30"
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    value={module.titleEn}
                    onChange={(event) => updateModule(index, 'titleEn', event.target.value)}
                    placeholder="Module title (EN)"
                    className={inputClass}
                  />
                  <input
                    type="text"
                    value={module.titleFr}
                    onChange={(event) => updateModule(index, 'titleFr', event.target.value)}
                    placeholder="Titre du module (FR)"
                    className={inputClass}
                  />
                  <textarea
                    rows={2}
                    value={module.descriptionEn}
                    onChange={(event) => updateModule(index, 'descriptionEn', event.target.value)}
                    placeholder="Description (EN)"
                    className={inputClass}
                  />
                  <textarea
                    rows={2}
                    value={module.descriptionFr}
                    onChange={(event) => updateModule(index, 'descriptionFr', event.target.value)}
                    placeholder="Description (FR)"
                    className={inputClass}
                  />
                </div>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addModule}
            className="border border-line/80 px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.16em] text-ink transition hover:border-accent hover:text-accent"
          >
            + Add module
          </button>
        </Section>

        <Section index={7} title="Capstone deliverable">
          <LocalizedField
            id="capstone-title"
            label="Capstone title"
            en={draft.capstoneTitleEn}
            fr={draft.capstoneTitleFr}
            onEn={(value) => update('capstoneTitleEn', value)}
            onFr={(value) => update('capstoneTitleFr', value)}
          />
          <LocalizedField
            id="capstone-description"
            label="Capstone description"
            en={draft.capstoneDescriptionEn}
            fr={draft.capstoneDescriptionFr}
            onEn={(value) => update('capstoneDescriptionEn', value)}
            onFr={(value) => update('capstoneDescriptionFr', value)}
            multiline
          />
          <LocalizedField
            id="capstone-deliverable"
            label="Student output / deliverable"
            en={draft.capstoneDeliverableEn}
            fr={draft.capstoneDeliverableFr}
            onEn={(value) => update('capstoneDeliverableEn', value)}
            onFr={(value) => update('capstoneDeliverableFr', value)}
            multiline
            rows={2}
          />
        </Section>

        <Section index={8} title="Syllabus PDF">
          <div>
            <label htmlFor="course-brochure" className={labelClass}>
              Syllabus PDF
            </label>
            <input
              id="course-brochure"
              type="file"
              accept="application/pdf,.pdf"
              onChange={(event) => setBrochureFile(event.target.files?.[0] ?? null)}
              className="block w-full border border-line/80 bg-surface-raised px-3 py-2.5 text-xs text-ink file:mr-4 file:border-0 file:bg-ink file:px-3 file:py-1.5 file:font-mono file:text-[9px] file:uppercase file:tracking-[0.16em] file:text-surface"
            />
            <p className="mt-2 text-xs leading-relaxed text-ink-muted">
              PDF only, 10 MB maximum. Leave empty to keep the current file.
            </p>
            {draft.brochureUrl ? (
              <a
                href={draft.brochureUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block font-mono text-[9px] uppercase tracking-[0.16em] text-accent transition hover:opacity-70"
              >
                Current PDF ↗
              </a>
            ) : null}
          </div>
        </Section>

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
            {pending
              ? 'Saving…'
              : mode === 'create'
                ? '[ Publish Programme ]'
                : '[ Save Programme ]'}
          </button>
          <Link
            href="/admin"
            className="border border-line/80 px-5 py-3 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-ink transition hover:border-ink"
          >
            Cancel
          </Link>
        </div>
      </div>
    </form>
  );
}
