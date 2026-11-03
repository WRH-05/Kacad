import { createBrowserClient } from '@supabase/ssr';
import type { Database } from '@/types/database';
import { supabaseConfig } from './env';

/**
 * Browser Supabase client. Call this inside event handlers or effects —
 * never at module scope, where prerendering would execute it on the server
 * and throw when the environment is not configured.
 */
export function createClient() {
  const config = supabaseConfig();

  if (!config) {
    throw new Error('Supabase is not configured');
  }

  return createBrowserClient<Database>(config.url, config.key);
}
