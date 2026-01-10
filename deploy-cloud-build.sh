#!/bin/bash

# 🚀 DÉPLOIEMENT VIA CLOUD BUILD (avec variables)

set -e

echo "🔨 Démarrage du build via Cloud Build..."

# Soumettre le build à Cloud Build (qui utilisera cloudbuild.yaml avec les --build-arg)
gcloud builds submit \
  --config=cloudbuild.yaml \
  --substitutions=COMMIT_SHA=$(git rev-parse HEAD) \
  .

echo "✅ Build et déploiement terminés!"
echo "🌐 Teste: https://david-irie-photographie-ysgycp323q-ew.a.run.app/#/galeries-privees"
