import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import './Portfolio.css'

function Couple() {
  const [fadeIn, setFadeIn] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  useEffect(() => {
    setFadeIn(true)
  }, [])

  // Couple photos
  const photos = [
    { src: `${import.meta.env.BASE_URL}images/couple-bijoux-1.jpg`, width: 3, height: 4 }, // Couple bijoux 1
    { src: `${import.meta.env.BASE_URL}images/homme-fleur.jpg`, width: 3, height: 4 }, // Homme avec fleur
    { src: `${import.meta.env.BASE_URL}images/couple-bijoux-2.jpg`, width: 3, height: 4 }, // Couple bijoux 2
    { src: `${import.meta.env.BASE_URL}images/slide2.jpg`, width: 4, height: 5 }, // Portrait tall
    { src: `${import.meta.env.BASE_URL}images/slide3.jpg`, width: 3, height: 4 }, // Portrait
    { src: `${import.meta.env.BASE_URL}images/slide4.jpg`, width: 16, height: 9 }, // Landscape
    { src: `${import.meta.env.BASE_URL}images/slide5.jpg`, width: 4, height: 5 }, // Portrait tall
    { src: `${import.meta.env.BASE_URL}images/slide1.jpg`, width: 3, height: 4 }, // Portrait
    { src: `${import.meta.env.BASE_URL}images/slide2.jpg`, width: 16, height: 9 }, // Landscape
    { src: `${import.meta.env.BASE_URL}images/slide3.jpg`, width: 4, height: 5 }, // Portrait tall
  ]

  const openLightbox = (index) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  return (
    <div className={`portfolio-page ${fadeIn ? 'fade-in' : ''}`}>
      {/* Hero Section */}
      <section className="portfolio-hero" style={{ backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(' + import.meta.env.BASE_URL + 'images/slide2.jpg)' }}>
        <div className="portfolio-hero-overlay">
          <h1 className="portfolio-hero-title">Séances Couple</h1>
          <p className="portfolio-hero-subtitle">
            Immortaliser votre complicité et votre amour dans des images authentiques et intemporelles
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="portfolio-intro">
        <div className="intro-content">
          <h2>Photographie de Couple</h2>
          <p>
            Une séance photo de couple est bien plus qu'une simple session photo. C'est un moment 
            privilégié où vous pouvez vous reconnecter, vous amuser ensemble et créer des souvenirs 
            précieux. Mon objectif est de capturer votre complicité naturelle, vos regards complices 
            et toute la beauté de votre relation.
          </p>
          <p>
            Que ce soit pour des fiançailles, un anniversaire, ou simplement pour célébrer votre amour, 
            je crée une atmosphère détendue et naturelle où vous pouvez être vous-mêmes. Le résultat : 
            des photos sincères qui reflètent votre histoire unique.
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
              <img src={photo.src} alt={`Couple ${index + 1}`} loading="lazy" />
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
          <h2>Types de Séances</h2>
          <div className="services-grid">
            <div className="service-item">
              <h3>💍 Engagement</h3>
              <p>Célébrez votre engagement avec une séance photo romantique avant le grand jour.</p>
            </div>
            <div className="service-item">
              <h3>🌅 Lifestyle</h3>
              <p>Séances naturelles dans votre environnement quotidien ou vos lieux favoris.</p>
            </div>
            <div className="service-item">
              <h3>🌴 Day After</h3>
              <p>Prolongez la magie de votre mariage avec une séance détendue le lendemain.</p>
            </div>
            <div className="service-item">
              <h3>🎉 Anniversaire</h3>
              <p>Marquez les étapes importantes de votre relation avec des photos mémorables.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="portfolio-cta">
        <div className="cta-content">
          <h2>Réservez Votre Séance</h2>
          <p>
            Créons ensemble des souvenirs inoubliables. Contactez-moi pour discuter 
            de vos idées et planifier votre séance photo de couple.
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

export default Couple
