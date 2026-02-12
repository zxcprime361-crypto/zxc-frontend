"use client";
import axios from "axios";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useDebounce } from "@/lib/debounder";

export interface ReusableSwiperTypes {
  query: string | null;
  media_type: string;
}

interface TMDBResponse<T> {
  page: number;
  total_pages: number;
  total_results: number;
  results: T[];
}

export default function useSearch<T>({
  query,
  media_type,
}: ReusableSwiperTypes) {
  const debounced = useDebounce(query, 300);

  return useInfiniteQuery<TMDBResponse<T>>({
    queryKey: ["search_infinite", debounced, media_type],
    enabled: !!query,
    initialPageParam: 1,
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axios.get(`/api/search/${media_type}`, {
        params: {
          query: debounced,
          page: pageParam,
        },
      });
      return res.data;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.page < lastPage.total_pages) {
        return lastPage.page + 1;
      }
      return undefined;
    },
    retry: false,
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 30,
  });
}
