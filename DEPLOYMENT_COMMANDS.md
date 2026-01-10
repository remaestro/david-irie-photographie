# 🚀 DEPLOYMENT COMMANDS - Copy & Paste

## Your Docker image is building with tag:
```
122237f696a7e5fb493980b65e5b4f55190fa58d
```

## Once build completes, run these commands:

### Step 1: Push image to registry
```bash
docker push europe-west1-docker.pkg.dev/david-irie-photographie/cloud-run-source-deploy/david-irie-photographie:122237f696a7e5fb493980b65e5b4f55190fa58d
```

### Step 2: Deploy to Cloud Run with ALL environment variables
```bash
gcloud run deploy david-irie-photographie \
  --image europe-west1-docker.pkg.dev/david-irie-photographie/cloud-run-source-deploy/david-irie-photographie:122237f696a7e5fb493980b65e5b4f55190fa58d \
  --region europe-west1 \
  --platform managed \
  --allow-unauthenticated \
  --set-env-vars "VITE_SUPABASE_URL=https://fjdkdoantfcwbnsqghlj.supabase.co,VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZqZGtkb2FudGZjd2Juc3FnaGxqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc5OTU2OTUsImV4cCI6MjA4MzU3MTY5NX0.qsUusyb3yvWE9C4386VhmHhOm4qaFTFmzAHR2a_S2c0,GMAIL_USER=contactphotodavidirie@gmail.com,GMAIL_APP_PASSWORD=tkwqfrrkaxasxqti,B2_KEY_ID=005aad79fa06b9e0000000001,B2_APPLICATION_KEY=K00521ST3tfdiv/eP9IFfBxTsmkdovw,B2_BUCKET_NAME=david-irie-photo,B2_ENDPOINT=s3.us-east-005.backblazeb2.com,B2_REGION=us-east-005"
```

## ✅ Environment Variables Included:
- ✅ Supabase URL & API Key (NEW!)
- ✅ Gmail SMTP credentials
- ✅ Backblaze B2 credentials

---

**After deployment, test at: https://david-irie-photographie-xxxxx-ew.a.run.app**
