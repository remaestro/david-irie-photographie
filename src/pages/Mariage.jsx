import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import './Portfolio.css'

function Mariage() {
  const [fadeIn, setFadeIn] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    setFadeIn(true)
  }, [])

  // Wedding photos
  const photos = [
    { src: `${import.meta.env.BASE_URL}images/bouquet-roses-1.jpg`, width: 3, height: 4 }, // Bouquet roses 1
    { src: `${import.meta.env.BASE_URL}images/slide1.jpg`, width: 3, height: 4 }, // Portrait
    { src: `${import.meta.env.BASE_URL}images/bouquet-roses-2.jpg`, width: 3, height: 4 }, // Bouquet roses 2
    { src: `${import.meta.env.BASE_URL}images/slide2.jpg`, width: 16, height: 9 }, // Landscape
    { src: `${import.meta.env.BASE_URL}images/slide3.jpg`, width: 4, height: 5 }, // Portrait tall
    { src: `${import.meta.env.BASE_URL}images/slide4.jpg`, width: 3, height: 4 }, // Portrait
    { src: `${import.meta.env.BASE_URL}images/slide5.jpg`, width: 16, height: 9 }, // Landscape
    { src: `${import.meta.env.BASE_URL}images/slide1.jpg`, width: 4, height: 5 }, // Portrait tall
    { src: `${import.meta.env.BASE_URL}images/slide2.jpg`, width: 3, height: 4 }, // Portrait
    { src: `${import.meta.env.BASE_URL}images/slide3.jpg`, width: 16, height: 9 }, // Landscape
    { src: `${import.meta.env.BASE_URL}images/slide4.jpg`, width: 4, height: 5 }, // Portrait tall
    { src: `${import.meta.env.BASE_URL}images/slide5.jpg`, width: 3, height: 4 }, // Portrait
  ]

  const openLightbox = (index) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <div className={`portfolio-page ${fadeIn ? 'fade-in' : ''}`}>
      {/* Hero Section */}
      <section className="portfolio-hero">
        <div className="portfolio-hero-overlay">
          <h1 className="portfolio-hero-title">Mariages</h1>
          <p className="portfolio-hero-subtitle">
            Capturer l'amour, les émotions et la magie de votre jour unique
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="portfolio-intro">
        <div className="intro-content">
          <h2>Photographie de Mariage</h2>
          <p>
            Chaque mariage est une histoire unique, pleine d'émotions, de rires et de moments précieux. 
            Mon approche est de capturer l'authenticité de votre journée, des préparatifs intimes aux 
            célébrations endiablées, en passant par les regards complices et les larmes de joie.
          </p>
          <p>
            Je travaille dans la discrétion pour immortaliser les instants spontanés tout en créant 
            des portraits élégants qui subliment votre amour. Le résultat : une collection d'images 
            intemporelles qui racontent votre histoire.
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
              <img src={photo.src} alt={`Mariage ${index + 1}`} loading="lazy" />
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
          <h2>Prestations Mariage</h2>
          <div className="services-grid">
            <div className="service-item">
              <h3>📸 Couverture Complète</h3>
              <p>De la préparation à la soirée, je capture chaque moment important de votre journée.</p>
            </div>
            <div className="service-item">
              <h3>🎥 Photo + Vidéo</h3>
              <p>Optez pour une formule complète : photos professionnelles et film de mariage émotionnel.</p>
            </div>
            <div className="service-item">
              <h3>💝 Séance Couple</h3>
              <p>Une séance engagement ou day after incluse pour créer des souvenirs uniques.</p>
            </div>
            <div className="service-item">
              <h3>🖼️ Galerie Privée</h3>
              <p>Accès à une galerie en ligne sécurisée pour partager vos photos avec vos proches.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="portfolio-cta">
        <div className="cta-content">
          <h2>Réservez Votre Date</h2>
          <p>
            Les dates de mariage se remplissent rapidement. Contactez-moi dès maintenant 
            pour discuter de votre projet et vérifier mes disponibilités.
          </p>
          <a href="#/contact" className="cta-button">Demander un Devis</a>
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

export default Mariage
