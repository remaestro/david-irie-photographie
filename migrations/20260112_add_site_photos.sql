-- Migration: add site_photos defaults
-- Creates `site_photos` table if missing and inserts default keys

BEGIN;

-- Create table if it does not exist (simple schema)
CREATE TABLE IF NOT EXISTS site_photos (
  photo_key TEXT PRIMARY KEY,
  url TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default hero slides
INSERT INTO site_photos (photo_key, url)
VALUES
  ('hero_slide_1', 'images/slide1.jpg')
, ('hero_slide_2', 'images/slide2.jpg')
, ('hero_slide_3', 'images/slide3.jpg')
, ('hero_slide_4', 'images/slide4.jpg')
, ('hero_slide_5', 'images/slide5.jpg')
ON CONFLICT (photo_key) DO NOTHING;

-- Insert default Instagram photos
INSERT INTO site_photos (photo_key, url)
VALUES
  ('instagram_1', 'images/couple-bijoux-1.jpg')
, ('instagram_2', 'images/gemini-1.png')
, ('instagram_3', 'images/bouquet-roses-1.jpg')
, ('instagram_4', 'images/homme-fleur.jpg')
, ('instagram_5', 'images/gemini-2.png')
, ('instagram_6', 'images/bouquet-roses-2.jpg')
, ('instagram_7', 'images/couple-bijoux-2.jpg')
, ('instagram_8', 'images/slide3.jpg')
ON CONFLICT (photo_key) DO NOTHING;

-- Portfolio / page hero sections
INSERT INTO site_photos (photo_key, url)
VALUES
  ('portfolio_mariage_hero', 'images/slide1.jpg')
, ('portfolio_couple_hero', 'images/slide2.jpg')
, ('portfolio_strobist_hero', 'images/slide4.jpg')
, ('portfolio_studio_hero', 'images/slide3.jpg')
, ('formations_hero', 'images/slide3.jpg')
, ('contact_hero', 'images/slide2.jpg')
, ('about_hero', 'images/slide1.jpg')
, ('privategalleries_hero', 'images/slide1.jpg')
, ('videos_hero', 'images/slide3.jpg')
ON CONFLICT (photo_key) DO NOTHING;

COMMIT;
