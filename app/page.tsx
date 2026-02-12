"use client";
import { usePathname, useSearchParams } from "next/navigation";
import LandingPage from "./landing-components/landing-page";
import ReusableSwiper from "./reusable-display";
import { movie_endpoints } from "@/constants/movie-endpoints";
import { AnimatePresence, motion } from "motion/react";
import SearchResult from "./search-components/search-results";
import Header from "./header";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { shuffleArray } from "@/lib/shuffle";
import { useMemo } from "react";
import ContinueWatching from "./continue-watching";
import Footer from "./footer";
import StreamProviders from "./stream-provider";
export default function Home() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const isSearching = Boolean(query);
  const pathname = usePathname();
  const custom_list = useMemo(() => {
    return shuffleArray([
      {
        id: "39328ae3eac6c1608c8a7c985bb8a31b:930cb1687beb924d3189a43835fd993c",
        media_type: "movie",
        custom_image: "",
        custom_logo: "",
      },

      // {
      //   id: 1062722,
      //   media_type: "movie",
      //   custom_image: "/uALGYsvHpRb8ABCvsu9f8Z7BKi7.jpg",
      //   custom_logo: "",
      // },
      // {
      //   id: 1218925,
      //   media_type: "movie",
      //   custom_image: "/gqTz24ZRsCP6AKjARmEivY7m0cK.jpg",
      //   custom_logo: "",
      // },
      // {
      //   id: 60625,
      //   media_type: "tv",
      //   custom_image: "/o8kotfqa2w5iX8hptIocMx1HOkV.jpg",
      //   custom_logo: "",
      // },
      // {
      //   id: 66732,
      //   media_type: "tv",
      //   custom_image: "/hTWtybOC91veCgHAVt3ULZnj4up.jpg",
      //   custom_logo: "/wx1Gm17tExax4qYB6mXPnc1UZB0.svg",
      // },
      // {
      //   id: 1242898,
      //   media_type: "movie",
      //   custom_image: "/kWyc8n6tmST0Uedxlg7WGIoBWTU.jpg",
      //   custom_logo: "",
      // },
      // { id: 803796, media_type: "movie", custom_image: "", custom_logo: "" },
      // {
      //   id: 1184918,
      //   media_type: "movie",
      //   custom_image: "/dlsglLDRgrtLIdnjvOXVETMslmb.jpg",
      //   custom_logo: "/phhAK2k36JYA87qDHTke0hcGiJf.png",
      // },
    ]);
  }, []);
  return (
    <>
      <LandingPage custom_list={custom_list} />
      <AnimatePresence mode="wait">
        {isSearching ? (
          <motion.div
            key="search"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              transition: {
                delay: 0.2,
                ease: "easeInOut",
              },
            }}
            exit={{
              opacity: 0,
              transition: {
                delay: 0.1,
                ease: "easeInOut",
              },
            }}
          >
            <SearchResult />
          </motion.div>
        ) : (
          <>
            <StreamProviders />
            <ContinueWatching />

            {movie_endpoints.map((tv) => (
              <ReusableSwiper
                key={tv.id}
                id={tv.id}
                endpoint={tv.endpoint}
                params={tv.params}
                displayName={tv.displayName}
                label={tv.label}
                type={tv.type}
              />
            ))}
          </>
        )}
      </AnimatePresence>
      <Footer />
      <ScrollToTop />
    </>
  );
}

//  <>
//       <LandingPage />
//       {movie_endpoints.map((tv) => (
//         <ReusableSwiper
//           key={tv.id}
//           id={tv.id}
//           endpoint={tv.endpoint}
//           params={tv.params}
//           displayName={tv.displayName}
//           label={tv.label}
//           type={tv.type}
//         />
//       ))}
//     </>
