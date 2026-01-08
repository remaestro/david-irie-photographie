import { useState } from 'react'
import { motion } from 'framer-motion'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import './PrivateGalleries.css'

function PrivateGalleries() {
  const [password, setPassword] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedGallery, setSelectedGallery] = useState(null)
  const [error, setError] = useState('')
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Galeries exemple (en production, ceci viendrait d'une base de données)
  const galleries = [
    {
      id: 1,
      name: "Mariage Sarah & Antoine - Juin 2025",
      password: "sarah2025",
      date: "15 Juin 2025",
      coverImage: `${import.meta.env.BASE_URL}images/slide1.jpg`,
      photos: [
        `${import.meta.env.BASE_URL}images/slide1.jpg`,
        `${import.meta.env.BASE_URL}images/slide2.jpg`,
        `${import.meta.env.BASE_URL}images/slide3.jpg`,
        `${import.meta.env.BASE_URL}images/slide4.jpg`,
        `${import.meta.env.BASE_URL}images/slide5.jpg`,
      ]
    },
    {
      id: 2,
      name: "Séance Couple Élodie & Marc - Mars 2025",
      password: "elodie2025",
      date: "20 Mars 2025",
      coverImage: `${import.meta.env.BASE_URL}images/slide2.jpg`,
      photos: [
        `${import.meta.env.BASE_URL}images/slide2.jpg`,
        `${import.meta.env.BASE_URL}images/slide3.jpg`,
        `${import.meta.env.BASE_URL}images/slide4.jpg`,
        `${import.meta.env.BASE_URL}images/slide5.jpg`,
        `${import.meta.env.BASE_URL}images/slide1.jpg`,
      ]
    },
    {
      id: 3,
      name: "Événement Corporate - Janvier 2026",
      password: "corporate2026",
      date: "10 Janvier 2026",
      coverImage: `${import.meta.env.BASE_URL}images/slide3.jpg`,
      photos: [
        `${import.meta.env.BASE_URL}images/slide3.jpg`,
        `${import.meta.env.BASE_URL}images/slide4.jpg`,
        `${import.meta.env.BASE_URL}images/slide5.jpg`,
        `${import.meta.env.BASE_URL}images/slide1.jpg`,
        `${import.meta.env.BASE_URL}images/slide2.jpg`,
      ]
    }
  ]

  const handleLogin = (e) => {
    e.preventDefault()
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
    setSelectedGallery(null)
    setPassword('')
    setError('')
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
          <h1 className="galleries-hero-title">Galeries Privées</h1>
          <p className="galleries-hero-subtitle">
            Accédez à vos photos en toute sécurité
          </p>
        </motion.div>
      </section>

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
              <div className="login-icon">🔒</div>
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
        ) : (
          /* Gallery Display */
          <motion.section 
            className="gallery-display"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="gallery-header">
              <div>
                <h2>{selectedGallery.name}</h2>
                <p className="gallery-date">📅 {selectedGallery.date}</p>
                <p className="gallery-count">📸 {selectedGallery.photos.length} photos</p>
              </div>
              <button onClick={handleLogout} className="logout-button">
                Déconnexion
              </button>
            </div>

            <div className="gallery-actions">
              <p className="gallery-instructions">
                Cliquez sur une photo pour l'agrandir. Vous pouvez télécharger vos photos favorites.
              </p>
            </div>

            <div className="gallery-grid">
              {selectedGallery.photos.map((photo, index) => (
                <motion.div
                  key={index}
                  className="gallery-photo"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <img 
                    src={photo} 
                    alt={`Photo ${index + 1}`}
                    onClick={() => openLightbox(index)}
                  />
                  <div className="photo-overlay">
                    <button 
                      className="overlay-button view-button"
                      onClick={() => openLightbox(index)}
                    >
                      👁️ Voir
                    </button>
                    <button 
                      className="overlay-button download-button"
                      onClick={() => downloadPhoto(photo, index)}
                    >
                      ⬇️ Télécharger
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}
      </div>

      {/* Lightbox */}
      {selectedGallery && (
        <Lightbox
          open={lightboxOpen}
          close={() => setLightboxOpen(false)}
          index={lightboxIndex}
          slides={selectedGallery.photos.map(photo => ({ src: photo }))}
        />
      )}
    </div>
  )
}

export default PrivateGalleries
