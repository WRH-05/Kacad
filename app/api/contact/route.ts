import { NextRequest, NextResponse } from 'next/server';
import { parseContact, readJsonBody } from '@/lib/validation';
import { forwardWebhook } from '@/lib/webhook';

export async function POST(request: NextRequest) {
  const body = await readJsonBody(request);
  if (!body.ok) {
    return NextResponse.json(
      { ok: false, code: body.code },
      { status: body.status, headers: { 'cache-control': 'no-store' } }
    );
  }

  const parsed = parseContact(body.body);
  if (!parsed.ok) {
    return NextResponse.json(
      { ok: false, code: 'validation_failed', fields: parsed.fields },
      { status: 400, headers: { 'cache-control': 'no-store' } }
    );
  }

  const webhook = process.env.CONTACT_WEBHOOK_URL || process.env.WAITLIST_WEBHOOK_URL;

  if (!webhook) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(
        '[contact] no webhook configured; accepting development submission without forwarding'
      );
      return NextResponse.json(
        { ok: true },
        { headers: { 'cache-control': 'no-store' } }
      );
    }

    return NextResponse.json(
      { ok: false, code: 'not_configured' },
      { status: 503, headers: { 'cache-control': 'no-store' } }
    );
  }

  const { website, ...safe } = parsed.value;

  // Silent success for bots.
  if (website) {
    return NextResponse.json(
      { ok: true },
      { headers: { 'cache-control': 'no-store' } }
    );
  }

  const delivered = await forwardWebhook(webhook, {
    type: 'contact',
    ...safe,
    receivedAt: new Date().toISOString()
  });

  if (!delivered) {
    return NextResponse.json(
      { ok: false, code: 'server_error' },
      { status: 502, headers: { 'cache-control': 'no-store' } }
    );
  }

  return NextResponse.json(
    { ok: true },
    { headers: { 'cache-control': 'no-store' } }
  );
}

export function GET() {
  return NextResponse.json(
    { ok: false, code: 'method_not_allowed' },
    { status: 405, headers: { allow: 'POST' } }
  );
}
