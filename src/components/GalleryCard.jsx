import { motion } from 'framer-motion'
import { FiCalendar, FiImage, FiKey, FiCopy, FiEye, FiTrash2, FiClock } from 'react-icons/fi'
import { FiHeart, FiUsers, FiGift, FiBriefcase, FiCamera } from 'react-icons/fi'
import './GalleryCard.css'

function GalleryCard({ gallery, index, onDelete, onView }) {
  const handleCopyPassword = () => {
    navigator.clipboard.writeText(gallery.password)
    alert(`Mot de passe copié: ${gallery.password}`)
  }

  const getTypeIcon = (type) => {
    const icons = {
      mariage: FiHeart,
      couple: FiUsers,
      evenement: FiGift,
      corporate: FiBriefcase,
      autre: FiCamera
    }
    const Icon = icons[type] || FiCamera
    return <Icon size={18} />
  }

  return (
    <motion.div
      className="gallery-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      {gallery.coverImage && (
        <div className="gallery-card-cover">
          <img src={gallery.coverImage} alt={gallery.name} />
        </div>
      )}
      
      <div className="gallery-card-content">
        <h3 className="gallery-card-title">
          {getTypeIcon(gallery.type)} {gallery.name}
        </h3>
        
        <div className="gallery-card-info">
          <p className="gallery-info-item">
            <FiCalendar size={16} /> {new Date(gallery.date).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'long',
              year: 'numeric'
            })}
          </p>
          <p className="gallery-info-item">
            <FiImage size={16} /> {gallery.photos.length} photo{gallery.photos.length !== 1 ? 's' : ''}
          </p>
        </div>

        <div className="gallery-card-password">
          <span className="password-label"><FiKey size={14} /> Mot de passe:</span>
          <code className="password-value">{gallery.password}</code>
          <button 
            className="copy-password-button"
            onClick={handleCopyPassword}
            title="Copier le mot de passe"
          >
            <FiCopy size={14} />
          </button>
        </div>

        {gallery.expiresAt && (
          <p className="gallery-expiry">
            <FiClock size={14} /> Expire le {new Date(gallery.expiresAt).toLocaleDateString('fr-FR')}
          </p>
        )}

        <div className="gallery-card-actions">
          <button 
            className="card-button view-button"
            onClick={onView}
          >
            <FiEye size={16} /> Voir
          </button>
          <button 
            className="card-button delete-button"
            onClick={onDelete}
          >
            <FiTrash2 size={16} /> Supprimer
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default GalleryCard
