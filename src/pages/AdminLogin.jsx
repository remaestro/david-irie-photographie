import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FiLock } from 'react-icons/fi'
import { useAdmin } from '../contexts/AdminContext'
import './AdminLogin.css'

function AdminLogin() {
  const navigate = useNavigate()
  const { login } = useAdmin()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (login(password)) {
      navigate('/admin/dashboard')
    } else {
      setError('Mot de passe incorrect')
      setPassword('')
    }
  }

  return (
    <div className="admin-login-page">
      <motion.div 
        className="admin-login-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="admin-login-header">
          <FiLock size={48} />
          <h1>Administration</h1>
          <p>DAVID IRIE PHOTOGRAPHIE</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setError('')
              }}
              placeholder="Entrez votre mot de passe"
              autoFocus
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button">
            Se connecter
          </button>
        </form>

        <div className="admin-login-footer">
          <a href="/">← Retour au site</a>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin
