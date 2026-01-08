import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import './Portfolio.css'

function Evenements() {
  const [fadeIn, setFadeIn] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    setFadeIn(true)
  }, [])

  // Event photos
  const photos = [
    { src: `${import.meta.env.BASE_URL}images/bouquet-roses-1.jpg`, width: 3, height: 4 }, // Bouquet roses
    { src: `${import.meta.env.BASE_URL}images/slide3.jpg`, width: 16, height: 9 }, // Landscape
    { src: `${import.meta.env.BASE_URL}images/slide4.jpg`, width: 3, height: 4 }, // Portrait
    { src: `${import.meta.env.BASE_URL}images/bouquet-roses-2.jpg`, width: 3, height: 4 }, // Bouquet roses 2
    { src: `${import.meta.env.BASE_URL}images/slide5.jpg`, width: 4, height: 5 }, // Portrait tall
    { src: `${import.meta.env.BASE_URL}images/slide1.jpg`, width: 16, height: 9 }, // Landscape
    { src: `${import.meta.env.BASE_URL}images/slide2.jpg`, width: 3, height: 4 }, // Portrait
    { src: `${import.meta.env.BASE_URL}images/slide3.jpg`, width: 4, height: 5 }, // Portrait tall
    { src: `${import.meta.env.BASE_URL}images/slide4.jpg`, width: 16, height: 9 }, // Landscape
    { src: `${import.meta.env.BASE_URL}images/slide5.jpg`, width: 3, height: 4 }, // Portrait
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
          <h1 className="portfolio-hero-title">Événements</h1>
          <p className="portfolio-hero-subtitle">
            Capturer l'énergie, l'émotion et les moments marquants de vos événements spéciaux
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="portfolio-intro">
        <div className="intro-content">
          <h2>Photographie d'Événements</h2>
          <p>
            Chaque événement est unique et mérite d'être immortalisé avec professionnalisme et créativité. 
            Qu'il s'agisse d'un anniversaire, d'une célébration familiale, d'un événement d'entreprise 
            ou d'une soirée privée, je capture l'essence et l'atmosphère de votre événement avec 
            discrétion et dynamisme.
          </p>
          <p>
            Mon approche combine photojournalisme et créativité artistique pour documenter tous les 
            moments importants : les préparatifs, les moments forts, les interactions spontanées et 
            l'ambiance générale. Vous recevrez une collection complète d'images qui raconte l'histoire 
            de votre événement du début à la fin.
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
              <img src={photo.src} alt={`Événement ${index + 1}`} loading="lazy" />
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
          <h2>Types d'Événements</h2>
          <div className="services-grid">
            <div className="service-item">
              <h3>🎂 Anniversaires</h3>
              <p>Célébrations d'anniversaire, fêtes d'enfants, et événements familiaux mémorables.</p>
            </div>
            <div className="service-item">
              <h3>🏢 Corporate</h3>
              <p>Conférences, séminaires, lancements de produits et événements d'entreprise.</p>
            </div>
            <div className="service-item">
              <h3>🎊 Célébrations</h3>
              <p>Baptêmes, communions, graduations et toutes vos célébrations importantes.</p>
            </div>
            <div className="service-item">
              <h3>🎭 Soirées Privées</h3>
              <p>Galas, cocktails, soirées thématiques et événements exclusifs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="portfolio-cta">
        <div className="cta-content">
          <h2>Planifions Votre Couverture</h2>
          <p>
            Discutons de votre événement et de vos besoins spécifiques. Je vous propose 
            une couverture photo adaptée à votre budget et à vos attentes.
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

export default Evenements
