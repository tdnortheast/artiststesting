import "jsr:@supabase/functions-js/edge-runtime.d.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface SaveReleaseRequest {
  artistId: string;
  release: {
    id: string;
    title: string;
    type: "album" | "single";
    releaseDate: string;
    coverArt: string;
    tracks: Array<{
      id: string;
      title: string;
      duration: string;
      explicit: boolean;
    }>;
  };
  webhookUrl: string;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const payload: SaveReleaseRequest = await req.json();

  const discordPayload = {
    content: `**New Release Uploaded**`,
    embeds: [
      {
        title: payload.release.title,
        description: `New ${payload.release.type} by artist`,
        color: 16745216,
        fields: [
          {
            name: "Artist ID",
            value: payload.artistId,
            inline: true,
          },
          {
            name: "Release Type",
            value: payload.release.type,
            inline: true,
          },
          {
            name: "Release Date",
            value: payload.release.releaseDate,
            inline: true,
          },
          {
            name: "Number of Tracks",
            value: payload.release.tracks.length.toString(),
            inline: true,
          },
          {
            name: "Tracks",
            value: payload.release.tracks
              .map(
                (t, i) =>
                  `${i + 1}. ${t.title} (${t.duration})${t.explicit ? " [EXPLICIT]" : ""}`
              )
              .join("\n"),
            inline: false,
          },
        ],
        footer: {
          text: `Uploaded at ${new Date().toLocaleString()}`,
        },
      },
    ],
  };

  const response = await fetch(payload.webhookUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(discordPayload),
  });

  if (!response.ok) {
    return new Response(JSON.stringify({ error: "Failed to send to Discord" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(
    JSON.stringify({ success: true, message: "Release saved and webhook sent" }),
    {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
    }
  );
});
