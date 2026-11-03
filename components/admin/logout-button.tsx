'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function LogoutButton() {
  const [pending, setPending] = useState(false);

  async function signOut() {
    setPending(true);

    try {
      await createClient().auth.signOut();
    } catch {
      // The cookies are cleared server-side by the login page on the next
      // navigation even if the client sign-out request fails.
    }

    window.location.assign('/admin/login');
  }

  return (
    <button
      type="button"
      onClick={signOut}
      disabled={pending}
      className="border border-current px-3 py-1.5 font-mono text-[9px] uppercase tracking-[0.18em] transition hover:opacity-70 disabled:cursor-not-allowed disabled:opacity-50"
    >
      {pending ? 'Signing out…' : 'Log out'}
    </button>
  );
}
