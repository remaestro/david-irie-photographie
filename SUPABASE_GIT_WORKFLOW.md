# 🚀 Workflow Git pour Supabase

## 📌 Problème résolu

La CLI Supabase nécessite des permissions Management API que votre compte ne possède pas. 
Solution : déployer vos migrations SQL directement via un script Node.js.

## ✅ Comment ça marche

1. **Modifiez votre schéma** : Éditez `supabase-schema.sql`
2. **Committez dans Git** : `git add . && git commit -m "Update schema"`
3. **Déployez vers Supabase** : `npm run db:push`

## 🔧 Configuration requise

Ajoutez votre **Service Role Key** dans `.env` :

```env
VITE_SUPABASE_URL=https://lqewrvxuiuvkwpspbjtt.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # ← À ajouter
```

**Où trouver votre Service Role Key** :
1. Dashboard Supabase → Project Settings
2. API → Project API keys
3. Copiez la clé `service_role` (⚠️ JAMAIS la committer dans Git!)

## 📝 Commandes disponibles

```bash
# Déployer le schéma complet vers Supabase
npm run db:push

# Alias
npm run db:migrate
```

## 🎯 Workflow complet

```bash
# 1. Modifier le schéma
code supabase-schema.sql

# 2. Déployer vers Supabase
npm run db:push

# 3. Committer les changements
git add supabase-schema.sql
git commit -m "Add new table for categories"
git push
```

## ⚠️ Important

- Le script est **idempotent** : vous pouvez le lancer plusieurs fois sans risque
- Les éléments existants seront ignorés
- Toujours **tester localement** avant de déployer en production

## 🔐 Sécurité

**NEVER commit `.env` to Git!**

Vérifiez que `.env` est dans `.gitignore` :
```bash
echo ".env" >> .gitignore
```

