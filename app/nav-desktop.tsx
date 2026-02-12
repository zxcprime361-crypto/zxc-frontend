import logo from "@/assets/zxczxc.svg";
import {
  Activity,
  Bookmark,
  ChevronDown,
  Chromium,
  Film,
  GalleryVerticalEnd,
  Home,
  Settings,
  SquareMousePointer,
  Telescope,
  Tv,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import SearchModal from "./search-components/search-modal";
import Link from "next/link";
import { usePathname } from "next/navigation";
import InstallButton from "@/components/ui/install";
import { useState } from "react";
export default function NavBar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="fixed top-0 inset-x-0  z-10 bg-linear-to-b from-background/90 to-transparent rounded-b-md hidden lg:block">
      <nav className="flex items-center justify-between  w-[85%] mx-auto py-6 text-muted-foreground">
        <span className="flex gap-10 items-center">
          <span className="size-10">
            <img src={logo.src} alt="" />
          </span>
          <div className="h-6 w-0.5 rounded-full bg-border"></div>
          <button
            className={pathname === "/" ? "text-foreground font-semibold" : ""}
          >
            <Link href="/" className="flex items-center gap-1.5">
              <Home className="size-5" />
              <span className=" font-medium">Home</span>
            </Link>
          </button>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
              asChild
              className={
                pathname === "/movie" ||
                pathname === "/tv" ||
                pathname === "/watchlist" ||
                pathname === "/history"
                  ? "text-foreground font-semibold"
                  : ""
              }
            >
              <button className="flex items-center gap-1.5 cursor-pointer">
                {pathname === "/movie" ? (
                  <Film className="size-5" />
                ) : pathname === "/tv" ? (
                  <Tv className="size-5" />
                ) : pathname === "/watchlist" ? (
                  <Bookmark className="size-5" />
                ) : pathname === "/history" ? (
                  <GalleryVerticalEnd className="size-5" />
                ) : (
                  <SquareMousePointer className="size-5" />
                )}
                <span className=" font-medium">
                  {pathname === "/movie"
                    ? "Movie"
                    : pathname === "/tv"
                      ? "TV Show"
                      : pathname === "/watchlist"
                        ? "Watchlist"
                        : pathname === "/history"
                          ? "History"
                          : "Browse"}
                </span>
                <ChevronDown className="size-4" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="mt-2 bg-background/80 backdrop-blur-md shadow-lg w-72 ">
              <PopoverHeader className="pb-3 border-b">
                <PopoverTitle className="text-lg font-bold">
                  Browse
                </PopoverTitle>
                <PopoverDescription className="">
                  Discover and manage your content
                </PopoverDescription>
              </PopoverHeader>

              <div className="py-2 space-y-1">
                <Link
                  onClick={() => setOpen(false)}
                  href="/movie"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-200 ${
                    pathname === "/movie"
                      ? "bg-linear-to-r from-muted to-muted/10 text-foreground shadow-sm"
                      : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Film className="w-5 h-5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-base font-semibold">Movies</p>
                    <p className="text-sm opacity-70">Browse all movies</p>
                  </div>
                </Link>

                <Link
                  onClick={() => setOpen(false)}
                  href="/tv"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-200 ${
                    pathname === "/tv"
                      ? "bg-linear-to-r from-muted to-muted/10 text-foreground shadow-sm"
                      : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Tv className="w-5 h-5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-base font-semibold">TV Shows</p>
                    <p className="text-sm opacity-70">Browse all series</p>
                  </div>
                </Link>

                <Link
                  onClick={() => setOpen(false)}
                  href="/collection"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-200 ${
                    pathname === "/collection"
                      ? "bg-linear-to-r from-muted to-muted/10 text-foreground shadow-sm"
                      : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Tv className="w-5 h-5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-base font-semibold">Collections</p>
                    <p className="text-sm opacity-70">Curated collections</p>
                  </div>
                </Link>

                <div className="h-px bg-border my-2" />

                <Link
                  onClick={() => setOpen(false)}
                  href="/watchlist"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-200 ${
                    pathname === "/watchlist"
                      ? "bg-linear-to-r from-muted to-muted/10 text-foreground shadow-sm"
                      : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Bookmark className="w-5 h-5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-base font-semibold">Watchlist</p>
                    <p className="text-sm opacity-70">Saved for later</p>
                  </div>
                </Link>

                <Link
                  onClick={() => setOpen(false)}
                  href="/history"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-200 ${
                    pathname === "/history"
                      ? "bg-linear-to-r from-muted to-muted/10 text-foreground shadow-sm"
                      : "hover:bg-accent/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <GalleryVerticalEnd className="w-5 h-5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-base font-semibold">History</p>
                    <p className="text-sm opacity-70">Recently watched</p>
                  </div>
                </Link>
              </div>
            </PopoverContent>
          </Popover>{" "}
          {/* <button
            className={
              pathname === "/explore" ? "text-foreground font-semibold" : ""
            }
          >
            <Link
              onClick={() => setOpen(false)}
              className={`hidden items-center gap-1.5 xl:flex`}
              href="/explore"
            >
              <Telescope className="size-5" />
              <span className=" font-medium">Explore</span>
            </Link>
          </button> */}
          <button
            className={`relative ${pathname === "/music" ? "text-foreground font-semibold" : ""}`}
          >
            <Link
              onClick={() => setOpen(false)}
              className={`hidden items-center gap-1.5 xl:flex`}
              href="/music"
            >
              <Activity className="size-5" />
              <span className=" font-medium">Music</span>
              <span className="absolute -bottom-5 right-2 text-[10px] tracking-widest font-medium bg-background/80 py-0.5 px-1 rounded-sm">
                BETA
              </span>
            </Link>
          </button>
          <button>
            <Link
              onClick={() => setOpen(false)}
              className={`hidden items-center gap-1.5 xl:flex`}
              href="https://zxcstream.xyz"
              target="_blank"
            >
              <Chromium className="size-5" />
              <span className=" font-medium">API</span>
            </Link>
          </button>
          <button
            className={`xl:block hidden ${pathname === "/settings" ? "text-foreground font-semibold" : ""}`}
          >
            <Link
              onClick={() => setOpen(false)}
              href="/settings"
              className="flex items-center gap-1.5"
            >
              <Settings className="size-5" />
              <span className=" font-medium">Settings</span>
            </Link>
          </button>
        </span>

        <span className="flex items-center gap-2">
          <SearchModal />
          <InstallButton />
        </span>
      </nav>
    </header>
  );
}
