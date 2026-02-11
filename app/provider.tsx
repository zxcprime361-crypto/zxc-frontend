"use client";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Tailspin } from "ldrs/react";
import "ldrs/react/Tailspin.css";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
import logo from "@/assets/zxczxc.svg";
import SearchModal from "./search-components/search-modal";
import { Toaster } from "@/components/ui/sonner";
import { usePathname } from "next/navigation";
import { useLastPlayed } from "@/store/now-playing-store";
import { useIsMobile } from "@/hook/use-mobile";
import NavBar from "./nav-desktop";
import MobileNavBar from "./nav-mobile";
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
import { Button } from "@/components/ui/button";
import ChangeLogs from "./changelogs";
export default function Provider({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const setMainPlayerActive = useLastPlayed((s) => s.setMainPlayerActive);
  const [queryClient] = useState(() => new QueryClient());
  const [search, setSearch] = useState(false);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        })
        .then((registration) => {
          console.log("Service Worker registered:", registration);
        })
        .catch((error) => {
          console.log("Service Worker registration failed:", error);
        });
    }
  }, []);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  useEffect(() => {
    if (!pathname.startsWith("/watch")) {
      setMainPlayerActive(false);
    }
  }, [pathname]);

  return (
    <QueryClientProvider client={queryClient}>
      <AnimatePresence mode="wait">
        {!isMounted && (
          <motion.div
            key="loader"
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            className="fixed inset-0 z-999 flex flex-col items-center justify-center bg-black backdrop-blur-2xl gap-4"
          >
            <img src={logo.src} className="size-14 animate-pulse" alt="logo" />
            <Tailspin size="20" stroke="3" speed="0.9" color="white" />
          </motion.div>
        )}
      </AnimatePresence>

      {isMounted && (
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {/* <ChangeLogs /> */}
          {(search || isMobile) && <SearchModal />}
          {/* <Navigation setSearch={setSearch} search={search} /> */}
          <NavBar />
          <MobileNavBar />
          <div>{children}</div>

          <Toaster />
        </ThemeProvider>
      )}
    </QueryClientProvider>
  );
}
