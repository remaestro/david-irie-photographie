#!/bin/bash

# Déployer la Cloud Function pour supprimer les fichiers de Backblaze B2

echo "🚀 Déploiement de deleteFromBackblaze..."

cd cloud-functions/deleteFromBackblaze

gcloud functions deploy deleteFromBackblaze \
  --gen2 \
  --runtime=nodejs22 \
  --region=europe-west1 \
  --source=. \
  --entry-point=deleteFromBackblaze \
  --trigger-http \
  --allow-unauthenticated \
  --set-env-vars B2_ENDPOINT=s3.us-west-004.backblazeb2.com,B2_BUCKET_NAME=david-irie-photographie,B2_REGION=us-west-004 \
  --set-secrets B2_KEY_ID=B2_KEY_ID:latest,B2_APPLICATION_KEY=B2_APPLICATION_KEY:latest

echo "✅ Déploiement terminé!"
