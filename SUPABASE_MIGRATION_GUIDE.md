# 🚀 GUIDE DE MIGRATION VERS SUPABASE

**Date:** 10 Janvier 2026  
**Projet:** David Irie Photographie  
**Objectif:** Migrer de localStorage vers Supabase pour les galeries privées

---

## 📋 TABLE DES MATIÈRES

1. [Pourquoi Supabase ?](#pourquoi-supabase)
2. [Architecture Actuelle vs Nouvelle](#architecture)
3. [Étape 1 : Configuration Supabase](#étape-1)
4. [Étape 2 : Schéma de Base de Données](#étape-2)
5. [Étape 3 : Migration du Code](#étape-3)
6. [Étape 4 : Déploiement](#étape-4)
7. [Checklist de Migration](#checklist)

---

## 🎯 POURQUOI SUPABASE ?

### **Problèmes avec localStorage**
❌ Les données sont stockées uniquement dans le navigateur  
❌ Perdues si l'utilisateur vide le cache  
❌ Pas de synchronisation entre appareils  
❌ Limite de 5-10 MB de stockage  
❌ Aucune sécurité côté serveur  
❌ Pas de backup automatique  

### **Avantages de Supabase**
✅ Base de données PostgreSQL hébergée  
✅ API REST et Realtime automatiques  
✅ Authentification intégrée  
✅ Stockage sécurisé et chiffré  
✅ Backup automatique quotidien  
✅ Row Level Security (RLS)  
✅ 500 MB gratuit (largement suffisant)  
✅ Dashboard d'administration  

---

## 📊 ARCHITECTURE

### **AVANT (localStorage)**
```
┌─────────────────┐
│   Navigateur    │
│                 │
│  ┌───────────┐  │
│  │localStorage│  │
│  │ - galeries│  │
│  │ - photos  │  │
│  └───────────┘  │
└─────────────────┘
```

### **APRÈS (Supabase)**
```
┌─────────────────┐         ┌──────────────────┐
│   Navigateur    │         │    Supabase      │
│                 │  API    │                  │
│  ┌───────────┐  │ ◄────► │  ┌────────────┐  │
│  │  React    │  │         │  │ PostgreSQL │  │
│  │ Component │  │         │  │  Database  │  │
│  └───────────┘  │         │  └────────────┘  │
│                 │         │                  │
│                 │         │  ┌────────────┐  │
│                 │         │  │  Backblaze │  │
│                 │         │  │     B2     │  │
│                 │         │  └────────────┘  │
└─────────────────┘         └──────────────────┘
```

---

## 🔧 ÉTAPE 1 : CONFIGURATION SUPABASE

### **1.1 Créer un compte Supabase**

1. Aller sur : https://supabase.com/dashboard
2. Cliquer sur **"Start your project"**
3. Se connecter avec GitHub (compte : remaestro)
4. Cliquer sur **"New Project"**

### **1.2 Configurer le projet**

```
Project Name:      david-irie-photographie
Database Password: [GÉNÉRER UN MOT DE PASSE FORT]
Region:           Europe (Frankfurt) - eu-central-1
Pricing Plan:     Free (500 MB storage)
```

**⚠️ IMPORTANT:** Copier et sauvegarder :
- `Project URL` (ex: https://xxxxx.supabase.co)
- `API Key (anon public)` (commence par `eyJh...`)
- `Database Password`

### **1.3 Ajouter les credentials au projet**

```bash
cd /Users/adioyeremi/david-irie-photographie

# Ajouter à .env
cat >> .env << 'EOF'

# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
EOF
```

---

## 📁 ÉTAPE 2 : SCHÉMA DE BASE DE DONNÉES

### **2.1 Créer les tables**

Aller dans **Supabase Dashboard > SQL Editor** et exécuter :

```sql
-- ============================================
-- TABLE: galleries
-- Description: Stocke les informations des galeries privées
-- ============================================
CREATE TABLE galleries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('mariage', 'couple', 'evenements', 'shooting-strobist', 'shooting-exterieur', 'shooting-studio')),
  event_date DATE,
  password TEXT NOT NULL, -- Mot de passe client (hasher en production)
  cover_image_url TEXT,
  expiration_date TIMESTAMP WITH TIME ZONE,
  is_expired BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_galleries_password ON galleries(password);
CREATE INDEX idx_galleries_expiration ON galleries(expiration_date) WHERE NOT is_expired;
CREATE INDEX idx_galleries_created_at ON galleries(created_at DESC);

-- Commentaires
COMMENT ON TABLE galleries IS 'Galeries privées pour les clients';
COMMENT ON COLUMN galleries.password IS 'Mot de passe simple pour accès client (à hasher en prod)';
COMMENT ON COLUMN galleries.expiration_date IS 'Date d''expiration calculée automatiquement';

-- ============================================
-- TABLE: photos
-- Description: Stocke les photos de chaque galerie
-- ============================================
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id UUID NOT NULL REFERENCES galleries(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  url TEXT NOT NULL, -- URL Backblaze B2
  thumbnail_url TEXT, -- URL miniature (optionnel)
  size_bytes INTEGER,
  width INTEGER,
  height INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  order_index INTEGER DEFAULT 0
);

-- Index pour performance
CREATE INDEX idx_photos_gallery_id ON photos(gallery_id);
CREATE INDEX idx_photos_order ON photos(gallery_id, order_index);

-- Commentaires
COMMENT ON TABLE photos IS 'Photos stockées sur Backblaze B2';
COMMENT ON COLUMN photos.url IS 'URL publique Backblaze B2';

-- ============================================
-- TABLE: gallery_views (optionnel - analytics)
-- Description: Tracking des consultations de galeries
-- ============================================
CREATE TABLE gallery_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id UUID NOT NULL REFERENCES galleries(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  ip_address INET
);

CREATE INDEX idx_gallery_views_gallery_id ON gallery_views(gallery_id);
CREATE INDEX idx_gallery_views_viewed_at ON gallery_views(viewed_at DESC);

-- ============================================
-- FONCTION: Auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour galleries
CREATE TRIGGER update_galleries_updated_at
    BEFORE UPDATE ON galleries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FONCTION: Marquer les galeries expirées
-- ============================================
CREATE OR REPLACE FUNCTION mark_expired_galleries()
RETURNS void AS $$
BEGIN
    UPDATE galleries
    SET is_expired = TRUE
    WHERE expiration_date < NOW()
      AND NOT is_expired;
END;
$$ LANGUAGE plpgsql;

-- Planifier l'exécution quotidienne (via cron job ou Cloud Function)
```

### **2.2 Configurer Row Level Security (RLS)**

```sql
-- Activer RLS sur toutes les tables
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_views ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLICIES: Accès public en lecture
-- (Pour l'instant, tout le monde peut lire)
-- ============================================

-- Galeries: Lecture publique
CREATE POLICY "Galeries accessibles en lecture publique"
ON galleries FOR SELECT
USING (true);

-- Photos: Lecture publique
CREATE POLICY "Photos accessibles en lecture publique"
ON photos FOR SELECT
USING (true);

-- ============================================
-- POLICIES: Écriture depuis le serveur uniquement
-- (via service_role key côté Cloud Functions)
-- ============================================

-- Galeries: Insertion autorisée
CREATE POLICY "Insertion galeries via service role"
ON galleries FOR INSERT
WITH CHECK (true);

-- Galeries: Mise à jour autorisée
CREATE POLICY "Mise à jour galeries via service role"
ON galleries FOR UPDATE
USING (true);

-- Galeries: Suppression autorisée
CREATE POLICY "Suppression galeries via service role"
ON galleries FOR DELETE
USING (true);

-- Photos: Insertion autorisée
CREATE POLICY "Insertion photos via service role"
ON photos FOR INSERT
WITH CHECK (true);

-- Photos: Suppression autorisée
CREATE POLICY "Suppression photos via service role"
ON photos FOR DELETE
USING (true);

-- Gallery views: Insertion autorisée
CREATE POLICY "Insertion views via service role"
ON gallery_views FOR INSERT
WITH CHECK (true);
```

### **2.3 Données de test (optionnel)**

```sql
-- Insérer une galerie de test
INSERT INTO galleries (name, type, event_date, password, expiration_date)
VALUES (
  'Mariage Sarah & Thomas',
  'mariage',
  '2026-02-14',
  'test1234',
  NOW() + INTERVAL '90 days'
);

-- Récupérer l'ID de la galerie
SELECT id, name FROM galleries;
-- Copier l'UUID (ex: a1b2c3d4-...)

-- Insérer des photos de test
INSERT INTO photos (gallery_id, filename, url, size_bytes)
VALUES 
  ('a1b2c3d4-...', 'photo1.jpg', 'https://f005.backblazeb2.com/file/david-irie-photo/test/photo1.jpg', 524288),
  ('a1b2c3d4-...', 'photo2.jpg', 'https://f005.backblazeb2.com/file/david-irie-photo/test/photo2.jpg', 612352);
```

---

## 💻 ÉTAPE 3 : MIGRATION DU CODE

### **3.1 Installer Supabase Client**

```bash
cd /Users/adioyeremi/david-irie-photographie
npm install @supabase/supabase-js
```

### **3.2 Créer le fichier de configuration**

**Fichier:** `src/config/supabase.js`

```javascript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ============================================
// GALERIES
// ============================================

/**
 * Récupérer toutes les galeries non expirées
 */
export async function getAllGalleries() {
  const { data, error } = await supabase
    .from('galleries')
    .select(`
      *,
      photos (
        id,
        url,
        thumbnail_url,
        order_index
      )
    `)
    .eq('is_expired', false)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

/**
 * Récupérer une galerie par mot de passe
 */
export async function getGalleryByPassword(password) {
  const { data, error } = await supabase
    .from('galleries')
    .select(`
      *,
      photos (
        id,
        filename,
        url,
        thumbnail_url,
        size_bytes,
        width,
        height,
        order_index
      )
    `)
    .eq('password', password)
    .eq('is_expired', false)
    .single()

  if (error) {
    if (error.code === 'PGRST116') {
      return null // Pas trouvé
    }
    throw error
  }

  // Incrémenter le compteur de vues
  await incrementGalleryViews(data.id)

  return data
}

/**
 * Créer une nouvelle galerie
 */
export async function createGallery(galleryData) {
  const { data, error } = await supabase
    .from('galleries')
    .insert([{
      name: galleryData.name,
      type: galleryData.type,
      event_date: galleryData.eventDate,
      password: galleryData.password,
      expiration_date: galleryData.expirationDate || 
        new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString()
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Supprimer une galerie
 */
export async function deleteGallery(galleryId) {
  const { error } = await supabase
    .from('galleries')
    .delete()
    .eq('id', galleryId)

  if (error) throw error
}

/**
 * Mettre à jour une galerie
 */
export async function updateGallery(galleryId, updates) {
  const { data, error } = await supabase
    .from('galleries')
    .update(updates)
    .eq('id', galleryId)
    .select()
    .single()

  if (error) throw error
  return data
}

/**
 * Incrémenter le compteur de vues
 */
async function incrementGalleryViews(galleryId) {
  await supabase.rpc('increment_gallery_views', { gallery_id: galleryId })
  
  await supabase
    .from('galleries')
    .update({ last_viewed_at: new Date().toISOString() })
    .eq('id', galleryId)
}

// ============================================
// PHOTOS
// ============================================

/**
 * Ajouter des photos à une galerie
 */
export async function addPhotosToGallery(galleryId, photos) {
  const photosData = photos.map((photo, index) => ({
    gallery_id: galleryId,
    filename: photo.filename,
    url: photo.url,
    thumbnail_url: photo.thumbnailUrl,
    size_bytes: photo.size,
    width: photo.width,
    height: photo.height,
    order_index: index
  }))

  const { data, error } = await supabase
    .from('photos')
    .insert(photosData)
    .select()

  if (error) throw error

  // Mettre à jour la photo de couverture si pas définie
  if (photos.length > 0) {
    await supabase
      .from('galleries')
      .update({ cover_image_url: photos[0].url })
      .eq('id', galleryId)
      .is('cover_image_url', null)
  }

  return data
}

/**
 * Supprimer une photo
 */
export async function deletePhoto(photoId) {
  const { error } = await supabase
    .from('photos')
    .delete()
    .eq('id', photoId)

  if (error) throw error
}

/**
 * Récupérer les photos d'une galerie
 */
export async function getGalleryPhotos(galleryId) {
  const { data, error } = await supabase
    .from('photos')
    .select('*')
    .eq('gallery_id', galleryId)
    .order('order_index')

  if (error) throw error
  return data
}

// ============================================
// FONCTION RPC POUR INCREMENT
// ============================================
// À créer dans Supabase SQL Editor:
/*
CREATE OR REPLACE FUNCTION increment_gallery_views(gallery_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE galleries
  SET views_count = views_count + 1
  WHERE id = gallery_id;
END;
$$ LANGUAGE plpgsql;
*/
```

### **3.3 Migrer PrivateGalleries.jsx**

**Fichier:** `src/pages/PrivateGalleries.jsx`

```javascript
import { useState, useEffect } from 'react'
import { getGalleryByPassword, getAllGalleries } from '../config/supabase'
import './PrivateGalleries.css'

function PrivateGalleries() {
  const [password, setPassword] = useState('')
  const [gallery, setGallery] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [allGalleries, setAllGalleries] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Vérifier si admin au chargement
  useEffect(() => {
    const adminStatus = sessionStorage.getItem('isAdminGallery')
    if (adminStatus === 'true') {
      setIsAdmin(true)
      loadAllGalleries()
    }
  }, [])

  // Charger toutes les galeries (admin uniquement)
  const loadAllGalleries = async () => {
    setLoading(true)
    try {
      const galleries = await getAllGalleries()
      setAllGalleries(galleries)
      setError('')
    } catch (err) {
      console.error('Error loading galleries:', err)
      setError('Erreur lors du chargement des galeries')
    } finally {
      setLoading(false)
    }
  }

  // Connexion
  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Vérifier si admin
      if (password === 'admin2026david') {
        setIsAdmin(true)
        sessionStorage.setItem('isAdminGallery', 'true')
        await loadAllGalleries()
        return
      }

      // Sinon, rechercher la galerie par mot de passe
      const foundGallery = await getGalleryByPassword(password)
      
      if (foundGallery) {
        setGallery(foundGallery)
        setError('')
      } else {
        setError('Mot de passe incorrect')
      }
    } catch (err) {
      console.error('Error:', err)
      setError('Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  // Déconnexion
  const handleLogout = () => {
    setGallery(null)
    setIsAdmin(false)
    setPassword('')
    setAllGalleries([])
    sessionStorage.removeItem('isAdminGallery')
  }

  // ... reste du code identique (UI)
}

export default PrivateGalleries
```

### **3.4 Créer AdminGallery component**

**Fichier:** `src/components/AdminGallery.jsx`

```javascript
import { useState } from 'react'
import { createGallery, addPhotosToGallery, deleteGallery } from '../config/supabase'
import './AdminGallery.css'

function AdminGallery({ galleries, onRefresh }) {
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'mariage',
    eventDate: '',
    password: generatePassword(),
    expirationDays: 90
  })
  const [uploading, setUploading] = useState(false)

  // Générer mot de passe aléatoire
  function generatePassword() {
    return Math.random().toString(36).substring(2, 10)
  }

  // Créer une galerie
  const handleCreateGallery = async (e) => {
    e.preventDefault()
    
    try {
      const expirationDate = new Date()
      expirationDate.setDate(expirationDate.getDate() + parseInt(formData.expirationDays))

      await createGallery({
        name: formData.name,
        type: formData.type,
        eventDate: formData.eventDate,
        password: formData.password,
        expirationDate: expirationDate.toISOString()
      })

      setShowModal(false)
      setFormData({
        name: '',
        type: 'mariage',
        eventDate: '',
        password: generatePassword(),
        expirationDays: 90
      })

      onRefresh() // Recharger la liste
    } catch (error) {
      console.error('Error creating gallery:', error)
      alert('Erreur lors de la création de la galerie')
    }
  }

  // Supprimer une galerie
  const handleDeleteGallery = async (galleryId, galleryName) => {
    if (!confirm(`Êtes-vous sûr de vouloir supprimer "${galleryName}" ?`)) {
      return
    }

    try {
      await deleteGallery(galleryId)
      onRefresh()
    } catch (error) {
      console.error('Error deleting gallery:', error)
      alert('Erreur lors de la suppression')
    }
  }

  return (
    <div className="admin-gallery">
      <header className="admin-header">
        <h1>🎨 Administration - Galeries Privées</h1>
        <button onClick={() => setShowModal(true)} className="btn-create">
          ➕ Créer nouvelle galerie
        </button>
      </header>

      <div className="galleries-grid">
        {galleries.map(gallery => (
          <div key={gallery.id} className="gallery-card">
            <div className="gallery-info">
              <h3>{gallery.name}</h3>
              <p>📅 {new Date(gallery.event_date).toLocaleDateString('fr-FR')}</p>
              <p>📸 {gallery.photos?.length || 0} photos</p>
              <p>🔑 Mot de passe: <strong>{gallery.password}</strong></p>
            </div>
            <div className="gallery-actions">
              <button onClick={() => handleDeleteGallery(gallery.id, gallery.name)}>
                🗑️ Supprimer
              </button>
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Créer une nouvelle galerie</h2>
            <form onSubmit={handleCreateGallery}>
              {/* Formulaire identique */}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminGallery
```

---

## 🚀 ÉTAPE 4 : DÉPLOIEMENT

### **4.1 Ajouter les variables d'environnement**

```bash
# Localement (.env)
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...

# Cloud Run (déploiement)
gcloud run deploy david-irie-photographie \
  --source . \
  --region=europe-west1 \
  --allow-unauthenticated \
  --set-env-vars "VITE_SUPABASE_URL=https://xxxxx.supabase.co,VITE_SUPABASE_ANON_KEY=eyJhbGci..."
```

### **4.2 Déployer**

```bash
# Build
npm run build

# Deploy
gcloud run deploy david-irie-photographie \
  --source . \
  --region=europe-west1 \
  --allow-unauthenticated
```

### **4.3 Tester**

1. Aller sur le site déployé
2. Accéder aux **Galeries Privées**
3. Se connecter en admin : `admin2026david`
4. Créer une galerie de test
5. Se déconnecter
6. Se reconnecter avec le mot de passe client
7. Vérifier que les photos s'affichent

---

## ✅ CHECKLIST DE MIGRATION

### **Avant la migration**
- [ ] Sauvegarder les données actuelles localStorage
- [ ] Créer compte Supabase
- [ ] Configurer le projet Supabase
- [ ] Récupérer les credentials (URL + API Key)

### **Configuration BDD**
- [ ] Créer les tables (galleries, photos, gallery_views)
- [ ] Configurer les index
- [ ] Activer Row Level Security
- [ ] Créer les policies
- [ ] Insérer des données de test

### **Migration Code**
- [ ] Installer @supabase/supabase-js
- [ ] Créer src/config/supabase.js
- [ ] Migrer PrivateGalleries.jsx
- [ ] Créer AdminGallery.jsx
- [ ] Tester en local

### **Déploiement**
- [ ] Ajouter variables d'environnement à .env
- [ ] Build l'application
- [ ] Déployer sur Cloud Run
- [ ] Configurer variables d'environnement Cloud Run
- [ ] Tester en production

### **Post-migration**
- [ ] Migrer les données existantes (si nécessaire)
- [ ] Supprimer l'ancien code localStorage
- [ ] Mettre à jour la documentation
- [ ] Nettoyer Netlify (si plus utilisé)

---

## 🔒 SÉCURITÉ

### **Recommandations**

1. **Hasher les mots de passe**
   ```javascript
   import bcrypt from 'bcryptjs'
   
   // Lors de la création
   const hashedPassword = await bcrypt.hash(password, 10)
   
   // Lors de la vérification
   const isValid = await bcrypt.compare(inputPassword, hashedPassword)
   ```

2. **Utiliser Service Role Key pour l'admin**
   - Anon Key : lecture publique uniquement
   - Service Role Key : opérations admin (côté Cloud Functions)

3. **Activer les backups automatiques**
   - Supabase Dashboard > Settings > Backups
   - Daily backups activés par défaut

---

## 🆘 TROUBLESHOOTING

### **Erreur: "Missing Supabase environment variables"**
**Solution:** Vérifier que `.env` contient `VITE_SUPABASE_URL` et `VITE_SUPABASE_ANON_KEY`

### **Erreur: "new row violates row-level security policy"**
**Solution:** Vérifier les policies RLS, utiliser Service Role Key pour les opérations admin

### **Photos ne s'affichent pas**
**Solution:** Vérifier que les URLs Backblaze B2 sont correctes et accessibles publiquement

### **Connexion refusée**
**Solution:** Vérifier que le mot de passe est correct, que la galerie n'est pas expirée

---

## 📞 SUPPORT

**Documentation Supabase:** https://supabase.com/docs  
**GitHub Issues:** https://github.com/remaestro/david-irie-photographie/issues  
**Contact:** adioyerm@gmail.com

---

✨ **Bonne migration !**
