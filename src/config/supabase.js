import { createClient } from '@supabase/supabase-js'

console.log('🔍 DEBUG Supabase Config:')
console.log('- VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL)
console.log('- VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'PRESENT ✅' : 'MISSING ❌')
console.log('- Toutes les env vars:', import.meta.env)

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables Supabase manquantes!')
  console.error('URL:', supabaseUrl)
  console.error('Key présente:', !!supabaseAnonKey)
  throw new Error('Missing Supabase environment variables')
}

console.log('✅ Supabase configuré avec succès!')

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================
// GALERIES
// ============================================

/**
 * Récupérer toutes les galeries non expirées
 */
export async function getAllGalleries() {
  const { data, error } = await supabase
    .from('galleries')
    .select(`
      *,
      photos (
        id,
        url,
        thumbnail_url,
        category,
        order_index
      )
    `)
    .eq('is_expired', false)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Récupérer une galerie par mot de passe
 */
export async function getGalleryByPassword(password) {
  const { data, error } = await supabase
    .from('galleries')
    .select(`
      *,
      photos (
        id,
        filename,
        url,
        thumbnail_url,
        size_bytes,
        width,
        height,
        order_index
      )
    `)
    .eq('password', password)
    .eq('is_expired', false)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Pas trouvé
    }
    throw error
  }

  // Incrémenter le compteur de vues
  await incrementGalleryViews(data.id)

  return data
}

/**
 * Créer une nouvelle galerie
 */
export async function createGallery(galleryData) {
  const { data, error } = await supabase
    .from('galleries')
    .insert([{
      name: galleryData.name,
      type: galleryData.type,
      event_date: galleryData.eventDate,
      password: galleryData.password,
      expiration_date: galleryData.expirationDate || 
        new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Supprimer une galerie
 */
export async function deleteGallery(galleryId) {
  const { error } = await supabase
    .from('galleries')
    .delete()
    .eq('id', galleryId)

  if (error) throw error
}

/**
 * Mettre à jour une galerie
 */
export async function updateGallery(galleryId, updates) {
  const { data, error } = await supabase
    .from('galleries')
    .update(updates)
    .eq('id', galleryId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Incrémenter le compteur de vues
 */
async function incrementGalleryViews(galleryId) {
  await supabase.rpc('increment_gallery_views', { gallery_id: galleryId })
  
  await supabase
    .from('galleries')
    .update({ last_viewed_at: new Date().toISOString() })
    .eq('id', galleryId)
}

// ============================================
// PHOTOS
// ============================================

/**
 * Ajouter des photos à une galerie
 */
export async function addPhotosToGallery(galleryId, photos) {
  const photosData = photos.map((photo, index) => ({
    gallery_id: galleryId,
    filename: photo.filename,
    url: photo.url,
    thumbnail_url: photo.thumbnailUrl,
    category: photo.category || null,
    size_bytes: photo.size,
    width: photo.width,
    height: photo.height,
    order_index: index
  }))

  const { data, error } = await supabase
    .from('photos')
    .insert(photosData)
    .select()

  if (error) throw error

  // Mettre à jour la photo de couverture si pas définie
  if (photos.length > 0) {
    await supabase
      .from('galleries')
      .update({ cover_image_url: photos[0].url })
      .eq('id', galleryId)
      .is('cover_image_url', null)
  }

  return data
}

/**
 * Supprimer une photo
 */
export async function deletePhoto(photoId) {
  const { error } = await supabase
    .from('photos')
    .delete()
    .eq('id', photoId)

  if (error) throw error
}

/**
 * Récupérer les photos d'une galerie
 */
export async function getGalleryPhotos(galleryId) {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('gallery_id', galleryId)
    .order('order_index')

  if (error) throw error
  return data
}

// ============================================
// CATÉGORIES
// ============================================

/**
 * Récupérer les catégories d'une galerie
 */
export async function getGalleryCategories(galleryId) {
  const { data, error } = await supabase
    .from('gallery_categories')
    .select('*')
    .eq('gallery_id', galleryId)
    .order('order_index')

  if (error) throw error
  return data
}

/**
 * Ajouter une catégorie à une galerie
 */
export async function addCategory(galleryId, categoryName) {
  const { data, error } = await supabase
    .from('gallery_categories')
    .insert([{
      gallery_id: galleryId,
      name: categoryName,
      order_index: 0
    }])
    .select()

  if (error) throw error
  return data[0]
}

/**
 * Supprimer une catégorie
 */
export async function deleteCategory(categoryId) {
  const { error } = await supabase
    .from('gallery_categories')
    .delete()
    .eq('id', categoryId)

  if (error) throw error
}
