"use client";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { MovieTypes } from "@/types/movie-by-id";

export default function useMovieById({
  media_type,
  id,
}: {
  media_type: string;
  id: string;
}) {
  const query = useQuery<MovieTypes>({
    queryKey: ["get-by-id", id, media_type],
    enabled: !!id && !!media_type,
    queryFn: async () => {
      const url = `/api/id/${media_type}/${id}`;

      try {
        const res = await axios.get(url);

        return res.data;
      } catch (error) {
        console.error(error);
      }
    },
    retry: false,
    staleTime: 1000 * 60 * 5,
  });

  return query;
}
