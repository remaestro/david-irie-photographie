import { Link } from 'react-router-dom'
import { FiHome, FiMenu, FiX } from 'react-icons/fi'
import { useState } from 'react'
import { useAdmin } from '../contexts/AdminContext'
import './PageHeader.css'

function PageHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { isAdmin, isEditMode, logout, toggleEditMode } = useAdmin()

  return (
    <header className="page-header">
      <div className="page-header-content">
        <Link to="/" className="page-logo">
          <FiHome size={20} />
          <span>DAVID IRIE</span>
        </Link>

        <button 
          className="mobile-menu-toggle" 
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>

        {/* Backdrop pour fermer le menu en mobile */}
        {menuOpen && (
          <div 
            className="page-nav-backdrop" 
            onClick={() => setMenuOpen(false)}
          />
        )}

        <nav className={`page-nav ${menuOpen ? 'page-nav-open' : ''}`}>
          <Link to="/" className="page-nav-link" onClick={() => setMenuOpen(false)}>Accueil</Link>
          <Link to="/about" className="page-nav-link" onClick={() => setMenuOpen(false)}>À Propos</Link>
          <Link to="/portfolio/mariage" className="page-nav-link" onClick={() => setMenuOpen(false)}>Portfolio</Link>
          <Link to="/formations" className="page-nav-link" onClick={() => setMenuOpen(false)}>Formations</Link>
          <Link to="/galeries-privees" className="page-nav-link" onClick={() => setMenuOpen(false)}>Galeries</Link>
          <Link to="/contact" className="page-nav-link page-nav-contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          
          {/* Admin Dashboard link (no edit/logout in header) */}
          {isAdmin && (
            <Link to="/admin/dashboard" className="page-nav-link page-admin-dashboard" onClick={() => setMenuOpen(false)}>Admin</Link>
          )}
        </nav>
      </div>
    </header>
  )
}

export default PageHeader
