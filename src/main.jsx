import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Formations from './pages/Formations.jsx'
import Contact from './pages/Contact.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HashRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/formations" element={<Formations />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
    </HashRouter>
  </StrictMode>,
)
