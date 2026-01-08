import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import './About.css'

function About() {
  const [fadeIn, setFadeIn] = useState(false)

  useEffect(() => {
    setFadeIn(true)
  }, [])

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }

  return (
    <div className={`about-page ${fadeIn ? 'fade-in' : ''}`}>
      {/* Hero Section */}
      <section className="about-hero">
        <motion.div 
          className="about-hero-overlay"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="about-hero-title">À Propos</h1>
          <p className="about-hero-subtitle">Ma passion, mon histoire</p>
        </motion.div>
      </section>

      {/* Main Content */}
      <div className="about-container">
        {/* Portrait Section */}
        <section className="about-portrait-section">
          <div className="portrait-wrapper">
            <div className="portrait-image">
              {/* Placeholder for portrait photo */}
              <div className="portrait-placeholder">
                <span>Photo Portrait</span>
              </div>
            </div>
          </div>
          <div className="portrait-intro">
            <h2>David Irie</h2>
            <p className="portrait-tagline">Photographe & Vidéaste</p>
            <p className="portrait-location">📍 Basé à Abidjan, Côte d'Ivoire</p>
          </div>
        </section>

        {/* Story Section */}
        <motion.section 
          className="about-story-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInUp}
          transition={{ duration: 0.6 }}
        >
          <div className="story-content">
            <h2 className="section-title">Mon Histoire</h2>
            <div className="story-text">
              <p>
                Je suis David Irie, photographe et vidéaste passionné. Mon aventure dans l'univers 
                de l'image a débuté il y a plusieurs années, nourrie par une fascination pour la 
                capacité de la photographie à capturer l'essence d'un moment, d'une émotion, d'une histoire.
              </p>
              <p>
                Entièrement autodidacte, j'ai consacré d'innombrables heures à perfectionner mon art, 
                explorant différents styles et techniques pour développer ma propre signature visuelle. 
                Cette quête perpétuelle d'excellence m'a permis de transformer une passion en vocation.
              </p>
              <p>
                Aujourd'hui, je me spécialise dans la photographie de mariage, de couple et d'événements. 
                Chaque projet est pour moi une nouvelle opportunité de raconter une histoire unique, 
                de capturer des émotions authentiques et de créer des souvenirs impérissables.
              </p>
            </div>
          </div>
        </motion.section>

        {/* Philosophy Section */}
        <motion.section 
          className="about-philosophy-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.div className="philosophy-grid">
            <motion.div className="philosophy-item" variants={fadeInUp} transition={{ duration: 0.5 }}>
              <div className="philosophy-icon">🎨</div>
              <h3>Créativité</h3>
              <p>
                Chaque séance est une toile blanche où j'exprime ma vision artistique tout en 
                respectant votre personnalité et vos désirs.
              </p>
            </motion.div>
            <motion.div className="philosophy-item" variants={fadeInUp} transition={{ duration: 0.5 }}>
              <div className="philosophy-icon">❤️</div>
              <h3>Authenticité</h3>
              <p>
                Je privilégie les moments naturels et spontanés. Mes photos racontent des histoires 
                vraies, pleines d'émotions sincères.
              </p>
            </motion.div>
            <motion.div className="philosophy-item" variants={fadeInUp} transition={{ duration: 0.5 }}>
              <div className="philosophy-icon">⭐</div>
              <h3>Excellence</h3>
              <p>
                La qualité est au cœur de mon travail. Du shooting à la livraison finale, 
                je m'engage à vous offrir le meilleur.
              </p>
            </motion.div>
            <motion.div className="philosophy-item" variants={fadeInUp} transition={{ duration: 0.5 }}>
              <div className="philosophy-icon">🤝</div>
              <h3>Écoute</h3>
              <p>
                Votre vision est essentielle. Je prends le temps de comprendre vos attentes 
                pour créer ensemble des images qui vous ressemblent.
              </p>
            </motion.div>
          </motion.div>
        </motion.section>

        {/* Approach Section */}
        <section className="about-approach-section">
          <h2 className="section-title">Ma Démarche</h2>
          <div className="approach-content">
            <div className="approach-step">
              <div className="step-number">01</div>
              <h3>Échange & Découverte</h3>
              <p>
                Nous commençons par un entretien où nous discutons de votre projet, de vos attentes 
                et de votre vision. C'est le moment de créer une connexion et de planifier ensemble.
              </p>
            </div>
            <div className="approach-step">
              <div className="step-number">02</div>
              <h3>Préparation & Création</h3>
              <p>
                Je prépare minutieusement chaque séance : repérage des lieux, choix de l'équipement, 
                planification du timing. Le jour J, je me concentre sur capturer l'essence de chaque instant.
              </p>
            </div>
            <div className="approach-step">
              <div className="step-number">03</div>
              <h3>Sélection & Retouche</h3>
              <p>
                Après la séance, je sélectionne et retouche chaque image avec soin. Mon objectif : 
                sublimer vos photos tout en préservant leur authenticité.
              </p>
            </div>
            <div className="approach-step">
              <div className="step-number">04</div>
              <h3>Livraison & Suivi</h3>
              <p>
                Vous recevez vos photos en haute résolution via une galerie privée. Je reste disponible 
                pour toute question ou besoin d'impression.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="about-cta-section">
          <div className="about-cta-content">
            <h2>Prêt à Commencer Votre Histoire ?</h2>
            <p>
              Que ce soit pour un mariage, une séance de couple ou un événement spécial, 
              je serais ravi d'échanger avec vous sur votre projet.
            </p>
            <a href="#/contact" className="cta-button">Contactez-moi</a>
          </div>
        </section>
      </div>
    </div>
  )
}

export default About
