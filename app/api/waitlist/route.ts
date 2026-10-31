import { NextRequest, NextResponse, after } from 'next/server';
import { parseWaitlist, readJsonBody } from '@/lib/validation';
import { forwardWebhook } from '@/lib/webhook';

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
  // never forwarded, so bots cannot learn that they were filtered.
  const { website, ...safe } = parsed.value;
  const payload = {
    type: 'waitlist',
    ...safe,
    receivedAt: new Date().toISOString()
  };

  const webhook = process.env.WAITLIST_WEBHOOK_URL;
  if (!website && webhook) {
    after(() => forwardWebhook(webhook, payload));
  } else if (!webhook && !website) {
    console.warn('[waitlist] WAITLIST_WEBHOOK_URL is not configured; brochure returned only');
  }

  return NextResponse.json(
    {
      ok: true,
      brochureUrl:
        process.env.BROCHURE_URL || '/brochures/kennedy-academy-syllabus.pdf'
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
