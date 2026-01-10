#!/bin/bash

# 🚀 DÉPLOIEMENT CLOUD RUN AVEC SUPABASE
# Ce script met à jour Cloud Run avec les variables Supabase

echo "🔧 Mise à jour des variables d'environnement Cloud Run..."
echo ""

gcloud run services update david-irie-photographie \
  --region europe-west1 \
  --update-env-vars "VITE_SUPABASE_URL=https://fjdkdoantfcwbnsqghlj.supabase.co,VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqZGtkb2FudGZjd2Juc3FnaGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5OTU2OTUsImV4cCI6MjA4MzU3MTY5NX0.qsUusyb3yvWE9C4386VhmHhOm4qaFTFmzAHR2a_S2c0"

echo ""
echo "✅ Variables Supabase ajoutées!"
echo "🌐 Teste ton site maintenant"
