# 🚀 DÉPLOIEMENT AUTOMATIQUE LOCAL - CONFIGURÉ!

**Date:** 10 Janvier 2026  
**Statut:** ✅ ACTIF

---

## ✅ CE QUI EST CONFIGURÉ

Tu as maintenant **3 façons de déployer**:

### 1️⃣ **`git push`** - Déploie automatiquement
```bash
git add -A
git commit -m "Mon commit"
git push
# ✅ Push vers GitHub
# ✅ Déploiement automatique lancé!
```

**Quand:** À chaque push  
**Durée:** ~5 minutes  
**Avantage:** Automatique  
**Inconvénient:** Tu dois attendre à chaque push

---

### 2️⃣ **`git deploy`** - Push main + déploie
```bash
git add -A
git commit -m "Mon commit"
git deploy
# ✅ Push vers main
# ✅ Déploiement lancé
```

**Quand:** Quand tu veux déployer  
**Durée:** ~5 minutes  
**Avantage:** Tu choisis quand déployer

---

### 3️⃣ **`git push-deploy`** - Push + déploie (toute branche)
```bash
git add -A
git commit -m "Mon commit"
git push-deploy origin ma-branche
# ✅ Push vers n'importe quelle branche
# ✅ Déploiement lancé
```

**Quand:** Pour déployer depuis une autre branche  
**Durée:** ~5 minutes

---

## 💡 RECOMMANDATION D'USAGE

### Développement quotidien:
```bash
# Modifications rapides sans déployer
git add -A
git commit -m "WIP: Travail en cours"
git push --no-verify    # Skip le hook, pas de déploiement
```

### Quand tu veux déployer:
```bash
git add -A
git commit -m "feat: Nouvelle fonctionnalité"
git deploy              # Push + déploie
```

### Push normal (avec déploiement auto):
```bash
git add -A  
git commit -m "fix: Correction bug"
git push                # Déploie automatiquement
```

---

## 🛠️ GESTION DU HOOK

### Désactiver le déploiement automatique:
```bash
rm .git/hooks/post-push
# Maintenant "git push" ne déploiera plus automatiquement
```

### Réactiver le déploiement automatique:
```bash
./setup-git-deploy.sh
# Réinstalle le hook
```

### Vérifier si le hook est actif:
```bash
ls -la .git/hooks/post-push && echo "✅ Hook actif" || echo "❌ Hook inactif"
```

---

## 📊 COMMENT ÇA MARCHE

### Git Hook (post-push):
- Se déclenche **après** un `git push` réussi
- Exécute `./deploy-cloud-build.sh`
- Attend la fin du déploiement
- Affiche les logs en temps réel

### Git Alias:
- `git deploy` = `git push origin main && ./deploy-cloud-build.sh`
- `git push-deploy` = `git push <args> && ./deploy-cloud-build.sh`

---

## ⚠️ NOTES IMPORTANTES

### Le déploiement prend du temps:
- Build Docker: ~2 minutes
- Push Container Registry: ~30 secondes
- Déploiement Cloud Run: ~1 minute
- **Total: ~3-5 minutes**

### Pendant le déploiement:
- ✅ Ton terminal affiche les logs
- ✅ Tu peux voir la progression
- ❌ Ne ferme pas le terminal!
- ❌ Tu ne peux pas faire d'autres commandes

### Si tu veux continuer à travailler:
```bash
# Option 1: Ouvre un nouveau terminal
cmd+t (ou ctrl+shift+t)

# Option 2: Déploie en arrière-plan
./deploy-cloud-build.sh &
```

---

## 🎯 WORKFLOW RECOMMANDÉ

### Pour des petites modifications (pas de déploiement):
```bash
git add -A
git commit -m "docs: Update README"
git push --no-verify    # Skip le hook
```

### Pour des fonctionnalités terminées (déploiement):
```bash
git add -A
git commit -m "feat: Nouvelle galerie"
git deploy              # OU git push (déploie auto)
```

### Pour tester avant de déployer:
```bash
npm run build           # Build local
npm run dev             # Test local
# Si tout est OK:
git deploy              # Déploie
```

---

## 🔄 DÉSINSTALLATION

Si tu veux revenir au déploiement manuel uniquement:

```bash
# Supprimer le hook
rm .git/hooks/post-push

# Supprimer les alias
git config --unset alias.deploy
git config --unset alias.push-deploy
```

Ensuite, utilise simplement:
```bash
./deploy-cloud-build.sh
```

---

## 📋 RÉSUMÉ

| Commande | Action | Déploiement |
|----------|--------|-------------|
| `git push` | Push vers GitHub | ✅ Auto |
| `git push --no-verify` | Push sans déployer | ❌ Non |
| `git deploy` | Push main + déploie | ✅ Oui |
| `git push-deploy` | Push branche + déploie | ✅ Oui |
| `./deploy-cloud-build.sh` | Déploie seulement | ✅ Oui |

---

## ✅ TU ES PRÊT!

**Teste maintenant:**
```bash
# Fais une petite modification
echo "# Test" >> README.md
git add README.md
git commit -m "test: Auto-deploy"
git deploy
# ✅ Regarde le déploiement se lancer!
```

**Besoin d'aide?** Dis-moi! 😊
