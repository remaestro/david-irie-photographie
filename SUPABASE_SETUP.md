# 🚀 SUPABASE SETUP - QUICK START

This guide will help you set up Supabase for the private galleries feature.

## Step 1: Create Supabase Account

1. Go to: https://supabase.com/dashboard
2. Click "Start your project"
3. Sign in with GitHub (recommended)
4. Click "New Project"

## Step 2: Configure Your Project

```
Project Name:      david-irie-photographie
Database Password: [Generate a strong password - SAVE THIS!]
Region:           Europe (Frankfurt) - eu-central-1
Pricing Plan:     Free (500 MB storage)
```

## Step 3: Get Your Credentials

After project creation (takes ~2 minutes):

1. Go to **Project Settings** (gear icon on left sidebar)
2. Go to **API** section
3. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** API key (starts with `eyJh...`)

## Step 4: Update .env File

Edit `/Users/adioyeremi/david-irie-photographie/.env`:

```bash
# Replace with your actual values:
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Step 5: Create Database Schema

1. In Supabase Dashboard, go to **SQL Editor** (left sidebar)
2. Click **New Query**
3. Copy the entire content of `supabase-schema.sql`
4. Paste it into the SQL Editor
5. Click **Run** (or press Ctrl/Cmd + Enter)

You should see: "Success. No rows returned"

## Step 6: Verify Tables Created

1. Go to **Table Editor** (left sidebar)
2. You should see 3 tables:
   - `galleries`
   - `photos`
   - `gallery_views`

## Step 7: Test Locally

```bash
cd /Users/adioyeremi/david-irie-photographie
npm run dev
```

Navigate to: http://localhost:5173/galeries-privees

## Step 8: Deploy to Cloud Run

```bash
# Build the app
npm run build

# Deploy with Supabase env vars
gcloud run deploy david-irie-photographie \
  --source . \
  --region=europe-west1 \
  --allow-unauthenticated \
  --set-env-vars "VITE_SUPABASE_URL=https://your-project-id.supabase.co,VITE_SUPABASE_ANON_KEY=your-anon-key"
```

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Check that `.env` has `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- Restart dev server after editing `.env`

### Error: "new row violates row-level security policy"
- Make sure you ran the entire `supabase-schema.sql`
- Check that RLS policies are created in Table Editor > Policies

### Photos don't display
- Verify Backblaze B2 URLs are public and accessible
- Check browser console for CORS errors

## Next Steps

Once Supabase is set up:
1. The code is already configured to use Supabase
2. Admin interface will work at `/galeries-privees` with password: `admin2026david`
3. You can create galleries and upload photos through the admin UI

## Files Created

- ✅ `src/config/supabase.js` - Supabase client configuration
- ✅ `supabase-schema.sql` - Database schema (run this in Supabase)
- ✅ `.env` - Updated with Supabase placeholders

## Documentation

- Supabase Docs: https://supabase.com/docs
- JavaScript Client: https://supabase.com/docs/reference/javascript
