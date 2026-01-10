#!/bin/bash

# 🚀 DÉPLOIEMENT CORRECT AVEC VARIABLES SUPABASE

set -e

echo "🔨 Build Docker avec variables Supabase..."

# Build l'image Docker LOCALEMENT avec les build args
docker build \
  --build-arg VITE_SUPABASE_URL="https://fjdkdoantfcwbnsqghlj.supabase.co" \
  --build-arg VITE_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqZGtkb2FudGZjd2Juc3FnaGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5OTU2OTUsImV4cCI6MjA4MzU3MTY5NX0.qsUusyb3yvWE9C4386VhmHhOm4qaFTFmzAHR2a_S2c0" \
  -t europe-west1-docker.pkg.dev/david-irie-photographie/cloud-run-source-deploy/david-irie-photographie:latest \
  .

echo "📤 Push de l'image vers Google Container Registry..."
docker push europe-west1-docker.pkg.dev/david-irie-photographie/cloud-run-source-deploy/david-irie-photographie:latest

echo "🚀 Déploiement sur Cloud Run..."
gcloud run deploy david-irie-photographie \
  --image europe-west1-docker.pkg.dev/david-irie-photographie/cloud-run-source-deploy/david-irie-photographie:latest \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated

echo "✅ Déploiement terminé!"
echo "🌐 Teste maintenant: https://david-irie-photographie-ysgycp323q-ew.a.run.app/#/galeries-privees"
