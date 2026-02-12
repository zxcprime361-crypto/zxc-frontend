import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import crypto from "crypto";
export interface SourceTypes {
  success: boolean;
  link: string;
  type: string;
}

export default function useSource({
  media_type,
  id,
  season,
  episode,
  imdbId,
  server = 1,
  title,
  year,
}: {
  media_type: string;
  id: string;
  season: number;
  episode: number;
  imdbId: string | null;
  server: number;
  title: string;
  year: string;
}) {
   const isNumeric = /^\d+$/.test(id);
  const query = useQuery<SourceTypes>({
    queryKey: [
      "get-source",
      id,
      media_type,
      season,
      episode,
      imdbId,
      server,
      title,
      year,
    ],
    enabled: !!id && !!imdbId && !isNumeric,
    queryFn: async () => {
      if ([0, 11, 1, 999999999, 2, 3, 4, 5, 6, 7].includes(server)) {
        const payload = {
          id,
          media_type,
          season,
          episode,
          imdbId,
          title,
          year,
        };
        const tokenRes = await axios.post("/zxcprime-backend/token", payload);
        const { token, signature } = tokenRes.data;

        const res = await axios.get(
          `/zxcprime-backend/${server}?data=${encodeURIComponent(token)}&sig=${signature}`,
        );

        return res.data;
      } else if (server === 50) {
        const url =
          media_type === "tv"
            ? `https://play.xpass.top/mov/${id}/${season}/${episode}/0/playlist.json`
            : `https://play.xpass.top/mov/${id}/0/0/0/playlist.json`;

        const res = await axios.get(url);
        const lastSource = res.data.playlist.at(-1);
        const finalSource = lastSource.sources.at(-1);

        const structure = {
          type: finalSource.type,
          link: finalSource.file,
          success: true,
        };
        return structure;
      } else if (server === 60) {
        const url =
          media_type === "tv"
            ? `https://play.xpass.top/meg/tv/${id}/${season}/${episode}/playlist.json`
            : `https://play.xpass.top/meg/movie/${id}/0/0/playlist.json`;

        const res = await axios.get(url);
        const lastSource = res.data.playlist.at(-1);
        const finalSource = lastSource.sources.at(-1);

        const structure = {
          type: finalSource.type,
          link: finalSource.file,
          success: true,
        };
        return structure;
      } else if (server === 70) {
        const url =
          media_type === "tv"
            ? `https://play.xpass.top/box/tv/${id}/${season}/${episode}/playlist.json`
            : `https://play.xpass.top/box/movie/${id}/0/0/playlist.json`;

        const res = await axios.get(url);
        const lastSource = res.data.playlist.at(-1);
        const finalSource = lastSource.sources.at(-1);

        const structure = {
          type: finalSource.type,
          link: finalSource.file,
          success: true,
        };
        return structure;
      }
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
