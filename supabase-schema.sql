-- ============================================
-- SUPABASE DATABASE SCHEMA
-- Project: David Irie Photographie
-- Description: Tables for private galleries
-- ============================================

-- ============================================
-- TABLE: galleries
-- Description: Stocke les informations des galeries privées
-- ============================================
CREATE TABLE galleries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('mariage', 'couple', 'evenements', 'shooting-strobist', 'shooting-exterieur', 'shooting-studio')),
  event_date DATE,
  password TEXT NOT NULL,
  cover_image_url TEXT,
  expiration_date TIMESTAMP WITH TIME ZONE,
  is_expired BOOLEAN DEFAULT FALSE,
  views_count INTEGER DEFAULT 0,
  last_viewed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour performance
CREATE INDEX idx_galleries_password ON galleries(password);
CREATE INDEX idx_galleries_expiration ON galleries(expiration_date) WHERE NOT is_expired;
CREATE INDEX idx_galleries_created_at ON galleries(created_at DESC);

-- Commentaires
COMMENT ON TABLE galleries IS 'Galeries privées pour les clients';
COMMENT ON COLUMN galleries.password IS 'Mot de passe simple pour accès client';
COMMENT ON COLUMN galleries.expiration_date IS 'Date d''expiration calculée automatiquement';

-- ============================================
-- TABLE: photos
-- Description: Stocke les photos de chaque galerie
-- ============================================
CREATE TABLE photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id UUID NOT NULL REFERENCES galleries(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  category TEXT,
  size_bytes INTEGER,
  width INTEGER,
  height INTEGER,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  order_index INTEGER DEFAULT 0
);

-- Index pour performance
CREATE INDEX idx_photos_gallery_id ON photos(gallery_id);
CREATE INDEX idx_photos_order ON photos(gallery_id, order_index);
CREATE INDEX idx_photos_category ON photos(category);

-- Commentaires
COMMENT ON TABLE photos IS 'Photos stockées sur Backblaze B2';
COMMENT ON COLUMN photos.url IS 'URL publique Backblaze B2';
COMMENT ON COLUMN photos.category IS 'Catégorie de la photo (ex: Entrée de la mariée, Cocktail, etc.)';

-- ============================================
-- TABLE: gallery_views (optionnel - analytics)
-- Description: Tracking des consultations de galeries
-- ============================================
CREATE TABLE gallery_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  gallery_id UUID NOT NULL REFERENCES galleries(id) ON DELETE CASCADE,
  viewed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_agent TEXT,
  ip_address INET
);

CREATE INDEX idx_gallery_views_gallery_id ON gallery_views(gallery_id);
CREATE INDEX idx_gallery_views_viewed_at ON gallery_views(viewed_at DESC);

-- ============================================
-- FONCTION: Auto-update updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger pour galleries
CREATE TRIGGER update_galleries_updated_at
    BEFORE UPDATE ON galleries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- FONCTION: Marquer les galeries expirées
-- ============================================
CREATE OR REPLACE FUNCTION mark_expired_galleries()
RETURNS void AS $$
BEGIN
    UPDATE galleries
    SET is_expired = TRUE
    WHERE expiration_date < NOW()
      AND NOT is_expired;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- FONCTION: Incrémenter le compteur de vues
-- ============================================
CREATE OR REPLACE FUNCTION increment_gallery_views(gallery_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE galleries
  SET views_count = views_count + 1
  WHERE id = gallery_id;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Activer RLS sur toutes les tables
ALTER TABLE galleries ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_views ENABLE ROW LEVEL SECURITY;

-- Galeries: Lecture publique
CREATE POLICY "Galeries accessibles en lecture publique"
ON galleries FOR SELECT
USING (true);

-- Photos: Lecture publique
CREATE POLICY "Photos accessibles en lecture publique"
ON photos FOR SELECT
USING (true);

-- Galeries: Insertion autorisée
CREATE POLICY "Insertion galeries via service role"
ON galleries FOR INSERT
WITH CHECK (true);

-- Galeries: Mise à jour autorisée
CREATE POLICY "Mise à jour galeries via service role"
ON galleries FOR UPDATE
USING (true);

-- Galeries: Suppression autorisée
CREATE POLICY "Suppression galeries via service role"
ON galleries FOR DELETE
USING (true);

-- Photos: Insertion autorisée
CREATE POLICY "Insertion photos via service role"
ON photos FOR INSERT
WITH CHECK (true);

-- Photos: Suppression autorisée
CREATE POLICY "Suppression photos via service role"
ON photos FOR DELETE
USING (true);

-- Gallery views: Insertion autorisée
CREATE POLICY "Insertion views via service role"
ON gallery_views FOR INSERT
WITH CHECK (true);

-- ============================================
-- DONNÉES DE TEST (OPTIONNEL)
-- ============================================

-- Exemple d'insertion de galerie de test
-- Décommenter si vous voulez des données de test

/*
INSERT INTO galleries (name, type, event_date, password, expiration_date)
VALUES (
  'Mariage Sarah & Thomas',
  'mariage',
  '2026-02-14',
  'test1234',
  NOW() + INTERVAL '90 days'
);

-- Récupérer l'ID de la galerie créée
-- SELECT id, name FROM galleries;

-- Remplacer 'GALLERY_ID_HERE' par l'UUID de la galerie
INSERT INTO photos (gallery_id, filename, url, size_bytes)
VALUES 
  ('GALLERY_ID_HERE', 'photo1.jpg', 'https://f005.backblazeb2.com/file/david-irie-photo/test/photo1.jpg', 524288),
  ('GALLERY_ID_HERE', 'photo2.jpg', 'https://f005.backblazeb2.com/file/david-irie-photo/test/photo2.jpg', 612352);
*/
