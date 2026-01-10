# 📍 OÙ TROUVER LES VARIABLES D'ENVIRONNEMENT

## 💻 EN LOCAL (Développement)

### Fichier: `.env`
**Chemin complet:** `/Users/adioyeremi/david-irie-photographie/.env`

**Pour voir le contenu:**
```bash
cd /Users/adioyeremi/david-irie-photographie
cat .env
```

**Pour modifier:**
```bash
nano .env
# ou
code .env  # si VS Code
```

**Variables actuelles:**
```env
# Gmail SMTP (Contact Form)
GMAIL_USER=contactphotodavidirie@gmail.com
GMAIL_APP_PASSWORD=tkwqfrrkaxasxqti

# Backblaze B2 (Photo Storage)
B2_KEY_ID=005aad79fa06b9e0000000001
B2_APPLICATION_KEY=K00521ST3tfdiv/eP9IFfBxTsmkdovw
B2_BUCKET_NAME=david-irie-photo
B2_ENDPOINT=s3.us-east-005.backblazeb2.com
B2_REGION=us-east-005

# Supabase (Database)
VITE_SUPABASE_URL=https://fjdkdoantfcwbnsqghlj.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqZGtkb2FudGZjd2Juc3FnaGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5OTU2OTUsImV4cCI6MjA4MzU3MTY5NX0.qsUusyb3yvWE9C4386VhmHhOm4qaFTFmzAHR2a_S2c0
```

---

## ☁️ EN PRODUCTION (Cloud Run)

### Option 1: Console Google Cloud (Interface Visuelle)

1. **Ouvre:** https://console.cloud.google.com/run
2. **Clique sur:** `david-irie-photographie`
3. **Va dans l'onglet:** **"VARIABLES ET SECRETS"**
4. **Tu verras:** Toutes les variables configurées

**Lien direct:** https://console.cloud.google.com/run/detail/europe-west1/david-irie-photographie/variables

### Option 2: Via ligne de commande

**Voir toutes les variables:**
```bash
gcloud run services describe david-irie-photographie \
  --region europe-west1 \
  --format="value(spec.template.spec.containers[0].env)"
```

**Variables actuellement configurées:**
- ✅ `VITE_SUPABASE_URL`
- ✅ `VITE_SUPABASE_ANON_KEY`

---

## 📝 DANS LE CODE

### Dockerfile
**Fichier:** `/Users/adioyeremi/david-irie-photographie/Dockerfile`

Les variables sont définies comme **ARG** (arguments de build):
```dockerfile
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
```

### cloudbuild.yaml
**Fichier:** `/Users/adioyeremi/david-irie-photographie/cloudbuild.yaml`

Les variables sont passées pendant le build Docker:
```yaml
- name: 'gcr.io/cloud-builders/docker'
  args:
    - 'build'
    - '--build-arg'
    - 'VITE_SUPABASE_URL=https://fjdkdoantfcwbnsqghlj.supabase.co'
    - '--build-arg'
    - 'VITE_SUPABASE_ANON_KEY=eyJhbGci...'
```

### Code Source
**Fichier:** `/Users/adioyeremi/david-irie-photographie/src/config/supabase.js`

Les variables sont utilisées dans le code:
```javascript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
```

---

## 🔐 DANS SUPABASE

### Pour obtenir/modifier les credentials Supabase:

1. **Dashboard:** https://supabase.com/dashboard/project/fjdkdoantfcwbnsqghlj
2. **Va dans:** Settings > API
3. **Tu trouveras:**
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** key → `VITE_SUPABASE_ANON_KEY`
   - **service_role** key (à ne JAMAIS mettre dans le code client!)

**Lien direct:** https://supabase.com/dashboard/project/fjdkdoantfcwbnsqghlj/settings/api

---

## 📊 RÉSUMÉ DES EMPLACEMENTS

| Variable | Local | Cloud Run | Supabase Dashboard |
|----------|-------|-----------|-------------------|
| `VITE_SUPABASE_URL` | ✅ `.env` | ✅ Variables Cloud Run | ✅ Settings > API |
| `VITE_SUPABASE_ANON_KEY` | ✅ `.env` | ✅ Variables Cloud Run | ✅ Settings > API |
| `GMAIL_USER` | ✅ `.env` | ❌ Non configuré | ❌ N/A |
| `GMAIL_APP_PASSWORD` | ✅ `.env` | ❌ Non configuré | ❌ N/A |
| `B2_KEY_ID` | ✅ `.env` | ❌ Non configuré | ❌ N/A |
| `B2_APPLICATION_KEY` | ✅ `.env` | ❌ Non configuré | ❌ N/A |

---

## ⚠️ IMPORTANT

### Variables VITE_* (compilées au build):
- Doivent être présentes **pendant le build**
- Sont remplacées dans le code par Vite
- **Ne peuvent PAS** être changées au runtime

### Variables normales (runtime):
- Peuvent être changées après le déploiement
- Lues au moment de l'exécution
- Exemple: variables pour Cloud Functions

---

## 🛠️ COMMANDES UTILES

**Voir les variables locales:**
```bash
cat .env
```

**Voir les variables Cloud Run:**
```bash
gcloud run services describe david-irie-photographie \
  --region europe-west1 \
  --format="yaml(spec.template.spec.containers[0].env)"
```

**Modifier les variables Cloud Run:**
```bash
gcloud run services update david-irie-photographie \
  --region europe-west1 \
  --update-env-vars "NOUVELLE_VAR=valeur"
```

**Tester les variables en local:**
```bash
npm run dev
# Les variables du .env sont chargées automatiquement
```

---

**Besoin d'aide?** Dis-moi quelle variable tu cherches! 😊
