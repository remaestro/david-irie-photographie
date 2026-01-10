#!/bin/bash

# 🔧 SETUP GIT HOOKS ET ALIAS

echo "🔧 Configuration Git pour déploiement automatique..."
echo ""

# Option 1: Git Hook (auto-deploy sur chaque push)
echo "1️⃣ Installation du Git Hook..."

cat > .git/hooks/post-push << 'HOOK'
#!/bin/bash
echo ""
echo "🚀 Push réussi! Lancement du déploiement..."
echo ""
./deploy-cloud-build.sh
echo ""
echo "✅ Déploiement terminé!"
HOOK

chmod +x .git/hooks/post-push
echo "   ✅ Git hook installé (s'exécute après chaque push)"
echo ""

# Option 2: Alias git deploy
echo "2️⃣ Configuration de l'alias 'git deploy'..."

git config alias.deploy '!git push origin main && ./deploy-cloud-build.sh'
echo "   ✅ Alias configuré: git deploy"
echo ""

# Option 3: Alias git push-deploy
echo "3️⃣ Configuration de l'alias 'git push-deploy'..."

git config alias.push-deploy '!f() { git push "$@" && ./deploy-cloud-build.sh; }; f'
echo "   ✅ Alias configuré: git push-deploy"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "✅ CONFIGURATION TERMINÉE!"
echo ""
echo "📋 TU PEUX MAINTENANT UTILISER:"
echo ""
echo "1. git push          → Push + déploie automatiquement"
echo "2. git deploy        → Push main + déploie"
echo "3. git push-deploy   → Push + déploie (n'importe quelle branche)"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "💡 RECOMMANDATION:"
echo "   - Utilise 'git push' normalement"
echo "   - Utilise 'git deploy' quand tu veux déployer"
echo ""
echo "⚠️  SI TU VEUX DÉSACTIVER LE HOOK AUTO:"
echo "   rm .git/hooks/post-push"
echo ""
