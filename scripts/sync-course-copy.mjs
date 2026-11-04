import { createClient } from '@supabase/supabase-js';
import { buildRecords } from './seed-data.mjs';

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

async function main() {
  const records = buildRecords();

  for (const record of records) {
    // Copy-only: operational fields (cohort, schedule, seats, mentor, brochure)
    // and structural fields are deliberately left untouched.
    const copy = {
      title: record.title,
      description: record.description,
      lede: record.lede,
      highlights: record.highlights,
      outcomes: record.outcomes,
      tools: record.tools,
      modules: record.modules,
      capstone: record.capstone
    };

    const { error } = await supabase.from('courses').update(copy).eq('id', record.id);

    if (error) {
      throw new Error(`Copy sync failed for ${record.id}: ${error.message}`);
    }

    console.log(`copy synced: ${record.id}`);
  }

  console.log(`\nSynced copy for ${records.length} courses.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
