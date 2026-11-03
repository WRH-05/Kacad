export type SupabaseConfig = {
  url: string;
  key: string;
};

/**
 * Public Supabase configuration (browser + server reads).
 *
 * `NEXT_PUBLIC_*` values are inlined at build time, so a rebuild is required
 * after changing them. Returns null when the project has not been configured,
 * letting the site fall back to local content instead of throwing at build.
 */
export function supabaseConfig(): SupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = (
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  )?.trim();

  return url && key ? { url, key } : null;
}

/**
 * Privileged configuration for scripts and server-only maintenance tasks.
 * The secret key must never be exposed through a `NEXT_PUBLIC_` variable.
 */
export function supabaseAdminConfig(): SupabaseConfig | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  return url && key ? { url, key } : null;
}
