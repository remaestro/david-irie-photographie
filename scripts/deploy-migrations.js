import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

// Charger les variables d'environnement
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Configuration Supabase
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Variables d\'environnement manquantes!');
  console.error('Assurez-vous que VITE_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont définies dans .env');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

async function deploySchema() {
  try {
    console.log('🚀 Déploiement du schéma Supabase...\n');

    // Lire le fichier SQL
    const schemaPath = join(__dirname, '..', 'supabase-schema.sql');
    const schema = readFileSync(schemaPath, 'utf-8');

    console.log(`📝 Exécution du schéma SQL...\n`);

    // Exécuter le schéma complet
    const { data, error } = await supabase.rpc('exec_sql', { sql: schema });

    if (error) {
      console.error('❌ Erreur lors du déploiement:', error.message);
      console.log('\n💡 Alternative: Utilisez le SQL Editor de Supabase');
      console.log('   1. Copiez le contenu de supabase-schema.sql');
      console.log('   2. Dashboard → SQL Editor → New Query');
      console.log('   3. Collez et exécutez');
      console.log(`\n🔗 https://supabase.com/dashboard/project/fjdkdoantfcwbnsqghlj/sql`);
      process.exit(1);
    }

    console.log('✅ Schéma déployé avec succès!\n');
    console.log('🔗 Vérifiez votre base de données:');
    console.log('   https://supabase.com/dashboard/project/fjdkdoantfcwbnsqghlj/editor');
    
  } catch (error) {
    console.error('❌ Erreur inattendue:', error.message);
    process.exit(1);
  }
}

deploySchema();
