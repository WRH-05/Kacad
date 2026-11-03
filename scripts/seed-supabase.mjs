import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';
import { buildRecords, root } from './seed-data.mjs';

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

const timestamp = Date.now();
const records = buildRecords();

function storagePathFromUrl(publicUrl) {
  if (!publicUrl) return null;

  const marker = '/object/public/brochures/';
  const index = publicUrl.indexOf(marker);

  return index === -1 ? null : decodeURIComponent(publicUrl.slice(index + marker.length));
}

async function seedCourse(record) {
  const localPath = path.join(root, 'public', 'brochures', `${record.id}-syllabus.pdf`);
  const file = await readFile(localPath);
  const storagePath = `${record.id}/syllabus-${timestamp}.pdf`;

  const { error: uploadError } = await supabase.storage
    .from('brochures')
    .upload(storagePath, file, { contentType: 'application/pdf', upsert: false });

  if (uploadError) {
    throw new Error(`Upload failed for ${record.id}: ${uploadError.message}`);
  }

  const { data: publicUrlData } = supabase.storage.from('brochures').getPublicUrl(storagePath);

  const { data: previous } = await supabase
    .from('courses')
    .select('brochure_url')
    .eq('id', record.id)
    .maybeSingle();

  const row = { ...record, brochure_url: publicUrlData.publicUrl };

  const { error: upsertError } = await supabase
    .from('courses')
    .upsert(row, { onConflict: 'id' });

  if (upsertError) {
    throw new Error(`Upsert failed for ${record.id}: ${upsertError.message}`);
  }

  const oldPath = storagePathFromUrl(previous?.brochure_url);

  if (oldPath && oldPath !== storagePath) {
    const { error: removeError } = await supabase.storage.from('brochures').remove([oldPath]);

    if (removeError) {
      console.warn(`Could not remove previous brochure ${oldPath}: ${removeError.message}`);
    }
  }

  console.log(`seeded ${record.id} -> ${storagePath}`);
}

async function main() {
  for (const record of records) {
    await seedCourse(record);
  }

  console.log(`\nSeeded ${records.length} courses.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
