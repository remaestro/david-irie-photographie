# ✅ CHECKLIST DE TEST - Interface Admin

## 🎯 Tests à effectuer (dans l'ordre)

### 1️⃣ DÉMARRER L'APPLICATION
```bash
npm run dev
```
- ✅ Le serveur démarre sans erreur
- ✅ Ouvrir http://localhost:5173 (ou le port affiché)

---

### 2️⃣ TEST ACCÈS CLIENT (mode normal)

1. Aller sur **Galeries Privées** (menu navigation)
2. Tu vois la page de connexion avec le formulaire de mot de passe
3. Essayer un mauvais mot de passe (ex: "test123")
   - ✅ Message d'erreur: "Mot de passe incorrect"
4. **Pour l'instant, il n'y a pas de galerie client** (c'est normal, localStorage vide)

---

### 3️⃣ TEST CONNEXION ADMIN ⭐

1. Dans le formulaire, entrer: `admin2026david`
2. Cliquer sur "Accéder à ma galerie"
3. **✅ Tu dois voir:**
   - Titre: "🎨 Administration - Galeries Privées"
   - Bouton: "➕ Créer nouvelle galerie"
   - Bouton: "🚪 Déconnexion"
   - Message: "Aucune galerie pour le moment"
   - Grand emoji 📸

---

### 4️⃣ TEST CRÉATION DE GALERIE ⭐⭐

1. Cliquer sur **"➕ Créer nouvelle galerie"**
2. **✅ Une fenêtre modale s'ouvre** avec:
   - Champ "Nom de la galerie"
   - Menu déroulant "Type" (Mariage, Couple, etc.)
   - Champ "Date de l'événement"
   - Champ "Mot de passe client" (pré-rempli automatiquement)
   - Champ "Expiration (jours)" (90 par défaut)

3. Remplir le formulaire:
   - **Nom**: "Test Mariage Sarah"
   - **Type**: Mariage 💍
   - **Date**: Choisir une date
   - **Mot de passe**: Laisser celui généré (ex: "abc12345") ou le changer
   - Cliquer sur **"✨ Créer la galerie"**

4. **✅ Tu dois voir:**
   - La modale se ferme
   - Toast vert en haut à droite: "✅ Galerie créée avec succès !"
   - Une carte de galerie apparaît dans le dashboard

---

### 5️⃣ TEST CARTE DE GALERIE ⭐

**✅ Sur la carte créée, tu dois voir:**
- Le titre: "💍 Test Mariage Sarah"
- La date de l'événement
- "📸 0 photo" (normal, vide pour l'instant)
- "🔑 Mot de passe: abc12345" (ou celui généré)
- Bouton "📋" pour copier le mot de passe
- Bouton "👁️ Voir"
- Bouton "🗑️ Supprimer"

**Test copie mot de passe:**
- Cliquer sur le bouton 📋
- ✅ Alert: "Mot de passe copié: abc12345"

---

### 6️⃣ TEST UPLOAD DE PHOTOS ⭐⭐⭐ (LE PLUS IMPORTANT!)

1. Cliquer sur **"👁️ Voir"** sur ta galerie
2. **✅ Une fenêtre d'upload s'ouvre:**
   - Titre: "📤 Ajouter des photos"
   - Nom de la galerie affiché
   - Zone de drag & drop avec emoji 📸

3. **Test 1 - Drag & Drop:**
   - Glisser 2-3 photos dans la zone
   - ✅ La zone devient verte avec "📤 Déposez les photos ici..."
   - Relâcher les photos

4. **Test 2 - Cliquer pour sélectionner:**
   - Cliquer dans la zone
   - Sélectionner 2-3 photos JPG/PNG
   - Cliquer "Ouvrir"

5. **✅ Pendant l'upload, tu dois voir:**
   - Emoji ⏳
   - "Upload en cours..."
   - **Barre de progression verte** qui se remplit
   - "1 / 3 photos" (puis 2/3, puis 3/3)

6. **✅ Après l'upload:**
   - Message vert: "✅ 3 photos uploadées avec succès !"
   - Les previews disparaissent

7. **Fermer la fenêtre (X)**

8. **✅ Retour au dashboard:**
   - La carte affiche maintenant "📸 3 photos"
   - La première photo devient l'image de couverture de la carte

---

### 7️⃣ TEST VÉRIFICATION BACKBLAZE B2 ⭐⭐

1. Aller sur ton compte Backblaze B2
2. Naviguer dans le bucket `david-irie-photo`
3. **✅ Tu dois voir un nouveau dossier:**
   ```
   galeries/
     └── test-mariage-sarah-[id]/
         ├── 1736430123000-photo1.jpg
         ├── 1736430124000-photo2.jpg
         └── 1736430125000-photo3.jpg
   ```

---

### 8️⃣ TEST ACCÈS CLIENT AVEC MOT DE PASSE ⭐⭐

1. Cliquer sur **"🚪 Déconnexion"**
2. Tu reviens à la page de login
3. Entrer le **mot de passe de la galerie créée** (ex: "abc12345")
4. Cliquer "Accéder à ma galerie"

5. **✅ Tu dois voir (mode CLIENT):**
   - Titre: "Test Mariage Sarah"
   - Date de l'événement
   - "📸 3 photos"
   - **Grille des 3 photos uploadées**
   - Bouton "Déconnexion"

6. **Test lightbox:**
   - Cliquer sur une photo
   - ✅ La photo s'agrandit en plein écran
   - Flèches pour naviguer entre photos
   - ESC ou X pour fermer

7. **Test téléchargement:**
   - Survoler une photo
   - Overlay noir apparaît avec 2 boutons
   - Cliquer "⬇️ Télécharger"
   - ✅ La photo se télécharge

---

### 9️⃣ TEST SUPPRESSION DE GALERIE ⭐

1. Se reconnecter en admin (`admin2026david`)
2. Cliquer sur **"🗑️ Supprimer"** sur la galerie test
3. **✅ Confirmation popup**: "Êtes-vous sûr de vouloir supprimer..."
4. Cliquer "OK"
5. **✅ Tu dois voir:**
   - Toast vert: "✅ Galerie supprimée"
   - La carte disparaît
   - Retour à l'état vide "Aucune galerie pour le moment"

---

### 🔟 TEST PERSISTANCE (localStorage) ⭐

1. Créer une nouvelle galerie (comme à l'étape 4)
2. **Rafraîchir la page** (F5)
3. Se reconnecter en admin
4. **✅ La galerie est toujours là !**

---

### 1️⃣1️⃣ TEST RESPONSIVE (Mobile) 📱

1. Ouvrir les DevTools (F12)
2. Activer le mode mobile (icône smartphone)
3. Tester l'interface sur différentes tailles
4. **✅ Tout doit s'adapter:**
   - Dashboard empilé verticalement
   - Boutons pleine largeur
   - Cartes en 1 colonne
   - Modal d'upload adapté

---

## 🎯 RÉSULTAT ATTENDU

Si **TOUS ces tests passent**, alors l'interface admin fonctionne parfaitement ! 🎉

### ⚠️ Si quelque chose ne marche pas:

**Vérifie dans la console (F12 > Console):**
- Erreurs en rouge ?
- Problème de connexion à Backblaze ?
- Problème de localStorage ?

**Erreurs communes possibles:**
1. **Upload ne marche pas** → Vérifier que la Cloud Function est bien déployée
2. **Photos n'apparaissent pas** → Vérifier les URLs Backblaze
3. **Galeries disparaissent** → Vérifier localStorage du navigateur
4. **Modale ne s'ouvre pas** → Vérifier erreurs CSS/JS

---

## 📸 Ce que tu dois voir en images:

### 1. Dashboard Admin vide:
- Grande carte grise avec emoji 📸
- "Aucune galerie pour le moment"

### 2. Après création:
- Carte avec photo de couverture (après upload)
- Boutons "Voir" et "Supprimer"
- Mot de passe affiché

### 3. Upload modal:
- Zone en pointillés
- Barre de progression verte
- Compteur "X / Y photos"

### 4. Vue client:
- Grille de photos (4-3 ratio)
- Overlay au hover
- Lightbox au clic

---

**Temps estimé pour tous les tests: 10-15 minutes** ⏱️

Bonne chance ! 🚀
