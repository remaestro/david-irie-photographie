#!/bin/bash

# 🚀 DÉPLOIEMENT AVEC SECRETS DEPUIS SECRET MANAGER

set -e

echo "🔐 Récupération des secrets..."

# Récupérer les secrets
VITE_SUPABASE_URL=$(gcloud secrets versions access latest --secret="VITE_SUPABASE_URL")
VITE_SUPABASE_ANON_KEY=$(gcloud secrets versions access latest --secret="VITE_SUPABASE_ANON_KEY")

if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
  echo "❌ Erreur: Impossible de récupérer les secrets"
  exit 1
fi

echo "✅ Secrets récupérés avec succès"
echo "🔨 Build de l'image Docker..."

COMMIT_SHA=$(git rev-parse --short HEAD)
PROJECT_ID="david-irie-photographie"

# Build l'image avec les secrets comme build args
docker build \
  --build-arg VITE_SUPABASE_URL="$VITE_SUPABASE_URL" \
  --build-arg VITE_SUPABASE_ANON_KEY="$VITE_SUPABASE_ANON_KEY" \
  -t "gcr.io/${PROJECT_ID}/david-irie-photographie:${COMMIT_SHA}" \
  -t "gcr.io/${PROJECT_ID}/david-irie-photographie:latest" \
  .

echo "📤 Push de l'image vers GCR..."
docker push "gcr.io/${PROJECT_ID}/david-irie-photographie:${COMMIT_SHA}"
docker push "gcr.io/${PROJECT_ID}/david-irie-photographie:latest"

echo "🚀 Déploiement sur Cloud Run..."
gcloud run deploy david-irie-photographie \
  --image "gcr.io/${PROJECT_ID}/david-irie-photographie:${COMMIT_SHA}" \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 10

echo "✅ Déploiement terminé!"
echo "🌐 URL: https://david-irie-photographie-208603494308.europe-west1.run.app"
echo ""
echo "📝 Note: Les Cloud Functions doivent être déployées séparément si modifiées."
echo "   Voir deploy-cloud-build.sh pour les commandes Cloud Functions."
