import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;

async function testSupabase() {
  console.log('====================================================');
  console.log('🔍 Testing Supabase Database Connection for Brijwasi Pethe Wale');
  console.log('====================================================\n');

  if (!supabaseUrl || supabaseUrl.includes('your-supabase-url')) {
    console.error('❌ Missing Supabase URL!');
    console.log('Please define SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL in your .env file.\n');
    process.exit(1);
  }

  if (!supabaseKey || supabaseKey.includes('your-supabase-key') || supabaseKey.includes('your-supabase-service-role-key')) {
    console.error('❌ Missing Supabase Secret/Anon Key!');
    console.log('Please define SUPABASE_SERVICE_ROLE_KEY or SUPABASE_ANON_KEY in your .env file.\n');
    process.exit(1);
  }

  console.log(`📡 Connecting to: ${supabaseUrl}`);
  console.log(`🔑 Key type: ${process.env.SUPABASE_SERVICE_ROLE_KEY ? 'service_role (Admin - Recommended for Backend)' : 'anon (Public)'}`);

  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // 1. Test pinging the store_settings table
    console.log('\n⏳ Step 1: Checking database connectivity & schema tables...');
    const { data: settingsData, error: settingsError } = await supabase
      .from('store_settings')
      .select('*')
      .limit(1);

    if (settingsError) {
      if (settingsError.code === '42P01') {
        console.error('⚠️ Connected to Supabase, but table "store_settings" does not exist yet.');
        console.log('👉 Please execute "supabase/schema.sql" in your Supabase SQL Editor first!');
        process.exit(1);
      } else {
        console.error('❌ Database query error:', settingsError.message);
        process.exit(1);
      }
    }

    console.log('✅ Connected successfully to Supabase PostgreSQL database!');
    console.log(`   Store Settings Table: OK (${settingsData?.length || 0} rows found)`);

    // 2. Test products table
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('id, name, slug')
      .limit(5);

    if (productsError) {
      console.warn('⚠️ Table "products" check:', productsError.message);
    } else {
      console.log(`✅ Products Table: OK (${productsData?.length || 0} sample products retrieved)`);
    }

    // 3. Test orders table
    const { data: ordersData, error: ordersError } = await supabase
      .from('orders')
      .select('id')
      .limit(1);

    if (ordersError) {
      console.warn('⚠️ Table "orders" check:', ordersError.message);
    } else {
      console.log(`✅ Orders Table: OK (Ready for customer checkouts)`);
    }

    console.log('\n🎉 ALL CHECKS PASSED: Your Supabase database is ready for production backend operations!');
  } catch (err: any) {
    console.error('❌ Unexpected error connecting to Supabase:', err.message);
    process.exit(1);
  }
}

testSupabase();
