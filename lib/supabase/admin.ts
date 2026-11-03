import 'server-only';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { supabaseAdminConfig } from './env';

/**
 * Privileged, cookie-less client. Only for scripts and server-only tasks that
 * genuinely need to bypass RLS. Never import this from a Client Component or
 * expose the secret key through a `NEXT_PUBLIC_` variable.
 */
export function createAdminClient() {
  const config = supabaseAdminConfig();

  if (!config) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not configured');
  }

  return createSupabaseClient<Database>(config.url, config.key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
}
