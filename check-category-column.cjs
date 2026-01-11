const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://fjdkdoantfcwbnsqghlj.supabase.co';
const supabaseAnonKey = fs.readFileSync('/tmp/supabase_key.txt', 'utf8').trim();

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkColumn() {
  console.log('🔍 Vérification de la colonne category...\n');
  
  // Essayer de récupérer les photos avec la colonne category
  const { data, error } = await supabase
    .from('photos')
    .select('id, filename, category')
    .limit(5);
  
  if (error) {
    console.error('❌ Erreur:', error.message);
    if (error.message.includes('category')) {
      console.log('\n⚠️  La colonne "category" n\'existe pas encore dans la table photos');
      console.log('📝 Vous devez exécuter la migration SQL dans Supabase SQL Editor');
      console.log('🔗 https://supabase.com/dashboard/project/fjdkdoantfcwbnsqghlj/sql');
    }
    return false;
  } else {
    console.log('✅ Colonne category existe!');
    console.log('Photos récupérées:', data.length);
    if (data.length > 0) {
      console.log('\nExemple:');
      data.forEach(p => console.log(`- ${p.filename}: category="${p.category || 'null'}"`));
    }
    return true;
  }
}

checkColumn();
