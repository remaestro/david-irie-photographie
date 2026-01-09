import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiPlusCircle, FiX } from 'react-icons/fi'
import './CreateGalleryModal.css'

function CreateGalleryModal({ onClose, onCreate }) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'mariage',
    date: new Date().toISOString().split('T')[0],
    password: generatePassword(),
    expiryDays: 90
  })

  const [error, setError] = useState('')

  function generatePassword() {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    let password = ''
    for (let i = 0; i < 8; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setError('')
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      setError('Le nom de la galerie est requis')
      return
    }

    if (!formData.password.trim()) {
      setError('Le mot de passe est requis')
      return
    }

    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + parseInt(formData.expiryDays))

    onCreate({
      name: formData.name.trim(),
      type: formData.type,
      date: formData.date,
      password: formData.password.trim(),
      expiresAt: expiresAt.toISOString()
    })

    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="modal-header">
          <h2><FiPlusCircle size={24} /> Créer une nouvelle galerie</h2>
          <button className="modal-close" onClick={onClose}><FiX size={24} /></button>
        </div>

        <form onSubmit={handleSubmit} className="gallery-form">
          <div className="form-group">
            <label htmlFor="name">Nom de la galerie *</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="ex: Mariage Sarah & Antoine"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="type">Type</label>
              <select
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="mariage">Mariage</option>
                <option value="couple">Couple</option>
                <option value="evenement">Événement</option>
                <option value="corporate">Corporate</option>
                <option value="autre">Autre</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="date">Date de l'événement</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">Mot de passe client *</label>
              <div className="password-input-group">
                <input
                  type="text"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="generate-password-button"
                  onClick={() => setFormData(prev => ({ ...prev, password: generatePassword() }))}
                  title="Générer un nouveau mot de passe"
                >
                  🔄
                </button>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="expiryDays">Expiration (jours)</label>
              <input
                type="number"
                id="expiryDays"
                name="expiryDays"
                value={formData.expiryDays}
                onChange={handleChange}
                min="1"
                max="365"
              />
            </div>
          </div>

          {error && <p className="form-error">{error}</p>}

          <div className="form-actions">
            <button type="button" className="cancel-button" onClick={onClose}>
              Annuler
            </button>
            <button type="submit" className="submit-button">
              <FiPlusCircle size={18} /> Créer la galerie
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}

export default CreateGalleryModal
