import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  try {
    const search = req.nextUrl.searchParams.get("search");

    if (!search)
      return NextResponse.json({ error: "No search query" }, { status: 400 });

    const url = `https://tidal-api.binimum.org/search/?s=${encodeURIComponent(search)}`;
    const res = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "application/json, text/plain, */*",
        Referer: "https://monochrome.tf/",
      },
    });

    return NextResponse.json(res.data, {
      headers: {
        "Cache-Control": "s-maxage=300, stale-while-revalidate=600", // 5 min cache on Vercel edge
      },
    });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
