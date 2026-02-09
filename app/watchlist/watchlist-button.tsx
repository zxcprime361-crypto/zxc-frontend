import { MovieTypes } from "@/types/movie-by-id";
import { useWatchlistStore } from "./useWatchlist";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Check, Minus, Plus } from "lucide-react";

export default function WatchlistButton({
  movie,
  media_type,
}: {
  movie: MovieTypes;
  media_type: string;
}) {
  const { addToWatchlist, removeFromWatchlist, isInWatchlist } =
    useWatchlistStore();

  const inWatchlist = isInWatchlist(movie.id);

  const handleClick = () => {
    if (inWatchlist) {
      removeFromWatchlist(movie.id);

      toast.success(`${movie.title || movie.name} Removed from Watchlist`, {
        // description: `${movie.title || movie.name} has been removed.`,
      });
    } else {
      addToWatchlist({
        id: movie.id,
        media_type: media_type,
        backdrop: movie.backdrop_path || "",
        title: movie.title || movie.name,
        year: (movie.release_date || movie.first_air_date)?.slice(0, 4) || "",
      });

      toast.success(`${movie.title || movie.name} Added to Watchlist`, {
        // description: `${movie.title} has been added.`,
      });
    }
  };

  return (
    <Button
      className="size-12 rounded-full"
      variant="outline"
      onClick={handleClick}
    >
      {inWatchlist ? <Check strokeWidth={2} /> : <Plus strokeWidth={2} />}
    </Button>
  );
}
