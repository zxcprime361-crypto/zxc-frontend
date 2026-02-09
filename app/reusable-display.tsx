import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import MovieCard from "@/components/ui/movie-card";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import {
  ArrowRight,
  ExternalLink,
  Film,
  SquareArrowOutUpRight,
  Tv,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import SkeletonCard1 from "@/components/ui/movie-card-skeleton-1";
import { swiperConfig } from "@/lib/swiper-config";
import { useIsMobile } from "@/hook/use-mobile";
import { MovieTypes } from "@/types/movie-by-id";
import { ReusableSwiperTypes } from "@/constants/movie-endpoints";
import { Button } from "@/components/ui/button";
import useGetDiscoverInfiniteSwiper from "@/hook/get-discover-infinite swiper";
import { Separator } from "@/components/ui/separator";

export default function ReusableSwiper({
  id,
  endpoint,
  params,
  displayName,
}: ReusableSwiperTypes) {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });
  const isMobile = useIsMobile();
  const [media_type, setMediaType] = useState<"movie" | "tv">("movie");
  const { data, isLoading } = useGetDiscoverInfiniteSwiper<MovieTypes>({
    endpoint,
    media_type,
    params,
    isVisible: inView,
  });
  const results = data?.pages.flatMap((p) => p.results) ?? [];
  const filtered = results.filter((filter) => filter.vote_average > 3);

  return (
    <div className=" mx-auto lg:w-[85%] w-[95%] ">
      <div className=" relative lg:py-25 py-8" ref={ref}>
        <h1 className="p-1 uppercase  mask-[linear-gradient(to_bottom,black_0%,transparent_85%)] lg:text-6xl text-4xl font-bold text-red-700  translate-y-3 lg:tracking-tight ">
          {displayName}
        </h1>

        {!inView || isLoading ? (
          <div className="grid lg:grid-cols-7 grid-cols-2 md:grid-cols-5 lg:gap-5 gap-2">
            {[...Array(isMobile ? 2 : 7)].map((_, i) => (
              <SkeletonCard1 key={i} />
            ))}
          </div>
        ) : results.length === 0 ? (
          <p className="text-center">No Data.</p>
        ) : (
          <Swiper {...swiperConfig}>
            {filtered.map((movie, i) => (
              <SwiperSlide key={movie.id} className="p-1">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: 1,
                    transition: {
                      delay: i * 0.03,
                      duration: 0.3,
                      ease: "easeInOut",
                    },
                  }}
                >
                  <MovieCard media_type={media_type} movie={movie} />
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
      <div className="flex items-center">
        <Separator className="flex-1" />
        <Link href={`/browse/${id}`}>
          <p className=" text-muted-foreground font-medium px-15 hover:underline cursor-pointer flex items-center gap-2">
            {displayName} {media_type === "movie" ? "Movies" : "TV Shows"}{" "}
            <ExternalLink className="size-4.5" />
          </p>
        </Link>
        <Separator className="flex-1" />
      </div>
    </div>
  );
}
