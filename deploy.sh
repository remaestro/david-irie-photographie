#!/bin/bash

# 🚀 DÉPLOIEMENT SIMPLE ET SÉCURISÉ
# Usage: ./deploy.sh

set -e

echo "╔════════════════════════════════════════════╗"
echo "║   🚀 DÉPLOIEMENT DAVID IRIE PHOTOGRAPHIE  ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Vérifier que Docker est démarré
if ! docker info > /dev/null 2>&1; then
  echo "❌ Erreur: Docker n'est pas démarré"
  echo "   → Lancez Docker Desktop et réessayez"
  exit 1
fi

# Récupérer les secrets
echo "🔐 Récupération des secrets depuis Secret Manager..."
VITE_SUPABASE_URL=$(gcloud secrets versions access latest --secret="VITE_SUPABASE_URL" 2>/dev/null)
VITE_SUPABASE_ANON_KEY=$(gcloud secrets versions access latest --secret="VITE_SUPABASE_ANON_KEY" 2>/dev/null)

if [ -z "$VITE_SUPABASE_URL" ] || [ -z "$VITE_SUPABASE_ANON_KEY" ]; then
  echo "❌ Erreur: Impossible de récupérer les secrets"
  echo "   → Vérifiez vos permissions Google Cloud"
  exit 1
fi

echo "✅ Secrets récupérés"

# Variables
COMMIT_SHA=$(git rev-parse --short HEAD)
PROJECT_ID="david-irie-photographie"
REGION="europe-west1"
IMAGE_NAME="gcr.io/${PROJECT_ID}/david-irie-photographie"

echo ""
echo "📦 Build de l'image Docker..."
echo "   Commit: ${COMMIT_SHA}"

docker build \
  --build-arg VITE_SUPABASE_URL="$VITE_SUPABASE_URL" \
  --build-arg VITE_SUPABASE_ANON_KEY="$VITE_SUPABASE_ANON_KEY" \
  -t "${IMAGE_NAME}:${COMMIT_SHA}" \
  -t "${IMAGE_NAME}:latest" \
  . \
  --quiet

echo "✅ Image buildée"

echo ""
echo "📤 Push vers Google Container Registry..."

docker push "${IMAGE_NAME}:${COMMIT_SHA}" --quiet
docker push "${IMAGE_NAME}:latest" --quiet

echo "✅ Image poussée"

echo ""
echo "🚀 Déploiement sur Cloud Run..."

gcloud run deploy david-irie-photographie \
  --image "${IMAGE_NAME}:${COMMIT_SHA}" \
  --region "${REGION}" \
  --platform managed \
  --allow-unauthenticated \
  --min-instances 0 \
  --max-instances 10 \
  --quiet

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║           ✅ DÉPLOIEMENT RÉUSSI!          ║"
echo "╚════════════════════════════════════════════╝"
echo ""
echo "🌐 Application: https://david-irie-photographie-208603494308.europe-west1.run.app"
echo "📸 Galeries:    https://david-irie-photographie-208603494308.europe-west1.run.app/#/galeries-privees"
echo ""
echo "💡 Pour pousser le code sur GitHub:"
echo "   git push origin main"
echo ""
