'use server';

import { redirect } from 'next/navigation';
import type { LoginState } from '@/lib/courses/admin';
import { createClient } from '@/lib/supabase/server';

export async function loginAction(
  _previous: LoginState,
  formData: FormData
): Promise<LoginState> {
  const email = String(formData.get('email') ?? '').trim();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { error: 'Enter your email and password.' };
  }

  let supabase;

  try {
    supabase = await createClient();
  } catch {
    return { error: 'Supabase is not configured on this deployment.' };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: 'Incorrect email or password.' };
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');

  if (adminError || !isAdmin) {
    await supabase.auth.signOut();
    return { error: 'This account does not have admin access.' };
  }

  redirect('/admin');
}
