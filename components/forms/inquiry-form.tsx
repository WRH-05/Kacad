'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n';
import { isEmail, isPhone } from '@/lib/validation';

type InquiryFormProps = {
  labels: Dictionary['contact']['form'];
  locale: Locale;
};

type FormState = {
  name: string;
  email: string;
  phone: string;
  message: string;
  consent: boolean;
  website: string;
};

const emptyForm: FormState = {
  name: '',
  email: '',
  phone: '',
  message: '',
  consent: false,
  website: ''
};

export function InquiryForm({ labels, locale }: InquiryFormProps) {
  const [form, setForm] = useState<FormState>(emptyForm);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => abortRef.current?.abort(), []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function validate(): Record<string, string> {
    const errors: Record<string, string> = {};
    if (!form.name.trim()) errors.name = labels.errors.required;
    if (!form.email.trim()) errors.email = labels.errors.required;
    else if (!isEmail(form.email.trim())) errors.email = labels.errors.email;
    if (form.phone.trim() && !isPhone(form.phone.trim())) {
      errors.phone = labels.errors.phone;
    }
    if (!form.message.trim()) errors.message = labels.errors.required;
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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          message: form.message.trim(),
          consent: form.consent,
          locale,
          website: form.website
        })
      });

      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        code?: string;
        fields?: Record<string, string>;
      };

      if (!response.ok || !data.ok) {
        if (data.code === 'not_configured') {
          setFormError(labels.fallback);
        } else if (data.fields) {
          const mapped: Record<string, string> = {};
          for (const [key, code] of Object.entries(data.fields)) {
            mapped[key] =
              code === 'required'
                ? labels.errors.required
                : code === 'too_long'
                  ? labels.errors.tooLong
                  : key === 'email'
                    ? labels.errors.email
                    : key === 'phone'
                      ? labels.errors.phone
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
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label
          htmlFor="inquiry-name"
          className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted"
        >
          {labels.fields.name}
        </label>
        <input
          id="inquiry-name"
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

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="inquiry-email"
            className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted"
          >
            {labels.fields.email}
          </label>
          <input
            id="inquiry-email"
            type="email"
            value={form.email}
            onChange={(event) => update('email', event.target.value)}
            placeholder={labels.placeholders.email}
            aria-invalid={Boolean(fieldErrors.email)}
            className="w-full border border-line/80 bg-surface-raised px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 focus:border-accent focus:ring-accent/20"
          />
          {fieldErrors.email ? (
            <p className="mt-1.5 text-xs text-accent">{fieldErrors.email}</p>
          ) : null}
        </div>

        <div>
          <label
            htmlFor="inquiry-phone"
            className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted"
          >
            {labels.fields.phone}
          </label>
          <input
            id="inquiry-phone"
            type="tel"
            value={form.phone}
            onChange={(event) => update('phone', event.target.value)}
            placeholder={labels.placeholders.phone}
            aria-invalid={Boolean(fieldErrors.phone)}
            className="w-full border border-line/80 bg-surface-raised px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 focus:border-accent focus:ring-accent/20"
          />
          {fieldErrors.phone ? (
            <p className="mt-1.5 text-xs text-accent">{fieldErrors.phone}</p>
          ) : null}
        </div>
      </div>

      <div>
        <label
          htmlFor="inquiry-message"
          className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted"
        >
          {labels.fields.message}
        </label>
        <textarea
          id="inquiry-message"
          rows={5}
          value={form.message}
          onChange={(event) => update('message', event.target.value)}
          placeholder={labels.placeholders.message}
          aria-invalid={Boolean(fieldErrors.message)}
          className="w-full border border-line/80 bg-surface-raised px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 focus:border-accent focus:ring-accent/20"
        />
        {fieldErrors.message ? (
          <p className="mt-1.5 text-xs text-accent">{fieldErrors.message}</p>
        ) : null}
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="inquiry-website">Website</label>
        <input
          id="inquiry-website"
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
        <span>{labels.fields.consent}</span>
      </label>
      {fieldErrors.consent ? (
        <p className="text-xs text-accent">{fieldErrors.consent}</p>
      ) : null}

      {formError ? <p className="text-xs leading-relaxed text-accent">{formError}</p> : null}

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
