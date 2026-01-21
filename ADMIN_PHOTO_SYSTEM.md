# 🎨 SYSTÈME D'ADMINISTRATION DES PHOTOS DU SITE

## ✅ Ce qui a été créé

### 1. **Base de données Supabase**
- Table `site_photos` créée avec toutes les photos par défaut
- RLS activée (visible par tous, modifiable seulement par admin)

### 2. **Contexte Admin** (`src/contexts/AdminContext.jsx`)
- Gestion de l'authentification admin
- Mode édition activable/désactivable
- Session persistante (24h)

### 3. **Composant EditableImage** (`src/components/EditableImage.jsx`)
- Overlay hover en mode édition
- Modal pour remplacer les photos
- Upload vers Backblaze B2
- Mise à jour automatique dans Supabase

### 4. **Hook useSitePhotos** (`src/hooks/useSitePhotos.js`)
- Charge toutes les photos du site depuis Supabase
- Retourne un objet `photos` indexé par clé

### 5. **Bouton Admin dans le header**
- Login/Logout
- Activation du mode édition

---

## 🚀 UTILISATION

### Étape 1: Se connecter en tant qu'admin

1. Cliquez sur le bouton **"Admin"** dans le header
2. Entrez le mot de passe : `admin2026david`
3. Vous êtes maintenant connecté !

### Étape 2: Activer le mode édition

1. Cliquez sur **"Mode édition"** dans le header
2. Le bouton devient bleu et clignote

### Étape 3: Modifier une photo

1. Survolez une photo du site
2. Un overlay noir apparaît avec un bouton **"Modifier"**
3. Cliquez sur **"Modifier"**
4. Dans la modal :
   - Voir la photo actuelle
   - Choisir une nouvelle photo
   - Voir l'aperçu
   - Cliquer sur **"Remplacer"**
5. La photo est uploadée sur Backblaze B2
6. La page se recharge automatiquement avec la nouvelle photo

---

## 📝 PROCHAINES ÉTAPES - INTÉGRATION DANS App.jsx

Pour que le système fonctionne, vous devez :

### 1. **Importer le hook dans App.jsx**

```jsx
import { useSitePhotos } from './hooks/useSitePhotos'
import EditableImage from './components/EditableImage'
```

### 2. **Utiliser le hook**

```jsx
function App() {
  const { photos, loading } = useSitePhotos()
  
  // Vos autres états...
  
  if (loading) {
    return <div>Chargement...</div>
  }
```

### 3. **Remplacer les images par EditableImage**

#### Pour les slides du hero :

**AVANT :**
```jsx
const slides = [
  { 
    title: "DAVID IRIE", 
    image: `${import.meta.env.BASE_URL}images/slide1.jpg` 
  },
  // ...
]
```

**APRÈS :**
```jsx
const slides = [
  { 
    title: "DAVID IRIE", 
    image: photos.hero_slide_1 || `${import.meta.env.BASE_URL}images/slide1.jpg` 
  },
  { 
    title: "PRÉVOIR L'INSTANT", 
    image: photos.hero_slide_2 || `${import.meta.env.BASE_URL}images/slide2.jpg` 
  },
  { 
    title: "CALENDRIER", 
    image: photos.hero_slide_3 || `${import.meta.env.BASE_URL}images/slide3.jpg` 
  },
  { 
    title: "LA QUALITÉ", 
    image: photos.hero_slide_4 || `${import.meta.env.BASE_URL}images/slide4.jpg` 
  },
  { 
    title: "PORTRAITS", 
    image: photos.hero_slide_5 || `${import.meta.env.BASE_URL}images/slide5.jpg` 
  },
]
```

#### Pour le background des slides (avec EditableImage) :

**AVANT :**
```jsx
<div className="hero-slide-bg" style={{ backgroundImage: `url(${slide.image})` }}>
</div>
```

**APRÈS :**
```jsx
<EditableImage
  photoKey={`hero_slide_${index + 1}`}
  src={slide.image}
  alt={slide.title}
  className="hero-slide-bg-image"
  style={{ 
    width: '100%', 
    height: '100%', 
    objectFit: 'cover',
    position: 'absolute',
    top: 0,
    left: 0
  }}
/>
```

**ET ajouter ce CSS dans App.css :**
```css
.hero-slide-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.hero-slide-bg-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

#### Pour les photos Instagram :

**AVANT :**
```jsx
const instagramPhotos = [
  `${import.meta.env.BASE_URL}images/couple-bijoux-1.jpg`,
  `${import.meta.env.BASE_URL}images/gemini-1.png`,
  // ...
]
```

**APRÈS :**
```jsx
const instagramPhotos = [
  photos.instagram_1 || `${import.meta.env.BASE_URL}images/couple-bijoux-1.jpg`,
  photos.instagram_2 || `${import.meta.env.BASE_URL}images/gemini-1.png`,
  photos.instagram_3 || `${import.meta.env.BASE_URL}images/bouquet-roses-1.jpg`,
  photos.instagram_4 || `${import.meta.env.BASE_URL}images/homme-fleur.jpg`,
  photos.instagram_5 || `${import.meta.env.BASE_URL}images/gemini-2.png`,
  photos.instagram_6 || `${import.meta.env.BASE_URL}images/bouquet-roses-2.jpg`,
  photos.instagram_7 || `${import.meta.env.BASE_URL}images/couple-bijoux-2.jpg`,
  photos.instagram_8 || `${import.meta.env.BASE_URL}images/slide3.jpg`,
]
```

**Et dans le rendu :**
```jsx
{instagramPhotos.map((photo, index) => (
  <div key={index} className="slider-photo-item">
    <EditableImage
      photoKey={`instagram_${index + 1}`}
      src={photo}
      alt={`Instagram ${index + 1}`}
      onClick={() => openLightbox(index)}
    />
  </div>
))}
```

---

## 🔑 CLÉS DES PHOTOS (photoKey)

Voici toutes les clés configurées dans la base de données :

### Hero Slider (5 photos)
- `hero_slide_1`
- `hero_slide_2`
- `hero_slide_3`
- `hero_slide_4`
- `hero_slide_5`

### Galerie Instagram (8 photos)
- `instagram_1`
- `instagram_2`
- `instagram_3`
- `instagram_4`
- `instagram_5`
- `instagram_6`
- `instagram_7`
- `instagram_8`

---

## 🎯 EXEMPLE COMPLET

Voici un exemple complet pour le slider Instagram :

```jsx
{/* Section Instagram - Slider photos */}
<section className="instagram-slider">
  <div className="slider-container">
    <h2 className="instagram-title">
      <FiInstagram size={28} />
      Suivez-moi sur Instagram
    </h2>
    <div className="slider-photos">
      {instagramPhotos.map((photo, index) => (
        <motion.div
          key={index}
          className={`slider-photo-item ${visibleImages.has(index + 1000) ? 'visible' : ''}`}
          data-index={index + 1000}
        >
          <EditableImage
            photoKey={`instagram_${index + 1}`}
            src={photo}
            alt={`Instagram photo ${index + 1}`}
            onClick={() => openLightbox(index)}
          />
        </motion.div>
      ))}
    </div>
  </div>
</section>
```

---

## ⚠️ IMPORTANT

1. **Fallback** : Toujours inclure une image par défaut avec `||`
   ```jsx
   photos.hero_slide_1 || `${import.meta.env.BASE_URL}images/slide1.jpg`
   ```

2. **photoKey** : Doit correspondre exactement à la clé dans la base de données

3. **Mode édition** : N'oubliez pas d'activer le mode édition après vous être connecté

4. **Upload** : Les photos sont uploadées sur Backblaze B2 dans le dossier `site-photos/`

5. **Rechargement** : La page se recharge automatiquement après le remplacement d'une photo

---

## 🔧 DÉPANNAGE

### La photo ne change pas
- Vérifiez que vous êtes en mode édition
- Vérifiez la console pour les erreurs
- Vérifiez que le photoKey correspond

### L'overlay ne s'affiche pas
- Vérifiez que vous êtes connecté en admin
- Vérifiez que le mode édition est activé
- Vérifiez que le composant EditableImage est bien utilisé

### L'upload échoue
- Vérifiez votre connexion internet
- Vérifiez les logs de la Cloud Function uploadToBackblaze
- Vérifiez que la photo fait moins de 5MB

---

## 📱 WORKFLOW COMPLET

1. **Se connecter** → Bouton "Admin" → Entrer le mot de passe
2. **Activer l'édition** → Bouton "Mode édition"
3. **Survoler une photo** → Overlay apparaît
4. **Cliquer "Modifier"** → Modal s'ouvre
5. **Choisir nouvelle photo** → Aperçu s'affiche
6. **Cliquer "Remplacer"** → Upload + mise à jour
7. **Page se recharge** → Nouvelle photo affichée
8. **Désactiver l'édition** → Bouton "Quitter édition"
9. **Se déconnecter** → Bouton "Déconnexion"

---

**Voulez-vous que j'intègre maintenant EditableImage dans App.jsx pour les slides et la galerie Instagram ?**
