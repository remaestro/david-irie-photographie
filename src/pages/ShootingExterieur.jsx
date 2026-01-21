import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import PageHeader from '../components/PageHeader'
import './Portfolio.css'

function ShootingExterieur() {
  const [fadeIn, setFadeIn] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    setFadeIn(true)
  }, [])

  // Exterior photos - using existing images as placeholders
  const photos = [
    { src: `${import.meta.env.BASE_URL}images/slide5.jpg`, width: 16, height: 9 },
    { src: `${import.meta.env.BASE_URL}images/slide1.jpg`, width: 3, height: 4 },
    { src: `${import.meta.env.BASE_URL}images/slide2.jpg`, width: 4, height: 5 },
    { src: `${import.meta.env.BASE_URL}images/slide3.jpg`, width: 16, height: 9 },
    { src: `${import.meta.env.BASE_URL}images/slide4.jpg`, width: 3, height: 4 },
    { src: `${import.meta.env.BASE_URL}images/slide5.jpg`, width: 4, height: 5 },
    { src: `${import.meta.env.BASE_URL}images/slide1.jpg`, width: 16, height: 9 },
    { src: `${import.meta.env.BASE_URL}images/slide2.jpg`, width: 3, height: 4 },
    { src: `${import.meta.env.BASE_URL}images/slide3.jpg`, width: 4, height: 5 },
    { src: `${import.meta.env.BASE_URL}images/slide4.jpg`, width: 16, height: 9 },
  ]

  const openLightbox = (index) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <div className={`portfolio-page ${fadeIn ? 'fade-in' : ''}`}>
      <PageHeader />
      {/* Hero Section */}
      <section className="portfolio-hero" style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(' + import.meta.env.BASE_URL + 'images/slide5.jpg)' }}>
        <div className="portfolio-hero-overlay">
          <h1 className="portfolio-hero-title">Shooting Extérieur</h1>
          <p className="portfolio-hero-subtitle">
            Capturer la beauté naturelle dans des décors extérieurs authentiques et inspirants
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="portfolio-intro">
        <div className="intro-content">
          <h2>Photographie en Extérieur</h2>
          <p>
            Les séances photo en extérieur offrent une liberté créative incomparable. Que ce soit 
            dans des paysages urbains, des jardins luxuriants, sur la plage ou en pleine nature, 
            chaque environnement apporte sa propre ambiance et sa propre lumière. J'exploite ces 
            éléments naturels pour créer des images vivantes et pleines d'émotion.
          </p>
          <p>
            Mon approche combine la maîtrise de la lumière naturelle avec un œil artistique pour 
            les compositions. Je choisis les meilleurs moments de la journée - golden hour, blue hour - 
            et les lieux les plus photogéniques pour garantir des résultats exceptionnels.
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
              <img src={photo.src} alt={`Extérieur ${index + 1}`} loading="lazy" />
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
          <h2>Types de Séances Extérieures</h2>
          <div className="services-grid">
            <div className="service-item">
              <h3>🌅 Golden Hour</h3>
              <p>Séances au lever ou coucher du soleil pour une lumière dorée et magique.</p>
            </div>
            <div className="service-item">
              <h3>🏖️ Beach & Nature</h3>
              <p>Photos sur la plage, en forêt ou dans des paysages naturels spectaculaires.</p>
            </div>
            <div className="service-item">
              <h3>🏙️ Urbain</h3>
              <p>Shooting dans la ville, avec architecture et street art comme toile de fond.</p>
            </div>
            <div className="service-item">
              <h3>🌸 Jardins & Parcs</h3>
              <p>Séances dans des jardins botaniques et parcs pour un cadre romantique et naturel.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="portfolio-cta">
        <div className="cta-content">
          <h2>Planifions Votre Séance</h2>
          <p>
            Envie de photos en extérieur ? Choisissons ensemble le lieu et le moment parfaits 
            pour créer des images naturelles et authentiques.
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

export default ShootingExterieur
