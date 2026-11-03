'use client';

import { useActionState } from 'react';
import { loginAction } from '@/app/admin/actions';
import type { LoginState } from '@/lib/courses/admin';

const initialState: LoginState = { error: null };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <div>
        <label
          htmlFor="admin-email"
          className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted"
        >
          Email
        </label>
        <input
          id="admin-email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="w-full border border-line/80 bg-surface-raised px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 focus:border-accent focus:ring-accent/20"
          placeholder="you@kennedyacademy.dz"
        />
      </div>

      <div>
        <label
          htmlFor="admin-password"
          className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted"
        >
          Password
        </label>
        <input
          id="admin-password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full border border-line/80 bg-surface-raised px-3 py-2.5 text-sm text-ink placeholder:text-ink-muted/60 focus:border-accent focus:ring-accent/20"
        />
      </div>

      {state.error ? (
        <p
          role="alert"
          className="border border-rubric/40 bg-rubric/5 px-3 py-2 text-xs leading-relaxed text-rubric"
        >
          {state.error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full bg-accent px-5 py-3 font-mono text-[10px] uppercase tracking-[0.2em] text-accent-ink transition hover:bg-accent/90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
    </form>
  );
}
