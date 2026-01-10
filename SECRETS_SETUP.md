# 🔐 Configuration des Secrets pour Cloud Build

Les variables d'environnement sensibles sont stockées dans **Google Secret Manager** pour plus de sécurité.

## ✅ Secrets déjà configurés

Les secrets suivants ont été créés et configurés :
- `VITE_SUPABASE_URL` - URL de votre projet Supabase
- `VITE_SUPABASE_ANON_KEY` - Clé anonyme Supabase

## 📝 Fichiers importants

- **`cloudbuild.yaml`** - Configuration Cloud Build avec vos secrets (dans .gitignore, ne sera PAS committé)
- **`cloudbuild.yaml.template`** - Template pour partager la structure sans les secrets

## 🚀 Déploiement

Utilisez simplement :
```bash
./deploy-cloud-build.sh
```

Les secrets sont automatiquement chargés depuis Secret Manager lors du build.

## 🔄 Mettre à jour un secret

```bash
# Mettre à jour l'URL Supabase
echo -n "nouvelle_url" | gcloud secrets versions add VITE_SUPABASE_URL --data-file=-

# Mettre à jour la clé Supabase
echo -n "nouvelle_clé" | gcloud secrets versions add VITE_SUPABASE_ANON_KEY --data-file=-
```

## 🆕 Créer un nouveau secret

```bash
# Créer le secret
echo -n "valeur" | gcloud secrets create NOM_DU_SECRET --data-file=-

# Donner accès à Cloud Build
gcloud secrets add-iam-policy-binding NOM_DU_SECRET \
  --member="serviceAccount:service-208603494308@gcp-sa-cloudbuild.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"

# Ajouter dans cloudbuild.yaml sous availableSecrets.secretManager
```

## ✅ État actuel

- ✅ Secrets créés dans Secret Manager
- ✅ Permissions configurées pour Cloud Build
- ✅ cloudbuild.yaml ajouté au .gitignore
- ✅ Template créé pour référence
- ✅ Déploiement fonctionnel avec secrets sécurisés
