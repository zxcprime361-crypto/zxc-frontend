// app/api/search/[media_type]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { encryptId } from "../../enc";

const TMDB_KEY = process.env.TMDB_API_KEY;

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const segments = url.pathname.split("/").filter(Boolean);
  const media_type = segments[segments.length - 1]; // movie or tv

  const query = url.searchParams.get("query");
  const page = url.searchParams.get("page") || "1";

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  if (!media_type || !["movie", "tv", "multi"].includes(media_type)) {
    return NextResponse.json(
      { error: "Invalid media_type. Must be movie, tv, or multi" },
      { status: 400 },
    );
  }

  try {
    const tmdbRes = await fetch(
      `https://api.themoviedb.org/3/search/${media_type}?api_key=${TMDB_KEY}&query=${encodeURIComponent(query)}&page=${page}&language=en-US`,
      { next: { revalidate: 300 } },
    );

    if (!tmdbRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch from TMDB" },
        { status: tmdbRes.status },
      );
    }

    const data = await tmdbRes.json();

    if (data.results && Array.isArray(data.results)) {
      data.results = data.results.map((item: any) => ({
        ...item,
        id: encryptId(String(item.id)),
      }));
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json(
      {
        error: "Server error",
        message: err instanceof Error ? err.message : String(err),
      },
      { status: 500 },
    );
  }
}
