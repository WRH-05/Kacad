import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/admin/login-form';

export const metadata: Metadata = {
  title: 'Sign in'
};

export default function AdminLoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <div className="border border-ink bg-surface p-8 sm:p-10">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-accent">
            Kennedy Academy Admin
          </p>
          <h1 className="mt-4 font-serif text-4xl leading-tight text-ink">Sign in</h1>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            Course CMS and admissions leads. Authorised staff only.
          </p>

          <LoginForm />
        </div>

        <div className="mt-6 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.2em] text-ink-muted">
          <Link href="/en" className="transition hover:text-accent">
            ← Back to site
          </Link>
          <span>El Biar · Algiers</span>
        </div>
      </div>
    </main>
  );
}
