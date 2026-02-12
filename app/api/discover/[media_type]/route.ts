// app/api/discover/[media_type]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { encryptId } from "../../enc";

const TMDB_KEY = process.env.TMDB_API_KEY;

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const segments = url.pathname.split("/").filter(Boolean);
  const media_type = segments[segments.length - 1]; // movie or tv

  const endpoint = url.searchParams.get("endpoint");
  const page = url.searchParams.get("page") || "1";

  if (!media_type || !["movie", "tv"].includes(media_type)) {
    return NextResponse.json(
      { error: "Invalid media_type. Must be movie or tv" },
      { status: 400 },
    );
  }

  try {
    // Build query params from all searchParams except 'endpoint' and 'page'
    const tmdbParams = new URLSearchParams();
    tmdbParams.set("api_key", TMDB_KEY!);
    tmdbParams.set("page", page);

    // Add all other params from the request
    url.searchParams.forEach((value, key) => {
      if (key !== "endpoint" && key !== "page") {
        tmdbParams.set(key, value);
      }
    });

    const tmdbRes = await fetch(
      `https://api.themoviedb.org/3/${endpoint}/${media_type}${endpoint === "trending" ? "/day" : ""}?${tmdbParams.toString()}`,
      { next: { revalidate: 300 } },
    );

    if (!tmdbRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from TMDB" },
        { status: tmdbRes.status },
      );
    }

    const data = await tmdbRes.json();

    // Encrypt all IDs in results
    if (data.results && Array.isArray(data.results)) {
      data.results = data.results.map((item: any) => ({
        ...item,
        id: encryptId(String(item.id)),
      }));
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error("Discover error:", err);
    return NextResponse.json(
      {
        error: "Server error",
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
