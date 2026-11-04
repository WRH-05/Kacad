import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';
import { parseCourseCreate, parseCourseUpdate } from '@/lib/courses/admin';
import { locales } from '@/lib/i18n';
import { createClient } from '@/lib/supabase/server';

function json(body: unknown, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: { 'cache-control': 'no-store' }
  });
}

function revalidateCourse(slug: string) {
  revalidateTag('courses');
  revalidatePath('/[locale]', 'layout');

  for (const locale of locales) {
    revalidatePath(`/${locale}/courses/${slug}`, 'page');
  }
}

export async function POST(request: NextRequest) {
  let supabase;

  try {
    supabase = await createClient();
  } catch {
    return json({ ok: false, code: 'not_configured' }, 500);
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return json({ ok: false, code: 'unauthorized' }, 401);
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');

  if (adminError || !isAdmin) {
    return json({ ok: false, code: 'forbidden' }, 403);
  }

  const parsed = parseCourseCreate(await request.json().catch(() => null));

  if (!parsed.ok) {
    return json({ ok: false, code: 'validation_failed', fields: parsed.fields }, 400);
  }

  const { data, error } = await supabase
    .from('courses')
    .insert(parsed.value)
    .select('id')
    .single();

  if (error) {
    if (error.code === '23505') {
      return json({ ok: false, code: 'slug_taken' }, 409);
    }

    console.error('[admin] course create failed:', error.message);
    return json({ ok: false, code: 'db_error' }, 500);
  }

  revalidateCourse(parsed.value.id);

  return json({ ok: true, id: data?.id ?? parsed.value.id });
}

export async function PATCH(request: NextRequest) {
  let supabase;

  try {
    supabase = await createClient();
  } catch {
    return json({ ok: false, code: 'not_configured' }, 500);
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return json({ ok: false, code: 'unauthorized' }, 401);
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');

  if (adminError || !isAdmin) {
    return json({ ok: false, code: 'forbidden' }, 403);
  }

  const parsed = parseCourseUpdate(await request.json().catch(() => null));

  if (!parsed.ok) {
    return json({ ok: false, code: 'validation_failed', fields: parsed.fields }, 400);
  }

  const { data, error } = await supabase
    .from('courses')
    .update(parsed.update)
    .eq('id', parsed.id)
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('[admin] course update failed:', error.message);
    return json({ ok: false, code: 'db_error' }, 500);
  }

  if (!data) {
    return json({ ok: false, code: 'not_found' }, 404);
  }

  revalidateCourse(parsed.id);

  return json({ ok: true });
}
