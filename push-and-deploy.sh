#!/bin/bash

# 🚀 PUSH + DÉPLOIEMENT AUTOMATIQUE
# Usage: ./push-and-deploy.sh

set -e

echo "╔════════════════════════════════════════════╗"
echo "║     📤 PUSH & DÉPLOIEMENT AUTOMATIQUE     ║"
echo "╚════════════════════════════════════════════╝"
echo ""

# Push vers GitHub
echo "📤 Push vers GitHub..."
git push origin main

echo ""
echo "✅ Code poussé sur GitHub"
echo ""

# Déploiement automatique
echo "🚀 Lancement du déploiement Cloud Run..."
echo ""
./deploy.sh

echo ""
echo "╔════════════════════════════════════════════╗"
echo "║    ✅ PUSH & DÉPLOIEMENT TERMINÉS!        ║"
echo "╚════════════════════════════════════════════╝"
