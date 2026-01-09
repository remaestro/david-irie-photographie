# 🎯 PROMPT - Création Interface Admin pour Galeries Privées

**Date:** 9 Janvier 2026  
**Projet:** David Irie Photographie  
**Objectif:** Transformer `PrivateGalleries.jsx` en interface d'administration complète

---

## 📋 CONTEXTE DU PROJET

Je travaille sur un site de photographe professionnel **David Irie Photographie** déployé sur **Google Cloud Run**. Le site utilise **React + Vite** et **Backblaze B2** pour le stockage des photos.

### Infrastructure existante :
- ✅ Site en production sur Cloud Run
- ✅ Backblaze B2 configuré (bucket: `david-irie-photo`)
- ✅ Cloud Function `uploadToBackblaze` opérationnelle
- ✅ Page `PrivateGalleries.jsx` existante (actuellement avec données en dur)

### Fichiers clés :
- `/src/pages/PrivateGalleries.jsx` - Page actuelle à transformer
- `/src/pages/PrivateGalleries.css` - Styles existants
- `/cloud-functions/uploadToBackblaze/index.js` - API d'upload fonctionnelle
- `/src/config/backblaze.js` - Configuration B2

### URL Cloud Function :
```
https://europe-west1-david-irie-photographie.cloudfunctions.net/uploadToBackblaze
```

### Configuration Backblaze B2 :
- Bucket: `david-irie-photo`
- Région: `us-east-005`
- Base URL: `https://f005.backblazeb2.com/file/david-irie-photo/`

---

## 🎯 OBJECTIF PRINCIPAL

**Transformer la page `PrivateGalleries.jsx` en une interface d'administration complète** permettant de :

1. **Se connecter en tant qu'admin** (mot de passe simple pour commencer)
2. **Créer des galeries privées** pour différents clients/événements
3. **Uploader des photos en masse** (drag & drop, 10-50 photos à la fois)
4. **Gérer les galeries** (voir, éditer, supprimer)
5. **Générer un mot de passe unique** par galerie pour les clients

---

## 📐 ARCHITECTURE ATTENDUE

### Deux modes dans la même page :

#### MODE 1 : Accès Client (par défaut)
- Formulaire de connexion avec mot de passe
- Affichage de la galerie privée du client
- Téléchargement des photos
- *(Comme actuellement dans PrivateGalleries.jsx)*

#### MODE 2 : Administration (si mot de passe admin)
- Mot de passe admin spécial : `admin2026david` (hardcodé pour l'instant)
- Dashboard complet de gestion

---

## 🛠️ FONCTIONNALITÉS À IMPLÉMENTER

### 1. Interface Admin - Dashboard Principal

Après connexion admin, afficher :

```
┌─────────────────────────────────────────────┐
│  🎨 Admin - Galeries Privées                │
│  [Créer nouvelle galerie] [Se déconnecter] │
├─────────────────────────────────────────────┤
│                                             │
│  📋 Mes Galeries (3)                        │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ 📸 Mariage Sarah & Antoine          │   │
│  │ 📅 15 Juin 2025 | 45 photos         │   │
│  │ 🔑 Mot de passe: sarah2025          │   │
│  │ [Voir] [Ajouter photos] [Supprimer]│   │
│  └─────────────────────────────────────┘   │
│                                             │
│  ┌─────────────────────────────────────┐   │
│  │ 📸 Couple Élodie & Marc             │   │
│  │ 📅 20 Mars 2025 | 32 photos         │   │
│  │ 🔑 Mot de passe: elodie2025         │   │
│  │ [Voir] [Ajouter photos] [Supprimer]│   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### 2. Création de Galerie

Modal/formulaire avec :
- **Nom de la galerie** (ex: "Mariage Sarah & Antoine")
- **Date de l'événement** (date picker)
- **Type** (select: Mariage, Couple, Événement, Corporate, Autre)
- **Mot de passe pour le client** (généré auto ou manuel)
- **Date d'expiration** (optionnel, défaut: +90 jours)

**Action :** Créer une galerie vide dans un state/localStorage

### 3. Upload de Photos - DRAG & DROP

Interface d'upload moderne avec :

- ✅ Drag & Drop de fichiers
- ✅ Sélection multiple (input type="file" multiple)
- ✅ Preview des photos avant upload
- ✅ Compression automatique côté client (max 1920x1080, 85% qualité)
- ✅ Barre de progression par photo
- ✅ Upload en parallèle (3-5 photos à la fois)
- ✅ Retry en cas d'échec
- ✅ Affichage du nombre de photos uploadées / total

**Technologies à utiliser :**
- `react-dropzone` pour le drag & drop
- `browser-image-compression` pour compresser les images
- API existante : Cloud Function `uploadToBackblaze`

**Format d'upload vers Backblaze B2 :**
```
galeries/
  ├── mariage-sarah-antoine-2025/
  │   ├── 1736458800000-photo1.jpg
  │   ├── 1736458801000-photo2.jpg
  │   └── ...
  ├── couple-elodie-marc-2025/
  │   └── ...
```

### 4. Gestion des Données

**Pour l'instant, utiliser localStorage** pour stocker :

```javascript
// Structure de données dans localStorage
{
  galleries: [
    {
      id: "uuid-v4",
      name: "Mariage Sarah & Antoine",
      type: "mariage",
      date: "2025-06-15",
      password: "sarah2025",
      coverImage: "url-premiere-photo",
      photos: [
        {
          id: "uuid-v4",
          url: "https://f005.backblazeb2.com/file/david-irie-photo/galeries/...",
          fileName: "photo1.jpg",
          uploadedAt: "2026-01-09T10:30:00Z"
        }
      ],
      expiresAt: "2025-09-15",
      createdAt: "2026-01-09T10:00:00Z"
    }
  ]
}
```

**Note :** Plus tard, on migrera vers Supabase, mais pour MVP, localStorage suffit.

### 5. Sécurité & UX

- **Mot de passe admin** : `admin2026david` (hardcodé pour l'instant)
- **Validation** : Empêcher création galerie sans nom
- **Confirmation** avant suppression de galerie
- **Messages de succès/erreur** clairs et visuels
- **Loading states** pendant uploads (spinner + progression)
- **Responsive** : Fonctionne sur mobile/tablette/desktop
- **Gestion erreurs** : Retry automatique si upload échoue

---

## 📦 DÉPENDANCES À AJOUTER

```bash
npm install react-dropzone browser-image-compression uuid
```

---

## 🎨 DESIGN & UI

**Réutiliser le style existant** de `PrivateGalleries.css` mais ajouter :

- **Dashboard cards** avec ombres légères
- **Boutons d'action** bien visibles et distincts
- **Zone de drop** avec bordure en pointillés quand on glisse des fichiers
- **Barres de progression** pour les uploads (individuelles et globale)
- **Icons** : utiliser emojis pour simplicité ou ajouter `react-icons` si nécessaire

### Palette de couleurs (respecter le design existant) :
- Principal : `#1a1a1a` (noir)
- Accent : `#f5f5f5` (gris clair)
- Succès : `#4caf50` (vert)
- Erreur : `#d32f2f` (rouge)
- Info : `#2196f3` (bleu)
- Warning : `#ff9800` (orange)

### Typographie existante :
- Titres : `'Playfair Display', serif`
- Texte : `'Cormorant Garamond', serif`

---

## 🔧 SPÉCIFICATIONS TECHNIQUES

### État React à gérer :

```javascript
const [isAdmin, setIsAdmin] = useState(false)
const [isAuthenticated, setIsAuthenticated] = useState(false)
const [galleries, setGalleries] = useState([]) // chargé depuis localStorage
const [selectedGallery, setSelectedGallery] = useState(null)
const [uploadProgress, setUploadProgress] = useState({})
const [showCreateModal, setShowCreateModal] = useState(false)
const [error, setError] = useState('')
const [successMessage, setSuccessMessage] = useState('')
```

### Fonctions clés à implémenter :

```javascript
// 1. Authentification
const handleLogin = (password) => {
  if (password === 'admin2026david') {
    setIsAdmin(true)
    setIsAuthenticated(true)
    loadGalleries()
  } else {
    // Chercher dans galleries
    const gallery = galleries.find(g => g.password === password)
    if (gallery) {
      setIsAuthenticated(true)
      setSelectedGallery(gallery)
    } else {
      setError('Mot de passe incorrect')
    }
  }
}

// 2. Création galerie
const createGallery = (galleryData) => {
  const newGallery = {
    id: uuid(),
    ...galleryData,
    photos: [],
    createdAt: new Date().toISOString()
  }
  
  const updatedGalleries = [...galleries, newGallery]
  setGalleries(updatedGalleries)
  localStorage.setItem('galleries', JSON.stringify(updatedGalleries))
  setSuccessMessage('Galerie créée avec succès !')
}

// 3. Upload photos avec compression
const uploadPhotos = async (files, galleryId) => {
  const totalFiles = files.length
  let uploadedCount = 0
  
  for (const file of files) {
    try {
      // Compression
      const compressed = await imageCompression(file, {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      })
      
      // Convertir en base64
      const base64 = await fileToBase64(compressed)
      
      // Appeler Cloud Function
      const response = await fetch(
        'https://europe-west1-david-irie-photographie.cloudfunctions.net/uploadToBackblaze',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            file: base64,
            fileName: file.name,
            galleryId: galleryId,
            contentType: file.type
          })
        }
      )
      
      if (!response.ok) throw new Error('Upload failed')
      
      const { url } = await response.json()
      
      // Ajouter à la galerie
      addPhotoToGallery(galleryId, {
        id: uuid(),
        url,
        fileName: file.name,
        uploadedAt: new Date().toISOString()
      })
      
      uploadedCount++
      setUploadProgress({ current: uploadedCount, total: totalFiles })
      
    } catch (error) {
      console.error('Upload error:', error)
      setError(`Erreur upload ${file.name}`)
    }
  }
  
  setSuccessMessage(`${uploadedCount}/${totalFiles} photos uploadées !`)
}

// 4. Ajouter photo à une galerie
const addPhotoToGallery = (galleryId, photo) => {
  const updatedGalleries = galleries.map(g => {
    if (g.id === galleryId) {
      return {
        ...g,
        photos: [...g.photos, photo],
        coverImage: g.coverImage || photo.url
      }
    }
    return g
  })
  
  setGalleries(updatedGalleries)
  localStorage.setItem('galleries', JSON.stringify(updatedGalleries))
}

// 5. Supprimer galerie
const deleteGallery = (galleryId) => {
  if (confirm('Êtes-vous sûr de vouloir supprimer cette galerie ?')) {
    const updatedGalleries = galleries.filter(g => g.id !== galleryId)
    setGalleries(updatedGalleries)
    localStorage.setItem('galleries', JSON.stringify(updatedGalleries))
    setSuccessMessage('Galerie supprimée')
  }
}

// 6. Charger galleries depuis localStorage
const loadGalleries = () => {
  const stored = localStorage.getItem('galleries')
  if (stored) {
    setGalleries(JSON.parse(stored))
  }
}

// 7. Helper: Convert file to base64
const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
```

---

## ✅ CRITÈRES DE SUCCÈS

L'implémentation sera réussie si :

1. ✅ Je peux me connecter avec `admin2026david` et voir le dashboard admin
2. ✅ Je peux créer une nouvelle galerie avec nom, date, type, mot de passe
3. ✅ Je peux uploader 10-20 photos par drag & drop dans une galerie
4. ✅ Les photos sont compressées automatiquement avant upload
5. ✅ Les photos apparaissent dans Backblaze B2 après upload
6. ✅ Je vois une barre de progression pendant l'upload
7. ✅ Je peux me déconnecter et me reconnecter avec le mot de passe client
8. ✅ Je vois la galerie du client avec toutes ses photos
9. ✅ Je peux supprimer une galerie (avec confirmation)
10. ✅ Les données persistent après rafraîchissement de page (localStorage)
11. ✅ L'interface est responsive (mobile, tablette, desktop)
12. ✅ Les messages de succès/erreur sont clairs

---

## 🚨 CONTRAINTES & NOTES IMPORTANTES

- ⚠️ **NE PAS toucher** à la Cloud Function `uploadToBackblaze` - elle fonctionne déjà
- ⚠️ **NE PAS modifier** `backblaze.js` - config OK
- ✅ **UTILISER** l'endpoint existant : `https://europe-west1-david-irie-photographie.cloudfunctions.net/uploadToBackblaze`
- ✅ **GARDER** la compatibilité avec l'accès client (mot de passe non-admin = galerie client)
- ✅ **PENSER** à la migration future vers Supabase (structure de données propre)
- ✅ **TESTER** avec des vraies photos (pas de mock)

---

## 📝 LIVRABLES ATTENDUS

### Fichiers principaux :
1. **`/src/pages/PrivateGalleries.jsx`** (modifié)
2. **`/src/pages/PrivateGalleries.css`** (complété avec nouveaux styles)

### Composants additionnels (optionnels mais recommandés) :
3. **`/src/components/AdminDashboard.jsx`** - Dashboard admin
4. **`/src/components/GalleryUploader.jsx`** - Composant upload drag & drop
5. **`/src/components/CreateGalleryModal.jsx`** - Modal création galerie
6. **`/src/components/GalleryCard.jsx`** - Card pour afficher une galerie

### Documentation :
7. **`ADMIN_USAGE.md`** - Guide rapide d'utilisation de l'interface admin (5-10 lignes)

---

## 🎬 ORDRE D'IMPLÉMENTATION RECOMMANDÉ

1. **Installer les dépendances** (5 min)
   ```bash
   npm install react-dropzone browser-image-compression uuid
   ```

2. **Authentification admin** (15 min)
   - Détecter mot de passe admin
   - Afficher mode admin vs mode client

3. **Dashboard basique** (20 min)
   - Liste des galeries depuis localStorage
   - Bouton "Créer galerie"
   - Bouton "Déconnexion"

4. **Modal création de galerie** (30 min)
   - Formulaire avec validation
   - Génération auto mot de passe (optionnel)
   - Sauvegarde dans localStorage

5. **Composant upload drag & drop** (1h)
   - Zone de drop avec react-dropzone
   - Preview des fichiers sélectionnés
   - Gestion de l'upload multiple

6. **Compression d'images** (20 min)
   - Intégrer browser-image-compression
   - Compresser avant upload

7. **Barre de progression** (30 min)
   - Progress bar par photo
   - Compteur global (3/10 photos)

8. **Affichage photos uploadées** (20 min)
   - Grid des photos dans la galerie
   - Lightbox (réutiliser existant)

9. **Suppression galerie** (15 min)
   - Bouton supprimer avec confirmation
   - Mise à jour localStorage

10. **Messages & UX** (30 min)
    - Toast de succès/erreur
    - Loading states
    - Responsive design

11. **Tests & polish** (30 min)
    - Tester tous les cas d'usage
    - Fixer les bugs
    - Améliorer le CSS

**Temps total estimé : 4-5 heures**

---

## 💡 EXEMPLE DE CODE STARTER

### Composant GalleryUploader

```jsx
import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import imageCompression from 'browser-image-compression'
import { v4 as uuid } from 'uuid'

const GalleryUploader = ({ galleryId, onUploadComplete }) => {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [previews, setPreviews] = useState([])

  const uploadToB2 = async (file) => {
    // Compression
    const compressed = await imageCompression(file, {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    })

    // Convert to base64
    const base64 = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(compressed)
    })

    // Upload via Cloud Function
    const response = await fetch(
      'https://europe-west1-david-irie-photographie.cloudfunctions.net/uploadToBackblaze',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: base64,
          fileName: file.name,
          galleryId: galleryId,
          contentType: file.type
        })
      }
    )

    if (!response.ok) throw new Error('Upload failed')

    const { url } = await response.json()
    return url
  }

  const onDrop = useCallback(async (acceptedFiles) => {
    setUploading(true)
    setProgress({ current: 0, total: acceptedFiles.length })

    // Create previews
    const newPreviews = acceptedFiles.map(file => ({
      id: uuid(),
      preview: URL.createObjectURL(file),
      name: file.name
    }))
    setPreviews(newPreviews)

    // Upload files
    let uploaded = 0
    for (const file of acceptedFiles) {
      try {
        const url = await uploadToB2(file)
        onUploadComplete({
          id: uuid(),
          url,
          fileName: file.name,
          uploadedAt: new Date().toISOString()
        })
        uploaded++
        setProgress({ current: uploaded, total: acceptedFiles.length })
      } catch (error) {
        console.error('Upload error:', error)
      }
    }

    setUploading(false)
    setPreviews([])
  }, [galleryId, onUploadComplete])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.jpg', '.png', '.webp'] },
    multiple: true,
    disabled: uploading
  })

  return (
    <div className="gallery-uploader">
      <div
        {...getRootProps()}
        className={`dropzone ${isDragActive ? 'active' : ''} ${uploading ? 'uploading' : ''}`}
      >
        <input {...getInputProps()} />
        {uploading ? (
          <div className="upload-progress">
            <p>📤 Upload en cours...</p>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: `${(progress.current / progress.total) * 100}%` }}
              />
            </div>
            <p>{progress.current} / {progress.total} photos</p>
          </div>
        ) : isDragActive ? (
          <p>📤 Déposez les photos ici...</p>
        ) : (
          <>
            <p className="dropzone-icon">📸</p>
            <p className="dropzone-text">
              Glissez vos photos ici ou cliquez pour sélectionner
            </p>
            <p className="dropzone-hint">
              JPG, PNG ou WebP • Max 10MB par photo
            </p>
          </>
        )}
      </div>

      {previews.length > 0 && (
        <div className="upload-previews">
          <h3>Photos sélectionnées ({previews.length})</h3>
          <div className="preview-grid">
            {previews.map(preview => (
              <div key={preview.id} className="preview-item">
                <img src={preview.preview} alt={preview.name} />
                <p>{preview.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default GalleryUploader
```

### CSS pour le Uploader

```css
.gallery-uploader {
  margin: 2rem 0;
}

.dropzone {
  border: 3px dashed #ccc;
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fafafa;
}

.dropzone:hover {
  border-color: #1a1a1a;
  background: #f0f0f0;
}

.dropzone.active {
  border-color: #4caf50;
  background: #e8f5e9;
}

.dropzone.uploading {
  cursor: not-allowed;
  opacity: 0.7;
}

.dropzone-icon {
  font-size: 4rem;
  margin: 0;
}

.dropzone-text {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.3rem;
  margin: 1rem 0 0.5rem 0;
  color: #333;
}

.dropzone-hint {
  font-family: 'Cormorant Garamond', serif;
  font-size: 1rem;
  color: #666;
  margin: 0;
}

.upload-progress {
  padding: 1rem;
}

.progress-bar {
  width: 100%;
  height: 20px;
  background: #e0e0e0;
  border-radius: 10px;
  overflow: hidden;
  margin: 1rem 0;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4caf50, #66bb6a);
  transition: width 0.3s ease;
}

.upload-previews {
  margin-top: 2rem;
}

.preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.preview-item {
  text-align: center;
}

.preview-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 2px solid #ddd;
}

.preview-item p {
  font-size: 0.85rem;
  color: #666;
  margin-top: 0.5rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
```

---

## 📚 RESSOURCES UTILES

### Documentation :
- **React Dropzone** : https://react-dropzone.js.org/
- **Browser Image Compression** : https://www.npmjs.com/package/browser-image-compression
- **UUID** : https://www.npmjs.com/package/uuid
- **Backblaze B2 API** : https://www.backblaze.com/b2/docs/

### Tutoriels :
- Drag & Drop React : https://www.youtube.com/results?search_query=react+dropzone+tutorial
- Image Compression : https://blog.logrocket.com/compress-images-before-upload-react/

---

## ❓ QUESTIONS FRÉQUENTES

### Q: Que faire si l'upload échoue ?
**R:** Implémenter un système de retry (2-3 tentatives) et afficher un message d'erreur clair.

### Q: Combien de photos peut-on uploader en même temps ?
**R:** Pas de limite technique, mais recommandé : 10-50 photos. Au-delà, faire des batches.

### Q: Faut-il gérer la suppression de photos individuelles ?
**R:** Pour le MVP, non. On pourra l'ajouter plus tard. Pour l'instant, suppression par galerie entière.

### Q: Comment gérer les galeries expirées ?
**R:** Pour le MVP, juste afficher une alerte si `expiresAt < Date.now()`. La suppression auto viendra plus tard.

### Q: localStorage a des limites de taille ?
**R:** Oui (~5-10MB). On stocke juste les URLs et métadonnées, pas les photos. Ça devrait suffire pour 50-100 galeries.

---

## 🎁 BONUS (Optionnel)

Si tu as le temps après l'implémentation de base :

- [ ] Générateur automatique de mot de passe (8 caractères alphanumériques)
- [ ] Copier le mot de passe dans le presse-papier (bouton copy)
- [ ] Filtrer les galeries par type (Mariage, Couple, etc.)
- [ ] Recherche de galerie par nom
- [ ] Export de toutes les photos d'une galerie en ZIP
- [ ] Notifications toast modernes (react-hot-toast)
- [ ] Animation des cards (framer-motion - déjà installé)
- [ ] Mode sombre (dark mode toggle)

---

## ✅ CHECKLIST FINALE

Avant de soumettre le code, vérifier que :

- [ ] Le code compile sans erreurs
- [ ] Pas de warnings ESLint critiques
- [ ] Toutes les fonctions principales marchent
- [ ] L'interface est responsive
- [ ] Les images sont bien compressées
- [ ] Les données persistent après refresh
- [ ] Les messages d'erreur sont clairs
- [ ] Le CSS est propre et organisé
- [ ] Le code est commenté (en français)
- [ ] README d'utilisation créé

---

## 🚀 C'EST PARTI !

Tu as toutes les informations nécessaires. N'hésite pas à poser des questions si quelque chose n'est pas clair.

**Bonne chance et bon code !** 💪🔥

---

**Créé le:** 9 Janvier 2026  
**Version:** 1.0  
**Contact:** Pour questions techniques, revenir vers moi
