'use client';

import { useEffect, useRef, useState } from 'react';
import type { CourseId } from '@/content/courses';
import type { Dictionary } from '@/lib/dictionaries';
import type { Locale } from '@/lib/i18n';

type RegistrationForm = {
  parentName: string;
  studentName: string;
  studentAge: string;
  email: string;
  phone: string;
  languagePreference: string;
  notes: string;
};

type FormErrors = Partial<Record<keyof RegistrationForm, string>>;

type CourseRegistrationModalProps = {
  locale: Locale;
  registration: Dictionary['registration'];
  courseId: CourseId | null;
  courseName: string;
  open: boolean;
  onClose: () => void;
};

const emptyForm: RegistrationForm = {
  parentName: '',
  studentName: '',
  studentAge: '',
  email: '',
  phone: '',
  languagePreference: '',
  notes: ''
};

export function CourseRegistrationModal({
  registration,
  courseId,
  courseName,
  open,
  onClose
}: CourseRegistrationModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [form, setForm] = useState<RegistrationForm>(emptyForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open) {
      dialog.showModal();
      setSubmitted(false);
      setErrors({});
      setForm(emptyForm);
    } else if (dialog.open) {
      dialog.close();
    }
  }, [open, courseId]);

  function validate(): FormErrors {
    const next: FormErrors = {};
    if (!form.parentName.trim()) next.parentName = registration.errors.required;
    if (!form.studentName.trim()) next.studentName = registration.errors.required;
    if (!form.studentAge.trim()) {
      next.studentAge = registration.errors.required;
    } else {
      const age = Number(form.studentAge);
      if (Number.isNaN(age) || age < 5 || age > 25) {
        next.studentAge = registration.errors.age;
      }
    }
    if (!form.email.trim()) {
      next.email = registration.errors.required;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = registration.errors.email;
    }
    if (!form.phone.trim()) next.phone = registration.errors.required;
    if (courseId === 'languages' && !form.languagePreference) {
      next.languagePreference = registration.errors.required;
    }
    return next;
  }

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const payload = {
      courseId,
      courseName,
      parentName: form.parentName.trim(),
      studentName: form.studentName.trim(),
      studentAge: Number(form.studentAge),
      email: form.email.trim(),
      phone: form.phone.trim(),
      languagePreference: courseId === 'languages' ? form.languagePreference : undefined,
      notes: form.notes.trim() || undefined,
      submittedAt: new Date().toISOString()
    };

    console.log('[Registration stub]', payload);
    setSubmitted(true);
    setErrors({});
  }

  function handleClose() {
    setSubmitted(false);
    setForm(emptyForm);
    setErrors({});
    onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      className="fixed inset-0 z-[100] m-auto w-[calc(100%-2rem)] max-w-lg rounded-2xl border border-navy/10 bg-cream p-0 shadow-soft backdrop:bg-navy/30 open:animate-in open:fade-in"
    >
      <div className="max-h-[90vh] overflow-y-auto p-6 sm:p-8">
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-navy">{registration.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{registration.subtitle}</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-navy/10 px-3 py-1.5 text-sm text-navy hover:bg-white"
            aria-label={registration.close}
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="rounded-xl border border-gold/30 bg-gold/10 px-4 py-6 text-center">
            <p className="font-medium text-navy">{registration.success}</p>
            <button
              type="button"
              onClick={handleClose}
              className="mt-4 rounded-full bg-navy px-5 py-2 text-sm font-medium text-white"
            >
              {registration.close}
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-navy">
                {registration.courseLabel}
              </label>
              <input
                type="text"
                readOnly
                value={courseName}
                className="w-full rounded-lg border-sand bg-white px-3 py-2 text-sm text-slate-700"
              />
            </div>

            {(
              [
                ['parentName', 'text'],
                ['studentName', 'text'],
                ['studentAge', 'number'],
                ['email', 'email'],
                ['phone', 'tel']
              ] as const
            ).map(([field, type]) => (
              <div key={field}>
                <label htmlFor={field} className="mb-1 block text-sm font-medium text-navy">
                  {registration.fields[field]}
                </label>
                <input
                  id={field}
                  type={type}
                  value={form[field]}
                  onChange={(e) => setForm((prev) => ({ ...prev, [field]: e.target.value }))}
                  placeholder={registration.placeholders[field]}
                  className="w-full rounded-lg border-sand bg-white px-3 py-2 text-sm shadow-sm focus:border-navy/30 focus:ring-navy/20"
                />
                {errors[field] ? (
                  <p className="mt-1 text-xs text-terracotta">{errors[field]}</p>
                ) : null}
              </div>
            ))}

            {courseId === 'languages' ? (
              <div>
                <label htmlFor="languagePreference" className="mb-1 block text-sm font-medium text-navy">
                  {registration.fields.languagePreference}
                </label>
                <select
                  id="languagePreference"
                  value={form.languagePreference}
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, languagePreference: e.target.value }))
                  }
                  className="w-full rounded-lg border-sand bg-white px-3 py-2 text-sm shadow-sm focus:border-navy/30 focus:ring-navy/20"
                >
                  <option value="">—</option>
                  <option value="french">{registration.languageOptions.french}</option>
                  <option value="english">{registration.languageOptions.english}</option>
                  <option value="german">{registration.languageOptions.german}</option>
                  <option value="spanish">{registration.languageOptions.spanish}</option>
                </select>
                {errors.languagePreference ? (
                  <p className="mt-1 text-xs text-terracotta">{errors.languagePreference}</p>
                ) : null}
              </div>
            ) : null}

            <div>
              <label htmlFor="notes" className="mb-1 block text-sm font-medium text-navy">
                {registration.fields.notes}
              </label>
              <textarea
                id="notes"
                rows={3}
                value={form.notes}
                onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder={registration.placeholders.notes}
                className="w-full rounded-lg border-sand bg-white px-3 py-2 text-sm shadow-sm focus:border-navy/30 focus:ring-navy/20"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-full bg-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-navy/90"
            >
              {registration.submit}
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
}
