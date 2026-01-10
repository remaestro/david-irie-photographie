# 👨‍💼 INTERFACE ADMIN - GALERIES PRIVÉES

## 🎯 Comment accéder à l'admin

### En local (développement):
1. Ouvre: http://localhost:5174/#/galeries-privees
2. Entre le mot de passe: `admin2026david`
3. Clique "Accéder à ma galerie"
4. ✅ Tu es maintenant dans l'interface admin!

### En production (après déploiement):
1. Ouvre: https://ton-site.run.app/#/galeries-privees
2. Entre le mot de passe: `admin2026david`
3. ✅ Interface admin accessible!

---

## 📋 Ce que tu peux faire dans l'admin

### 1. Créer une nouvelle galerie
1. Clique sur **"➕ Créer nouvelle galerie"**
2. Remplis le formulaire:
   ```
   Nom: "Mariage Sarah & Thomas"
   Type: Mariage
   Date de l'événement: 14/02/2026
   Mot de passe client: test123
   Expiration: 90 jours (par défaut)
   ```
3. Clique **"Créer la galerie"**
4. ✅ La galerie est créée dans Supabase!

### 2. Voir toutes les galeries
- Liste complète visible dans le dashboard
- Informations affichées:
  - 📅 Nom de la galerie
  - 📸 Nombre de photos
  - 🔑 Mot de passe du client
  - 📆 Date de création

### 3. Ajouter des photos à une galerie
1. Clique sur une galerie dans le dashboard
2. Le GalleryUploader s'ouvre
3. Upload les photos vers Backblaze B2
4. ✅ Photos ajoutées automatiquement

### 4. Supprimer une galerie
1. Clique sur **"🗑️ Supprimer"** sur une galerie
2. Confirme la suppression
3. ✅ Galerie supprimée de Supabase

---

## 🔐 Comment fonctionne l'accès client?

### Pour donner accès à un client:

1. **Tu crées la galerie** (en admin)
2. **Tu notes le mot de passe** généré (ex: `test123`)
3. **Tu envoies au client par email:**
   ```
   Bonjour Sarah & Thomas,

   Vos photos sont prêtes! 📸

   Accédez à votre galerie privée:
   https://david-irie-photo.run.app/#/galeries-privees

   Mot de passe: test123

   La galerie sera accessible pendant 90 jours.

   Cordialement,
   David Irie
   ```

4. **Le client se connecte:**
   - Ouvre le lien
   - Entre `test123`
   - ✅ Voit ses photos!

---

## 📊 Où sont stockées les données?

### Avant (localStorage):
- ❌ Stockage dans le navigateur
- ❌ Perdu si cache vidé
- ❌ Pas de backup

### Maintenant (Supabase):
- ✅ Base de données PostgreSQL
- ✅ Backup automatique
- ✅ Accessible de partout
- ✅ Sécurisé avec RLS

### Vérifier dans Supabase:
1. Va sur: https://supabase.com/dashboard/project/fjdkdoantfcwbnsqghlj/editor
2. Clique sur **Table Editor**
3. Sélectionne **galleries**
4. 🎉 Tu vois toutes tes galeries!

---

## 🎨 Workflow complet

```
1. CLIENT TE CONTACTE
   ↓
2. TU FAIS LA SÉANCE PHOTO
   ↓
3. TU RETOUCHES LES PHOTOS
   ↓
4. TU TE CONNECTES À L'ADMIN
   - Mot de passe: admin2026david
   ↓
5. TU CRÉES LA GALERIE
   - Nom: "Mariage Sarah & Thomas"
   - Type: Mariage
   - Password: test123
   ↓
6. TU UPLOADES LES PHOTOS
   - Via GalleryUploader
   - Stockage: Backblaze B2
   ↓
7. TU ENVOIES LE LIEN AU CLIENT
   - URL: /galeries-privees
   - Password: test123
   ↓
8. CLIENT VOIT SES PHOTOS
   - Peut les voir en grand
   - Peut les télécharger
   ↓
9. APRÈS 90 JOURS
   - Galerie expire automatiquement
```

---

## 🧪 Test maintenant!

### Étape 1: Connecte-toi en admin
```bash
# Le dev server tourne déjà
# Ouvre: http://localhost:5174/#/galeries-privees
# Password: admin2026david
```

### Étape 2: Crée une galerie test
```
Nom: Test Galerie
Type: Mariage
Date: Aujourd'hui
Password: test123
```

### Étape 3: Vérifie dans Supabase
```
URL: https://supabase.com/dashboard/project/fjdkdoantfcwbnsqghlj/editor
Table: galleries
✅ Ta galerie devrait apparaître!
```

### Étape 4: Teste l'accès client
```
1. Déconnecte-toi (bouton Déconnexion)
2. Entre le password: test123
3. ✅ Tu vois la galerie client (vide pour l'instant)
```

---

## 🔒 Sécurité

### Mot de passe admin:
- `admin2026david` (changeable dans le code)
- Seul toi connais ce password
- Donne accès à TOUTES les galeries

### Mot de passe client:
- Unique par galerie (ex: `test123`)
- Donne accès à UNE SEULE galerie
- Tu le génères lors de la création
- Tu l'envoies au client par email

### Expiration:
- Galeries expirent après 90 jours (par défaut)
- Client ne peut plus accéder après expiration
- Tu peux changer la durée à la création

---

## ❓ Questions fréquentes

**Q: Le client peut voir les galeries des autres?**  
R: Non! Chaque password donne accès à UNE SEULE galerie.

**Q: Je peux avoir plusieurs admins?**  
R: Pour l'instant non, un seul password admin. Dis-moi si tu veux plusieurs admins!

**Q: Où sont stockées les photos?**  
R: Backblaze B2 (pas dans Supabase). Supabase stocke juste les URLs.

**Q: Je peux modifier une galerie après création?**  
R: Actuellement tu peux ajouter/supprimer, pas modifier. Dis-moi si tu veux cette fonction!

**Q: Combien de galeries je peux créer?**  
R: Illimité! Supabase free tier = 500MB de database (largement suffisant).

---

## 🎉 C'est tout!

Tu es prêt à utiliser l'interface admin! 

**Teste maintenant:** http://localhost:5174/#/galeries-privees

**Besoin d'aide?** Dis-moi! 😊
