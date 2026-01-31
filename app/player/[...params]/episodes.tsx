import { Button } from "@/components/ui/button";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Eye,
  EyeOff,
  ListVideo,
  TextSearch,
  X,
} from "lucide-react";
import { useTvSeason } from "@/api/get-seasons";
import { Tailspin } from "ldrs/react";
import "ldrs/react/Tailspin.css";
import Link from "next/link";
import CircularProgress from "./circular-progress";

import { MovieTypes } from "@/types/movie-by-id";
import SeasonPopover from "./season";
import { IconGhost2Filled } from "@tabler/icons-react";
export default function Episodes({
  id,
  season,
  episode,
  metadata,
  lockTimer,
  resetTimer,
  server,
  autoPlay,
}: {
  id: number;
  season: number;
  episode: number;
  metadata: MovieTypes;
  lockTimer: () => void;
  resetTimer: () => void;
  server: number;
  autoPlay: boolean;
}) {
  const [open, setOpen] = useState(false);
  const activeEpisodeRef = useRef<HTMLAnchorElement | null>(null);
  const [activateSpoiler, setActivateSpoiler] = useState(true);

  const [selectSeason, setSeasonSelect] = useState(season);

  const { data, isLoading } = useTvSeason({
    id,
    season_number: selectSeason,
    media_type: "tv",
  });

  useEffect(() => {
    if (open && activeEpisodeRef.current) {
      activeEpisodeRef.current.scrollIntoView({
        behavior: "auto",
        block: "center",
      });
    }
  }, [open, data, selectSeason]);

  const closeDrawer = () => {
    setOpen(false);
    resetTimer();
  };

  const params = new URLSearchParams();

  if (server > 0) params.set("server", String(server));
  if (autoPlay) params.set("autoPlay", "true");
  return (
    <div
      onPointerMove={(e) => {
        e.stopPropagation();
        if (e.pointerType === "mouse") {
          lockTimer();
        }
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        if (e.pointerType === "touch") {
          resetTimer();
        }
      }}
      onPointerUp={(e) => {
        e.stopPropagation();
        if (e.pointerType === "mouse") {
          resetTimer();
        }
      }}
    >
      <ListVideo
        onClick={() => setOpen(true)}
        onPointerMove={lockTimer}
        className="cursor-pointer lg:size-9.5 size-7 text-gray-200"
      />
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-background/80"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              onClick={() => closeDrawer()}
            />

            {/* Drawer */}
            <motion.div
              className="fixed right-0 top-0 bottom-0 z-50 lg:w-sm w-70  border-l border-input/30 backdrop-blur-2xl bg-background/50 rounded-l-md flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{
                type: "spring",
                damping: 50,
                stiffness: 500,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex-1 overflow-auto p-2 custom-scrollbar">
                {isLoading ? (
                  <div className=" h-full grid place-items-center ">
                    <Tailspin size="50" stroke="5" speed="1" color="white" />
                  </div>
                ) : data?.episodes.length == 0 ? (
                  <div className="h-full grid place-items-center">
                    <div className="flex flex-col items-center gap-3">
                      <IconGhost2Filled className="size-15" />

                      <div className="text-center">
                        <p className="tracking-wide font-medium text-lg">404</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="grid  grid-cols-1 divide-y border-input/30">
                      {data?.episodes.map((e) => (
                        <Link
                          key={e.id}
                          className="group relative overflow-hidden py-6 px-2"
                          href={`/player/tv/${id}/${selectSeason}/${
                            e.episode_number
                          }${params.toString() ? `?${params.toString()}` : ""}`}
                          ref={
                            episode === e.episode_number &&
                            season === selectSeason
                              ? activeEpisodeRef
                              : null
                          }
                        >
                          {/* Image */}
                          <div className="relative aspect-video   lg:max-w-full lg:mb-3 mb-1.5 bg-black rounded-md overflow-hidden">
                            <div className="absolute top-0 -left-2 flex items-center z-20">
                              {episode === e.episode_number &&
                                season === selectSeason && (
                                  <div
                                    className={`flex items-center justify-center text-gray-200 font-medium tracking-wide  text-xs pl-5 pr-6    py-1.5 bg-blue-900
                         `}
                                    style={{
                                      clipPath:
                                        "polygon(0 0, 100% 0, 85% 100%, 0% 100%)",
                                    }}
                                  >
                                    NOW PLAYING
                                  </div>
                                )}
                            </div>
                            {e.still_path ? (
                              <>
                                <img
                                  src={`https://image.tmdb.org/t/p/w780${e.still_path}`}
                                  alt={e.name}
                                  className={`w-full h-full object-cover group-hover:opacity-80 transition-opacity ${
                                    !activateSpoiler ? "blur-2xl" : ""
                                  }`}
                                />
                                {!activateSpoiler && (
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                    <div className="text-center">
                                      <EyeOff className="w-8 h-8 mx-auto mb-2 text-white/80" />
                                      <p className="text-white/80 text-sm font-medium">
                                        Spoiler Hidden
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <span className="text-5xl font-bold text-neutral-800">
                                  {e.episode_number}
                                </span>
                              </div>
                            )}

                            {/* Rating Badge */}
                            {e.vote_average > 0 && (
                              <CircularProgress voteAverage={e.vote_average} />
                            )}
                          </div>

                          {/* Info */}
                          <div className="flex-1">
                            <h3 className=" font-semibold lg:text-base text-sm mb-1  line-clamp-1 group-hover:text-neutral-300 transition-colors">
                              {!activateSpoiler && "Episode"} {e.episode_number}
                              {activateSpoiler && `. ${e.name}`}
                            </h3>

                            <div className="flex items-center gap-2 lg:text-sm text-xs text-neutral-500 mb-2">
                              {e.air_date && (
                                <span>
                                  {new Date(e.air_date).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    },
                                  )}
                                </span>
                              )}
                              {e.runtime && (
                                <>
                                  <span>•</span>
                                  <span>{e.runtime} min</span>
                                </>
                              )}
                            </div>

                            {e.overview && activateSpoiler && (
                              <p className="text-sm text-muted-foreground lg:line-clamp-3 line-clamp-2 leading-relaxed ">
                                {e.overview}
                              </p>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="w-full p-4 space-y-2">
                <SeasonPopover
                  metadata={metadata}
                  seasonSelect={selectSeason}
                  setSeasonSelect={setSeasonSelect}
                  season={season}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => setActivateSpoiler((prev) => !prev)}
                  >
                    Anti Spoiler {activateSpoiler ? <Eye /> : <EyeOff />}
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={() => closeDrawer()}
                  >
                    Close <X />
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
