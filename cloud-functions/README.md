# Cloud Functions - David Irie Photographie

Ce dossier contient les Cloud Functions (équivalent Netlify Functions).

## Déploiement

Chaque fonction se déploie séparément:

```bash
# sendEmail
gcloud functions deploy sendEmail \
  --runtime nodejs22 \
  --trigger-http \
  --allow-unauthenticated \
  --region europe-west1 \
  --entry-point sendEmail \
  --source cloud-functions/sendEmail

# uploadToCloudinary
gcloud functions deploy uploadToCloudinary \
  --runtime nodejs22 \
  --trigger-http \
  --allow-unauthenticated \
  --region europe-west1 \
  --entry-point uploadToCloudinary \
  --source cloud-functions/uploadToCloudinary

# uploadToBackblaze
gcloud functions deploy uploadToBackblaze \
  --runtime nodejs22 \
  --trigger-http \
  --allow-unauthenticated \
  --region europe-west1 \
  --entry-point uploadToBackblaze \
  --source cloud-functions/uploadToBackblaze

# cleanOldGalleries (scheduled)
gcloud functions deploy cleanOldGalleries \
  --runtime nodejs22 \
  --trigger-topic clean-galleries-daily \
  --region europe-west1 \
  --entry-point cleanOldGalleries \
  --source cloud-functions/cleanOldGalleries
```

## Variables d'environnement

Configurer avec:

```bash
gcloud functions deploy FUNCTION_NAME \
  --set-env-vars GMAIL_USER=xxx,GMAIL_APP_PASSWORD=xxx
```
