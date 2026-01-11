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
