const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = 'https://fjdkdoantfcwbnsqghlj.supabase.co';
const supabaseAnonKey = fs.readFileSync(process.env.HOME + '/.config/gcloud/supabase_anon_key.txt', 'utf8').trim();

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testInsert() {
  console.log('🧪 Test d\'insertion avec catégorie...\n');
  
  // Récupérer une vraie galerie existante
  const { data: galleries } = await supabase
    .from('galleries')
    .select('id, name')
    .limit(1);
  
  if (!galleries || galleries.length === 0) {
    console.error('❌ Aucune galerie trouvée');
    return;
  }
  
  const galleryId = galleries[0].id;
  console.log(`📁 Utilisation de la galerie: ${galleries[0].name} (${galleryId})\n`);
  
  // Simuler l'insertion d'une photo de test
  const testPhoto = {
    gallery_id: galleryId,
    filename: 'test-category.jpg',
    url: 'https://test.com/test.jpg',
    thumbnail_url: 'https://test.com/test-thumb.jpg',
    category: 'Ma Super Catégorie de Test',
    size_bytes: null,
    width: null,
    height: null,
    order_index: 999
  };
  
  console.log('Données envoyées:', JSON.stringify(testPhoto, null, 2));
  
  const { data, error } = await supabase
    .from('photos')
    .insert([testPhoto])
    .select();
  
  if (error) {
    console.error('\n❌ Erreur:', error.message);
    console.error('Details:', error);
  } else {
    console.log('\n✅ Photo insérée avec succès!');
    console.log('Résultat:', JSON.stringify(data, null, 2));
    
    // Vérifier que la catégorie est bien sauvegardée
    if (data[0].category === 'Ma Super Catégorie de Test') {
      console.log('\n🎉 LA CATÉGORIE EST BIEN SAUVEGARDÉE!');
    } else {
      console.log('\n⚠️  Catégorie attendue: "Ma Super Catégorie de Test"');
      console.log(`   Catégorie reçue: "${data[0].category}"`);
    }
    
    // Nettoyer
    const photoId = data[0].id;
    await supabase.from('photos').delete().eq('id', photoId);
    console.log('\n🧹 Photo de test supprimée');
  }
}

testInsert();
