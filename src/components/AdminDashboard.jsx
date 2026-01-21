import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiPaperclip, FiPlus, FiLogOut, FiImage } from 'react-icons/fi'
import { useAdmin } from '../contexts/AdminContext'
import CreateGalleryModal from './CreateGalleryModal'
import GalleryCard from './GalleryCard'
import './AdminDashboard.css'

function AdminDashboard({ galleries = [], onCreateGallery, onDeleteGallery, onLogout, onSelectGallery }) {
  const [showCreateModal, setShowCreateModal] = useState(false)
  const { isAdmin, logout } = useAdmin()
  const navigate = useNavigate()

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin')
    }
  }, [isAdmin, navigate])

  const handleLogout = () => {
    logout()
    if (onLogout) onLogout()
    navigate('/admin')
  }

  if (!isAdmin) {
    return null
  }

  return (
    <div className="admin-dashboard">
      <motion.div 
        className="dashboard-header"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="dashboard-title">
          <h2><FiPaperclip size={28} /> Administration - Galeries Privées</h2>
          <p className="dashboard-subtitle">{galleries.length} galerie{galleries.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="dashboard-actions">
          <button 
            className="create-gallery-button"
            onClick={() => setShowCreateModal(true)}
          >
            <FiPlus size={18} /> Créer nouvelle galerie
          </button>
          <button 
            className="logout-button"
            onClick={handleLogout}
          >
            <FiLogOut size={18} /> Déconnexion
          </button>
        </div>
      </motion.div>

      {galleries.length === 0 ? (
        <motion.div 
          className="empty-state"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="empty-icon"><FiImage size={80} strokeWidth={1} /></div>
          <h3>Aucune galerie pour le moment</h3>
          <p>Créez votre première galerie pour commencer à ajouter des photos</p>
          <button 
            className="create-gallery-button"
            onClick={() => setShowCreateModal(true)}
          >
            <FiPlus size={18} /> Créer ma première galerie
          </button>
        </motion.div>
      ) : (
        <motion.div 
          className="galleries-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {galleries.map((gallery, index) => (
            <GalleryCard
              key={gallery.id}
              gallery={gallery}
              index={index}
              onDelete={() => onDeleteGallery(gallery.id)}
              onView={() => onSelectGallery(gallery)}
            />
          ))}
        </motion.div>
      )}

      {showCreateModal && (
        <CreateGalleryModal
          onClose={() => setShowCreateModal(false)}
          onCreate={onCreateGallery}
        />
      )}
    </div>
  )
}

export default AdminDashboard
