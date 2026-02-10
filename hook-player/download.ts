import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import crypto from "crypto";
export interface ProxiedVideoLink {
  id: string;
  resolution: number;
  size: string; // API returns it as string
  url: string; // proxied URL
}

export interface ProxiedApiResponse {
  success: boolean;
  links: ProxiedVideoLink[];
  api_key: string; // IP used for proxy
}

export default function useDownload({
  media_type,
  id,
  season,
  episode,
  imdbId,
  title,
  year,
  trigger,
}: {
  media_type: string;
  id: number;
  season: number | null;
  episode: number | null;
  imdbId: string | null;
  title: string;
  year: string;
  trigger: boolean;
}) {
  const query = useQuery<ProxiedApiResponse>({
    queryKey: [
      "download",
      id,
      media_type,
      season,
      episode,
      imdbId,
      title,
      year,
    ],
    enabled:
      trigger &&
      !!id &&
      !!imdbId &&
      (media_type === "movie" ||
        (media_type === "tv" && !!season && !!episode)),
    queryFn: async () => {
      const { f_token, f_ts } = generateFrontendToken(String(id));

      const tokenRes = await axios.post("/api/token", {
        id,
        f_token,
        ts: f_ts,
      });
      const { ts, token } = tokenRes.data;

      const res = await axios.get(
        `/api/download?a=${id}&b=${media_type}${
          media_type === "tv" ? `&c=${season}&d=${episode}` : ""
        }${
          imdbId !== null ? `&e=${imdbId}` : ""
        }&gago=${ts}&putanginamo=${token}&f_token=${f_token}&f=${title}&g=${year}`,
      );

      return res.data;
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return query;
}

export function generateFrontendToken(id: string) {
  const f_ts = Date.now();
  const f_token = crypto
    .createHash("sha256")
    .update(`${id}:${f_ts}`)
    .digest("hex");
  return { f_token, f_ts };
}
// https://fmovies4u.com/api/movie/353081
