# 📋 TODO - Ce qui reste à faire

**Date:** 9 Janvier 2026  
**Projet:** David Irie Photographie

---

## ✅ DÉJÀ FAIT AUJOURD'HUI

- ✅ Site déployé sur Cloud Run et fonctionnel
- ✅ Cloud Functions opérationnelles (uploadToBackblaze, uploadToCloudinary, sendEmail)
- ✅ CI/CD optimisé (déploiement conditionnel des fonctions)
- ✅ Test d'upload B2 réussi
- ✅ Correction du problème CORS
- ✅ Amélioration de la lisibilité du texte (navigation, titres)

---

## 🔴 PRIORITÉ 1 - Configuration Services Externes (Cette semaine)

### 1. Domaine Personnalisé
**Temps estimé:** 30 minutes + 24h propagation DNS  
**Coût:** ~12€/an

**Actions:**
- [ ] Acheter `davidirie.com` (ou autre nom)
  - Recommandé: Google Domains, Namecheap, ou OVH
- [ ] Créer compte Cloudflare (gratuit)
- [ ] Ajouter le domaine à Cloudflare
- [ ] Configurer les DNS (nameservers)
- [ ] Pointer vers Cloud Run (CNAME)
- [ ] Vérifier SSL automatique actif

**Ressources:**
- Guide Cloudflare: https://developers.cloudflare.com/dns/

---

### 2. Cloudflare CDN
**Temps estimé:** 20 minutes  
**Coût:** Gratuit

**Actions:**
- [ ] Activer le proxy Cloudflare (orange cloud)
- [ ] Configurer les paramètres de cache:
  - [ ] Browser Cache TTL: 4 heures
  - [ ] Edge Cache TTL: 1 mois pour images
- [ ] Activer minification automatique (HTML, CSS, JS)
- [ ] Activer Brotli compression
- [ ] Configurer Page Rules pour optimisation images
- [ ] Tester vitesse avec/sans CDN

**Ressources:**
- Dashboard Cloudflare > Speed > Optimization

---

### 3. Backblaze B2 - Organisation Complète
**Temps estimé:** 2-3 heures  
**Coût:** Gratuit (jusqu'à 10 GB)

**Actions:**
- [x] ✅ Compte créé (credentials déjà configurés)
- [x] ✅ Bucket `david-irie-photo` créé et configuré
- [x] ✅ Configuration code prête (`src/config/backblaze.js`)
- [ ] **🔥 EN COURS** - Organiser la structure de stockage dans Backblaze
- [ ] **PROCHAINE ÉTAPE** - Uploader le portfolio par catégorie

**Structure recommandée à créer dans Backblaze :**
  ```
  david-irie-photo/
  ├── portfolio/
  │   ├── mariage/
  │   ├── couple/
  │   ├── evenements/
  │   ├── shooting-strobist/
  │   ├── shooting-exterieur/
  │   └── shooting-studio/
  ├── videos/
  │   ├── teaser-mariage/
  │   ├── pre-wedding/
  │   └── lifestyle/
  └── galeries-privees/
      ├── client1/
      ├── client2/
      └── ...
  ```
- [ ] Optimiser les images avant upload (WebP, compression)
- [ ] Créer thumbnails pour chaque photo (300x300, 800x600)
- [ ] Tester accès public aux fichiers
- [ ] Intégrer les photos dans les pages du site

**📌 MÉTHODES D'UPLOAD :**

**Option 1 - Interface Web Backblaze (Rapide pour débuter) :**
1. Aller sur : https://secure.backblaze.com/b2_buckets.htm
2. Cliquer sur le bucket `david-irie-photo`
3. Upload → Nommer les fichiers : `portfolio/mariage/photo1.jpg`

**Option 2 - Cyberduck (Recommandé pour upload en masse) :**
```bash
# Télécharger : https://cyberduck.io/
# Connexion S3 :
# - Server: s3.us-east-005.backblazeb2.com
# - Access Key: 005aad79fa06b9e0000000001
# - Secret Key: K00521ST3tfdiv/eP9IFfBxTsmkdovw
# - Path: /david-irie-photo
```

**Option 3 - B2 CLI (Pour les techniciens) :**
```bash
# Installer B2 CLI
pip install b2

# Authentification
b2 authorize-account 005aad79fa06b9e0000000001 K00521ST3tfdiv/eP9IFfBxTsmkdovw

# Upload d'un dossier complet
b2 sync /chemin/local/mariage b2://david-irie-photo/portfolio/mariage
```

**📋 CHECKLIST UPLOAD :**
- [ ] Préparer 10-20 meilleures photos de chaque catégorie
- [ ] Renommer les fichiers (ex: `mariage-chateau-001.jpg`)
- [ ] Uploader dans les bons dossiers
- [ ] Tester une URL : `https://f005.backblazeb2.com/file/david-irie-photo/portfolio/mariage/photo1.jpg`
- [ ] Créer un fichier `photos-index.json` avec la liste des photos

**🎨 FORMAT DES PHOTOS :**
- Format : JPG ou WebP
- Taille : Max 1920x1080px (full HD)
- Poids : 200-500 KB par photo (après compression)
- Nommage : `categorie-description-numero.jpg`

**Exemple :** `mariage-eglise-sortie-001.jpg`

---

### 4. Supabase - Base de Données
**Temps estimé:** 1-2 heures  
**Coût:** Gratuit

**Actions:**
- [ ] Créer compte Supabase: https://supabase.com/dashboard/sign-up
- [ ] Créer projet `david-irie-photographie` (région: Europe West)
- [ ] Créer les tables:

**Schéma BDD:**
```sql
-- Table: photos
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'mariage', 'couple', etc.
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  width INTEGER,
  height INTEGER,
  taken_at DATE,
  created_at TIMESTAMP DEFAULT NOW(),
  is_featured BOOLEAN DEFAULT FALSE,
  order_index INTEGER DEFAULT 0
);

-- Table: albums
CREATE TABLE albums (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  cover_photo_id UUID REFERENCES photos(id),
  category TEXT,
  is_private BOOLEAN DEFAULT FALSE,
  password_hash TEXT, -- pour galeries privées
  created_at TIMESTAMP DEFAULT NOW()
);

-- Table: album_photos (relation many-to-many)
CREATE TABLE album_photos (
  album_id UUID REFERENCES albums(id) ON DELETE CASCADE,
  photo_id UUID REFERENCES photos(id) ON DELETE CASCADE,
  order_index INTEGER DEFAULT 0,
  PRIMARY KEY (album_id, photo_id)
);

-- Index pour performance
CREATE INDEX idx_photos_category ON photos(category);
CREATE INDEX idx_photos_featured ON photos(is_featured);
CREATE INDEX idx_albums_private ON albums(is_private);
```

**Actions suite:**
- [ ] Configurer Row Level Security (RLS)
- [ ] Générer clés API (anon key, service role key)
- [ ] Importer métadonnées des photos
- [ ] Tester requêtes API REST

**Ressources:**
- Doc Supabase: https://supabase.com/docs

---

### 5. Gmail SMTP - Formulaire Contact
**Temps estimé:** 15 minutes  
**Coût:** Gratuit

**Actions:**
- [ ] Générer App Password Gmail:
  1. Aller sur: https://myaccount.google.com/security
  2. Activer 2FA (si pas déjà fait)
  3. Générer "App Password" pour "Mail"
  4. Copier le mot de passe (16 caractères)
- [ ] Ajouter les variables d'environnement à Cloud Run:
  ```bash
  gcloud run services update david-irie-photographie \
    --set-env-vars GMAIL_USER=votre-email@gmail.com,GMAIL_APP_PASSWORD=xxxx \
    --region=europe-west1
  ```
- [ ] Tester le formulaire de contact
- [ ] Vérifier réception email
- [ ] Configurer auto-réponse (optionnel)

**Fichier de référence:** `GMAIL_SETUP_INSTRUCTIONS.txt`

---

## 🟡 PRIORITÉ 2 - Contenu & Optimisation (Semaine prochaine)

### 6. Intégration Backblaze + Supabase dans l'Application
**Temps estimé:** 3-4 heures  
**Niveau:** Développement

**Actions:**
- [ ] Installer Supabase client dans le projet:
  ```bash
  npm install @supabase/supabase-js
  ```
- [ ] Créer fichier config Supabase: `src/config/supabase.js`
- [ ] Créer fichier config Backblaze: `src/config/backblaze.js` (✅ déjà fait)
- [ ] Modifier les pages pour charger les photos depuis Supabase:
  - [ ] `Portfolio.jsx` - Afficher photos par catégorie
  - [ ] `Mariage.jsx` - Photos de mariage
  - [ ] `Couple.jsx` - Photos couple
  - [ ] `Videos.jsx` - Vidéos depuis B2
- [ ] Ajouter pagination (20-30 photos par page)
- [ ] Implémenter recherche/filtrage
- [ ] Tester performance de chargement
- [ ] Ajouter loading states (skeletons)

**Code exemple:**
```javascript
// src/config/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)
```

---

### 7. Optimisation des Images
**Temps estimé:** 2-3 heures  
**Outils:** ImageMagick, Sharp, ou service en ligne

**Actions:**
- [ ] Convertir toutes les images en WebP (meilleure compression)
- [ ] Créer 3 versions par image:
  - Thumbnail: 300x300px (~30 KB)
  - Medium: 800x600px (~100 KB)
  - Full: 1920x1080px (~300 KB)
- [ ] Optimiser la compression (qualité 85%)
- [ ] Ajouter lazy loading natif (`loading="lazy"`)
- [ ] Implémenter progressive image loading
- [ ] Tester avec PageSpeed Insights

**Script d'optimisation (exemple):**
```bash
# Installer ImageMagick
brew install imagemagick

# Convertir en WebP
for img in *.jpg; do
  magick "$img" -quality 85 -resize 1920x1080 "${img%.jpg}.webp"
done
```

---

### 8. SEO - Référencement
**Temps estimé:** 2 heures  
**Coût:** Gratuit

**Actions:**
- [ ] Google Search Console:
  - [ ] Ajouter le site
  - [ ] Vérifier propriété (méthode DNS)
  - [ ] Soumettre sitemap.xml
- [ ] Créer/optimiser `sitemap.xml` dynamique
- [ ] Ajouter `robots.txt` optimisé (✅ existe déjà)
- [ ] Optimiser balises meta par page:
  - [ ] Title (50-60 caractères)
  - [ ] Description (150-160 caractères)
  - [ ] Open Graph (Facebook/Twitter)
- [ ] Ajouter structured data (Schema.org):
  - [ ] Photographer
  - [ ] ImageGallery
  - [ ] LocalBusiness (si applicable)
- [ ] Optimiser URLs (slugs parlants)
- [ ] Ajouter texte alt sur toutes les images

**Fichier à créer:** `src/utils/seo.js` pour gérer les meta tags

---

### 9. Google Analytics 4
**Temps estimé:** 1 heure  
**Coût:** Gratuit

**Actions:**
- [ ] Créer compte Google Analytics 4
- [ ] Créer propriété pour le site
- [ ] Récupérer Measurement ID (G-XXXXXXXXXX)
- [ ] Ajouter le code tracking (déjà préparé dans `GOOGLE_ANALYTICS_SETUP.txt`)
- [ ] Configurer événements personnalisés:
  - [ ] Clic sur photo (lightbox)
  - [ ] Changement de catégorie
  - [ ] Soumission formulaire contact
  - [ ] Téléchargement brochure (si applicable)
- [ ] Configurer objectifs de conversion
- [ ] Tester avec Google Tag Assistant
- [ ] Vérifier données après 24-48h

**Code à ajouter dans `index.html`:**
```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

### 10. Galeries Privées - Fonctionnalité Complète
**Temps estimé:** 4-5 heures  
**Niveau:** Développement avancé

**Actions:**
- [ ] Créer interface admin pour créer des galeries:
  - [ ] Upload photos pour un client spécifique
  - [ ] Générer mot de passe unique
  - [ ] Envoyer email au client avec lien + mot de passe
- [ ] Améliorer `PrivateGalleries.jsx`:
  - [ ] Connexion à Supabase (au lieu de données en dur)
  - [ ] Hasher les mots de passe (bcrypt)
  - [ ] Stocker session client (JWT ou cookie)
  - [ ] Permettre téléchargement individuel ou batch
  - [ ] Ajouter watermark sur preview (optionnel)
- [ ] Créer système d'expiration:
  - [ ] Galerie expire après 30-90 jours
  - [ ] Notification avant expiration
- [ ] Statistiques par galerie:
  - [ ] Nombre de vues
  - [ ] Photos téléchargées
  - [ ] Dernière visite

**Schéma BDD supplémentaire:**
```sql
-- Table: private_galleries
CREATE TABLE private_galleries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  client_email TEXT,
  password_hash TEXT NOT NULL,
  album_id UUID REFERENCES albums(id),
  expires_at TIMESTAMP,
  views_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🟢 PRIORITÉ 3 - Amélioration Continue (Mois prochain)

### 11. Monitoring & Alertes
**Temps estimé:** 1 heure  
**Coût:** Gratuit

**Actions:**
- [ ] UptimeRobot (monitoring uptime):
  - [ ] Créer compte: https://uptimerobot.com
  - [ ] Ajouter monitor HTTP(s) pour le site
  - [ ] Configurer alertes email (si down)
  - [ ] Intervalle: 5 minutes
- [ ] Google Cloud Monitoring:
  - [ ] Créer dashboard personnalisé
  - [ ] Métriques: CPU, mémoire, requêtes/min
  - [ ] Alertes si erreur 500 > 5/min
  - [ ] Budget alerts (si coûts > 5€)
- [ ] Sentry (erreur tracking) - optionnel:
  - [ ] Créer compte gratuit
  - [ ] Intégrer dans React
  - [ ] Capturer erreurs JS côté client

---

### 12. Performance - Optimisations Avancées
**Temps estimé:** 3-4 heures  
**Niveau:** Technique

**Actions:**
- [ ] Implémenter Service Worker (PWA):
  - [ ] Cache offline des assets statiques
  - [ ] Stratégie cache-first pour images
  - [ ] Permettre accès hors ligne (lecture seule)
- [ ] Code splitting React:
  - [ ] Lazy load des pages avec `React.lazy()`
  - [ ] Précharger page suivante probable
  - [ ] Réduire bundle size initial
- [ ] Optimiser fonts:
  - [ ] Utiliser `font-display: swap`
  - [ ] Subset fonts (caractères utilisés seulement)
  - [ ] Précharger fonts critiques
- [ ] Compression Brotli (déjà activé via Cloudflare)
- [ ] HTTP/3 (QUIC) - activer sur Cloudflare
- [ ] Viser Lighthouse score 95+/100

**Objectifs de performance:**
- First Contentful Paint (FCP): < 1.8s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- Time to Interactive (TTI): < 3.8s

---

### 13. Sécurité - Durcissement
**Temps estimé:** 1-2 heures  

**Actions:**
- [ ] Configurer Content Security Policy (CSP)
- [ ] Ajouter Security Headers:
  - [ ] X-Frame-Options: DENY
  - [ ] X-Content-Type-Options: nosniff
  - [ ] Referrer-Policy: strict-origin-when-cross-origin
  - [ ] Permissions-Policy
- [ ] Rate limiting sur formulaire contact (Cloudflare)
- [ ] CAPTCHA sur formulaire (Google reCAPTCHA v3)
- [ ] Audit dépendances npm (`npm audit`)
- [ ] Configurer dependabot (GitHub) pour auto-update sécurité
- [ ] Backup automatique Supabase (quotidien)

---

### 14. Marketing & Visibilité
**Temps estimé:** Variable  
**Coût:** 0€ (effort temps)

**Actions:**
- [ ] Google My Business:
  - [ ] Créer profil photographe
  - [ ] Ajouter photos, horaires, localisation
  - [ ] Encourager avis clients
- [ ] Réseaux sociaux:
  - [ ] Instagram Business optimisé
  - [ ] Pinterest (galeries photos)
  - [ ] Facebook Page
  - [ ] Lien vers site dans bio
- [ ] Backlinks SEO:
  - [ ] Inscription annuaires photographes
  - [ ] Partenariats lieux événements (salles mariage)
  - [ ] Blog invité sur sites wedding
- [ ] Newsletter (optionnel):
  - [ ] Intégrer Mailchimp ou Sendinblue
  - [ ] Formulaire inscription
  - [ ] Campagne mensuelle

---

### 15. Fonctionnalités Bonus (Si temps/budget)
**Temps estimé:** Variable  
**Priorité:** Basse

**Actions:**
- [ ] Blog intégré (conseils photo, coulisses)
- [ ] Témoignages clients avec carousel
- [ ] Système de favoris (pour galeries privées)
- [ ] Partage social facile (boutons partage)
- [ ] Mode sombre (dark mode)
- [ ] Multi-langue (FR/EN)
- [ ] Formulaire devis personnalisé
- [ ] Calendrier disponibilités (intégration Google Calendar)
- [ ] Chat en direct (Crisp, Tawk.to)
- [ ] Espace client dédié (dashboard)

---

## 📊 RÉCAPITULATIF PAR PRIORITÉ

### 🔴 CRITIQUE (Cette semaine) - 6-8 heures
1. Domaine personnalisé
2. Cloudflare CDN
3. Upload portfolio Backblaze
4. Supabase configuration
5. Gmail SMTP

### 🟡 IMPORTANT (2 semaines) - 10-15 heures
6. Intégration Backblaze + Supabase
7. Optimisation images
8. SEO complet
9. Google Analytics 4
10. Galeries privées fonctionnelles

### 🟢 AMÉLIORATION (1 mois+) - Variable
11. Monitoring
12. Performance avancée
13. Sécurité renforcée
14. Marketing
15. Fonctionnalités bonus

---

## 💰 BUDGET RÉCAPITULATIF

| Élément | Coût | Fréquence |
|---------|------|-----------|
| **Domaine** | 12€ | An |
| **Cloudflare** | 0€ | - |
| **Backblaze B2** (0-10 GB) | 0€ | Mois |
| **Supabase** | 0€ | Mois |
| **Gmail SMTP** | 0€ | - |
| **Cloud Run** | 0€ | Mois |
| **TOTAL** | **12€/an** = **1€/mois** | - |

**Si dépassement 10 GB stockage:**
- +50 GB = +0.22€/mois
- +100 GB = +0.50€/mois
- Transfert toujours gratuit via Cloudflare

---

## 🎯 PROCHAINE ACTION IMMÉDIATE

**ÉTAPE 1:** Acheter le domaine `davidirie.com` (ou autre)  
**Où:** Google Domains, Namecheap, OVH  
**Coût:** ~12€/an  
**Temps:** 10 minutes

**Dès que le domaine est acheté, on peut configurer Cloudflare et tout connecter!** 🚀

---

**Besoin d'aide pour l'une de ces étapes? N'hésitez pas!** 💪
