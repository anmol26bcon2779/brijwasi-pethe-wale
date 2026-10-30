import dotenv from 'dotenv';
import { db, supabase } from '../server/db.js';

dotenv.config();

async function run() {
  console.log('====================================================');
  console.log('🚀 Migrating Brijwasi Pethe Wale Delicacies into Supabase');
  console.log('====================================================\n');

  if (!supabase) {
    console.error('❌ Supabase client is not connected!');
    console.log('Please ensure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env');
    process.exit(1);
  }

  const result = await db.seedInitialData();
  console.log('\nMigration Result:');
  console.log(JSON.stringify(result, null, 2));

  if (result.success) {
    console.log('\n🎉 Successfully migrated all 14 authentic products into Supabase!');
  } else {
    console.error('\n⚠️ Migration encountered an issue:', result.message);
  }
}

run().catch(console.error);
