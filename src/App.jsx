import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Lightbox from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'
import './App.css'

function App() {
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [visibleImages, setVisibleImages] = useState(new Set())
  const [currentSlide, setCurrentSlide] = useState(0)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)
  const observerRef = useRef(null)

  const slides = [
    { title: "DAVID IRIE PHOTOGRAPHIE", subtitle: "Amour, PASSION, créativité.", buttonText: "Plus d'infos", image: `${import.meta.env.BASE_URL}images/slide1.jpg` },
    { title: "PRÉVOIR L'INSTANT, LE FIGER", subtitle: "NOUVELLE PLAQUETTE 2025 - 2027", buttonText: "Plus d'infos", image: `${import.meta.env.BASE_URL}images/slide2.jpg` },
    { title: "CALENDRIER WEDDING", subtitle: "2026", buttonText: "Cliquez ici", image: `${import.meta.env.BASE_URL}images/slide3.jpg` },
    { title: "LA QUALITÉ AVANT LE PRIX", subtitle: "Créativité & authenticité", buttonText: "Découvrir", image: `${import.meta.env.BASE_URL}images/slide4.jpg` },
    { title: "PORTRAITS & LIFESTYLE", subtitle: "Capturer votre essence", buttonText: "En savoir plus", image: `${import.meta.env.BASE_URL}images/slide5.jpg` }
  ]

  // Instagram photos - reusing slider images as placeholders
  const instagramPhotos = [
    `${import.meta.env.BASE_URL}images/slide1.jpg`,
    `${import.meta.env.BASE_URL}images/slide2.jpg`,
    `${import.meta.env.BASE_URL}images/slide3.jpg`,
    `${import.meta.env.BASE_URL}images/slide4.jpg`,
    `${import.meta.env.BASE_URL}images/slide5.jpg`,
    `${import.meta.env.BASE_URL}images/slide1.jpg`,
    `${import.meta.env.BASE_URL}images/slide2.jpg`,
    `${import.meta.env.BASE_URL}images/slide3.jpg`,
  ]

  const openLightbox = (index) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(slideInterval)
  }, [slides.length])

  const toggleDropdown = (menu) => {
    setActiveDropdown(activeDropdown === menu ? null : menu)
  }

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = parseInt(entry.target.dataset.index)
            setVisibleImages((prev) => new Set([...prev, index]))
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: '50px'
      }
    )

    const images = document.querySelectorAll('.gallery-item, .feature-single, .slider-photo-item')
    images.forEach((img) => observerRef.current.observe(img))

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [])

  return (
    <div className="app">
      {/* Header avec Hero Slider en background - comme KAMINASHOOT */}
      <header className="header-with-slider">
        {/* Hero Slider - 4 slides plein écran EN BACKGROUND */}
        <div className="hero-slider">
          <div className="hero-slides">
            {slides.map((slide, index) => (
              <div 
                key={index} 
                className={`hero-slide ${index === currentSlide ? 'active' : ''}`}
              >
                <div className="hero-slide-bg" style={{ backgroundImage: `url(${slide.image})` }}>
                </div>
                <div className="hero-slide-tint"></div>
              </div>
            ))}
          </div>
          <button className="hero-prev" onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}>←</button>
          <button className="hero-next" onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}>→</button>
          
          {/* Compteur de slides */}
          <div className="hero-slide-counter">
            <span className="current-slide">0{currentSlide + 1}</span>
            <span className="slide-separator">—</span>
            <span className="total-slides">0{slides.length}</span>
          </div>
        </div>

        {/* Header Navigation par-dessus le slider */}
        <div className="header-content">
          <div className="header-spacer"></div>
          <h1 className="logo">DAVID IRIE</h1>
          <div className="header-spacer-small"></div>
          
          {/* Hamburger Button - Mobile only */}
          <button 
            className="hamburger-btn" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>

          {/* Mobile Menu Backdrop */}
          {mobileMenuOpen && (
            <div 
              className="menu-backdrop" 
              onClick={() => setMobileMenuOpen(false)}
            ></div>
          )}

          <nav className={`nav ${mobileMenuOpen ? 'nav-open' : ''}`}>
            <Link to="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Accueil</Link>
            <Link to="/about" className="nav-link" onClick={() => setMobileMenuOpen(false)}>À Propos</Link>
            
            {/* Portfolio Dropdown */}
            <div className="nav-dropdown">
              <button 
                className="nav-link dropdown-toggle"
                onClick={() => toggleDropdown('portfolio')}
              >
                Portfolio
              </button>
              {activeDropdown === 'portfolio' && (
                <div className="dropdown-menu">
                  <Link to="/portfolio/mariage" onClick={() => { setMobileMenuOpen(false); setActiveDropdown(null); }}>Mariage</Link>
                  <Link to="/portfolio/couple" onClick={() => { setMobileMenuOpen(false); setActiveDropdown(null); }}>Couple</Link>
                  <Link to="/portfolio/evenements" onClick={() => { setMobileMenuOpen(false); setActiveDropdown(null); }}>Événements</Link>
                  <Link to="/portfolio/strobist" onClick={() => { setMobileMenuOpen(false); setActiveDropdown(null); }}>Shooting Strobist</Link>
                  <Link to="/portfolio/exterieur" onClick={() => { setMobileMenuOpen(false); setActiveDropdown(null); }}>Shooting Extérieur</Link>
                  <Link to="/portfolio/studio" onClick={() => { setMobileMenuOpen(false); setActiveDropdown(null); }}>Shooting Studio</Link>
                </div>
              )}
            </div>

            {/* Vidéos Dropdown */}
            <div className="nav-dropdown">
              <Link 
                to="/videos"
                className="nav-link"
                onClick={() => { setMobileMenuOpen(false); setActiveDropdown(null); }}
              >
                Vidéos
              </Link>
            </div>

            {/* Tarifs Dropdown */}
            <div className="nav-dropdown">
              <button 
                className="nav-link dropdown-toggle"
                onClick={() => toggleDropdown('tarifs')}
              >
                Tarifs
              </button>
              {activeDropdown === 'tarifs' && (
                <div className="dropdown-menu">
                  <a href="#mariage-photo-video" onClick={() => setMobileMenuOpen(false)}>Mariage photo/vidéo</a>
                  <a href="#mariage-photo" onClick={() => setMobileMenuOpen(false)}>Mariage Photo</a>
                  <a href="#mariage-video" onClick={() => setMobileMenuOpen(false)}>Mariage Vidéo</a>
                  <a href="#shooting-ext" onClick={() => setMobileMenuOpen(false)}>Shooting extérieur</a>
                  <a href="#shooting-stu" onClick={() => setMobileMenuOpen(false)}>Shooting Studio</a>
                </div>
              )}
            </div>

            <Link to="/formations" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Formations</Link>
            <a href="#galeries" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Galeries privées</a>
            <Link to="/contact" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Contact</Link>
          </nav>
          <div className="header-spacer"></div>
        </div>

        {/* Contenu Hero par-dessus tout */}
        <div className="hero-slide-content">
          <h2 className="hero-slide-title">{slides[currentSlide].title}</h2>
          {slides[currentSlide].subtitle && <p className="hero-slide-subtitle">{slides[currentSlide].subtitle}</p>}
          {slides[currentSlide].buttonText && (
            <a href="#" className="hero-slide-button">{slides[currentSlide].buttonText}</a>
          )}
        </div>
      </header>

      <main>
        {/* Texte de mission centré */}
        <section className="mission-section">
          <div className="mission-content">
            <p className="mission-statement">
              Photographe mariage Paris, je suis disponible pour immortaliser les émotions de votre journée de mariage, 
              être là où tout commence pour vous. Je maîtrise l'art de la photo portrait, beauté, Lifestyle, mode ainsi 
              que la vidéo partout en France.
            </p>
          </div>
        </section>

        {/* Vidéo Banner - Player Vimeo */}
        <section className="video-banner-section">
          <div className="video-banner">
            <video 
              className="video-player"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src={`${import.meta.env.BASE_URL}images/video1.mp4`} type="video/mp4" />
            </video>
            <div className="video-overlay-content">
              <h3 className="video-overlay-title">MOMENTS PRÉCIEUX</h3>
              <p className="video-overlay-subtitle">Capturer l'émotion de votre mariage</p>
            </div>
          </div>
        </section>

        {/* Bouton TARIFS wedding */}
        <section className="tarifs-button-section">
          <a href="#tarifs" className="tarifs-button">TARIFS wedding</a>
        </section>

        {/* Photo Slider - Carrousel horizontal comme KAMINASHOOT */}
        <section className="photo-slider-section">
          <div className="photo-slider">
            {slides.map((slide, index) => (
              <div key={index} className="slider-photo-item" data-index={index}>
                <div className="slider-photo-placeholder" style={{ backgroundImage: `url(${slide.image})` }}>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Réseaux sociaux */}
        <section className="social-section">
          <div className="social-links">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <span>Facebook</span>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
              <span>Instagram</span>
            </a>
          </div>
        </section>

        {/* Feed Instagram - Bande de photos */}
        <section className="instagram-feed">
          <div className="instagram-photos">
            {instagramPhotos.map((photo, index) => (
              <div 
                key={index} 
                className="instagram-photo"
                onClick={() => openLightbox(index)}
                style={{ cursor: 'pointer' }}
              >
                <div className="instagram-photo-placeholder" style={{ backgroundImage: `url(${photo})` }}>
                </div>
              </div>
            ))}
          </div>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="instagram-overlay">
            <div className="instagram-overlay-content">
              <div className="instagram-icon">📷</div>
              <h3>Instagram</h3>
              <p>@davidiriephotographie</p>
            </div>
          </a>
        </section>

        {/* Section À Propos */}
        <section id="about" className="about-section">
          <div className="about-content">
            <h2 className="section-title">À Propos</h2>
            <p className="about-text">
              Je suis David Irie, photographe et vidéaste.
            </p>
            <p className="about-text">
              Ma passion pour l'art de la photographie et de la vidéo m'a conduit à créer mon studio. 
              Entièrement autodidacte, j'ai transformé cet intérêt en une véritable aventure créative, 
              dédiée à capturer les moments les plus précieux de la vie.
            </p>
            <p className="about-text">
              Photographe & vidéaste de mariage, je suis à vos côtés pour capturer chaque émotion de votre journée, 
              présent dès les premiers instants pour raconter le début de votre nouvelle histoire ensemble.
            </p>
          </div>
        </section>

        {/* Section Contact */}
        <section id="contact" className="contact-section">
          <h2 className="section-title-large">COMMENÇONS VOTRE VOYAGE</h2>
          <div className="contact-features">
            <div className="feature">
              <h3>DES CLIENTS SATISFAITS</h3>
            </div>
            <div className="feature">
              <h3>UN TRAVAIL DE QUALITÉ</h3>
            </div>
            <div className="feature">
              <h3>DISPONIBLE & À L'ÉCOUTE</h3>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <p>All content Copyright © 2026 DAVID IRIE PHOTOGRAPHIE</p>
      </footer>

      {/* Lightbox */}
      <Lightbox
        open={lightboxOpen}
        close={() => setLightboxOpen(false)}
        index={lightboxIndex}
        slides={instagramPhotos.map(photo => ({ src: photo }))}
      />
    </div>
  )
}

export default App
