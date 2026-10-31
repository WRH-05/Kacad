'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { CourseId } from '@/content/courses';
import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n';
import { isContact } from '@/lib/validation';
import type { WaitlistAgeGroup } from '@/lib/waitlist';

type WaitlistFormProps = {
  courseId: CourseId;
  courseLabel: string;
  labels: Dictionary['waitlist'];
  locale: Locale;
};

type FormState = {
  name: string;
  contact: string;
  ageGroup: WaitlistAgeGroup | '';
  notes: string;
  consent: boolean;
  website: string;
};

const emptyForm: FormState = {
  name: '',
  contact: '',
  ageGroup: '',
  notes: '',
  consent: false,
  website: ''
};

export function WaitlistForm({ courseId, courseLabel, labels, locale }: WaitlistFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [brochureUrl, setBrochureUrl] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function validate(): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = labels.errors.required;
    if (!form.contact.trim()) errors.contact = labels.errors.required;
    else if (!isContact(form.contact.trim())) errors.contact = labels.errors.contact;
    if (!form.ageGroup) errors.ageGroup = labels.errors.ageGroup;
    if (!form.consent) errors.consent = labels.errors.consent;
    return errors;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const errors = validate();
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setFormError(null);
      return;
    }

    setStatus('submitting');
    setFieldErrors({});
    setFormError(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          courseId,
          name: form.name.trim(),
          contact: form.contact.trim(),
          ageGroup: form.ageGroup,
          notes: form.notes.trim() || undefined,
          consent: form.consent,
          locale,
          website: form.website
        })
      });

      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        brochureUrl?: string;
        fields?: Record<string, string>;
      };

      if (!response.ok || !data.ok) {
        if (data.fields) {
          const mapped: Record<string, string> = {};
          for (const [key, code] of Object.entries(data.fields)) {
            mapped[key] =
              code === 'required'
                ? labels.errors.required
                : code === 'too_long'
                  ? labels.errors.tooLong
                  : key === 'contact'
                    ? labels.errors.contact
                    : key === 'ageGroup'
                      ? labels.errors.ageGroup
                      : key === 'consent'
                        ? labels.errors.consent
                        : labels.errors.server;
          }
          setFieldErrors(mapped);
        } else {
          setFormError(labels.errors.server);
        }
        setStatus('idle');
        return;
      }

      setBrochureUrl(data.brochureUrl ?? null);
      setStatus('success');
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') return;
      setFormError(labels.errors.network);
      setStatus('idle');
    }
  }

  if (status === 'success') {
    return (
      <div className="border border-line/70 bg-surface-sunken p-6">
        <p className="font-serif text-2xl text-ink">{labels.successTitle}</p>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">{labels.successBody}</p>
        {brochureUrl ? (
          <a
            href={brochureUrl}
            download
            className="mt-6 inline-flex items-center gap-3 bg-accent px-5 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-accent-ink transition hover:bg-accent/90"
          >
            {labels.brochureCta}
            <span aria-hidden="true">↓</span>
          </a>
        ) : null}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted">
          {labels.courseLabel}
        </label>
        <p className="border border-line/70 bg-surface-sunken px-3 py-2.5 text-sm text-ink">
          {courseLabel}
        </p>
      </div>

      <div>
        <label
          htmlFor={`waitlist-name-${courseId}`}
          className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted"
        >
          {labels.fields.name}
        </label>
        <input
          id={`waitlist-name-${courseId}`}
          type="text"
          value={form.name}
          onChange={(event) => update('name', event.target.value)}
          placeholder={labels.placeholders.name}
          aria-invalid={Boolean(fieldErrors.name)}
          className="w-full border border-line/80 bg-surface-raised px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 focus:border-accent focus:ring-accent/20"
        />
        {fieldErrors.name ? (
          <p className="mt-1.5 text-xs text-accent">{fieldErrors.name}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor={`waitlist-contact-${courseId}`}
          className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted"
        >
          {labels.fields.contact}
        </label>
        <input
          id={`waitlist-contact-${courseId}`}
          type="text"
          inputMode="email"
          value={form.contact}
          onChange={(event) => update('contact', event.target.value)}
          placeholder={labels.placeholders.contact}
          aria-invalid={Boolean(fieldErrors.contact)}
          aria-describedby={`waitlist-contact-hint-${courseId}`}
          className="w-full border border-line/80 bg-surface-raised px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 focus:border-accent focus:ring-accent/20"
        />
        <p
          id={`waitlist-contact-hint-${courseId}`}
          className="mt-1.5 text-xs text-ink-muted"
        >
          {labels.contactHint}
        </p>
        {fieldErrors.contact ? (
          <p className="mt-1.5 text-xs text-accent">{fieldErrors.contact}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor={`waitlist-age-${courseId}`}
          className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted"
        >
          {labels.fields.ageGroup}
        </label>
        <select
          id={`waitlist-age-${courseId}`}
          value={form.ageGroup}
          onChange={(event) =>
            update('ageGroup', event.target.value as WaitlistAgeGroup | '')
          }
          aria-invalid={Boolean(fieldErrors.ageGroup)}
          className="w-full border border-line/80 bg-surface-raised px-3 py-2.5 text-sm text-ink focus:border-accent focus:ring-accent/20"
        >
          <option value="">{labels.ageGroupPlaceholder}</option>
          {Object.entries(labels.ageGroupOptions).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {fieldErrors.ageGroup ? (
          <p className="mt-1.5 text-xs text-accent">{fieldErrors.ageGroup}</p>
        ) : null}
      </div>

      <div>
        <label
          htmlFor={`waitlist-notes-${courseId}`}
          className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted"
        >
          {labels.fields.notes}
        </label>
        <textarea
          id={`waitlist-notes-${courseId}`}
          rows={3}
          value={form.notes}
          onChange={(event) => update('notes', event.target.value)}
          placeholder={labels.placeholders.notes}
          className="w-full border border-line/80 bg-surface-raised px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 focus:border-accent focus:ring-accent/20"
        />
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor={`waitlist-website-${courseId}`}>Website</label>
        <input
          id={`waitlist-website-${courseId}`}
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={form.website}
          onChange={(event) => update('website', event.target.value)}
        />
      </div>

      <label className="flex items-start gap-3 text-xs leading-relaxed text-ink-muted">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(event) => update('consent', event.target.checked)}
          className="mt-0.5 h-4 w-4 border-line text-accent focus:ring-accent/20"
        />
        <span>{labels.consent}</span>
      </label>
      {fieldErrors.consent ? (
        <p className="text-xs text-accent">{fieldErrors.consent}</p>
      ) : null}

      {formError ? <p className="text-xs text-accent">{formError}</p> : null}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full bg-accent px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-accent-ink transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === 'submitting' ? labels.submitting : labels.submit}
      </button>
    </form>
  );
}
