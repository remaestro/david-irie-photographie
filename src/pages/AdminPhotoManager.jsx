import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiImage, FiLogOut, FiEdit } from 'react-icons/fi'
import { useAdmin } from '../contexts/AdminContext'
import useSitePhotos from '../hooks/useSitePhotos'
import EditableImage from '../components/EditableImage'
import './AdminPhotoManager.css'
import { supabase, getAllGalleries } from '../config/supabase'

function AdminPhotoManager() {
  const { isAdmin, isEditMode, logout, toggleEditMode } = useAdmin()
  const { photos, loading, reload } = useSitePhotos()
  const [galleries, setGalleries] = useState([])
  const [loadingGalleries, setLoadingGalleries] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin')
    }
  }, [isAdmin, navigate])

  // Load galleries and their photos so admin can edit album images
  useEffect(() => {
    let mounted = true
    async function loadGalleries() {
      setLoadingGalleries(true)
      try {
        const data = await getAllGalleries()
        if (mounted) setGalleries(data || [])
      } catch (err) {
        console.error('Erreur chargement galeries', err)
      } finally {
        if (mounted) setLoadingGalleries(false)
      }
    }
    loadGalleries()
    return () => { mounted = false }
  }, [])

  const handleLogout = () => {
    logout()
    navigate('/admin')
  }

  if (!isAdmin) {
    return null
  }

  const heroPhotos = [
    { key: 'hero_slide_1', label: 'Hero Slide 1', url: photos.hero_slide_1 },
    { key: 'hero_slide_2', label: 'Hero Slide 2', url: photos.hero_slide_2 },
    { key: 'hero_slide_3', label: 'Hero Slide 3', url: photos.hero_slide_3 },
    { key: 'hero_slide_4', label: 'Hero Slide 4', url: photos.hero_slide_4 },
    { key: 'hero_slide_5', label: 'Hero Slide 5', url: photos.hero_slide_5 },
  ]

  const instagramPhotos = [
    { key: 'instagram_1', label: 'Instagram 1', url: photos.instagram_1 },
    { key: 'instagram_2', label: 'Instagram 2', url: photos.instagram_2 },
    { key: 'instagram_3', label: 'Instagram 3', url: photos.instagram_3 },
    { key: 'instagram_4', label: 'Instagram 4', url: photos.instagram_4 },
    { key: 'instagram_5', label: 'Instagram 5', url: photos.instagram_5 },
    { key: 'instagram_6', label: 'Instagram 6', url: photos.instagram_6 },
    { key: 'instagram_7', label: 'Instagram 7', url: photos.instagram_7 },
    { key: 'instagram_8', label: 'Instagram 8', url: photos.instagram_8 },
  ]

  // All site photos (any key present in site_photos table)
  const allSitePhotos = Object.keys(photos || {}).map((k) => ({ key: k, label: k.replace(/_/g, ' '), url: photos[k] }))

  return (
    <div className="admin-photo-manager">
      <div className="admin-header">
        <div className="admin-header-left">
          <h1><FiImage size={32} /> Gestion des Photos du Site</h1>
          <p className="admin-subtitle">Modifiez les photos affichées sur la page d'accueil</p>
        </div>
        <div className="admin-header-right">
          <button
            className={`edit-mode-btn ${isEditMode ? 'active' : ''}`}
            onClick={toggleEditMode}
          >
            <FiEdit size={18} />
            {isEditMode ? 'Désactiver le mode édition' : 'Activer le mode édition'}
          </button>
          <button className="logout-btn" onClick={handleLogout}>
            <FiLogOut size={18} /> Déconnexion
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">Chargement des photos...</div>
      ) : (
        <>
          {/* Hero Slider Photos */}
          <motion.section
            className="photo-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="section-title">Hero Slider (5 photos)</h2>
            <p className="section-description">
              Ces photos apparaissent dans le slider principal de la page d'accueil
            </p>
            <div className="photo-grid hero-grid">
              {heroPhotos.map((photo, index) => (
                <motion.div
                  key={photo.key}
                  className="photo-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="photo-card-label">{photo.label}</div>
                  <EditableImage
                    src={photo.url || `${import.meta.env.BASE_URL}images/slide${index + 1}.jpg`}
                    alt={photo.label}
                    photoKey={photo.key}
                    className="photo-preview"
                    style={{ 
                      backgroundImage: `url(${photo.url || `${import.meta.env.BASE_URL}images/slide${index + 1}.jpg`})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      height: '200px',
                      borderRadius: '8px'
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>

            {/* Albums / Galleries Photos */}
            <motion.section
              className="photo-section"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <h2 className="section-title">Albums / Galeries</h2>
              <p className="section-description">
                Les photos appartenant aux galeries (Portfolio). Vous pouvez modifier chaque photo ici.
              </p>
              {loadingGalleries ? (
                <div className="loading-state">Chargement des albums...</div>
              ) : (
                <div className="galleries-list">
                  {galleries.map((gallery) => (
                    <div key={gallery.id} className="gallery-block">
                      <h3 className="gallery-title">{gallery.name}</h3>
                      <div className="photo-grid instagram-grid">
                        {(gallery.photos || []).map((photo) => (
                          <motion.div
                            key={photo.id}
                            className="photo-card"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.25 }}
                          >
                            <div className="photo-card-label">{gallery.name} — #{photo.id}</div>
                            <EditableImage
                              src={photo.url || photo.thumbnail_url || `${import.meta.env.BASE_URL}images/default.jpg`}
                              alt={`${gallery.name} photo ${photo.id}`}
                              className="photo-preview"
                              // Use callback to update photos table instead of site_photos
                              onUploadSuccess={async (newUrl) => {
                                try {
                                  const { error } = await supabase
                                    .from('photos')
                                    .update({ url: newUrl, thumbnail_url: newUrl, updated_at: new Date().toISOString() })
                                    .eq('id', photo.id)

                                  if (error) throw error
                                  // Refresh galleries and site photos
                                  const data = await getAllGalleries()
                                  setGalleries(data || [])
                                  reload()
                                } catch (err) {
                                  console.error('Erreur update photo de galerie', err)
                                  alert('Erreur lors de la mise à jour de la photo')
                                }
                              }}
                              style={{ 
                                backgroundImage: `url(${photo.url || photo.thumbnail_url || `${import.meta.env.BASE_URL}images/default.jpg`})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                height: '150px',
                                borderRadius: '8px'
                              }}
                            />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.section>

          {/* Instagram Gallery Photos */}
          <motion.section
            className="photo-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <h2 className="section-title">Galerie Instagram (8 photos)</h2>
            <p className="section-description">
              Ces photos apparaissent dans la bande Instagram de la page d'accueil
            </p>
            <div className="photo-grid instagram-grid">
              {instagramPhotos.map((photo, index) => (
                <motion.div
                  key={photo.key}
                  className="photo-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                >
                  <div className="photo-card-label">{photo.label}</div>
                  <EditableImage
                    src={photo.url || `${import.meta.env.BASE_URL}images/default.jpg`}
                    alt={photo.label}
                    photoKey={photo.key}
                    className="photo-preview"
                    style={{ 
                      backgroundImage: `url(${photo.url || `${import.meta.env.BASE_URL}images/default.jpg`})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      height: '150px',
                      borderRadius: '8px'
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* All Site Photos */}
          <motion.section
            className="photo-section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h2 className="section-title">Toutes les photos du site</h2>
            <p className="section-description">
              Liste automatique de toutes les clés présentes dans la table `site_photos`.
            </p>
            <div className="photo-grid instagram-grid">
              {allSitePhotos.map((photo, index) => (
                <motion.div
                  key={photo.key}
                  className="photo-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, delay: index * 0.02 }}
                >
                  <div className="photo-card-label">{photo.key}</div>
                  <EditableImage
                    src={photo.url || `${import.meta.env.BASE_URL}images/default.jpg`}
                    alt={photo.label}
                    photoKey={photo.key}
                    className="photo-preview"
                    style={{ 
                      backgroundImage: `url(${photo.url || `${import.meta.env.BASE_URL}images/default.jpg`})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      height: '150px',
                      borderRadius: '8px'
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Instructions */}
          <motion.div
            className="instructions"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <h3>Comment modifier une photo ?</h3>
            <ol>
              <li>Activez le <strong>mode édition</strong> en cliquant sur le bouton ci-dessus</li>
              <li>Survolez une photo - une overlay "MODIFIER" apparaîtra</li>
              <li>Cliquez sur la photo pour ouvrir le modal de remplacement</li>
              <li>Sélectionnez une nouvelle photo depuis votre ordinateur</li>
              <li>La photo sera uploadée automatiquement et remplacée</li>
            </ol>
          </motion.div>
        </>
      )}
    </div>
  )
}

export default AdminPhotoManager
