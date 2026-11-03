import 'server-only';
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';
import { supabaseConfig } from './env';

/**
 * Cookie-less publishable-key client for cached public reads. It must not read
 * request state so it can be used from inside `unstable_cache`.
 */
export function createPublicClient() {
  const config = supabaseConfig();

  if (!config) {
    return null;
  }

  return createSupabaseClient<Database>(config.url, config.key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false
    }
  });
}
