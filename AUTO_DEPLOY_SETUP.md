# ⚙️ CONFIGURATION AUTO-DEPLOY SUR PUSH GITHUB

## 🎯 Objectif
Faire en sorte que chaque `git push` vers GitHub déclenche automatiquement un build Cloud Build avec les variables Supabase correctes.

---

## 📋 OPTION 1: Cloud Build Trigger (Recommandé)

### Étape 1: Connecter GitHub à Cloud Build

1. **Va sur Cloud Build Triggers:**
   https://console.cloud.google.com/cloud-build/triggers?project=david-irie-photographie

2. **Clique sur "CONNECT REPOSITORY"**

3. **Sélectionne "GitHub"**

4. **Authentifie-toi avec GitHub** (compte: remaestro)

5. **Sélectionne le repository:**
   - Repository: `remaestro/david-irie-photographie`

6. **Clique "Connect"**

---2

### Étape 2: Créer le Trigger

1. **Clique sur "CREATE TRIGGER"**

2. **Configure le trigger:**
   ```
   Nom: deploy-on-push
   Description: Auto-deploy on push to main
   les 
   Event: Push to a branch
   Source: remaestro/david-irie-photographie
   Branch: ^main$
   
   Configuration: Cloud Build configuration file (yaml or json)
   Location: Repository
   Cloud Build configuration file: cloudbuild-simple.yaml
   ```

3. **Clique "CREATE"**

---

### Étape 3: Tester

```bash
# Fais un petit changement
git add -A
git commit -m "test: Test auto-deploy"
git push origin main

# Le build se déclenchera automatiquement!
```

**Suis le build ici:**
https://console.cloud.google.com/cloud-build/builds?project=david-irie-photographie

---

## 📋 OPTION 2: GitHub Actions (Alternative)

### Créer `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Cloud Run

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Authenticate to Google Cloud
      uses: google-github-actions/auth@v1
      with:
        credentials_json: ${{ secrets.GCP_SA_KEY }}
    
    - name: Set up Cloud SDK
      uses: google-github-actions/setup-gcloud@v1
    
    - name: Build and Deploy
      run: |
        gcloud builds submit \
          --config=cloudbuild-simple.yaml \
          .
```

**Avantages:**
- ✅ Plus de contrôle
- ✅ Peut ajouter des tests avant deploy
- ✅ Notifications GitHub

**Inconvénients:**
- ❌ Nécessite créer un Service Account
- ❌ Plus complexe

---

## 🎯 RECOMMANDATION: Option 1 (Cloud Build Trigger)

**Pourquoi?**
- ✅ Plus simple (pas de service account à créer)
- ✅ Intégration native Google Cloud
- ✅ Utilise directement `cloudbuild-simple.yaml`
- ✅ Logs dans Cloud Build
- ✅ Gratuit (120 minutes/jour)

---

## 📝 FICHIERS CRÉÉS

Ton projet a maintenant:

1. **`cloudbuild-simple.yaml`** ✅
   - Config simple avec variables Supabase
   - Utilisé pour auto-deploy

2. **`cloudbuild.yaml`** (ancien)
   - Plus complexe avec Cloud Functions
   - À garder pour déploiements complets

3. **`deploy-cloud-build.sh`** ✅
   - Script pour déployer manuellement
   - Utilise cloudbuild-simple.yaml

4. **`deploy-with-env.sh`**
   - Déploiement Docker local (nécessite Docker Desktop)

---

## 🚀 WORKFLOW RECOMMANDÉ

### Pour un déploiement MANUEL:
```bash
./deploy-cloud-build.sh
```

### Pour un déploiement AUTOMATIQUE:
```bash
git add -A
git commit -m "feat: Nouvelle fonctionnalité"
git push origin main
# ✅ Le trigger Cloud Build se déclenche automatiquement!
```

---

## ⚙️ COMMANDES RAPIDES

**Créer le trigger via CLI (si tu préfères):**
```bash
gcloud builds triggers create github \
  --name=deploy-on-push \
  --repo-name=david-irie-photographie \
  --repo-owner=remaestro \
  --branch-pattern=^main$ \
  --build-config=cloudbuild-simple.yaml
```

**Lister les triggers:**
```bash
gcloud builds triggers list
```

**Tester le trigger manuellement:**
```bash
gcloud builds triggers run deploy-on-push --branch=main
```

---

## 📊 VÉRIFICATION

Après avoir configuré le trigger:

1. **Fais un petit changement:**
   ```bash
   echo "# Test auto-deploy" >> README.md
   git add README.md
   git commit -m "test: Auto-deploy"
   git push origin main
   ```

2. **Vérifie que le build démarre:**
   https://console.cloud.google.com/cloud-build/builds?project=david-irie-photographie

3. **Tu devrais voir:** Un nouveau build qui se déclenche automatiquement

4. **Après ~5 minutes:** Le site est mis à jour!

---

## ✅ RÉSUMÉ

| Méthode | Déclenchement | Complexité | Recommandé |
|---------|---------------|------------|------------|
| Cloud Build Trigger | Push GitHub | ⭐ Simple | ✅ OUI |
| GitHub Actions | Push GitHub | ⭐⭐⭐ Moyen | ⚠️ Si besoin avancé |
| Script manuel | `./deploy-cloud-build.sh` | ⭐ Simple | ✅ Pour test rapide |

---

## 🎯 PROCHAINE ÉTAPE

**Configure le Cloud Build Trigger maintenant:**
👉 https://console.cloud.google.com/cloud-build/triggers?project=david-irie-photographie

1. Clique "CONNECT REPOSITORY"
2. Connecte GitHub
3. Sélectionne `remaestro/david-irie-photographie`
4. Crée un trigger avec `cloudbuild-simple.yaml`
5. ✅ Terminé!

**Besoin d'aide pour configurer le trigger?** Dis-moi! 😊
