import { useState, useEffect } from 'react'
import './Videos.css'

function Videos() {
  const [fadeIn, setFadeIn] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState(null)

  useEffect(() => {
    setFadeIn(true)
  }, [])

  // Video collection - mix of YouTube embeds and local videos
  const videos = [
    {
      id: 1,
      title: "Mariage Laura & Antoine",
      category: "Mariage",
      thumbnail: `${import.meta.env.BASE_URL}images/slide1.jpg`,
      type: "local",
      src: `${import.meta.env.BASE_URL}images/video1.mp4`
    },
    {
      id: 2,
      title: "Séance Couple - Golden Hour",
      category: "Couple",
      thumbnail: `${import.meta.env.BASE_URL}images/slide2.jpg`,
      type: "local",
      src: `${import.meta.env.BASE_URL}images/video2.mp4`
    },
    {
      id: 3,
      title: "Événement Corporate - Lancement Produit",
      category: "Événement",
      thumbnail: `${import.meta.env.BASE_URL}images/slide3.jpg`,
      type: "local",
      src: `${import.meta.env.BASE_URL}images/video1.mp4`
    },
    {
      id: 4,
      title: "Mariage Sarah & David",
      category: "Mariage",
      thumbnail: `${import.meta.env.BASE_URL}images/slide4.jpg`,
      type: "local",
      src: `${import.meta.env.BASE_URL}images/video2.mp4`
    },
    {
      id: 5,
      title: "Day After - Plage",
      category: "Couple",
      thumbnail: `${import.meta.env.BASE_URL}images/slide5.jpg`,
      type: "local",
      src: `${import.meta.env.BASE_URL}images/video1.mp4`
    },
    {
      id: 6,
      title: "Gala Annuel 2025",
      category: "Événement",
      thumbnail: `${import.meta.env.BASE_URL}images/slide1.jpg`,
      type: "local",
      src: `${import.meta.env.BASE_URL}images/video2.mp4`
    }
  ]

  const [activeFilter, setActiveFilter] = useState('Tous')
  
  const categories = ['Tous', 'Mariage', 'Couple', 'Événement']
  
  const filteredVideos = activeFilter === 'Tous' 
    ? videos 
    : videos.filter(video => video.category === activeFilter)

  const openVideo = (video) => {
    setSelectedVideo(video)
    document.body.style.overflow = 'hidden' // Prevent background scroll
  }

  const closeVideo = () => {
    setSelectedVideo(null)
    document.body.style.overflow = 'auto'
  }

  return (
    <div className={`videos-page ${fadeIn ? 'fade-in' : ''}`}>
      {/* Hero Section */}
      <section className="videos-hero">
        <div className="videos-hero-overlay">
          <h1 className="videos-hero-title">Vidéos</h1>
          <p className="videos-hero-subtitle">
            Des films émotionnels qui racontent votre histoire
          </p>
        </div>
      </section>

      {/* Intro Section */}
      <section className="videos-intro">
        <div className="intro-content">
          <h2>Cinématographie & Storytelling</h2>
          <p>
            Au-delà de la photographie, je propose également des services de vidéographie professionnelle. 
            Chaque film que je réalise est une œuvre narrative qui capture l'essence émotionnelle de votre 
            événement. De la préparation aux moments culminants, je documente votre histoire avec une 
            approche cinématographique et artistique.
          </p>
          <p>
            Mes films combinent séquences documentaires naturelles et prises de vue stylisées pour créer 
            un récit visuel captivant que vous chérirez pour toujours.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="videos-filter-section">
        <div className="filter-container">
          <h3>Filtrer par catégorie</h3>
          <div className="filter-buttons">
            {categories.map(category => (
              <button
                key={category}
                className={`filter-btn ${activeFilter === category ? 'active' : ''}`}
                onClick={() => setActiveFilter(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Video Grid */}
      <section className="videos-grid-section">
        <div className="videos-grid">
          {filteredVideos.map(video => (
            <div 
              key={video.id} 
              className="video-card"
              onClick={() => openVideo(video)}
            >
              <div className="video-thumbnail">
                <img src={video.thumbnail} alt={video.title} />
                <div className="play-overlay">
                  <div className="play-button">▶</div>
                </div>
                <div className="video-category-badge">{video.category}</div>
              </div>
              <div className="video-info">
                <h3>{video.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Services Info */}
      <section className="videos-services">
        <div className="services-content">
          <h2>Prestations Vidéo</h2>
          <div className="services-grid">
            <div className="service-item">
              <h3>🎬 Film de Mariage</h3>
              <p>Documentaire complet de votre journée, monté avec musique et transitions cinématographiques.</p>
            </div>
            <div className="service-item">
              <h3>🎥 Clip Highlights</h3>
              <p>Résumé dynamique de 3-5 minutes parfait pour les réseaux sociaux et le partage rapide.</p>
            </div>
            <div className="service-item">
              <h3>🎞️ Multi-Caméras</h3>
              <p>Couverture avec plusieurs angles pour capturer tous les moments importants simultanément.</p>
            </div>
            <div className="service-item">
              <h3>🎙️ Interviews</h3>
              <p>Témoignages et vœux capturés en qualité studio pour enrichir votre film.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="videos-cta">
        <div className="cta-content">
          <h2>Créons Votre Film</h2>
          <p>
            Intéressé par une couverture vidéo ? Discutons de votre projet et de la meilleure 
            façon de raconter votre histoire en images.
          </p>
          <a href="#/contact" className="cta-button">Demander un Devis Vidéo</a>
        </div>
      </section>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="video-modal" onClick={closeVideo}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeVideo}>×</button>
            <h2>{selectedVideo.title}</h2>
            <div className="video-player">
              {selectedVideo.type === 'local' ? (
                <video controls autoPlay>
                  <source src={selectedVideo.src} type="video/mp4" />
                  Votre navigateur ne supporte pas la lecture de vidéos.
                </video>
              ) : (
                <iframe
                  src={selectedVideo.src}
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={selectedVideo.title}
                ></iframe>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Videos
