# Actions nécessaires - Gestion des catégories et suppression de photos

## 1. Migration Supabase - Table gallery_categories

Allez sur: https://supabase.com/dashboard/project/fjdkdoantfcwbnsqghlj/sql

Exécutez le SQL suivant:

```sql
-- Table pour stocker les catégories de chaque galerie
CREATE TABLE gallery_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id UUID NOT NULL REFERENCES galleries(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(gallery_id, name)
);

-- Index pour performance
CREATE INDEX idx_gallery_categories_gallery_id ON gallery_categories(gallery_id);
CREATE INDEX idx_gallery_categories_order ON gallery_categories(gallery_id, order_index);

-- Commentaire
COMMENT ON TABLE gallery_categories IS 'Catégories définies par l''admin pour organiser les photos';
COMMENT ON COLUMN gallery_categories.name IS 'Nom de la catégorie (ex: Entrée de la mariée, Cocktail)';
```

## 2. Déployer la Cloud Function deleteFromBackblaze

Exécutez:

```bash
./deploy-delete-function.sh
```

## 3. Test

Une fois fait, testez:
- ✅ Créer une catégorie
- ✅ Upload une photo dans une catégorie
- ✅ Supprimer une photo (vérifie que le fichier est supprimé de Backblaze)
- ✅ Supprimer une catégorie vide
- ✅ Les catégories vides s'affichent

## Fonctionnalités

### Gestion des catégories
- ✅ Les catégories sont stockées en base de données
- ✅ L'admin peut créer/supprimer des catégories
- ✅ Les catégories vides sont visibles
- ✅ Impossible de supprimer une catégorie qui contient des photos

### Suppression de photos
- ✅ Bouton de suppression sur chaque photo
- ✅ Suppression sur Backblaze B2 (Cloud Function)
- ✅ Suppression en base Supabase
- ✅ Rafraîchissement automatique de l'interface
