import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './App.css'

function App() {
  const [activeDropdown, setActiveDropdown] = useState(null)
  const [visibleImages, setVisibleImages] = useState(new Set())
  const [currentSlide, setCurrentSlide] = useState(0)
  const observerRef = useRef(null)

  const slides = [
    { title: "DAVID IRIE PHOTOGRAPHIE", subtitle: "Amour, PASSION, créativité.", buttonText: "Plus d'infos", image: `${import.meta.env.BASE_URL}images/slide1.jpg` },
    { title: "PRÉVOIR L'INSTANT, LE FIGER", subtitle: "NOUVELLE PLAQUETTE 2025 - 2027", buttonText: "Plus d'infos", image: `${import.meta.env.BASE_URL}images/slide2.jpg` },
    { title: "CALENDRIER WEDDING", subtitle: "2026", buttonText: "Cliquez ici", image: `${import.meta.env.BASE_URL}images/slide3.jpg` },
    { title: "LA QUALITÉ AVANT LE PRIX", subtitle: "Créativité & authenticité", buttonText: "Découvrir", image: `${import.meta.env.BASE_URL}images/slide4.jpg` },
    { title: "PORTRAITS & LIFESTYLE", subtitle: "Capturer votre essence", buttonText: "En savoir plus", image: `${import.meta.env.BASE_URL}images/slide5.jpg` }
  ]

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
          <nav className="nav">
            <Link to="/" className="nav-link">Accueil</Link>
            <a href="#about" className="nav-link">À Propos</a>
            
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
                  <a href="#mariage">Mariage</a>
                  <a href="#couple">Couple shoot</a>
                  <a href="#evenements">Événements</a>
                  <a href="#shooting-strobist">Shooting strobist</a>
                  <a href="#shooting-exterieur">Shooting extérieur</a>
                  <a href="#shooting-studio">Shooting studio</a>
                </div>
              )}
            </div>

            {/* Vidéos Dropdown */}
            <div className="nav-dropdown">
              <button 
                className="nav-link dropdown-toggle"
                onClick={() => toggleDropdown('videos')}
              >
                Vidéos
              </button>
              {activeDropdown === 'videos' && (
                <div className="dropdown-menu">
                  <a href="#teaser-mariage">Teaser mariage</a>
                  <a href="#pre-wedding">Pré-wedding</a>
                  <a href="#demande-mariage">Demande en mariage</a>
                  <a href="#lifestyle">Lifestyle</a>
                  <a href="#pub">Spots publicitaire</a>
                </div>
              )}
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
                  <a href="#mariage-photo-video">Mariage photo/vidéo</a>
                  <a href="#mariage-photo">Mariage Photo</a>
                  <a href="#mariage-video">Mariage Vidéo</a>
                  <a href="#shooting-ext">Shooting extérieur</a>
                  <a href="#shooting-stu">Shooting Studio</a>
                </div>
              )}
            </div>

            <Link to="/formations" className="nav-link">Formations</Link>
            <a href="#galeries" className="nav-link">Galeries privées</a>
            <Link to="/contact" className="nav-link">Contact</Link>
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
            {[...Array(8)].map((_, index) => (
              <div key={index} className="instagram-photo">
                <div className="instagram-photo-placeholder">
                  <span className="placeholder-text">IG {index + 1}</span>
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
    </div>
  )
}

export default App
