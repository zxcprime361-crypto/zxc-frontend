"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import clsx from "clsx";
import { MovieTypes } from "@/types/movie-by-id";

export default function SeasonPopover({
  metadata,
  setSeasonSelect,
  seasonSelect,
  season,
}: {
  metadata: MovieTypes;
  setSeasonSelect: (seasonsSelect: number) => void;
  seasonSelect: number;
  season: number;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="relative w-full z-50">
        <Button
          onClick={() => setOpen((v) => !v)}
          className="w-full justify-between"
          variant="outline"
        >
          {metadata.seasons.find((f) => f.season_number === seasonSelect)?.name}
          <ChevronDown
            className={clsx(
              "transition-transform duration-200",
              open && "rotate-180"
            )}
          />
        </Button>

        {open && (
          <div
            className="
              absolute left-0 mt-2 w-full
              rounded-md border bg-background shadow-md
              animate-in fade-in zoom-in-95 bottom-full
            "
            onClick={(e) => e.stopPropagation()}
          >
            <ul className="py-1">
              {metadata.seasons.map((season) => (
                <li
                  key={season.id}
                  className="cursor-pointer px-3 py-2 text-sm hover:bg-muted flex gap-2 items-center justify-between"
                  onClick={() => {
                    setOpen(false);
                    setSeasonSelect(season.season_number);
                  }}
                >
                  {season.name}
                  {seasonSelect === season.season_number && (
                    <Check className="size-4" />
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 "
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
