/*
  # Seed releases and tracks data for artists
  
  Populates the releases table with Yuno $weez and J@M@R releases
*/

INSERT INTO releases (id, release_id, artist_id, title, type, release_date, cover_art_url, created_at, updated_at)
SELECT
  gen_random_uuid(),
  'sweez-city',
  id,
  '$weezCity',
  'album',
  '2025-12-25'::date,
  'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/88/94/98/8894986e-c4c6-f301-3f2e-bd0dbe21bf96/artwork.jpg/632x632bb.webp',
  NOW(),
  NOW()
FROM artists
WHERE name = 'Yuno $weez'
ON CONFLICT (release_id) DO NOTHING;

INSERT INTO releases (id, release_id, artist_id, title, type, release_date, cover_art_url, created_at, updated_at)
SELECT
  gen_random_uuid(),
  'lost-files',
  id,
  'lost files from $weez',
  'album',
  '2026-01-02'::date,
  'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/de/1d/ae/de1dae3c-113c-ed1a-8c08-02ebc1f779f3/artwork.jpg/632x632bb.webp',
  NOW(),
  NOW()
FROM artists
WHERE name = 'Yuno $weez'
ON CONFLICT (release_id) DO NOTHING;

INSERT INTO releases (id, release_id, artist_id, title, type, release_date, cover_art_url, created_at, updated_at)
SELECT
  gen_random_uuid(),
  'xans-wrld',
  id,
  'Xan$wrld',
  'single',
  '2026-01-03'::date,
  'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/11/d7/27/11d7272c-67dc-1aa4-2525-2ff23f71fd33/artwork.jpg/632x632bb.webp',
  NOW(),
  NOW()
FROM artists
WHERE name = 'Yuno $weez'
ON CONFLICT (release_id) DO NOTHING;

INSERT INTO releases (id, release_id, artist_id, title, type, release_date, cover_art_url, created_at, updated_at)
SELECT
  gen_random_uuid(),
  'boondocks',
  id,
  'Boondocks',
  'single',
  '2026-01-03'::date,
  'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a4/a5/15/a4a515a7-227c-6655-d26b-3e8c2e481cd4/artwork.jpg/632x632bb.webp',
  NOW(),
  NOW()
FROM artists
WHERE name = 'Yuno $weez'
ON CONFLICT (release_id) DO NOTHING;

INSERT INTO releases (id, release_id, artist_id, title, type, release_date, cover_art_url, created_at, updated_at)
SELECT
  gen_random_uuid(),
  'perkys',
  id,
  'PERKY$',
  'single',
  '2026-01-19'::date,
  'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/68/73/53/68735313-0fa6-51d1-2912-9dcfb1d8d64b/artwork.jpg/632x632bb.webp',
  NOW(),
  NOW()
FROM artists
WHERE name = 'Yuno $weez'
ON CONFLICT (release_id) DO NOTHING;

INSERT INTO releases (id, release_id, artist_id, title, type, release_date, cover_art_url, created_at, updated_at)
SELECT
  gen_random_uuid(),
  'payme',
  id,
  'Pay Me!',
  'single',
  '2026-01-19'::date,
  'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/12/70/a3/1270a327-2ce4-7e17-dc42-402ce499eed1/artwork.jpg/632x632bb.webp',
  NOW(),
  NOW()
FROM artists
WHERE name = 'Yuno $weez'
ON CONFLICT (release_id) DO NOTHING;

INSERT INTO releases (id, release_id, artist_id, title, type, release_date, cover_art_url, created_at, updated_at)
SELECT
  gen_random_uuid(),
  'freaking-music',
  id,
  'I AM THE FREAKING MUSIC',
  'single',
  '2025-10-30'::date,
  'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/bd/5b/9a/bd5b9aad-d071-d193-96f1-09a9ffdec549/artwork.jpg/632x632bb.webp',
  NOW(),
  NOW()
FROM artists
WHERE name = 'J@M@R'
ON CONFLICT (release_id) DO NOTHING;
