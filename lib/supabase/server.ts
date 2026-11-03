import 'server-only';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';
import { supabaseConfig } from './env';

/**
 * Cookie-bound Supabase client for Server Components, Server Actions and
 * Route Handlers. A new client must be created for each request.
 */
export async function createClient() {
  const config = supabaseConfig();

  if (!config) {
    throw new Error('Supabase is not configured');
  }

  const cookieStore = await cookies();

  return createServerClient<Database>(config.url, config.key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // Server Components cannot write cookies. Middleware or the Server
          // Action/Route Handler that produced this render will refresh them.
        }
      }
    }
  });
}
