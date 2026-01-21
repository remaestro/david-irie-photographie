import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const defaults = [
  // Hero slides
  { photo_key: 'hero_slide_1', url: 'images/slide1.jpg' },
  { photo_key: 'hero_slide_2', url: 'images/slide2.jpg' },
  { photo_key: 'hero_slide_3', url: 'images/slide3.jpg' },
  { photo_key: 'hero_slide_4', url: 'images/slide4.jpg' },
  { photo_key: 'hero_slide_5', url: 'images/slide5.jpg' },

  // Instagram band
  { photo_key: 'instagram_1', url: 'images/couple-bijoux-1.jpg' },
  { photo_key: 'instagram_2', url: 'images/gemini-1.png' },
  { photo_key: 'instagram_3', url: 'images/bouquet-roses-1.jpg' },
  { photo_key: 'instagram_4', url: 'images/homme-fleur.jpg' },
  { photo_key: 'instagram_5', url: 'images/gemini-2.png' },
  { photo_key: 'instagram_6', url: 'images/bouquet-roses-2.jpg' },
  { photo_key: 'instagram_7', url: 'images/couple-bijoux-2.jpg' },
  { photo_key: 'instagram_8', url: 'images/slide3.jpg' },
  
  // Portfolio / page hero sections
  { photo_key: 'portfolio_mariage_hero', url: 'images/slide1.jpg' },
  { photo_key: 'portfolio_couple_hero', url: 'images/slide2.jpg' },
  { photo_key: 'portfolio_strobist_hero', url: 'images/slide4.jpg' },
  { photo_key: 'portfolio_studio_hero', url: 'images/slide3.jpg' },
  { photo_key: 'formations_hero', url: 'images/slide3.jpg' },
  { photo_key: 'contact_hero', url: 'images/slide2.jpg' },
  { photo_key: 'about_hero', url: 'images/slide1.jpg' },
  { photo_key: 'privategalleries_hero', url: 'images/slide1.jpg' },
  { photo_key: 'videos_hero', url: 'images/slide3.jpg' },
]

async function run() {
  try {
    console.log('Upserting site_photos default keys...')
    for (const item of defaults) {
      const { data, error } = await supabase
        .from('site_photos')
        .upsert({ photo_key: item.photo_key, url: item.url }, { onConflict: 'photo_key' })
        .select()

      if (error) {
        console.error('Error upserting', item.photo_key, error.message)
      } else {
        console.log('Upserted', item.photo_key)
      }
    }

    console.log('Done.')
    process.exit(0)
  } catch (err) {
    console.error('Unexpected error:', err)
    process.exit(1)
  }
}

run()
