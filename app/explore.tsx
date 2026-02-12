"use client";

import {
  IconCarambolaFilled,
  IconFilter2Bolt,
  IconFilter2X,
  IconFilterPlus,
  IconLoader,
  IconMovieOff,
  IconRefresh,
  IconTransfer,
  IconX,
} from "@tabler/icons-react";
import { Calendar, Check, ChevronsUpDown, Minus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import MovieCard from "@/components/ui/movie-card";
import {
  keywordTopics,
  movieGenres,
  productionCompanies,
  tvGenres,
  tvNetworks,
} from "@/constants/filter";
import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import TitleReusable from "@/components/ui/title";
import useGetDiscoverInfinite from "@/hook/get-discover-infinite";
import { MovieTypes } from "@/types/movie-by-id";
import { useInView } from "react-intersection-observer";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hook/use-mobile";
import SkeletonCard1 from "@/components/ui/movie-card-skeleton-1";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { useLayoutDensity } from "@/store/useLayoutDensity";
import { GRID_CONFIG } from "@/lib/layout-density";
import { Badge } from "@/components/ui/badge";
export default function ExploreTmdb({
  media_type,
}: {
  media_type: "movie" | "tv";
}) {
  const isMobile = useIsMobile();
  const { ref, inView } = useInView({
    threshold: 0.1, // triggers when 50% visible
  });
  const [selectedMedia, setSelectedMedia] = useState<"movie" | "tv">(
    media_type,
  );
  const [selectedGenres, setSelectedGenres] = useState<Set<number>>(new Set());
  const [selectedNetwork, setSelectedNetwork] = useState<number | null>(null);
  const [expandYear, setExpandYear] = useState(false);
  const [expandGenre, setExpandGenre] = useState(false);
  const [expandCompanies, setExpandCompanies] = useState(false);
  const [expandLanguage, setExpandLanguage] = useState(false);
  const [expandKeyword, setExpandKeyword] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [toValue, settoValue] = useState<number | null>(null);
  const [fromValue, setfromValue] = useState<number | null>(null);
  const [minRating, setMinRating] = useState<number | null>(null);
  const [maxRating, setMaxRating] = useState<number | null>(null);
  const [yearType, setYearType] = useState(false);
  const CURRENT_YEAR = new Date().getFullYear();
  const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);
  const [selectedKeywords, setSelectedKeywords] = useState<Set<string>>(
    new Set(),
  );
  const [selectedSort, setSelectedSort] = useState<string | null>(null);
  const [sort, setSort] = useState("");
  const density = useLayoutDensity((state) => state.density);
  const toggleGenre = (id: number) => {
    setSelectedGenres((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleKeywords = (lang: string) => {
    setSelectedKeywords((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(lang)) newSet.delete(lang);
      else newSet.add(lang);
      return newSet;
    });
  };
  const hasAnyFilter =
    selectedGenres.size > 0 ||
    selectedKeywords.size > 0 ||
    selectedNetwork !== null ||
    selectedLanguage !== null ||
    minRating !== null ||
    maxRating !== null ||
    selectedSort !== null ||
    // sort !== "" ||
    selectedYear !== null ||
    toValue !== null ||
    fromValue !== null;
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useGetDiscoverInfinite<MovieTypes>({
      endpoint: "discover",
      enable: hasAnyFilter,
      media_type: selectedMedia,
      params: {
        // page: 1,
        ...(sort && { sort_by: sort }),

        ...(selectedGenres.size > 0 && {
          with_genres: [...selectedGenres].join(","),
        }),

        ...(!yearType &&
          selectedYear != null &&
          (selectedMedia === "tv"
            ? {
                "first_air_date.gte": `${selectedYear}-01-01`,
                "first_air_date.lte": `${selectedYear}-12-31`,
              }
            : {
                "primary_release_date.gte": `${selectedYear}-01-01`,
                "primary_release_date.lte": `${selectedYear}-12-31`,
              })),

        ...(yearType === true &&
          toValue != null &&
          (selectedMedia === "tv"
            ? { "first_air_date.gte": `${toValue}-01-01` }
            : { "primary_release_date.gte": `${toValue}-01-01` })),

        ...(yearType === true &&
          fromValue != null &&
          (selectedMedia === "tv"
            ? { "first_air_date.lte": `${fromValue}-12-31` }
            : { "primary_release_date.lte": `${fromValue}-12-31` })),

        ...(minRating != null && {
          "vote_average.gte": minRating,
        }),

        ...(maxRating != null && {
          "vote_average.lte": maxRating,
        }),

        ...(selectedNetwork &&
          (selectedMedia === "tv"
            ? { with_networks: selectedNetwork }
            : { with_companies: selectedNetwork })),

        ...((sort === "popularity.asc" ||
          sort === "popularity.desc" ||
          sort === "vote_average.asc" ||
          sort === "vote_average.desc" ||
          sort === "release_date.asc" ||
          sort === "release_date.desc") && {
          "vote_count.gte": 10,
        }),
        ...(selectedLanguage && { with_original_language: selectedLanguage }),
        ...(selectedSort && { sort_by: selectedSort }),
        ...(selectedKeywords.size > 0 && {
          with_keywords: [...selectedKeywords].join(","),
        }),
      },
    });
  const total_results = data?.pages[0]?.total_results ?? 0;
  const results = data?.pages.flatMap((p) => p.results) ?? [];

  const resetFilter = () => {
    setSelectedGenres(new Set());
    setSelectedNetwork(null);
    setSelectedKeywords(new Set());
    setSelectedYear(null);
    setMinRating(null);
    setMaxRating(null);
    setSelectedLanguage(null);
    setSelectedSort(null);
    settoValue(null);
    setfromValue(null);
  };
  useEffect(() => {
    setSelectedGenres(new Set());
    setSelectedNetwork(null);
    setSelectedKeywords(new Set());
    setSelectedYear(null);
    setSelectedLanguage(null);
    setMinRating(null);
    setMaxRating(null);
    setSelectedSort(null);
    settoValue(null);
    setfromValue(null);
  }, [selectedMedia]);
  const years = Array.from(
    { length: CURRENT_YEAR - 1999 + 1 },
    (_, i) => 1999 + i,
  );

  const safeToYear = toValue ? toValue : 1999;
  const safeFromYear = fromValue ? fromValue : 1999;
  const fromYear = Array.from(
    { length: CURRENT_YEAR - safeToYear + 1 },
    (_, i) => safeToYear + i,
  );

  const rating = Array.from({ length: 10 }, (_, i) => i + 1);
  const safeMinRating = minRating ? minRating : 1;
  const safeMaxRating = maxRating ? maxRating : 1;
  const dynamicMaxRating = Array.from(
    { length: 10 - safeMinRating + 1 },
    (_, i) => i + safeMinRating,
  );
  useEffect(() => {
    if (safeFromYear < safeToYear && fromValue !== null) {
      setfromValue(safeToYear);
    }
  }, [toValue]);
  useEffect(() => {
    if (safeMaxRating < safeMinRating && maxRating !== null) {
      setMaxRating(safeMinRating);
    }
  }, [minRating]);

  //FIND
  const selectedLanguageLabel = languages.find(
    (lang) => lang.code === selectedLanguage,
  )?.name;
  const selectedNetworkLabel = (
    selectedMedia === "movie" ? productionCompanies : tvNetworks
  ).find((network) => network.id === selectedNetwork)?.name;
  //FILTERS
  const selectedGenreLabels = (
    selectedMedia === "movie" ? movieGenres : tvGenres
  ).filter((genre) => selectedGenres.has(genre.id));
  const selectedKeywordLabels = keywordTopics.filter((key) =>
    selectedKeywords.has(key.value),
  );

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);
  return (
    <div className=" space-y-2 lg:py-25 py-15 mx-auto lg:w-[85%] w-[95%]">
      <div className="space-y-4 py-4">
        <div className="flex justify-end items-end ">
          {/* <Select
            value={selectedMedia}
            onValueChange={(value) => setSelectedMedia(value as "movie" | "tv")}
          >
            <SelectTrigger className="">
              <SelectValue placeholder="Movie" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="movie">Movie</SelectItem>
                <SelectItem value="tv">TV Show</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select> */}
          <div className="flex items-center gap-2">
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectItem value="popularity.desc">
                    Popularity (High → Low)
                  </SelectItem>
                  <SelectItem value="popularity.asc">
                    Popularity (Low → High)
                  </SelectItem>

                  <SelectItem value="vote_average.desc">
                    Rating (High → Low)
                  </SelectItem>
                  <SelectItem value="vote_average.asc">
                    Rating (Low → High)
                  </SelectItem>

                  <SelectItem value="release_date.desc">
                    Release Date (Newest)
                  </SelectItem>
                  <SelectItem value="release_date.asc">
                    Release Date (Oldest)
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>

            <Drawer
              direction={isMobile ? "bottom" : "left"}
              repositionInputs={false}
            >
              <DrawerTrigger asChild>
                <Button variant="destructive">
                  <IconFilter2Bolt /> Advance Filter
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-[50vh] lg:h-screen">
                <DrawerHeader className="p-2 lg:p-4 hidden lg:flex">
                  <DrawerTitle className="text-lg tracking-wide">
                    <TitleReusable
                      title="Advanced Filters"
                      description=""
                      Icon={IconFilterPlus}
                      textColor="text-red-700/70"
                      titleSize="lg:text-lg text-base"
                    />
                  </DrawerTitle>
                  <DrawerDescription className="text-left">
                    Customize your search using genres, years, networks, and
                    more.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="overflow-auto custom-scrollbar space-y-3">
                  <div className="lg:p-4 p-2 lg:space-y-3 space-y-1">
                    <h1 className="font-medium text-sm lg:text-base flex gap-3 items-end justify-between">
                      {yearType ? " Year Range" : "Released Year"}
                      <Button
                        size="icon"
                        variant="secondary"
                        onClick={() => setYearType((prev) => !prev)}
                      >
                        {yearType ? <Calendar /> : <IconTransfer />}
                      </Button>
                    </h1>
                    {yearType ? (
                      <div className="flex gap-2 items-center">
                        <CommandComponent
                          value={toValue}
                          setValue={settoValue}
                          years={years}
                          placeholder="To"
                          label="year"
                        />
                        <Separator className="w-10! bg-border" />
                        <CommandComponent
                          value={fromValue}
                          setValue={setfromValue}
                          years={fromYear}
                          placeholder="From"
                          label="year"
                        />
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {Array.from(
                          { length: CURRENT_YEAR - 1999 + 1 },
                          (_, i) => 1999 + i,
                        )
                          .slice(expandYear ? 0 : 21)
                          .map((year) => (
                            <Button
                              key={year}
                              size="xl"
                              className="flex-1 tracking-wide"
                              // use selectedYear to determine variant
                              variant={
                                selectedYear === year
                                  ? "destructive"
                                  : "secondary"
                              }
                              onClick={
                                () =>
                                  setSelectedYear((prev) =>
                                    prev === year ? null : year,
                                  ) // toggle
                              }
                            >
                              {year}
                            </Button>
                          ))}
                        <Button
                          onClick={() => setExpandYear((prev) => !prev)}
                          size="xl"
                          variant="secondary"
                        >
                          {expandYear ? <Minus /> : <Plus />}
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="lg:p-4 p-2 lg:space-y-3 space-y-1">
                    <h1 className="font-medium text-sm lg:text-base flex gap-3 items-end justify-between">
                      Rating Range
                    </h1>
                    <div className="flex gap-2 items-center">
                      <CommandComponent
                        value={minRating}
                        setValue={setMinRating}
                        years={rating}
                        placeholder="Min"
                        label="rating"
                      />
                      <Separator className="w-10! bg-border" />
                      <CommandComponent
                        value={maxRating}
                        setValue={setMaxRating}
                        years={dynamicMaxRating}
                        placeholder="Max"
                        label="rating"
                      />
                    </div>
                  </div>
                  <div className=" lg:p-4 p-2 lg:space-y-3 space-y-1">
                    <h1 className="font-medium text-sm lg:text-base">
                      Companies{" "}
                      <span className="text-red-500">
                        {!selectedNetwork ? "" : "(1)"}
                      </span>
                    </h1>
                    <div className="flex flex-wrap gap-2">
                      {(selectedMedia === "tv"
                        ? tvNetworks
                        : productionCompanies
                      )
                        .slice(
                          0,
                          expandCompanies
                            ? (selectedMedia === "tv"
                                ? tvNetworks
                                : productionCompanies
                              ).length
                            : 4,
                        )
                        .map((network) => (
                          <Button
                            variant={
                              selectedNetwork === network.id
                                ? "destructive"
                                : "secondary"
                            }
                            className="flex-1"
                            key={network.id}
                            size="xl"
                            onClick={() =>
                              setSelectedNetwork((prev) =>
                                prev === network.id ? null : network.id,
                              )
                            }
                          >
                            {network.name}
                          </Button>
                        ))}
                      <Button
                        onClick={() => setExpandCompanies((prev) => !prev)}
                        size="xl"
                        variant="secondary"
                      >
                        {expandCompanies ? <Minus /> : <Plus />}
                      </Button>
                    </div>
                  </div>
                  <div className="lg:p-4 p-2 lg:space-y-3 space-y-1">
                    <h1 className="font-medium text-sm lg:text-base">
                      Languages{" "}
                      <span className="text-red-500">
                        {!selectedLanguage ? "" : `(1)`}
                      </span>
                    </h1>
                    <div className="flex flex-wrap gap-2">
                      {languages
                        .slice(0, expandLanguage ? languages.length : 5)
                        .map((lang) => (
                          <Button
                            key={lang.code}
                            size="xl"
                            variant={
                              selectedLanguage === lang.code
                                ? "destructive"
                                : "secondary"
                            }
                            onClick={() =>
                              setSelectedLanguage((prev) =>
                                prev === lang.code ? null : lang.code,
                              )
                            }
                            className="flex-1"
                          >
                            {lang.name}
                          </Button>
                        ))}
                      <Button
                        variant="secondary"
                        size="xl"
                        onClick={() => setExpandLanguage((prev) => !prev)}
                      >
                        {expandLanguage ? <Minus /> : <Plus />}
                      </Button>
                    </div>
                  </div>
                  <div className=" lg:p-4 p-2 lg:space-y-3 space-y-1">
                    <h1 className="font-medium text-sm lg:text-base">
                      Keywords{" "}
                      <span className="text-red-500">
                        {selectedKeywords.size === 0
                          ? ""
                          : `(${selectedKeywords.size})`}
                      </span>
                    </h1>
                    <div className="flex flex-wrap gap-2">
                      {keywordTopics
                        .slice(0, expandKeyword ? keywordTopics.length : 5)
                        .map((meow) => (
                          <Button
                            variant={
                              selectedKeywords.has(meow.value)
                                ? "destructive"
                                : "secondary"
                            }
                            className="flex-1"
                            key={meow.value}
                            size="xl"
                            onClick={() => toggleKeywords(meow.value)}
                          >
                            {meow.label}
                          </Button>
                        ))}
                      <Button
                        variant="secondary"
                        size="xl"
                        onClick={() => setExpandKeyword((prev) => !prev)}
                      >
                        {expandKeyword ? <Minus /> : <Plus />}
                      </Button>
                    </div>
                  </div>
                </div>
                <DrawerFooter className=" grid grid-cols-2">
                  <Button className="" onClick={resetFilter}>
                    Reset <IconRefresh />
                  </Button>

                  <DrawerClose asChild>
                    <Button variant="outline" className="">
                      Close <IconX />
                    </Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {(selectedMedia === "tv" ? tvGenres : movieGenres)
            .slice(
              0,
              expandGenre
                ? (selectedMedia === "tv" ? tvGenres : movieGenres).length
                : isMobile
                  ? 5
                  : 9,
            )
            .map((genre) => (
              <span
                key={genre.id}
                className={`flex-1 flex flex-col gap-1 p-4 lg:min-w-35 border rounded-md cursor-pointer  ${selectedGenres.has(genre.id) ? "text-foreground" : " text-muted-foreground"}`}
                onClick={() => toggleGenre(genre.id)}
              >
                <genre.icon className=" lg:size-8 size-6" />
                <p className="line-clamp-1 font-medium lg:text-base text-sm">
                  {genre.name}
                </p>
              </span>
            ))}
          <span
            className="flex-1 flex flex-col gap-1 p-4 min-w-35 border rounded-md font-medium lg:text-base text-sm"
            onClick={() => setExpandGenre((prev) => !prev)}
          >
            {expandGenre ? (
              <Minus className=" lg:size-8 size-6" />
            ) : (
              <Plus className=" lg:size-8 size-6" />
            )}
            {expandGenre ? "Collapse" : "Expand"}
          </span>
        </div>
        {hasAnyFilter && (
          <div className="flex gap-3">
            <h1 className="text-sm font-medium">Active filter:</h1>
            <div className="flex flex-wrap gap-1">
              {selectedGenreLabels.map((genre) => (
                <Badge
                  className="cursor-pointer"
                  key={genre.id}
                  variant="secondary"
                  onClick={() =>
                    setSelectedGenres((prev) => {
                      const next = new Set(prev);
                      next.delete(genre.id);
                      return next;
                    })
                  }
                >
                  {genre.name} <IconX />
                </Badge>
              ))}
              {selectedKeywordLabels.map((keyword) => (
                <Badge
                  className="cursor-pointer"
                  key={keyword.label}
                  variant="secondary"
                  onClick={() =>
                    setSelectedKeywords((prev) => {
                      const next = new Set(prev);
                      next.delete(keyword.value);
                      return next;
                    })
                  }
                >
                  {keyword.label} <IconX />
                </Badge>
              ))}
              {selectedLanguageLabel && (
                <Badge
                  className="cursor-pointer"
                  variant="secondary"
                  onClick={() => setSelectedLanguage(null)}
                >
                  {selectedLanguageLabel} <IconX />
                </Badge>
              )}
              {selectedNetworkLabel && (
                <Badge
                  className="cursor-pointer"
                  variant="secondary"
                  onClick={() => setSelectedNetwork(null)}
                >
                  {selectedNetworkLabel} <IconX />
                </Badge>
              )}
              {(minRating || maxRating) && (
                <div className="flex items-center gap-2">
                  {minRating && (
                    <Badge
                      className="cursor-pointer"
                      variant="secondary"
                      onClick={() => setMinRating(null)}
                    >
                      Min - {minRating}
                      <IconX />
                    </Badge>
                  )}

                  {maxRating && (
                    <Badge
                      className="cursor-pointer"
                      variant="secondary"
                      onClick={() => setMaxRating(null)}
                    >
                      Max - {maxRating}
                      <IconX />
                    </Badge>
                  )}
                </div>
              )}
              {yearType
                ? (fromValue || toValue) && (
                    <div className="flex items-center gap-2">
                      {fromValue && (
                        <Badge
                          className="cursor-pointer"
                          variant="secondary"
                          onClick={() => setfromValue(null)}
                        >
                          From - {fromValue}
                          <IconX />
                        </Badge>
                      )}

                      {toValue && (
                        <Badge
                          className="cursor-pointer"
                          variant="secondary"
                          onClick={() => settoValue(null)}
                        >
                          To - {toValue}
                          <IconX />
                        </Badge>
                      )}
                    </div>
                  )
                : selectedYear && (
                    <Badge
                      className="cursor-pointer"
                      variant="secondary"
                      onClick={() => setSelectedYear(null)}
                    >
                      {selectedYear}
                      <IconX />
                    </Badge>
                  )}
            </div>
          </div>
        )}
      </div>

      {!hasAnyFilter ? (
        <div className="flex justify-center items-center h-[calc(100vh-400px)]">
          <div className="flex justify-center items-center flex-col">
            <IconFilter2Bolt className="lg:size-10 size-8" />
            <h1 className="lg:text-xl text-base font-medium mt-3">
              No Selected Filter
            </h1>
            <p className="text-muted-foreground lg:tex-base text-sm">
              Results will show here.
            </p>
          </div>
        </div>
      ) : isLoading ? (
        <div className={`grid py-20 ${GRID_CONFIG[density]}`}>
          {[...Array(7)].map((_, i) => (
            <SkeletonCard1 key={i} />
          ))}
        </div>
      ) : results.filter((f) => f.poster_path).length === 0 ? (
        <div className="flex justify-center items-center h-[calc(100vh-400px)]">
          <div className="flex justify-center items-center flex-col">
            <IconFilter2X className="lg:size-10 size-8" />
            <h1 className="lg:text-xl text-base font-medium mt-3">
              No Data Found
            </h1>
            <p className="text-muted-foreground">
              Try another filter combination.
            </p>
          </div>
        </div>
      ) : (
        <div className="lg:py-5">
          <span className="p-2 text-end">
            <h1 className="text-sm text-muted-foreground">Total results -</h1>
            <h1 className="text-lg font-medium">
              {" "}
              {formatTotalResults(total_results)}
            </h1>
          </span>
          <div className={`grid ${GRID_CONFIG[density]}`}>
            {results
              .filter((f) => f.poster_path)
              .map((result, idx) => (
                <MovieCard
                  key={`${idx}=${result.id}`}
                  movie={result}
                  media_type={selectedMedia}
                />
              ))}

            {isFetchingNextPage &&
              [...Array(7)].map((_, i) => (
                <div key={i} className="">
                  <Skeleton className="aspect-2/3" />
                  <div className="mt-3 space-y-1">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-1/3" />
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}
      <div ref={ref} className="grid place-items-center">
        {isFetchingNextPage && (
          <p className="flex gap-2 animate-pulse text-muted-foreground">
            fetching data...
            <IconLoader className="animate-spin" />
          </p>
        )}
      </div>
      <ScrollToTop />
    </div>
  );
}

function CommandComponent({
  // open,
  // setOpen,
  value,
  years,
  setValue,
  placeholder,
  disabled,
  label,
}: {
  // open: boolean;
  // setOpen: (open: boolean) => void;
  value: number | null;
  years: number[];
  setValue: (value: number | null) => void;
  placeholder: string;
  disabled?: boolean;
  label: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild className="flex-1">
        <Button
          variant={!value ? "secondary" : "destructive"}
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
          size="xl"
        >
          {value !== null ? value : placeholder}
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className=" p-0">
        <Command>
          <CommandInput
            placeholder={`Search ${label}...`}
            className="h-9 capitalize"
          />
          <CommandList>
            <CommandEmpty>{`No ${label} found.`}</CommandEmpty>
            <CommandGroup>
              <CommandItem
                onSelect={() => {
                  setValue(null);
                  setOpen(false);
                }}
              >
                Reset...
              </CommandItem>
              {years.map((year) => (
                <CommandItem
                  key={year}
                  value={String(year)}
                  onSelect={() => {
                    setValue(year);
                    setOpen(false);
                  }}
                >
                  {year}{" "}
                  {label === "rating" && <IconCarambolaFilled color="yellow" />}
                  <Check
                    className={cn(
                      "ml-auto",
                      value === year ? "opacity-100" : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
const languages = [
  { code: "en", name: "English" },
  { code: "tl", name: "Filipino" },
  { code: "ko", name: "Korean" },
  { code: "ja", name: "Japanese" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "es", name: "Spanish" },
  { code: "it", name: "Italian" },
  { code: "zh", name: "Chinese" },
  { code: "hi", name: "Hindi" },
  { code: "ru", name: "Russian" },
  { code: "pt", name: "Portuguese" },
  { code: "sv", name: "Swedish" },
  { code: "nl", name: "Dutch" },
  { code: "tr", name: "Turkish" },
  { code: "pl", name: "Polish" },
  { code: "da", name: "Danish" },
  { code: "no", name: "Norwegian" },
  { code: "fi", name: "Finnish" },
  { code: "he", name: "Hebrew" },
  { code: "ar", name: "Arabic" },
];
const formatTotalResults = (total: number) => {
  if (total >= 10000) return "9,999+";
  return total.toLocaleString();
};
