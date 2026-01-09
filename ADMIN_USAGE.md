# 📚 Guide d'utilisation - Interface Admin

## 🔐 Connexion Admin

1. Aller sur la page **Galeries Privées**
2. Entrer le mot de passe admin : `admin2026david`
3. Cliquer sur "Accéder à ma galerie"

## ✨ Créer une nouvelle galerie

1. Cliquer sur **"➕ Créer nouvelle galerie"**
2. Remplir le formulaire :
   - **Nom** : ex. "Mariage Sarah & Antoine"
   - **Type** : Mariage, Couple, Événement, Corporate, ou Autre
   - **Date** : Date de l'événement
   - **Mot de passe** : Généré automatiquement (peut être modifié)
   - **Expiration** : Nombre de jours avant expiration (défaut: 90 jours)
3. Cliquer sur **"✨ Créer la galerie"**

## 📤 Ajouter des photos à une galerie

1. Cliquer sur **"👁️ Voir"** sur une galerie
2. Une fenêtre d'upload s'ouvre
3. **Glisser-déposer** des photos dans la zone ou cliquer pour sélectionner
4. Les photos sont automatiquement **compressées** et **uploadées** vers Backblaze B2
5. Une barre de progression affiche l'état de l'upload

## 🗑️ Supprimer une galerie

1. Cliquer sur **"🗑️ Supprimer"** sur une galerie
2. Confirmer la suppression
3. ⚠️ **Attention** : Cette action est irréversible !

## 👥 Accès Client

1. Partager le **mot de passe de la galerie** avec votre client
2. Le client entre ce mot de passe sur la page Galeries Privées
3. Il accède uniquement à sa galerie privée
4. Il peut voir et télécharger ses photos

## 💾 Stockage des données

- Les métadonnées des galeries sont stockées dans le **localStorage** du navigateur
- Les photos sont uploadées sur **Backblaze B2**
- ⚠️ Ne pas vider le cache du navigateur pour conserver les données

## 🔧 Conseils

- Utilisez des **mots de passe simples** pour vos clients (ex: "sarah2025")
- Le bouton **📋** copie le mot de passe dans le presse-papier
- Les images sont compressées à max **1920px** et **85% qualité**
- Uploadez jusqu'à **50 photos** à la fois pour de meilleures performances

---

**Version** : 1.0  
**Date** : Janvier 2026
