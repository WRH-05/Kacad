import { revalidatePath, revalidateTag } from 'next/cache';
import { NextRequest } from 'next/server';
import { isCourseSlug } from '@/content/courses';
import { jsonResponse, requireAdmin } from '@/lib/admin-api';
import { parseCourseCreate, parseCourseUpdate } from '@/lib/courses/admin';
import { locales } from '@/lib/i18n';

function revalidateCourse(slug: string) {
  revalidateTag('courses');
  revalidatePath('/[locale]', 'layout');

  for (const locale of locales) {
    revalidatePath(`/${locale}/courses/${slug}`, 'page');
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return auth.response;
  }

  const parsed = parseCourseCreate(await request.json().catch(() => null));

  if (!parsed.ok) {
    return jsonResponse({ ok: false, code: 'validation_failed', fields: parsed.fields }, 400);
  }

  const { data, error } = await auth.supabase
    .from('courses')
    .insert(parsed.value)
    .select('id')
    .single();

  if (error) {
    if (error.code === '23505') {
      return jsonResponse({ ok: false, code: 'slug_taken' }, 409);
    }

    console.error('[admin] course create failed:', error.message);
    return jsonResponse({ ok: false, code: 'db_error' }, 500);
  }

  revalidateCourse(parsed.value.id);

  return jsonResponse({ ok: true, id: data?.id ?? parsed.value.id });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return auth.response;
  }

  const parsed = parseCourseUpdate(await request.json().catch(() => null));

  if (!parsed.ok) {
    return jsonResponse({ ok: false, code: 'validation_failed', fields: parsed.fields }, 400);
  }

  const { data, error } = await auth.supabase
    .from('courses')
    .update(parsed.update)
    .eq('id', parsed.id)
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('[admin] course update failed:', error.message);
    return jsonResponse({ ok: false, code: 'db_error' }, 500);
  }

  if (!data) {
    return jsonResponse({ ok: false, code: 'not_found' }, 404);
  }

  revalidateCourse(parsed.id);

  return jsonResponse({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const auth = await requireAdmin();

  if (!auth.ok) {
    return auth.response;
  }

  const id = request.nextUrl.searchParams.get('id');

  if (!id || !isCourseSlug(id)) {
    return jsonResponse({ ok: false, code: 'validation_failed' }, 400);
  }

  const { count, error: countError } = await auth.supabase
    .from('waitlist_leads')
    .select('*', { count: 'exact', head: true })
    .eq('course_id', id)
    .in('status', ['new', 'contacted']);

  if (countError) {
    console.error('[admin] active lead count failed:', countError.message);
    return jsonResponse({ ok: false, code: 'db_error' }, 500);
  }

  if ((count ?? 0) > 0) {
    return jsonResponse({ ok: false, code: 'active_leads', activeLeads: count }, 409);
  }

  const { data, error } = await auth.supabase
    .from('courses')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle();

  if (error) {
    // Defensive: the FK is SET NULL, but keep a clear conflict if it ever restarts.
    if (error.code === '23503') {
      return jsonResponse({ ok: false, code: 'has_leads' }, 409);
    }

    console.error('[admin] course delete failed:', error.message);
    return jsonResponse({ ok: false, code: 'db_error' }, 500);
  }

  if (!data) {
    return jsonResponse({ ok: false, code: 'not_found' }, 404);
  }

  revalidateCourse(id);

  return jsonResponse({ ok: true });
}
