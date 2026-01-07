import { useState } from 'react'
import './Formations.css'

function Formations() {
  const formations = [
    {
      title: "Formation Photographie de Mariage",
      duration: "2 jours",
      level: "Débutant à Intermédiaire",
      price: "890€",
      description: "Apprenez les techniques essentielles de la photographie de mariage, de la préparation à la réception.",
      points: [
        "Gestion de la lumière naturelle et artificielle",
        "Composition et cadrage créatif",
        "Direction des mariés et invités",
        "Post-production et livraison"
      ]
    },
    {
      title: "Formation Portrait & Lifestyle",
      duration: "1 jour",
      level: "Tous niveaux",
      price: "490€",
      description: "Maîtrisez l'art du portrait en studio et en extérieur pour créer des images authentiques.",
      points: [
        "Techniques de pose et direction",
        "Utilisation du flash et modificateurs",
        "Création d'ambiances",
        "Retouche portrait professionnelle"
      ]
    },
    {
      title: "Formation Strobist Avancé",
      duration: "1 jour",
      level: "Intermédiaire à Avancé",
      price: "590€",
      description: "Perfectionnez vos compétences en éclairage artificiel pour des créations uniques.",
      points: [
        "Configuration multi-flash",
        "Schémas d'éclairage créatifs",
        "Shooting en conditions difficiles",
        "Équilibre lumière ambiante/flash"
      ]
    },
    {
      title: "Formation Business Photographe",
      duration: "1 jour",
      level: "Tous niveaux",
      price: "390€",
      description: "Développez votre activité de photographe professionnel avec les bonnes stratégies.",
      points: [
        "Tarification et packages",
        "Marketing et communication",
        "Gestion administrative",
        "Développement client"
      ]
    }
  ]

  return (
    <div className="formations-page">
      {/* Hero Section */}
      <section className="formations-hero">
        <div className="formations-hero-content">
          <h1 className="formations-hero-title">FORMATIONS</h1>
          <p className="formations-hero-subtitle">Développez vos compétences photographiques</p>
        </div>
      </section>

      {/* Introduction */}
      <section className="formations-intro">
        <div className="formations-intro-content">
          <h2 className="formations-intro-title">Partagez ma passion</h2>
          <p className="formations-intro-text">
            Fort de plus de 10 ans d'expérience en photographie de mariage et portrait, 
            je partage mes connaissances et techniques à travers des formations sur mesure. 
            Que vous soyez débutant ou photographe confirmé, mes formations vous permettront 
            d'acquérir de nouvelles compétences et de développer votre créativité.
          </p>
        </div>
      </section>

      {/* Formations List */}
      <section className="formations-list">
        {formations.map((formation, index) => (
          <div key={index} className="formation-card">
            <div className="formation-header">
              <h3 className="formation-title">{formation.title}</h3>
              <div className="formation-meta">
                <span className="formation-duration">{formation.duration}</span>
                <span className="formation-level">{formation.level}</span>
              </div>
            </div>
            <p className="formation-description">{formation.description}</p>
            <ul className="formation-points">
              {formation.points.map((point, idx) => (
                <li key={idx}>{point}</li>
              ))}
            </ul>
            <div className="formation-footer">
              <span className="formation-price">{formation.price}</span>
              <a href="/contact" className="formation-button">Réserver</a>
            </div>
          </div>
        ))}
      </section>

      {/* CTA Section */}
      <section className="formations-cta">
        <h2 className="formations-cta-title">Prêt à commencer ?</h2>
        <p className="formations-cta-text">Contactez-moi pour discuter de vos besoins et réserver votre formation</p>
        <a href="/contact" className="formations-cta-button">Prendre rendez-vous</a>
      </section>
    </div>
  )
}

export default Formations
