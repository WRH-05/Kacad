import { NextRequest, NextResponse, after } from 'next/server';
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

async function persistLead(input: {
  courseId: string;
  name: string;
  contact: string;
  ageGroup: string;
  notes?: string;
  locale: string;
}): Promise<string | null> {
  const client = createPublicClient();

  if (!client) {
    return null;
  }

  try {
    const { data: course, error: courseError } = await client
      .from('courses')
      .select('brochure_url')
      .eq('id', input.courseId)
      .maybeSingle();

    if (courseError) {
      console.error('[waitlist] course lookup failed:', courseError.message);
    }

    const { error: insertError } = await client.from('waitlist_leads').insert({
      course_id: input.courseId,
      name: input.name,
      contact: input.contact,
      age_group: input.ageGroup,
      notes: input.notes ?? null,
      locale: input.locale
    });

    if (insertError) {
      console.error('[waitlist] lead insert failed:', insertError.message);
    }

    return course?.brochure_url ?? null;
  } catch (error) {
    console.error('[waitlist] persistence threw:', error);
    return null;
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

  const storedBrochure = isBot
    ? null
    : await persistLead({
        courseId: safe.courseId,
        name: safe.name,
        contact: safe.contact,
        ageGroup: safe.ageGroup,
        notes: safe.notes,
        locale: safe.locale
      });

  const webhook = process.env.WAITLIST_WEBHOOK_URL;
  if (!isBot && webhook) {
    after(() => forwardWebhook(webhook, payload));
  } else if (!webhook && !isBot) {
    console.warn('[waitlist] WAITLIST_WEBHOOK_URL is not configured; lead stored in Supabase only');
  }

  const brochureUrl =
    storedBrochure ||
    process.env.BROCHURE_URL ||
    `/brochures/${safe.courseId}-syllabus.pdf`;

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
