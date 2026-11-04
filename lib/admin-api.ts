import 'server-only';
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

type ServerClient = Awaited<ReturnType<typeof createClient>>;

export function jsonResponse(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { 'cache-control': 'no-store' }
  });
}

type AdminGuard =
  | { ok: true; supabase: ServerClient }
  | { ok: false; response: NextResponse };

/** Shared session + allowlist check for `/api/admin/*` route handlers. */
export async function requireAdmin(): Promise<AdminGuard> {
  let supabase: ServerClient;

  try {
    supabase = await createClient();
  } catch {
    return { ok: false, response: jsonResponse({ ok: false, code: 'not_configured' }, 500) };
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, response: jsonResponse({ ok: false, code: 'unauthorized' }, 401) };
  }

  const { data: isAdmin, error } = await supabase.rpc('is_admin');

  if (error || !isAdmin) {
    return { ok: false, response: jsonResponse({ ok: false, code: 'forbidden' }, 403) };
  }

  return { ok: true, supabase };
}
