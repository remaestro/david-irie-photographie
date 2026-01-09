# 🚀 Quick Start - Déploiement Cloud Run

**Temps: 30 minutes pour le premier déploiement**

## Prérequis

- [ ] Compte Google (Gmail)
- [ ] Carte bancaire (pour activer Google Cloud - aucun débit!)
- [ ] Git et GitHub configurés

## Étapes Rapides

### 1️⃣ Setup Google Cloud (10 min)

```bash
# Installer gcloud CLI
brew install google-cloud-sdk  # MacOS
# ou télécharge: https://cloud.google.com/sdk/docs/install

# Login
gcloud auth login

# Créer projet (dans la console web: console.cloud.google.com)
# Puis configurer
gcloud config set project david-irie-photographie

# Activer les APIs (dans console web)
# ✅ Cloud Run API
# ✅ Cloud Build API
# ✅ Cloud Functions API
```

### 2️⃣ Déployer le site (10 min)

```bash
cd david-irie-photographie

# Déploiement direct (Cloud Build fait tout!)
gcloud run deploy david-irie-photographie \
  --source . \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 10

# Attends 3-5 minutes...
# URL affichée à la fin!
```

### 3️⃣ Déployer les fonctions (10 min)

```bash
# sendEmail
gcloud functions deploy sendEmail \
  --gen2 \
  --runtime nodejs22 \
  --trigger-http \
  --allow-unauthenticated \
  --region europe-west1 \
  --entry-point sendEmail \
  --source cloud-functions/sendEmail \
  --set-env-vars GMAIL_USER=ton-email@gmail.com,GMAIL_APP_PASSWORD=xxxx

# Répète pour uploadToCloudinary et uploadToBackblaze
# (voir CLOUD_RUN_DEPLOYMENT_GUIDE.txt pour les commandes complètes)
```

### 4️⃣ Setup auto-deploy (optionnel - 5 min)

1. Cloud Console → Cloud Build → Triggers
2. Connect Repository → GitHub → remaestro/david-irie-photographie
3. Create Trigger → Push to branch "main" → cloudbuild.yaml
4. Save

✅ **Maintenant: git push = auto-deploy!**

## 🎯 C'est tout!

Site accessible sur: `https://david-irie-photographie-xxxxx-ew.a.run.app`

## Prochaines étapes

- [ ] Configurer custom domain
- [ ] Setup Cloudflare CDN (bandwidth gratuit!)
- [ ] Configurer monitoring

**Guide complet:** Voir `CLOUD_RUN_DEPLOYMENT_GUIDE.txt`
