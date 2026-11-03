import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { supabaseConfig } from './env';

/**
 * Refreshes the Supabase auth cookies for `/admin` requests. It never
 * redirects — the dashboard layout owns that decision — so `/admin/login`
 * cannot loop.
 */
export async function updateSession(request: NextRequest) {
  const config = supabaseConfig();

  if (!config) {
    return NextResponse.next({ request });
  }

  let response = NextResponse.next({ request });

  const supabase = createServerClient(config.url, config.key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });

        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });

        Object.entries(headers ?? {}).forEach(([key, value]) => {
          response.headers.set(key, value);
        });
      }
    }
  });

  try {
    await supabase.auth.getUser();
  } catch {
    // A refresh failure should not take the whole admin route down; the
    // dashboard layout will see no user and redirect to the login page.
  }

  return response;
}
