# 📦 Stockage Cloud - Guide Rapide

## 🎯 Configuration Finale

- **Cloudinary (Gratuit)** : Photos formulaire contact
- **Backblaze B2 (2 TB - 10€/mois)** : Galeries privées (photos + vidéos)
- **Cloudflare (Gratuit)** : CDN accélération

---

## ⚡ Démarrage Rapide

### 1. Créer les comptes (20 min)

✅ **Cloudinary** : https://cloudinary.com/users/register_free
✅ **Backblaze** : https://www.backblaze.com/b2/sign-up.html
✅ **Cloudflare** (optionnel) : https://dash.cloudflare.com/sign-up

### 2. Configurer les variables Netlify

Dans Netlify Dashboard → Site settings → Environment variables :

```bash
# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Backblaze B2
B2_KEY_ID=your_key_id
B2_APPLICATION_KEY=your_application_key
B2_BUCKET_NAME=david-irie-galeries-privees
B2_ENDPOINT=s3.us-west-004.backblazeb2.com
B2_REGION=us-west-004
```

### 3. Déployer sur Netlify

```bash
git push origin main
```

Netlify installera automatiquement les dépendances.

---

## 📁 Structure des Fichiers

### Cloudinary (Contact Form)
```
contact-inspirations/
  ├── client1-photo1.jpg
  ├── client1-photo2.jpg
  └── ... (auto-deleted after 30 days)
```

### Backblaze B2 (Private Galleries)
```
galeries/
  ├── mariage-sarah-2025/
  │   ├── photo001.jpg
  │   ├── photo002.jpg
  │   └── video-complet.mp4
  ├── couple-elodie-2025/
  │   ├── photo001.jpg
  │   └── ...
  └── ... (auto-deleted after 365 days)
```

---

## 🚀 Utilisation des Fonctions

### Upload vers Cloudinary (Formulaire Contact)

```javascript
// Frontend
const uploadPhoto = async (file) => {
  const response = await fetch('/.netlify/functions/uploadToCloudinary', {
    method: 'POST',
    body: JSON.stringify({
      file: fileBase64,
      fileName: 'inspiration-photo.jpg'
    })
  })
  const data = await response.json()
  console.log(data.url) // URL de la photo
}
```

### Upload vers Backblaze (Galeries Privées)

```javascript
// Frontend - Admin panel
const uploadToGallery = async (file, galleryId) => {
  const response = await fetch('/.netlify/functions/uploadToBackblaze', {
    method: 'POST',
    body: JSON.stringify({
      file: fileBase64,
      fileName: 'photo001.jpg',
      galleryId: 'mariage-sarah-2025',
      fileType: 'image/jpeg'
    })
  })
  const data = await response.json()
  console.log(data.url) // URL permanente
}
```

### Nettoyage Auto (Scheduled)

```bash
# Manuel via curl
curl -X POST https://ton-site.netlify.app/.netlify/functions/cleanOldGalleries

# Ou configurer Netlify Scheduled Functions (1x/mois)
```

---

## 💰 Coûts Estimés

| Stockage | Photos | Vidéos | Coût/mois |
|----------|--------|--------|-----------|
| 50 GB | 10,000 | 10 | **0.25€** |
| 200 GB | 40,000 | 40 | **1€** |
| 500 GB | 100,000 | 100 | **2.5€** |
| 1 TB | 200,000 | 200 | **5€** |
| 2 TB | 400,000 | 400 | **10€** |

---

## 📊 Monitoring

### Backblaze Dashboard
- **Usage** : Voir stockage utilisé en temps réel
- **Browse Files** : Explorer les galeries
- **Lifecycle** : Vérifier règles de suppression auto

### Cloudinary Dashboard
- **Media Library** : Voir toutes les photos
- **Usage** : Tracking des 25 GB gratuits
- **Transformations** : Stats d'optimisation

---

## ⚠️ Important

### Sécurité
- ✅ Variables d'environnement dans Netlify (JAMAIS dans le code)
- ✅ 2FA activé sur Backblaze et Cloudinary
- ✅ Permissions bucket = Private

### Backup
- ⚠️ Backblaze = stockage cloud (PAS un backup)
- 💾 Toujours garder RAW sur disque dur local
- 🔄 Backup mensuel recommandé

### Lifecycle
- 🗓️ Galeries supprimées après 1 an
- 📧 Prévenir clients 1 mois avant expiration
- 💾 Clients doivent télécharger leurs photos

---

## 🆘 Troubleshooting

### Upload échoue
1. Vérifier variables d'environnement Netlify
2. Vérifier permissions Application Key (Read + Write)
3. Vérifier format fichier (JPEG, PNG, MP4 acceptés)

### Photos ne s'affichent pas
1. Vérifier URL dans la console browser
2. Vérifier bucket = Public pour les URLs directes
3. Tester URL directement dans navigateur

### Coût plus élevé que prévu
1. Vérifier stockage utilisé dans dashboard
2. Vérifier lifecycle rules actives
3. Vérifier bande passante (utiliser Cloudflare !)

---

## 📞 Support

**Problème technique ?**
- Vérifier `STORAGE_SETUP_GUIDE.txt` pour configuration détaillée
- Logs Netlify Functions : Netlify Dashboard → Functions → Logs

**Questions ?**
- Backblaze Support : help@backblaze.com
- Cloudinary Support : https://support.cloudinary.com
