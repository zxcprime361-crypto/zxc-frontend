import { create } from "zustand";
import { persist } from "zustand/middleware";

// --- Types ---
interface VideoProgress {
  id: string;
  title: string;
  media_type: string;
  backdrop: string;

  season?: number;
  episode?: number;
  currentTime: number;
  duration: number;
  lastUpdated: number; // new field
}

interface VideoProgressState {
  progress: Record<string, VideoProgress>;
  saveProgress: (
    key: string,
    currentTime: number,
    duration: number,
    id: string,
    title: string,
    media_type: string,
    backdrop: string,

    season?: number,
    episode?: number,
  ) => void;
  getProgress: (key: string) => VideoProgress | null;
  clearProgress: (key: string) => void;
  clearAll: () => void;
}

const makeKey = (
  media_type: "movie" | "tv",
  id: string,
  season?: number,
  episode?: number,
) => {
  if (media_type === "movie") {
    return `movie-${id}`;
  }

  return `tv-${id}-s${season}-e${episode}`;
};

// --- Store ---
export const useVideoProgressStore = create<VideoProgressState>()(
  persist(
    (set, get) => ({
      progress: {},

      saveProgress: (
        key,
        currentTime,
        duration,
        id,
        title,
        media_type,
        backdrop,

        season,
        episode,
      ) =>
        set((state) => ({
          progress: {
            ...state.progress,
            [key]: {
              id,
              title,
              media_type,
              backdrop,

              season,
              episode,
              currentTime,
              duration,
              lastUpdated: Date.now(),
            },
          },
        })),

      getProgress: (key) => get().progress[key] || null,

      clearProgress: (key) =>
        set((state) => {
          const newProgress = { ...state.progress };
          delete newProgress[key];
          return { progress: newProgress };
        }),

      clearAll: () => set({ progress: {} }),
    }),
    { name: "video-progress-storage" },
  ),
);

export { makeKey };
