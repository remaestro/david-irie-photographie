import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Formations from './pages/Formations.jsx'
import Contact from './pages/Contact.jsx'
import About from './pages/About.jsx'
import Mariage from './pages/Mariage.jsx'
import Couple from './pages/Couple.jsx'
import Evenements from './pages/Evenements.jsx'
import Videos from './pages/Videos.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/formations" element={<Formations />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/portfolio/mariage" element={<Mariage />} />
        <Route path="/portfolio/couple" element={<Couple />} />
        <Route path="/portfolio/evenements" element={<Evenements />} />
        <Route path="/videos" element={<Videos />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
)
