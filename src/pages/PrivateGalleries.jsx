import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiFolder, FiLock, FiCalendar, FiImage, FiEye, FiDownload, FiLogOut } from 'react-icons/fi'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { getAllGalleries, getGalleryByPassword, createGallery as createGalleryDB, deleteGallery as deleteGalleryDB, addPhotosToGallery, getGalleryCategories } from '../config/supabase'
import AdminDashboard from '../components/AdminDashboard'
import GalleryUploader from '../components/GalleryUploader'
import PageHeader from '../components/PageHeader'
import './PrivateGalleries.css'

const ADMIN_PASSWORD = 'admin2026david'

function PrivateGalleries() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [selectedGallery, setSelectedGallery] = useState(null)
  const [galleries, setGalleries] = useState([])
  const [error, setError] = useState('')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const [showUploader, setShowUploader] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [galleryCategories, setGalleryCategories] = useState([])

  // Charger les galeries depuis Supabase au démarrage (admin uniquement)
  useEffect(() => {
    if (isAdmin) {
      loadGalleries()
    }
  }, [isAdmin])

  const loadGalleries = async () => {
    setLoading(true)
    try {
      const data = await getAllGalleries()
      setGalleries(data)
    } catch (err) {
      console.error('Error loading galleries:', err)
      setError('Erreur lors du chargement des galeries')
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    
    try {
      // Vérifier si c'est le mot de passe admin
      if (password === ADMIN_PASSWORD) {
        setIsAdmin(true)
        setIsAuthenticated(true)
        setLoading(false)
        return
      }
      
      // Sinon, chercher la galerie dans Supabase par mot de passe
      const gallery = await getGalleryByPassword(password)
      
      if (gallery) {
        setIsAuthenticated(true)
        setSelectedGallery(gallery)
        
        // Charger les catégories de cette galerie
        try {
          const categories = await getGalleryCategories(gallery.id)
          setGalleryCategories(categories)
        } catch (err) {
          console.error('Error loading categories:', err)
          setGalleryCategories([])
        }
        
        setError('')
      } else {
        setError('Mot de passe incorrect. Veuillez réessayer.')
        setPassword('')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('Une erreur est survenue. Veuillez réessayer.')
      setPassword('')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setIsAdmin(false)
    setSelectedGallery(null)
    setPassword('')
    setError('')
    setSuccessMessage('')
  }

  const createGallery = async (galleryData) => {
    setLoading(true)
    try {
      await createGalleryDB({
        name: galleryData.name,
        type: galleryData.type,
        eventDate: galleryData.date,
        password: galleryData.password,
        expirationDate: galleryData.expirationDate
      })
      
      setSuccessMessage('✅ Galerie créée avec succès !')
      setTimeout(() => setSuccessMessage(''), 3000)
      
      // Recharger les galeries
      await loadGalleries()
    } catch (err) {
      console.error('Error creating gallery:', err)
      setError('Erreur lors de la création de la galerie')
    } finally {
      setLoading(false)
    }
  }

  const deleteGallery = async (galleryId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette galerie ? Cette action est irréversible.')) {
      setLoading(true)
      try {
        await deleteGalleryDB(galleryId)
        setSuccessMessage('✅ Galerie supprimée')
        setTimeout(() => setSuccessMessage(''), 3000)
        
        // Recharger les galeries
        await loadGalleries()
      } catch (err) {
        console.error('Error deleting gallery:', err)
        setError('Erreur lors de la suppression de la galerie')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleSelectGalleryForView = (gallery) => {
    setSelectedGallery(gallery)
    setShowUploader(true)
  }

  const handleUploadComplete = async (uploadedPhotos) => {
    if (!selectedGallery) return

    setLoading(true)
    try {
      // Enregistrer les photos dans Supabase
      const photosToAdd = uploadedPhotos.map(photo => ({
        filename: photo.fileName,
        url: photo.url,
        thumbnailUrl: photo.url, // Pas de thumbnail séparé pour le moment
        category: photo.category || null,
        size: null,
        width: null,
        height: null
      }))
      
      await addPhotosToGallery(selectedGallery.id, photosToAdd)
      
      // Recharger les galeries pour obtenir les dernières données
      const updatedGalleries = await getAllGalleries()
      setGalleries(updatedGalleries)
      
      // Mettre à jour la galerie sélectionnée avec les nouvelles données
      const updatedGallery = updatedGalleries.find(g => g.id === selectedGallery.id)
      if (updatedGallery) {
        setSelectedGallery(updatedGallery)
      }
      
      setSuccessMessage(`✅ ${uploadedPhotos.length} photo${uploadedPhotos.length > 1 ? 's' : ''} ajoutée${uploadedPhotos.length > 1 ? 's' : ''} !`)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Error refreshing gallery:', err)
      setError('Erreur lors du rafraîchissement')
    } finally {
      setLoading(false)
    }
  }

  const openLightbox = (index) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const downloadPhoto = (photoUrl, index) => {
    // Simulate download
    const link = document.createElement('a')
    link.href = photoUrl
    link.download = `photo-${index + 1}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="private-galleries-page">
      <PageHeader />
      {/* Hero Section */}
      <section className="galleries-hero">
        <motion.div 
          className="galleries-hero-overlay"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="galleries-hero-title">
            {isAdmin ? 'Administration' : 'Galeries Privées'}
          </h1>
          <p className="galleries-hero-subtitle">
            {isAdmin ? 'Gérez vos galeries privées' : 'Accédez à vos photos en toute sécurité'}
          </p>
        </motion.div>
      </section>

      {successMessage && (
        <motion.div 
          className="success-toast"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          {successMessage}
        </motion.div>
      )}

      <div className="galleries-container">
        {!isAuthenticated ? (
          /* Login Form */
          <motion.section 
            className="login-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="login-box">
              <div className="login-icon"><FiLock size={48} strokeWidth={1.5} /></div>
              <h2>Accès Sécurisé</h2>
              <p className="login-description">
                Entrez le mot de passe qui vous a été fourni par email pour accéder à votre galerie privée.
              </p>
              
              <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                  <label htmlFor="password">Mot de passe</label>
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Entrez votre mot de passe"
                    required
                  />
                </div>
                
                {error && <p className="error-message">{error}</p>}
                
                <button type="submit" className="login-button" disabled={loading}>
                  {loading ? 'Connexion...' : 'Accéder à ma galerie'}
                </button>
              </form>

              <div className="login-help">
                <p>Vous n'avez pas reçu de mot de passe ?</p>
                <a href="#/contact">Contactez-nous</a>
              </div>
            </div>
          </motion.section>
        ) : isAdmin ? (
          /* Admin Dashboard */
          <AdminDashboard
            galleries={galleries}
            onCreateGallery={createGallery}
            onDeleteGallery={deleteGallery}
            onLogout={handleLogout}
            onSelectGallery={handleSelectGalleryForView}
          />
        ) : (
          /* Gallery Display for Client */
          <motion.section 
            className="gallery-display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="gallery-header">
              <div>
                <h2>{selectedGallery.name}</h2>
                <p className="gallery-date">
                  <FiCalendar size={16} /> {new Date(selectedGallery.event_date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
                <p className="gallery-count"><FiImage size={16} /> {selectedGallery.photos?.length || 0} photos</p>
              </div>
              <button onClick={handleLogout} className="logout-button">
                <FiLogOut size={18} /> Déconnexion
              </button>
            </div>

            <div className="gallery-actions">
              <p className="gallery-instructions">
                Cliquez sur une photo pour l'agrandir. Vous pouvez télécharger vos photos favorites.
              </p>
            </div>

            {!selectedGallery.photos || selectedGallery.photos.length === 0 ? (
              <div className="empty-gallery">
                <p className="empty-icon"><FiImage size={80} strokeWidth={1} /></p>
                <p>Aucune photo pour le moment. Revenez bientôt !</p>
              </div>
            ) : (
              <>
                {/* Afficher les photos groupées par catégories depuis gallery_categories */}
                {galleryCategories.length > 0 ? (
                  <>
                    {galleryCategories
                      .sort((a, b) => (a.order_index || 0) - (b.order_index || 0))
                      .map(category => {
                        const photosInCategory = selectedGallery.photos.filter(p => p.category === category.name)
                        
                        if (photosInCategory.length === 0) return null
                        
                        return (
                          <div key={category.id} className="gallery-category-section">
                            <h3 className="gallery-category-title">
                              <FiFolder size={22} strokeWidth={1.5} /> {category.name}
                            </h3>
                            <div className="gallery-grid">
                              {photosInCategory.map((photo, index) => {
                                const globalIndex = selectedGallery.photos.indexOf(photo)
                                return (
                                  <motion.div
                                    key={photo.id || index}
                                    className="gallery-photo"
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.4, delay: index * 0.05 }}
                                  >
                                    <img 
                                      src={photo.url || photo} 
                                      alt={`Photo ${index + 1}`}
                                      onClick={() => openLightbox(globalIndex)}
                                    />
                                    <div className="photo-overlay">
                                      <button 
                                        className="overlay-button view-button"
                                        onClick={() => openLightbox(globalIndex)}
                                      >
                                        <FiEye size={18} /> Voir
                                      </button>
                                      <button 
                                        className="overlay-button download-button"
                                        onClick={() => downloadPhoto(photo.url || photo, globalIndex)}
                                      >
                                        <FiDownload size={18} /> Télécharger
                                      </button>
                                    </div>
                                  </motion.div>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    
                    {/* Photos sans catégorie */}
                    {(() => {
                      const categoryNames = galleryCategories.map(c => c.name)
                      const photosWithoutCategory = selectedGallery.photos.filter(p => !p.category || !categoryNames.includes(p.category))
                      
                      if (photosWithoutCategory.length === 0) return null
                      
                      return (
                        <div className="gallery-category-section">
                          <h3 className="gallery-category-title">
                            <FiFolder size={22} strokeWidth={1.5} /> Autres photos
                          </h3>
                          <div className="gallery-grid">
                            {photosWithoutCategory.map((photo, index) => {
                              const globalIndex = selectedGallery.photos.indexOf(photo)
                              return (
                                <motion.div
                                  key={photo.id || index}
                                  className="gallery-photo"
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ duration: 0.4, delay: index * 0.05 }}
                                >
                                  <img 
                                    src={photo.url || photo} 
                                    alt={`Photo ${index + 1}`}
                                    onClick={() => openLightbox(globalIndex)}
                                  />
                                  <div className="photo-overlay">
                                    <button 
                                      className="overlay-button view-button"
                                      onClick={() => openLightbox(globalIndex)}
                                    >
                                      <FiEye size={18} /> Voir
                                    </button>
                                    <button 
                                      className="overlay-button download-button"
                                      onClick={() => downloadPhoto(photo.url || photo, globalIndex)}
                                    >
                                      <FiDownload size={18} /> Télécharger
                                    </button>
                                  </div>
                                </motion.div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })()}
                  </>
                ) : (
                  /* Pas de catégories : afficher toutes les photos */
                  <div className="gallery-grid">
                    {selectedGallery.photos.map((photo, index) => (
                      <motion.div
                        key={photo.id || index}
                        className="gallery-photo"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <img 
                          src={photo.url || photo} 
                          alt={`Photo ${index + 1}`}
                          onClick={() => openLightbox(index)}
                        />
                        <div className="photo-overlay">
                          <button 
                            className="overlay-button view-button"
                            onClick={() => openLightbox(index)}
                          >
                            <FiEye size={18} /> Voir
                          </button>
                          <button 
                            className="overlay-button download-button"
                            onClick={() => downloadPhoto(photo.url || photo, index)}
                          >
                            <FiDownload size={18} /> Télécharger
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </>
            )}
          </motion.section>
        )}
      </div>

      {/* Gallery Uploader Modal */}
      {showUploader && selectedGallery && (
        <GalleryUploader
          galleryId={selectedGallery.id}
          galleryName={selectedGallery.name}
          existingPhotos={selectedGallery.photos}
          onUploadComplete={handleUploadComplete}
          onPhotoDeleted={async () => {
            const updatedGalleries = await getAllGalleries()
            setGalleries(updatedGalleries)
            const updatedGallery = updatedGalleries.find(g => g.id === selectedGallery.id)
            if (updatedGallery) setSelectedGallery(updatedGallery)
          }}
          onCategoryChanged={async () => {
            const updatedGalleries = await getAllGalleries()
            setGalleries(updatedGalleries)
            const updatedGallery = updatedGalleries.find(g => g.id === selectedGallery.id)
            if (updatedGallery) setSelectedGallery(updatedGallery)
          }}
          onClose={() => setShowUploader(false)}
        />
      )}

      {/* Lightbox */}
      {selectedGallery && selectedGallery.photos && selectedGallery.photos.length > 0 && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={selectedGallery.photos.map(photo => ({ 
            src: photo.url || photo 
          }))}
        />
      )}
    </div>
  )
}

export default PrivateGalleries
