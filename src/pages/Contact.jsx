import { useState, useEffect } from 'react'
import './Contact.css'
import heroImage from '../assets/images/slide2.jpg'

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'mariage',
    date: '',
    message: ''
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null) // 'success' | 'error' | null

  // Load Calendly script
  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus(null)

    try {
      const response = await fetch('/.netlify/functions/sendEmail', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (response.ok) {
        setSubmitStatus('success')
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'mariage',
          date: '',
          message: ''
        })
      } else {
        setSubmitStatus('error')
        console.error('Error:', result.message)
      }
    } catch (error) {
      setSubmitStatus('error')
      console.error('Error sending email:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="contact-page">
      {/* Hero Section */}
      <section className="contact-hero" style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${heroImage})` }}>
        <div className="contact-hero-content">
          <h1 className="contact-hero-title">CONTACT</h1>
          <p className="contact-hero-subtitle">Parlons de votre projet</p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="contact-content">
        <div className="contact-container">
          {/* Contact Info */}
          <div className="contact-info">
            <h2 className="contact-info-title">Restons en contact</h2>
            <p className="contact-info-text">
              Je suis disponible pour discuter de votre projet, que ce soit pour un mariage, 
              une séance portrait, une formation ou tout autre besoin photographique.
            </p>

            <div className="contact-details">
              <div className="contact-detail-item">
                <h3 className="contact-detail-label">Email</h3>
                <a href="mailto:contact@davidirie.fr" className="contact-detail-value">
                  contact@davidirie.fr
                </a>
              </div>

              <div className="contact-detail-item">
                <h3 className="contact-detail-label">Téléphone</h3>
                <a href="tel:+33612345678" className="contact-detail-value">
                  +33 6 12 34 56 78
                </a>
              </div>

              <div className="contact-detail-item">
                <h3 className="contact-detail-label">Localisation</h3>
                <p className="contact-detail-value">Paris & Île-de-France</p>
              </div>

              <div className="contact-detail-item">
                <h3 className="contact-detail-label">Disponibilité</h3>
                <p className="contact-detail-value">Lun - Sam : 9h - 19h</p>
              </div>
            </div>

            <div className="contact-social">
              <h3 className="contact-social-title">Suivez-moi</h3>
              <div className="contact-social-links">
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="contact-social-link">
                  Instagram
                </a>
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="contact-social-link">
                  Facebook
                </a>
                <a href="https://pinterest.com" target="_blank" rel="noopener noreferrer" className="contact-social-link">
                  Pinterest
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="contact-form-wrapper">
            <h2 className="contact-form-title">Envoyez-moi un message</h2>
            <form className="contact-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">Nom complet *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="name"
                  className="form-input"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">Téléphone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-input"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="subject" className="form-label">Type de prestation *</label>
                <select
                  id="subject"
                  name="subject"
                  className="form-select"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                >
                  <option value="mariage">Mariage</option>
                  <option value="portrait">Portrait / Couple</option>
                  <option value="evenement">Événement</option>
                  <option value="formation">Formation</option>
                  <option value="autre">Autre</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="date" className="form-label">Date souhaitée</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="form-input"
                  value={formData.date}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="message" className="form-label">Message *</label>
                <textarea
                  id="message"
                  name="message"
                  className="form-textarea"
                  rows="6"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  placeholder="Parlez-moi de votre projet..."
                ></textarea>
              </div>

              <button type="submit" className="form-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message'}
              </button>

              {submitStatus === 'success' && (
                <div className="form-message form-success">
                  ✅ Message envoyé avec succès ! Vous recevrez une réponse rapidement.
                </div>
              )}

              {submitStatus === 'error' && (
                <div className="form-message form-error">
                  ❌ Erreur lors de l'envoi. Veuillez réessayer ou me contacter directement par email.
                </div>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Calendar Section */}
      <section className="calendar-section">
        <div className="calendar-container">
          <h2 className="calendar-title">Réservez un rendez-vous</h2>
          <p className="calendar-subtitle">
            Choisissez un créneau pour discuter de votre projet par téléphone ou visioconférence
          </p>
          
          {/* Calendly Embed */}
          <div 
            className="calendly-inline-widget" 
            data-url="https://calendly.com/VOTRE-USERNAME/consultation-photographie?hide_gdpr_banner=1&primary_color=1a1a1a"
            style={{ minWidth: '320px', height: '700px' }}
          ></div>
        </div>
      </section>
    </div>
  )
}

export default Contact
