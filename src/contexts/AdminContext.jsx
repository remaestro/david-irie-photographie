import { createContext, useContext, useState, useEffect } from 'react'

const AdminContext = createContext()

const ADMIN_PASSWORD = 'admin2026david'
const ADMIN_SESSION_KEY = 'david_irie_admin_session'

export function AdminProvider({ children }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  useEffect(() => {
    // Vérifier si une session admin existe
    const session = localStorage.getItem(ADMIN_SESSION_KEY)
    if (session) {
      try {
        const { timestamp } = JSON.parse(session)
        // Session expire après 24h
        if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
          setIsAdmin(true)
        } else {
          localStorage.removeItem(ADMIN_SESSION_KEY)
        }
      } catch (e) {
        localStorage.removeItem(ADMIN_SESSION_KEY)
      }
    }
  }, [])

  const login = (password) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true)
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify({ timestamp: Date.now() }))
      return true
    }
    return false
  }

  const logout = () => {
    setIsAdmin(false)
    setIsEditMode(false)
    localStorage.removeItem(ADMIN_SESSION_KEY)
  }

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode)
  }

  return (
    <AdminContext.Provider value={{ 
      isAdmin, 
      isEditMode, 
      login, 
      logout, 
      toggleEditMode 
    }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within AdminProvider')
  }
  return context
}
