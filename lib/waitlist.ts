import type { CourseId } from '@/content/courses';

export const waitlistAgeGroups = ['kids', 'juniors', 'adults'] as const;
export type WaitlistAgeGroup = (typeof waitlistAgeGroups)[number];

export type WaitlistInput = {
  courseId: CourseId;
  name: string;
  contact: string;
  ageGroup: WaitlistAgeGroup;
  notes?: string;
  locale: 'en' | 'fr';
  consent: true;
  website: string;
};

export type ContactInput = {
  name: string;
  email: string;
  phone?: string;
  message: string;
  locale: 'en' | 'fr';
  consent: true;
  website: string;
};

export type FieldError = 'required' | 'invalid' | 'too_long';

export type ApiFailure = {
  ok: false;
  code:
    | 'invalid_json'
    | 'payload_too_large'
    | 'unsupported_media_type'
    | 'validation_failed'
    | 'method_not_allowed'
    | 'not_configured'
    | 'server_error';
  fields?: Record<string, FieldError>;
};
