import { NextRequest, NextResponse, after } from 'next/server';
import { isCourseId } from '@/content/courses';
import { createPublicClient } from '@/lib/supabase/public';
import { parseWaitlist, readJsonBody } from '@/lib/validation';
import { forwardWebhook } from '@/lib/webhook';

function withDownload(url: string, filename: string): string {
  if (!/^https?:\/\//i.test(url)) {
    return url;
  }

  const separator = url.includes('?') ? '&' : '?';

  return `${url}${separator}download=${encodeURIComponent(filename)}`;
}

type PersistResult =
  | { ok: true; brochureUrl: string | null }
  | { ok: false; code: 'course_not_found' };

type LeadInput = {
  courseId: string;
  name: string;
  contact: string;
  ageGroup: string;
  notes?: string;
  locale: string;
};

async function insertLead(
  client: NonNullable<ReturnType<typeof createPublicClient>>,
  input: LeadInput,
  brochureUrl: string | null
): Promise<PersistResult> {
  const { error } = await client.from('waitlist_leads').insert({
    course_id: input.courseId,
    name: input.name,
    contact: input.contact,
    age_group: input.ageGroup,
    notes: input.notes ?? null,
    locale: input.locale
  });

  if (error) {
    console.error('[waitlist] lead insert failed:', error.message);

    if (error.code === '23503') {
      return { ok: false, code: 'course_not_found' };
    }
  }

  return { ok: true, brochureUrl };
}

async function persistLead(input: LeadInput): Promise<PersistResult> {
  const client = createPublicClient();

  if (!client) {
    // Static fallback mode: only the eight bundled programmes exist.
    return isCourseId(input.courseId)
      ? { ok: true, brochureUrl: null }
      : { ok: false, code: 'course_not_found' };
  }

  try {
    const { data: course, error: courseError } = await client
      .from('courses')
      .select('brochure_url')
      .eq('id', input.courseId)
      .maybeSingle();

    if (courseError) {
      console.error('[waitlist] course lookup failed:', courseError.message);
      // A transient read failure must not block conversion; the insert below
      // still carries the FK check.
      return insertLead(client, input, null);
    }

    if (!course && !isCourseId(input.courseId)) {
      return { ok: false, code: 'course_not_found' };
    }

    return insertLead(client, input, course?.brochure_url ?? null);
  } catch (error) {
    console.error('[waitlist] persistence threw:', error);
    return { ok: true, brochureUrl: null };
  }
}

export async function POST(request: NextRequest) {
  const body = await readJsonBody(request);
  if (!body.ok) {
    return NextResponse.json(
      { ok: false, code: body.code },
      { status: body.status, headers: { 'cache-control': 'no-store' } }
    );
  }

  const parsed = parseWaitlist(body.body);
  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, code: 'validation_failed', fields: parsed.fields },
      { status: 400, headers: { 'cache-control': 'no-store' } }
    );
  }

  // Honeypot: a filled "website" field gets the normal success shape but is
  // never stored or forwarded, so bots cannot learn that they were filtered.
  const { website, ...safe } = parsed.value;
  const isBot = Boolean(website);
  const payload = {
    type: 'waitlist',
    ...safe,
    receivedAt: new Date().toISOString()
  };

  const persisted: PersistResult = isBot
    ? { ok: true, brochureUrl: null }
    : await persistLead({
        courseId: safe.courseId,
        name: safe.name,
        contact: safe.contact,
        ageGroup: safe.ageGroup,
        notes: safe.notes,
        locale: safe.locale
      });

  if (!persisted.ok) {
    return NextResponse.json(
      { ok: false, code: 'validation_failed', fields: { courseId: 'invalid' } },
      { status: 400, headers: { 'cache-control': 'no-store' } }
    );
  }

  const webhook = process.env.WAITLIST_WEBHOOK_URL;
  if (!isBot && webhook) {
    after(() => forwardWebhook(webhook, payload));
  } else if (!webhook && !isBot) {
    console.warn('[waitlist] WAITLIST_WEBHOOK_URL is not configured; lead stored in Supabase only');
  }

  const fallback = isCourseId(safe.courseId)
    ? `/brochures/${safe.courseId}-syllabus.pdf`
    : '/brochures/kennedy-academy-syllabus.pdf';

  const brochureUrl = persisted.brochureUrl || process.env.BROCHURE_URL || fallback;

  return NextResponse.json(
    {
      ok: true,
      brochureUrl: withDownload(brochureUrl, `${safe.courseId}-syllabus.pdf`)
    },
    { headers: { 'cache-control': 'no-store' } }
  );
}

export function GET() {
  return NextResponse.json(
    { ok: false, code: 'method_not_allowed' },
    { status: 405, headers: { allow: 'POST' } }
  );
}
