import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface TidalArtist {
  id: number;
  name: string;
}

interface TidalAlbum {
  id: number;
  title: string;
  releaseDate: string;
  cover: string;
  type: string;
}

interface TidalTrack {
  id: number;
  title: string;
  duration: number;
  explicit: boolean;
  trackNumber: number;
}

async function getTidalAccessToken(clientId: string, clientSecret: string): Promise<string> {
  const response = await fetch("https://auth.tidalapi.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: clientId,
      client_secret: clientSecret,
    }).toString(),
  });

  const data = await response.json() as { access_token: string };
  return data.access_token;
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

async function syncTidalArtist(
  supabase: ReturnType<typeof createClient>,
  accessToken: string,
  artistId: string,
  artistName: string,
  tidalId: number
) {
  try {
    const albumsUrl = `https://openapi.tidal.com/artists/${tidalId}/albums?countryCode=US&limit=50`;

    const albumsResponse = await fetch(albumsUrl, {
      headers: {
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    if (!albumsResponse.ok) {
      console.error(`Failed to fetch albums for ${artistName}`);
      return;
    }

    const albumsData = await albumsResponse.json() as { data: TidalAlbum[] };
    const albums = albumsData.data || [];

    for (const album of albums) {
      const releaseId = `tidal-${album.id}`;
      const releaseType = album.type?.toLowerCase() === "ep" ? "album" : "single";

      const { data: existingRelease } = await supabase
        .from("releases")
        .select("id")
        .eq("release_id", album.title)
        .eq("artist_id", artistId)
        .maybeSingle();

      if (existingRelease) continue;

      const tracksUrl = `https://openapi.tidal.com/albums/${album.id}/tracks?countryCode=US`;
      const tracksResponse = await fetch(tracksUrl, {
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      });

      let tracks: TidalTrack[] = [];
      if (tracksResponse.ok) {
        const tracksData = await tracksResponse.json() as { data: TidalTrack[] };
        tracks = tracksData.data || [];
      }

      const { error: releaseError } = await supabase.from("releases").insert({
        id: releaseId,
        artist_id: artistId,
        title: album.title,
        type: releaseType,
        release_date: album.releaseDate,
        cover_art_url: album.cover,
      });

      if (releaseError) {
        console.error("Failed to insert release:", releaseError);
        continue;
      }

      for (const track of tracks) {
        const trackId = `tidal-track-${track.id}`;
        await supabase.from("tracks").insert({
          id: trackId,
          track_id: track.id.toString(),
          release_id: releaseId,
          title: track.title,
          duration: formatDuration(track.duration),
          explicit: track.explicit || false,
        });
      }
    }
  } catch (error) {
    console.error(`Error syncing artist ${artistName}:`, error);
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const clientId = Deno.env.get("TIDAL_CLIENT_ID") || "iC9XhHa5H1DNfYTO";
    const clientSecret = Deno.env.get("TIDAL_CLIENT_SECRET") || "qfxO1kMDGYsN9AzUZ3yg1rZpiS3rJCw0AlRKLizkCyM=";
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";

    const supabase = createClient(supabaseUrl, supabaseKey);

    const accessToken = await getTidalAccessToken(clientId, clientSecret);

    const { data: artists } = await supabase
      .from("artists")
      .select("id, name, tidal_id")
      .not("tidal_id", "is", null);

    if (!artists || artists.length === 0) {
      return new Response(
        JSON.stringify({ message: "No artists with Tidal IDs found" }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    for (const artist of artists) {
      if (artist.tidal_id) {
        await syncTidalArtist(supabase, accessToken, artist.id, artist.name, parseInt(artist.tidal_id));
      }
    }

    return new Response(
      JSON.stringify({ success: true, message: "Tidal sync completed" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Sync error:", error);
    return new Response(
      JSON.stringify({ error: "Failed to sync Tidal data" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
