-- Ajouter la colonne category à la table photos
ALTER TABLE photos ADD COLUMN category TEXT;

-- Ajouter un index pour les catégories
CREATE INDEX idx_photos_category ON photos(category);

-- Commentaire
COMMENT ON COLUMN photos.category IS 'Catégorie de la photo (ex: Entrée de la mariée, Cocktail, etc.)';
