import { randomBytes } from 'node:crypto';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { root } from './seed-data.mjs';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'wrhachemi@gmail.com';
const envPath = path.join(root, '.env.local');

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    'Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Run with --env-file=.env.local.'
  );
  process.exit(1);
}

const supabase = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false }
});

async function readEnvFile() {
  try {
    return await readFile(envPath, 'utf8');
  } catch {
    return '';
  }
}

async function persistCredentials(password) {
  const current = await readEnvFile();
  const lines = [];

  if (!/^ADMIN_EMAIL=/m.test(current)) {
    lines.push(`ADMIN_EMAIL=${ADMIN_EMAIL}`);
  }
  if (!/^ADMIN_PASSWORD=/m.test(current)) {
    lines.push(`ADMIN_PASSWORD=${password}`);
  }

  if (lines.length > 0) {
    const separator = current.length > 0 && !current.endsWith('\n') ? '\n' : '';
    await writeFile(envPath, `${current}${separator}${lines.join('\n')}\n`, 'utf8');
  }
}

async function findExistingUser() {
  let page = 1;

  while (page <= 10) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 200 });

    if (error) {
      throw new Error(`Could not list auth users: ${error.message}`);
    }

    const match = data.users.find(
      (user) => user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
    );

    if (match) return match;
    if (data.users.length < 200) return null;

    page += 1;
  }

  return null;
}

async function main() {
  const existing = await findExistingUser();
  let userId = existing?.id;
  let password = null;

  if (!existing) {
    password = randomBytes(24).toString('base64url');

    const { data, error } = await supabase.auth.admin.createUser({
      email: ADMIN_EMAIL,
      password,
      email_confirm: true
    });

    if (error) {
      throw new Error(`Could not create admin user: ${error.message}`);
    }

    userId = data.user?.id;
    await persistCredentials(password);
  } else if (!/^ADMIN_PASSWORD=/m.test(await readEnvFile())) {
    // The account already existed and we do not know its password. Generate a
    // fresh temporary one so the documented login is usable.
    password = randomBytes(24).toString('base64url');

    const { error } = await supabase.auth.admin.updateUserById(existing.id, { password });

    if (error) {
      throw new Error(`Could not reset admin password: ${error.message}`);
    }

    await persistCredentials(password);
  }

  const { error: allowlistError } = await supabase
    .from('admin_users')
    .upsert({ email: ADMIN_EMAIL.toLowerCase() }, { onConflict: 'email' });

  if (allowlistError) {
    throw new Error(`Could not add admin to allowlist: ${allowlistError.message}`);
  }

  console.log(`admin ready: ${ADMIN_EMAIL} (user ${userId})`);
  console.log('Password stored in .env.local as ADMIN_PASSWORD (never printed).');
  console.log('Rotate it from the Supabase dashboard when convenient.');
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
