import { useState, useEffect } from 'react'
import { getSitePhotos } from '../config/supabase'

/**
 * Hook pour charger les photos du site depuis Supabase
 * Retourne un objet avec les URLs indexées par photo_key
 */
export default function useSitePhotos() {
  const [photos, setPhotos] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPhotos()
  }, [])

  const loadPhotos = async () => {
    try {
      const data = await getSitePhotos()
      
      // Convertir le tableau en objet indexé par photo_key
      const photosMap = {}
      data.forEach(photo => {
        photosMap[photo.photo_key] = `${import.meta.env.BASE_URL}${photo.url}`
      })
      
      setPhotos(photosMap)
    } catch (error) {
      console.error('Error loading site photos:', error)
      // Fallback vers les photos par défaut
      setPhotos({})
    } finally {
      setLoading(false)
    }
  }

  return { photos, loading, reload: loadPhotos }
}
