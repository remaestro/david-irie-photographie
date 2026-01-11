const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://fjdkdoantfcwbnsqghlj.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

async function runMigration() {
  console.log('🔨 Migration: Ajout colonne category à la table photos');
  console.log('');
  
  const sql = fs.readFileSync('add-category-column.sql', 'utf8');
  
  if (!supabaseServiceKey) {
    console.error('⚠️  SUPABASE_SERVICE_KEY non définie');
    console.log('');
    console.log('📝 Veuillez exécuter la migration manuellement dans Supabase SQL Editor:');
    console.log('🔗 https://supabase.com/dashboard/project/fjdkdoantfcwbnsqghlj/sql');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('Migration SQL à exécuter:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(sql);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    process.exit(0);
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  
  const { data, error } = await supabase.rpc('exec_sql', { query: sql });
  
  if (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  } else {
    console.log('✅ Migration réussie!');
    console.log('✅ Colonne category ajoutée à la table photos');
  }
}

runMigration();
