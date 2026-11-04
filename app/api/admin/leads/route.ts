import { NextRequest } from 'next/server';
import { jsonResponse, requireAdmin } from '@/lib/admin-api';
import { isLeadStatus } from '@/lib/courses/admin';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return auth.response;
  }

  const body = (await request.json().catch(() => null)) as {
    id?: unknown;
    status?: unknown;
  } | null;

  if (typeof body?.id !== 'string' || !UUID_RE.test(body.id) || !isLeadStatus(body.status)) {
    return jsonResponse({ ok: false, code: 'validation_failed' }, 400);
  }

  const { data, error } = await auth.supabase
    .from('waitlist_leads')
    .update({ status: body.status })
    .eq('id', body.id)
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('[admin] lead update failed:', error.message);
    return jsonResponse({ ok: false, code: 'db_error' }, 500);
  }

  if (!data) {
    return jsonResponse({ ok: false, code: 'not_found' }, 404);
  }

  return jsonResponse({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return auth.response;
  }

  const id = request.nextUrl.searchParams.get('id');

  if (!id || !UUID_RE.test(id)) {
    return jsonResponse({ ok: false, code: 'validation_failed' }, 400);
  }

  const { data, error } = await auth.supabase
    .from('waitlist_leads')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('[admin] lead delete failed:', error.message);
    return jsonResponse({ ok: false, code: 'db_error' }, 500);
  }

  if (!data) {
    return jsonResponse({ ok: false, code: 'not_found' }, 404);
  }

  return jsonResponse({ ok: true });
}
