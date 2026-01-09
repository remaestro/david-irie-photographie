import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiFolder, FiLock, FiCalendar, FiImage, FiEye, FiDownload, FiLogOut } from 'react-icons/fi'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import { v4 as uuid } from 'uuid'
import AdminDashboard from '../components/AdminDashboard'
import GalleryUploader from '../components/GalleryUploader'
import './PrivateGalleries.css'

const ADMIN_PASSWORD = 'admin2026david'
const STORAGE_KEY = 'galleries'

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

  // Charger les galeries depuis localStorage au démarrage
  useEffect(() => {
    loadGalleries()
  }, [])

  const loadGalleries = () => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setGalleries(JSON.parse(stored))
      } catch (err) {
        console.error('Error loading galleries:', err)
      }
    }
  }

  const saveGalleries = (updatedGalleries) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedGalleries))
    setGalleries(updatedGalleries)
  }

  const handleLogin = (e) => {
    e.preventDefault()
    
    // Vérifier si c'est le mot de passe admin
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true)
      setIsAuthenticated(true)
      setError('')
      return
    }
    
    // Sinon, chercher dans les galeries
    const gallery = galleries.find(g => g.password === password)
    
    if (gallery) {
      setIsAuthenticated(true)
      setSelectedGallery(gallery)
      setError('')
    } else {
      setError('Mot de passe incorrect. Veuillez réessayer.')
      setPassword('')
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

  const createGallery = (galleryData) => {
    const newGallery = {
      id: uuid(),
      ...galleryData,
      photos: [],
      createdAt: new Date().toISOString()
    }
    
    const updatedGalleries = [...galleries, newGallery]
    saveGalleries(updatedGalleries)
    setSuccessMessage('✅ Galerie créée avec succès !')
    setTimeout(() => setSuccessMessage(''), 3000)
  }

  const deleteGallery = (galleryId) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette galerie ? Cette action est irréversible.')) {
      const updatedGalleries = galleries.filter(g => g.id !== galleryId)
      saveGalleries(updatedGalleries)
      setSuccessMessage('✅ Galerie supprimée')
      setTimeout(() => setSuccessMessage(''), 3000)
    }
  }

  const handleSelectGalleryForView = (gallery) => {
    setSelectedGallery(gallery)
    setShowUploader(true)
  }

  const handleUploadComplete = (uploadedPhotos) => {
    if (!selectedGallery) return

    const updatedGalleries = galleries.map(g => {
      if (g.id === selectedGallery.id) {
        const updatedGallery = {
          ...g,
          photos: [...g.photos, ...uploadedPhotos],
          coverImage: g.coverImage || uploadedPhotos[0]?.url
        }
        setSelectedGallery(updatedGallery)
        return updatedGallery
      }
      return g
    })

    saveGalleries(updatedGalleries)
    setSuccessMessage(`✅ ${uploadedPhotos.length} photo${uploadedPhotos.length > 1 ? 's' : ''} ajoutée${uploadedPhotos.length > 1 ? 's' : ''} !`)
    setTimeout(() => setSuccessMessage(''), 3000)
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
                
                <button type="submit" className="login-button">
                  Accéder à ma galerie
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
                  <FiCalendar size={16} /> {new Date(selectedGallery.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </p>
                <p className="gallery-count"><FiImage size={16} /> {selectedGallery.photos.length} photos</p>
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

            {selectedGallery.photos.length === 0 ? (
              <div className="empty-gallery">
                <p className="empty-icon"><FiImage size={80} strokeWidth={1} /></p>
                <p>Aucune photo pour le moment. Revenez bientôt !</p>
              </div>
            ) : (
              <>
                {/* Extraire les catégories */}
                {(() => {
                  const categories = [...new Set(selectedGallery.photos.map(p => p.category).filter(Boolean))]
                  const photosWithoutCategory = selectedGallery.photos.filter(p => !p.category)
                  
                  return categories.length > 0 ? (
                    <>
                      {categories.map(category => {
                        const photosInCategory = selectedGallery.photos.filter(p => p.category === category)
                        return (
                          <div key={category} className="gallery-category-section">
                            <h3 className="gallery-category-title"><FiFolder size={22} strokeWidth={1.5} /> {category}</h3>
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
                      
                      {photosWithoutCategory.length > 0 && (
                        <div className="gallery-category-section">
                          <h3 className="gallery-category-title"><FiFolder size={22} strokeWidth={1.5} /> Autres photos</h3>
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
                      )}
                    </>
                  ) : (
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
                  )
                })()}
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
          onClose={() => setShowUploader(false)}
        />
      )}

      {/* Lightbox */}
      {selectedGallery && selectedGallery.photos.length > 0 && (
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
