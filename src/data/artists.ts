import { createClient } from '@supabase/supabase-js';

export interface Track {
  id: string;
  title: string;
  duration: string;
  explicit: boolean;
}

export interface Release {
  id: string;
  title: string;
  type: 'album' | 'single';
  releaseDate: string;
  coverArt: string;
  tracks: Track[];
}

export interface Artist {
  id: string;
  name: string;
  password: string;
  releases: Release[];
}

let supabase: ReturnType<typeof createClient> | null = null;

try {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (supabaseUrl && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
  }
} catch (error) {
  console.error('Failed to initialize Supabase:', error);
}

const fallbackArtists: Artist[] = [
  {
    id: 'yuno-sweez',
    name: 'Yuno $weez',
    password: 'Benkifiya1',
    releases: [
      {
        id: 'sweez-city',
        title: '$weezCity',
        type: 'album',
        releaseDate: '2025-12-25',
        coverArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/88/94/98/8894986e-c4c6-f301-3f2e-bd0dbe21bf96/artwork.jpg/632x632bb.webp',
        tracks: [
          { id: '1', title: 'fatimah', duration: '1:24', explicit: true },
          { id: '2', title: 'DONOTRUNUPONME!', duration: '1:43', explicit: true },
          { id: '3', title: 'Beamer (feat. Yuno Benz)', duration: '1:51', explicit: true },
          { id: '4', title: 'Issey Miyake', duration: '1:57', explicit: true },
          { id: '5', title: 'Oxycodone (feat. JBEETLE)', duration: '2:49', explicit: true },
          { id: '6', title: 'SUNDAYMORNINGCHURCH (feat. Jadi)', duration: '3:20', explicit: true },
          { id: '7', title: 'Let Me Interlude', duration: '2:11', explicit: true },
          { id: '8', title: 'Law Fawk Order', duration: '1:42', explicit: true },
          { id: '9', title: 'Purple Drank', duration: '2:19', explicit: true },
          { id: '10', title: 'Givenchy', duration: '1:51', explicit: true },
        ],
      },
      {
        id: 'lost-files',
        title: 'lost files from $weez',
        type: 'album',
        releaseDate: '2026-01-02',
        coverArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/de/1d/ae/de1dae3c-113c-ed1a-8c08-02ebc1f779f3/artwork.jpg/632x632bb.webp',
        tracks: [
          { id: '1', title: 'Lost Intro (feat. soløwøn)', duration: '2:27', explicit: true },
          { id: '2', title: 'Mona Lisa', duration: '2:16', explicit: true },
          { id: '3', title: 'Yuno $weez', duration: '1:20', explicit: true },
          { id: '4', title: 'Bugatti Way (feat. YunoKaydee)', duration: '1:55', explicit: true },
          { id: '5', title: 'Middleman', duration: '1:50', explicit: true },
          { id: '6', title: 'Boondocks (feat. svspperkk)', duration: '3:07', explicit: true },
          { id: '7', title: 'For Me (feat. svspperkk)', duration: '2:07', explicit: true },
          { id: '8', title: 'Outer Banks', duration: '2:08', explicit: true },
          { id: '9', title: 'Pain (feat. Kaminar1)', duration: '2:25', explicit: true },
          { id: '10', title: '$he Lit', duration: '2:03', explicit: true },
          { id: '11', title: 'Lost Outro', duration: '1:31', explicit: true },
        ],
      },
      {
        id: 'xans-wrld',
        title: 'Xan$wrld',
        type: 'single',
        releaseDate: '2026-01-03',
        coverArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/11/d7/27/11d7272c-67dc-1aa4-2525-2ff23f71fd33/artwork.jpg/632x632bb.webp',
        tracks: [
          { id: '1', title: 'Xan$wrld', duration: '2:10', explicit: true },
        ],
      },
      {
        id: 'boondocks',
        title: 'Boondocks',
        type: 'single',
        releaseDate: '2026-01-03',
        coverArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/a4/a5/15/a4a515a7-227c-6655-d26b-3e8c2e481cd4/artwork.jpg/632x632bb.webp',
        tracks: [
          { id: '1', title: 'Boondocks (feat. svspperkk & $p@de)', duration: '3:50', explicit: true },
        ],
      },
      {
        id: 'perkys',
        title: 'PERKY$',
        type: 'single',
        releaseDate: '2026-01-19',
        coverArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/68/73/53/68735313-0fa6-51d1-2912-9dcfb1d8d64b/artwork.jpg/632x632bb.webp',
        tracks: [
          { id: '1', title: 'PERKY$', duration: '1:54', explicit: true },
        ],
      },
      {
        id: 'payme',
        title: 'Pay Me!',
        type: 'single',
        releaseDate: '2026-01-19',
        coverArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music221/v4/12/70/a3/1270a327-2ce4-7e17-dc42-402ce499eed1/artwork.jpg/632x632bb.webp',
        tracks: [
          { id: '1', title: 'Pay Me! (feat. Yuno Benz)', duration: '2:03', explicit: true },
        ],
      },
    ],
  },
  {
    id: 'jamar',
    name: 'J@M@R',
    password: 'jamar123',
    releases: [
      {
        id: 'freaking-music',
        title: 'I AM THE FREAKING MUSIC',
        type: 'single',
        releaseDate: '2025-10-30',
        coverArt: 'https://is1-ssl.mzstatic.com/image/thumb/Music211/v4/bd/5b/9a/bd5b9aad-d071-d193-96f1-09a9ffdec549/artwork.jpg/632x632bb.webp',
        tracks: [
          { id: '1', title: 'I AM THE FREAKING MUSIC', duration: '2:46', explicit: true },
        ],
      },
    ],
  },
];

export async function loadArtistsFromDatabase(): Promise<Artist[]> {
  if (!supabase) {
    console.warn('Supabase not initialized, using fallback data');
    return fallbackArtists;
  }

  try {
    const { data: artistsData, error: artistsError } = await supabase
      .from('artists')
      .select('id, name, artist_id, password');

    if (artistsError) {
      console.error('Error fetching artists:', artistsError);
      return fallbackArtists;
    }

    if (!artistsData || artistsData.length === 0) {
      return fallbackArtists;
    }

    const artists: Artist[] = [];

    for (const artistRow of artistsData) {
      try {
        const { data: releasesData, error: releasesError } = await supabase
          .from('releases')
          .select('id, title, type, release_date, cover_art_url')
          .eq('artist_id', artistRow.id);

        if (releasesError) {
          console.error('Error fetching releases for', artistRow.name, releasesError);
          continue;
        }

        const releases: Release[] = [];

        for (const releaseRow of releasesData || []) {
          try {
            const { data: tracksData, error: tracksError } = await supabase
              .from('tracks')
              .select('id, title, duration, explicit')
              .eq('release_id', releaseRow.id)
              .order('created_at', { ascending: true });

            if (tracksError) {
              console.error('Error fetching tracks for', releaseRow.title, tracksError);
              continue;
            }

            releases.push({
              id: releaseRow.id,
              title: releaseRow.title,
              type: releaseRow.type as 'album' | 'single',
              releaseDate: releaseRow.release_date,
              coverArt: releaseRow.cover_art_url || '',
              tracks: (tracksData || []).map(t => ({
                id: t.id,
                title: t.title,
                duration: t.duration,
                explicit: t.explicit || false,
              })),
            });
          } catch (error) {
            console.error('Error processing release:', error);
            continue;
          }
        }

        artists.push({
          id: artistRow.id,
          name: artistRow.name,
          password: artistRow.password || '',
          releases: releases.sort((a, b) =>
            new Date(b.releaseDate).getTime() - new Date(a.releaseDate).getTime()
          ),
        });
      } catch (error) {
        console.error('Error processing artist:', error);
        continue;
      }
    }

    return artists.length > 0 ? artists : fallbackArtists;
  } catch (error) {
    console.error('Failed to load artists from database:', error);
    return fallbackArtists;
  }
}

export { fallbackArtists as artists };
