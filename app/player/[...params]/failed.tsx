import { Button } from "@/components/ui/button";
import { IconGhost2Filled } from "@tabler/icons-react";
import { ArrowRight, RefreshCcw } from "lucide-react";
import Link from "next/link";

export default function Failed({
  media_type,
  id,
  season,
  episode,
  handleRefreshServers,
}: {
  media_type: string;
  id: string;
  season: number;
  episode: number;
  handleRefreshServers: () => void;
}) {
  return (
    <div className="absolute flex justify-center items-center flex-col gap-1 inset-0">
      <IconGhost2Filled className="size-12 animate-bounce" />
      <p className="font-medium">404 Not Found.</p>

      <div className="flex items-center gap-3 py-6">
        <Button variant="secondary" onClick={handleRefreshServers}>
          <RefreshCcw /> Retry Server
        </Button>
        <Button variant="outline" asChild>
          <Link
            href={`/embed/${media_type}/${id}${
              media_type === "tv" ? `/${season}/${episode}` : ""
            }`}
          >
            Backup Server <ArrowRight />
          </Link>
        </Button>
      </div>
      <Link
        target="_blank"
        className="underline text-sm text-blue-400"
        href={`https://t.me/+AZZmZ7-_SFsxM2M9`}
      >
        Contact Us
      </Link>
    </div>
  );
}
