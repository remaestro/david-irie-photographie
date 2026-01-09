# 📸 Guide d'utilisation Backblaze B2 - David Irie Photographie

## 📋 Informations de connexion

**Dashboard Backblaze:** https://secure.backblaze.com/b2_buckets.htm

**Bucket configuré:**
- Nom: `david-irie-photo`
- Type: Public (allPublic)
- Région: us-east-005

**URL de base:**
```
https://f005.backblazeb2.com/file/david-irie-photo/
```

---

## 📁 Structure des dossiers recommandée

Organisez vos photos dans des dossiers pour faciliter la gestion:

```
david-irie-photo/
├── portfolio/          # Photos principales du portfolio
├── gallery/            # Galerie complète
├── events/             # Photos d'événements
├── portraits/          # Portraits
├── landscapes/         # Paysages
└── thumbnails/         # Miniatures (générées automatiquement)
```

---

## 🔄 Comment uploader des photos

### Méthode 1: Interface Web Backblaze (Simple)

1. **Connexion:**
   - Va sur: https://secure.backblaze.com/user_signin.htm
   - Connecte-toi avec ton compte

2. **Navigation:**
   - Menu gauche → "B2 Cloud Storage"
   - Clique sur le bucket "david-irie-photo"

3. **Upload:**
   - Clique sur "Upload/Download"
   - Clique "Upload"
   - Sélectionne tes photos
   - **Important:** Nomme tes fichiers de façon claire
     - Exemple: `portrait-marie-2024.jpg`
     - Évite les espaces (utilise des tirets `-`)

4. **Organisation (optionnel):**
   - Pour uploader dans un dossier, ajoute le chemin dans le nom
   - Exemple: `portfolio/portrait-marie-2024.jpg`

### Méthode 2: Cyberduck / Transmit (Pour uploads en masse)

**Cyberduck** (Gratuit, macOS/Windows):
1. Télécharge: https://cyberduck.io/
2. Nouvelle connexion → "Amazon S3"
3. Paramètres:
   - Server: `s3.us-east-005.backblazeb2.com`
   - Access Key ID: `005aad79fa06b9e0000000001`
   - Secret Access Key: `K00521ST3tfdiv/eP9IFfBxTsmkdovw`
   - Path: `/david-irie-photo`
4. Connecte et upload par glisser-déposer

---

## 🖼️ Comment obtenir l'URL d'une photo

### Format d'URL:

```
https://f005.backblazeb2.com/file/david-irie-photo/[chemin-fichier]
```

### Exemples:

Photo à la racine:
```
https://f005.backblazeb2.com/file/david-irie-photo/test.jpg
```

Photo dans un dossier:
```
https://f005.backblazeb2.com/file/david-irie-photo/portfolio/portrait-marie.jpg
```

Thumbnail:
```
https://f005.backblazeb2.com/file/david-irie-photo/thumbnails/portrait-marie-thumb.jpg
```

---

## ✏️ Utilisation dans le code du site

Le site utilise le fichier `/src/config/backblaze.js` pour gérer les URLs.

### Exemple d'utilisation:

```javascript
import { getPhotoUrl, getThumbnailUrl } from '@/config/backblaze';

// URL d'une photo
const photoUrl = getPhotoUrl('portrait-marie.jpg', 'portfolio');
// Résultat: https://f005.backblazeb2.com/file/david-irie-photo/portfolio/portrait-marie.jpg

// URL d'un thumbnail
const thumbUrl = getThumbnailUrl('portrait-marie-thumb.jpg');
// Résultat: https://f005.backblazeb2.com/file/david-irie-photo/thumbnails/portrait-marie-thumb.jpg
```

---

## 📊 Gestion du portfolio

### Ajouter des photos au site:

Pour l'instant, les photos sont gérées manuellement dans le code.

**Fichier à modifier:** `/src/data/photos.js` (à créer)

**Exemple:**

```javascript
import { getPhotoUrl, getThumbnailUrl } from '@/config/backblaze';

export const photos = [
  {
    id: 1,
    title: 'Portrait Marie',
    description: 'Session portrait en extérieur',
    category: 'portraits',
    url: getPhotoUrl('portrait-marie.jpg', 'portfolio'),
    thumbnail: getThumbnailUrl('portrait-marie-thumb.jpg'),
    date: '2024-01-15'
  },
  {
    id: 2,
    title: 'Paysage Montagne',
    description: 'Lever de soleil dans les Alpes',
    category: 'landscapes',
    url: getPhotoUrl('montagne-alpes.jpg', 'portfolio'),
    thumbnail: getThumbnailUrl('montagne-alpes-thumb.jpg'),
    date: '2024-02-20'
  }
];
```

---

## 🔒 Sécurité des credentials

**⚠️ IMPORTANT: Les credentials Backblaze B2 sont stockés:**

✅ **En sécurité:**
- GitHub Secrets (chiffrés)
- Variables d'environnement Cloud Run (chiffrées)

❌ **JAMAIS:**
- Dans le code source
- Dans les fichiers de configuration versionnés
- Dans le frontend accessible aux utilisateurs

**Credentials (référence):**
- keyID: `005aad79fa06b9e0000000001`
- applicationKey: `K00521ST3tfdiv/eP9IFfBxTsmkdovw`

---

## 📈 Monitoring et statistiques

### Vérifier l'utilisation:

1. Va sur Backblaze dashboard
2. Menu "B2 Cloud Storage" → "Buckets"
3. Clique sur "david-irie-photo"
4. Tu verras:
   - Nombre de fichiers
   - Stockage utilisé (MB/GB)
   - Bande passante utilisée

### Quotas gratuits Backblaze B2:
- ✅ 10 GB de stockage gratuit
- ✅ 1 GB/jour de téléchargement gratuit (~30 GB/mois)

### Si dépassement des quotas:
- Stockage: ~0.006$/GB/mois (~0.0056€/GB)
- Transfert: GRATUIT si via Cloudflare CDN (à configurer)

---

## 🚀 Prochaines étapes (Optionnel)

### 1. Configuration Cloudflare CDN

**Avantages:**
- ✅ Transfert illimité GRATUIT (Bandwidth Alliance)
- ✅ Performance mondiale (cache)
- ✅ URL custom: `photos.davidirie.com`

**Configuration:** Voir guide séparé `CLOUDFLARE_CDN_GUIDE.md`

### 2. Upload automatique depuis le site

**Actuellement:** Upload manuel via Backblaze UI

**Future amélioration:**
- Interface d'admin dans le site
- Upload direct depuis le navigateur
- Redimensionnement automatique des images
- Génération automatique des thumbnails

### 3. Base de données Supabase

**Pour gérer dynamiquement:**
- Liste des photos
- Métadonnées (titre, description, tags)
- Catégories
- Albums

**Configuration:** Voir guide `SUPABASE_SETUP_GUIDE.md`

---

## 📞 Support

**Backblaze Support:**
- Documentation: https://www.backblaze.com/docs/cloud-storage
- Email: help@backblaze.com

**En cas de problème:**
1. Vérifie que le bucket est bien "Public"
2. Vérifie l'orthographe exacte du nom de fichier
3. Teste l'URL directement dans le navigateur
4. Vérifie que le fichier existe bien dans Backblaze

---

## ✅ Checklist de démarrage

- [ ] Compte Backblaze B2 créé
- [ ] Bucket "david-irie-photo" configuré en Public
- [ ] App Keys créées et sauvegardées
- [ ] Secrets ajoutés dans GitHub
- [ ] Photo test uploadée et URL testée
- [ ] Structure de dossiers créée
- [ ] Premières photos du portfolio uploadées
- [ ] Site mis à jour avec les nouvelles URLs

---

**Date de création:** 9 Janvier 2026  
**Dernière mise à jour:** 9 Janvier 2026
