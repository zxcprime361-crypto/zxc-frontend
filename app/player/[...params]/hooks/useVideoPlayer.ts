import {
  makeKey,
  useVideoProgressStore,
} from "@/store-player/videoProgressStore";
import { useEffect, useRef, useState } from "react";

export function useVideoPlayer({
  videoRef,
  id,
  media_type,
  season,
  episode,
  title,
  backdrop,
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  id: string;
  media_type: string;
  season: number;
  episode: number;
  title: string;
  backdrop: string;
}) {
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [buffered, setBuffered] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isEnded, setIsEnded] = useState(false);
  const isSeekingRef = useRef(false);
  const [isPiPActive, setIsPiPActive] = useState(false);
  const [isFiveMinutesLeft, setIsFiveMinutesLeft] = useState(false);
  const fiveMinutesThreshold = 180;
  const progressKey =
    media_type === "movie"
      ? makeKey("movie", id)
      : makeKey("tv", id, season, episode);
  const restoredRef = useRef(false);
  console.log("eeeeeeeeee", isEnded);
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onEnded = () => {
      setIsEnded(true);
      useVideoProgressStore.getState().clearProgress(progressKey);
    };

    const onTimeUpdate = () => {
      if (!restoredRef.current) return;
      if (video.currentTime < 1) return;

      if (!isSeekingRef.current) {
        setCurrentTime(video.currentTime);
      }

      if (video.duration) {
        if (video.duration - video.currentTime <= fiveMinutesThreshold) {
          setIsFiveMinutesLeft(true);
        } else {
          setIsFiveMinutesLeft(false); // reset if user seeks back
        }
      }

      if (id && media_type) {
        const key =
          media_type === "movie"
            ? makeKey("movie", id)
            : makeKey("tv", id, season, episode);

        useVideoProgressStore
          .getState()
          .saveProgress(
            progressKey,
            video.currentTime,
            video.duration,
            id,
            title,
            media_type,
            backdrop,
            season,
            episode,
          );
      }
    };
    const updateBuffered = () => {
      let end = 0;
      for (let i = 0; i < video.buffered.length; i++) {
        end = Math.max(end, video.buffered.end(i));
      }
      setBuffered(end / video.duration);
    };

    // const onLoadedMetadata = () => {
    //   if (!isFinite(video.duration)) return;

    //   setDuration(video.duration);
    //   updateBuffered(); // initialize buffered bar
    // };

    const onLoadedMetadata = () => {
      if (!isFinite(video.duration)) return;

      setDuration(video.duration);
      updateBuffered();

      if (restoredRef.current) return;

      const saved = useVideoProgressStore.getState().getProgress(progressKey);

      if (
        saved &&
        saved.currentTime > 5 &&
        saved.currentTime < video.duration * 0.95
      ) {
        video.currentTime = saved.currentTime;
        setCurrentTime(saved.currentTime);
      }

      restoredRef.current = true;
    };

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    const handleCanPlay = () => setIsInitializing(false);
    const handleLoadStart = () => setIsInitializing(true);
    const handleEnterPiP = () => {
      console.log("Entered Picture-in-Picture");
      setIsPiPActive(true); // optional state
    };

    const handleLeavePiP = () => {
      console.log("Exited Picture-in-Picture");
      setIsPiPActive(false); // optional state
    };
    const handleBufferingStart = () => setIsBuffering(true);
    const handleBufferingEnd = () => setIsBuffering(false);
    const handleSeeking = () => {
      isSeekingRef.current = true;
    };

    const handleSeeked = () => {
      isSeekingRef.current = false;
    };
    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("progress", updateBuffered);
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);
    video.addEventListener("canplay", handleCanPlay); // NEW
    video.addEventListener("loadstart", handleLoadStart); // NEW

    video.addEventListener("waiting", handleBufferingStart); // video is buffering
    video.addEventListener("playing", handleBufferingEnd); // resumed
    video.addEventListener("ended", onEnded);
    video.addEventListener("seeking", handleSeeking);
    video.addEventListener("seeked", handleSeeked);

    video.addEventListener("enterpictureinpicture", handleEnterPiP);
    video.addEventListener("leavepictureinpicture", handleLeavePiP);

    return () => {
      video.removeEventListener("timeupdate", onTimeUpdate);
      video.removeEventListener("progress", updateBuffered);
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      video.removeEventListener("play", onPlay);
      video.removeEventListener("pause", onPause);
      video.removeEventListener("canplay", handleCanPlay); // NEW
      video.removeEventListener("loadstart", handleLoadStart); // NEW
      video.removeEventListener("waiting", handleBufferingStart);
      video.removeEventListener("playing", handleBufferingEnd);
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("seeking", handleSeeking);
      video.removeEventListener("seeked", handleSeeked);
      video.removeEventListener("enterpictureinpicture", handleEnterPiP);
      video.removeEventListener("leavepictureinpicture", handleLeavePiP);
    };
  }, [videoRef, id, media_type, title, backdrop]);

  useEffect(() => {
    restoredRef.current = false;
  }, [videoRef.current?.src]);

  const playVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => {});
    setIsPlaying(true);
  };

  // pause video
  const pauseVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    video.pause();
    setIsPlaying(false);
  };
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) playVideo();
    else pauseVideo();
  };

  const handleSeekChange = (value: number[]) => {
    isSeekingRef.current = true;
    setCurrentTime(value[0]); // preview thumb position
  };
  const handleSeekCommit = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = value[0];
    setCurrentTime(value[0]); // immediately update state
    if (video.currentTime < video.duration) {
      setIsEnded(false);
    }
  };

  const seek = (time: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = time;
      setCurrentTime(time);

      if (time < duration) {
        setIsEnded(false);
      }
    }
  };
  const jump = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = Math.max(
      0,
      Math.min(video.currentTime + seconds, duration),
    );
    seek(newTime);
  };
  const skipTo = (time: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = time;
    setCurrentTime(time);
  };
  const jumpForward10 = () => jump(10);
  const jumpBackward10 = () => jump(-10);
  const skipToTime = (seconds: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = seconds;
    setCurrentTime(seconds);
    setIsEnded(false);
  };
  const togglePiP = async () => {
    if (videoRef.current) {
      try {
        if (document.pictureInPictureElement) {
          // Exit PiP if already in PiP
          await document.exitPictureInPicture();
        } else {
          // Enter PiP
          await videoRef.current.requestPictureInPicture();
        }
      } catch (err) {
        console.error("Failed to toggle PiP:", err);
      }
    }
  };
  return {
    isPlaying,
    currentTime,
    duration,
    buffered,
    isBuffering,
    isInitializing,
    playVideo,
    pauseVideo,
    togglePlay,
    seek,
    handleSeekChange,
    handleSeekCommit,
    ///
    setCurrentTime,
    jumpForward10,
    jumpBackward10,
    isEnded,
    skipTo,
    isFiveMinutesLeft,
    skipToTime,
    isPiPActive,
    togglePiP,
  };
}
