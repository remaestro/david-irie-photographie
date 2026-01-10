import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { FiUser, FiAperture, FiUsers, FiPackage } from 'react-icons/fi'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import './Portfolio.css'

function ShootingStudio() {
  const [fadeIn, setFadeIn] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    setFadeIn(true)
  }, [])

  // Studio photos - using existing images as placeholders
  const photos = [
    { src: `${import.meta.env.BASE_URL}images/slide3.jpg`, width: 4, height: 5 },
    { src: `${import.meta.env.BASE_URL}images/slide4.jpg`, width: 3, height: 4 },
    { src: `${import.meta.env.BASE_URL}images/slide5.jpg`, width: 16, height: 9 },
    { src: `${import.meta.env.BASE_URL}images/slide1.jpg`, width: 4, height: 5 },
    { src: `${import.meta.env.BASE_URL}images/slide2.jpg`, width: 3, height: 4 },
    { src: `${import.meta.env.BASE_URL}images/slide3.jpg`, width: 16, height: 9 },
    { src: `${import.meta.env.BASE_URL}images/slide4.jpg`, width: 4, height: 5 },
    { src: `${import.meta.env.BASE_URL}images/slide5.jpg`, width: 3, height: 4 },
    { src: `${import.meta.env.BASE_URL}images/slide1.jpg`, width: 16, height: 9 },
    { src: `${import.meta.env.BASE_URL}images/slide2.jpg`, width: 4, height: 5 },
  ]

  const openLightbox = (index) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <div className={`portfolio-page ${fadeIn ? 'fade-in' : ''}`}>
      {/* Hero Section */}
      <section className="portfolio-hero" style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(' + import.meta.env.BASE_URL + 'images/slide3.jpg)' }}>
        <div className="portfolio-hero-overlay">
          <h1 className="portfolio-hero-title">Shooting Studio</h1>
          <p className="portfolio-hero-subtitle">
            Environnement contrôlé et éclairage professionnel pour des portraits impeccables
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="portfolio-intro">
        <div className="intro-content">
          <h2>Photographie en Studio</h2>
          <p>
            Le studio offre un contrôle total sur chaque aspect de la photographie. Fond uni ou décor 
            personnalisé, éclairage précis et ambiance maîtrisée - tout est orchestré pour créer 
            exactement l'image que vous désirez. Mon studio est équipé de matériel professionnel 
            haut de gamme pour garantir des résultats d'une qualité exceptionnelle.
          </p>
          <p>
            Que vous ayez besoin de portraits corporate classiques, de photos créatives artistiques, 
            ou de shootings produits, le studio permet une flexibilité et une précision impossibles 
            à obtenir en extérieur. Chaque séance est préparée selon vos besoins spécifiques.
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
              <img src={photo.src} alt={`Studio ${index + 1}`} loading="lazy" />
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
          <h2>Services Studio</h2>
          <div className="services-grid">
            <div className="service-item">
              <h3><FiUser size={24} strokeWidth={1.5} /> Portraits Professionnels</h3>
              <p>Photos d'entreprise, CV, LinkedIn avec fonds neutres et éclairage flattteur.</p>
            </div>
            <div className="service-item">
              <h3><FiAperture size={24} strokeWidth={1.5} /> Créatif & Artistique</h3>
              <p>Séances conceptuelles avec décors, accessoires et éclairages créatifs.</p>
            </div>
            <div className="service-item">
              <h3><FiUsers size={24} strokeWidth={1.5} /> Photos Famille</h3>
              <p>Portraits de famille, maternité, nouveau-nés dans un environnement confortable.</p>
            </div>
            <div className="service-item">
              <h3><FiPackage size={24} strokeWidth={1.5} /> Produits & Lookbooks</h3>
              <p>Photographie produits et mode avec éclairage commercial professionnel.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="portfolio-cta">
        <div className="cta-content">
          <h2>Réservez le Studio</h2>
          <p>
            Le studio est disponible pour vos projets personnels ou professionnels. 
            Contactez-moi pour discuter de votre vision et réserver votre créneau.
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

export default ShootingStudio
