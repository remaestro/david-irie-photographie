import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import './Portfolio.css'

function ShootingStrobist() {
  const [fadeIn, setFadeIn] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    setFadeIn(true)
  }, [])

  // Strobist photos - using existing images as placeholders
  const photos = [
    { src: `${import.meta.env.BASE_URL}images/slide1.jpg`, width: 4, height: 5 },
    { src: `${import.meta.env.BASE_URL}images/slide2.jpg`, width: 3, height: 4 },
    { src: `${import.meta.env.BASE_URL}images/slide3.jpg`, width: 16, height: 9 },
    { src: `${import.meta.env.BASE_URL}images/slide4.jpg`, width: 4, height: 5 },
    { src: `${import.meta.env.BASE_URL}images/slide5.jpg`, width: 3, height: 4 },
    { src: `${import.meta.env.BASE_URL}images/slide1.jpg`, width: 16, height: 9 },
    { src: `${import.meta.env.BASE_URL}images/slide2.jpg`, width: 4, height: 5 },
    { src: `${import.meta.env.BASE_URL}images/slide3.jpg`, width: 3, height: 4 },
    { src: `${import.meta.env.BASE_URL}images/slide4.jpg`, width: 16, height: 9 },
    { src: `${import.meta.env.BASE_URL}images/slide5.jpg`, width: 4, height: 5 },
  ]

  const openLightbox = (index) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <div className={`portfolio-page ${fadeIn ? 'fade-in' : ''}`}>
      {/* Hero Section */}
      <section className="portfolio-hero" style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(' + import.meta.env.BASE_URL + 'images/slide4.jpg)' }}>
        <div className="portfolio-hero-overlay">
          <h1 className="portfolio-hero-title">Shooting Strobist</h1>
          <p className="portfolio-hero-subtitle">
            Maîtrise créative de la lumière pour des portraits dramatiques et artistiques
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="portfolio-intro">
        <div className="intro-content">
          <h2>Photographie Strobist</h2>
          <p>
            Le strobisme est l'art de sculpter la lumière avec des flashs déportés pour créer des 
            portraits uniques et spectaculaires. Cette technique me permet de contrôler chaque ombre, 
            chaque reflet, et de créer une ambiance sur mesure qui sublime votre personnalité.
          </p>
          <p>
            Que ce soit pour un portrait créatif, une séance mode, ou des photos professionnelles, 
            j'utilise des configurations d'éclairage sophistiquées pour produire des images qui se 
            démarquent. Chaque setup lumineux est pensé pour mettre en valeur vos traits et créer 
            l'atmosphère désirée.
          </p>
        </div>
      </section>

      {/* Masonry Gallery */}
      <section className="portfolio-gallery">
        <div className="masonry-grid">
          {photos.map((photo, index) => (
            <motion.div
              key={index}
              className={`masonry-item masonry-item-${photo.width}x${photo.height}`}
              onClick={() => openLightbox(index)}
              initial={{ opacity: 0, y: 60 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ scale: 1.02, transition: { duration: 0.3 } }}
            >
              <img src={photo.src} alt={`Strobist ${index + 1}`} loading="lazy" />
              <div className="image-overlay">
                <span className="overlay-icon">🔍</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Services Info */}
      <section className="portfolio-services">
        <div className="services-content">
          <h2>Types de Séances Strobist</h2>
          <div className="services-grid">
            <div className="service-item">
              <h3>💼 Portraits Corporate</h3>
              <p>Photos professionnelles pour LinkedIn, sites web et communications d'entreprise.</p>
            </div>
            <div className="service-item">
              <h3>🎭 Portraits Créatifs</h3>
              <p>Séances artistiques avec éclairages dramatiques pour un résultat unique et personnel.</p>
            </div>
            <div className="service-item">
              <h3>👗 Lookbook Mode</h3>
              <p>Mise en valeur de collections vestimentaires avec éclairage studio professionnel.</p>
            </div>
            <div className="service-item">
              <h3>🎬 Headshots Acteurs</h3>
              <p>Portraits pour casting et books artistiques avec éclairage cinématographique.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="portfolio-cta">
        <div className="cta-content">
          <h2>Créons Votre Portrait</h2>
          <p>
            Intéressé par une séance portrait avec éclairage strobist ? Discutons de votre 
            vision et créons ensemble des images qui vous ressemblent.
          </p>
          <a href="#/contact" className="cta-button">Réserver une Séance</a>
        </div>
      </section>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={photos.map(photo => ({ src: photo.src }))}
      />
    </div>
  )
}

export default ShootingStrobist
