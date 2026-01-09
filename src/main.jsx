import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'

// Lazy load all page components for better performance
const Formations = lazy(() => import('./pages/Formations.jsx'))
const Contact = lazy(() => import('./pages/Contact.jsx'))
const About = lazy(() => import('./pages/About.jsx'))
const Mariage = lazy(() => import('./pages/Mariage.jsx'))
const Couple = lazy(() => import('./pages/Couple.jsx'))
const Evenements = lazy(() => import('./pages/Evenements.jsx'))
const ShootingStrobist = lazy(() => import('./pages/ShootingStrobist.jsx'))
const ShootingExterieur = lazy(() => import('./pages/ShootingExterieur.jsx'))
const ShootingStudio = lazy(() => import('./pages/ShootingStudio.jsx'))
const Videos = lazy(() => import('./pages/Videos.jsx'))
const PrivateGalleries = lazy(() => import('./pages/PrivateGalleries.jsx'))

// Loading component
const Loading = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '1.5rem',
    color: '#1a1a1a'
  }}>
    Chargement...
  </div>
)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/formations" element={<Formations />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/about" element={<About />} />
          <Route path="/portfolio/mariage" element={<Mariage />} />
          <Route path="/portfolio/couple" element={<Couple />} />
          <Route path="/portfolio/evenements" element={<Evenements />} />
          <Route path="/portfolio/strobist" element={<ShootingStrobist />} />
          <Route path="/portfolio/exterieur" element={<ShootingExterieur />} />
          <Route path="/portfolio/studio" element={<ShootingStudio />} />
          <Route path="/videos" element={<Videos />} />
          <Route path="/galeries-privees" element={<PrivateGalleries />} />
        </Routes>
      </Suspense>
    </HashRouter>
  </StrictMode>,
)
