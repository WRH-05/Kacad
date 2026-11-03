import type { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { LogoutButton } from '@/components/admin/logout-button';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function AdminDashboardLayout({ children }: { children: ReactNode }) {
  const supabase = await createClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/admin/login');
  }

  const { data: isAdmin, error: adminError } = await supabase.rpc('is_admin');

  if (adminError || !isAdmin) {
    return (
      <main className="flex min-h-screen items-center justify-center px-6 py-16 text-ink">
        <div className="w-full max-w-xl border border-ink bg-surface p-8 sm:p-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-rubric">
            Access denied
          </p>
          <h1 className="mt-4 font-serif text-3xl leading-tight">
            This account is not on the admin allowlist.
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">
            Ask the academy owner to add <span className="text-ink">{user.email}</span> to the
            admin list, then sign in again.
          </p>
          <div className="mt-8">
            <LogoutButton />
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-surface text-ink">
      <header className="border-b-4 border-ink bg-ink text-surface">
        <div className="section-shell flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="font-mono text-[11px] uppercase tracking-[0.26em]">
              Kennedy Academy Admin
            </span>
            <span className="font-mono text-[8px] uppercase tracking-[0.2em] text-surface/50">
              El Biar · Algiers
            </span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-mono text-[9px] tracking-[0.12em] text-surface/60">
              {user.email}
            </span>
            <LogoutButton />
          </div>
        </div>
      </header>

      {children}
    </div>
  );
}
