import { isCourseId } from '@/content/courses';
import { isLocale } from '@/lib/i18n';
import {
  waitlistAgeGroups,
  type ContactInput,
  type FieldError,
  type WaitlistInput
} from '@/lib/waitlist';

const MAX_BODY_BYTES = 16_384;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9][0-9\s().-]{6,19}$/;

export function isEmail(value: string): boolean {
  return EMAIL_RE.test(value);
}

export function isPhone(value: string): boolean {
  return PHONE_RE.test(value);
}

export function isContact(value: string): boolean {
  return isEmail(value) || isPhone(value);
}

export function clip(value: unknown, max: number): string {
  return typeof value === 'string' ? value.trim().slice(0, max) : '';
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

type ParseResult<T> =
  | { ok: true; value: T }
  | { ok: false; fields: Record<string, FieldError> };

export function parseWaitlist(body: unknown): ParseResult<WaitlistInput> {
  if (!isRecord(body)) {
    return { ok: false, fields: { _form: 'invalid' } };
  }

  const fields: Record<string, FieldError> = {};
  const courseId = body.courseId;
  const name = clip(body.name, 120);
  const contact = clip(body.contact, 160);
  const ageGroup = body.ageGroup;
  const notes = clip(body.notes, 1000);
  const consent = body.consent === true;
  const website = clip(body.website, 200);

  if (!isCourseId(courseId)) fields.courseId = courseId ? 'invalid' : 'required';
  if (!name) fields.name = 'required';
  else if (name.length >= 120) fields.name = 'too_long';
  if (!contact) fields.contact = 'required';
  else if (!isContact(contact)) fields.contact = 'invalid';
  if (!(waitlistAgeGroups as readonly unknown[]).includes(ageGroup)) {
    fields.ageGroup = 'invalid';
  }
  if (typeof body.notes === 'string' && body.notes.trim().length > 1000) {
    fields.notes = 'too_long';
  }
  if (!consent) fields.consent = 'required';

  if (Object.keys(fields).length > 0) {
    return { ok: false, fields };
  }

  return {
    ok: true,
    value: {
      courseId: courseId as WaitlistInput['courseId'],
      name,
      contact,
      ageGroup: ageGroup as WaitlistInput['ageGroup'],
      notes: notes || undefined,
      locale: isLocale(String(body.locale ?? '')) ? (body.locale as 'en' | 'fr') : 'en',
      consent: true,
      website
    }
  };
}

export function parseContact(body: unknown): ParseResult<ContactInput> {
  if (!isRecord(body)) {
    return { ok: false, fields: { _form: 'invalid' } };
  }

  const fields: Record<string, FieldError> = {};
  const name = clip(body.name, 120);
  const email = clip(body.email, 160);
  const phone = clip(body.phone, 40);
  const message = clip(body.message, 2000);
  const consent = body.consent === true;
  const website = clip(body.website, 200);

  if (!name) fields.name = 'required';
  else if (name.length >= 120) fields.name = 'too_long';
  if (!email) fields.email = 'required';
  else if (!isEmail(email)) fields.email = 'invalid';
  if (phone && !isPhone(phone)) fields.phone = 'invalid';
  if (!message) fields.message = 'required';
  else if (message.length >= 2000) fields.message = 'too_long';
  if (!consent) fields.consent = 'required';

  if (Object.keys(fields).length > 0) {
    return { ok: false, fields };
  }

  return {
    ok: true,
    value: {
      name,
      email,
      phone: phone || undefined,
      message,
      locale: isLocale(String(body.locale ?? '')) ? (body.locale as 'en' | 'fr') : 'en',
      consent: true,
      website
    }
  };
}

type BodyResult =
  | { ok: true; body: unknown }
  | { ok: false; status: number; code: 'unsupported_media_type' | 'payload_too_large' | 'invalid_json' };

export async function readJsonBody(request: Request): Promise<BodyResult> {
  const contentType = request.headers.get('content-type') ?? '';
  if (!contentType.toLowerCase().startsWith('application/json')) {
    return { ok: false, status: 415, code: 'unsupported_media_type' };
  }

  const declaredLength = Number(request.headers.get('content-length') ?? 0);
  if (declaredLength > MAX_BODY_BYTES) {
    return { ok: false, status: 413, code: 'payload_too_large' };
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return { ok: false, status: 413, code: 'payload_too_large' };
  }

  try {
    return { ok: true, body: JSON.parse(raw) };
  } catch {
    return { ok: false, status: 400, code: 'invalid_json' };
  }
}
