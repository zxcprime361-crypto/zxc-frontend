"use client";

import { Input } from "@/components/ui/input";
import useMusicSearch from "@/hook-music/search";
import useMusicSource from "@/hook-music/source";
import { useState } from "react";
import AudioPlayer from "./dash";

export default function MusicSearch() {
  const [search, setSearch] = useState("");
  const [id, setId] = useState<number | null>(null);

  const { data: search_result } = useMusicSearch({ search });
  const { data: source, isLoading } = useMusicSource({ id });

  return (
    <div className="py-30 w-[85%] mx-auto">
      <Input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search music..."
      />

      {/* Player */}
      {source?.data?.manifest && (
        <div className="fixed bottom-0 inset-x-0 py-8 px-8 bg-background/80 backdrop-blur-lg">
          <AudioPlayer
            manifestBase64={source.data.manifest}
            manifestMimeType={source.data.manifestMimeType}
          />
        </div>
      )}

      {/* Results */}
      <div className="divide-y mt-10">
        {search_result?.data.items.map((m) => (
          <button
            key={m.id}
            onClick={() => setId(m.id)}
            className="py-4 w-full text-left hover:bg-muted px-2 rounded flex items-end gap-3"
          >
            {m.album.cover && (
              <div className="size-15 overflow-hidden rounded-sm">
                <img
                  src={`https://resources.tidal.com/images/${m.album.cover.replace(/-/g, "/")}/320x320.jpg`}
                  alt={m.album.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div>
              <div className="font-medium">
                {m.title}
                <span className="ml-5 text-muted-foreground italic">
                  {id === m.id && ` - Playing`}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {m.artist.name}
              </div>
            </div>
          </button>
        ))}
      </div>

      {isLoading && <p className="mt-4 text-sm">Loading audio…</p>}
    </div>
  );
}
