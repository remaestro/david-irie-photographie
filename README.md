# 📸 David Irie Photographie

Site web professionnel pour photographe avec galeries privées.

## 🚀 Déploiement Rapide

```bash
# 1. Développer en local
npm run dev

# 2. Déployer sur Google Cloud
./deploy.sh

# 3. Pousser le code sur GitHub (optionnel)
git push
```

**📖 [Guide complet de déploiement →](./GUIDE_DEPLOIEMENT.md)**

---

## 🎯 Workflow

- **GitHub** = Code source uniquement (pas de déploiement automatique)
- **Déploiement** = Local avec `./deploy.sh` → Google Cloud Run
- **Secrets** = Stockés dans Google Secret Manager

## 📚 Documentation

- **[GUIDE_DEPLOIEMENT.md](./GUIDE_DEPLOIEMENT.md)** - Guide rapide
- **[DEPLOYMENT_LOCAL.md](./DEPLOYMENT_LOCAL.md)** - Guide complet
- **[SECRETS_SETUP.md](./SECRETS_SETUP.md)** - Gestion des secrets
- **[PUSH_SECURISE.md](./PUSH_SECURISE.md)** - Push sans risque
- **[DIAGNOSTIC_SUPABASE.md](./DIAGNOSTIC_SUPABASE.md)** - Dépannage

## 🔧 Développement

```bash
# Installation
npm install

# Dev local
npm run dev         # → http://localhost:5173

# Build
npm run build

# Lint
npm run lint
```

## 🌐 Production

**URL:** https://david-irie-photographie-208603494308.europe-west1.run.app

**Galeries privées:** https://david-irie-photographie-208603494308.europe-west1.run.app/#/galeries-privees

---

## 🛡️ Sécurité

✅ Secrets stockés dans Google Secret Manager  
✅ Fichiers sensibles dans `.gitignore`  
✅ Pas de secrets dans le code  
✅ GitHub Actions désactivé  

---

**Note:** Ce projet utilise React + Vite avec déploiement manuel sur Google Cloud Run.
