"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";

interface RecitationPlayerProps {
  recitationUrl: string;
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds) || seconds < 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

const speeds = [0.75, 1, 1.25] as const;

const barHeights = [40, 65, 50, 80, 55, 70, 45, 60, 75, 50, 65, 40];

export default function RecitationPlayer({ recitationUrl }: RecitationPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState<(typeof speeds)[number]>(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onLoadedMetadata = () => setDuration(audio.duration);
    const onEnded = () => setPlaying(false);

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, []);

  const togglePlay = useCallback(async () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      await audio.play();
      setPlaying(true);
    }
  }, [playing]);

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const audio = audioRef.current;
      if (!audio || !duration) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
      audio.currentTime = ratio * duration;
      setCurrentTime(audio.currentTime);
    },
    [duration]
  );

  const handleSpeed = useCallback(
    (s: (typeof speeds)[number]) => {
      const audio = audioRef.current;
      if (!audio) return;
      audio.playbackRate = s;
      setSpeed(s);
    },
    []
  );

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="bg-bg-secondary border border-border-subtle rounded-sm p-4 space-y-4">
      <audio ref={audioRef} src={recitationUrl} preload="metadata" />

      {/* Waveform visualization */}
      <div className="flex items-end justify-center gap-1 h-10">
        {barHeights.map((h, i) => (
          <motion.div
            key={i}
            className="w-1 rounded-full bg-gold"
            animate={
              playing
                ? {
                    height: [`${h * 0.3}%`, `${h}%`, `${h * 0.5}%`, `${h * 0.8}%`, `${h * 0.3}%`],
                  }
                : { height: `${h * 0.3}%` }
            }
            transition={
              playing
                ? {
                    duration: 0.8 + i * 0.1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
                : { duration: 0.4 }
            }
          />
        ))}
      </div>

      {/* Controls row */}
      <div className="flex items-center gap-4">
        {/* Play/Pause button */}
        <button
          onClick={togglePlay}
          className="w-14 h-14 rounded-full border border-gold flex items-center justify-center shrink-0 hover:bg-gold/10 transition-colors duration-300"
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="4" y="2" width="3.5" height="14" rx="1" fill="#C8A96E" />
              <rect x="10.5" y="2" width="3.5" height="14" rx="1" fill="#C8A96E" />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M5 2.5L15 9L5 15.5V2.5Z" fill="#C8A96E" />
            </svg>
          )}
        </button>

        {/* Progress and time */}
        <div className="flex-1 space-y-1">
          {/* Progress bar */}
          <div
            className="h-1.5 bg-border-subtle rounded-full cursor-pointer"
            onClick={handleSeek}
          >
            <div
              className="h-full bg-gold rounded-full transition-[width] duration-100"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Time display */}
          <div className="flex justify-between font-[family-name:var(--font-mono)] text-xs text-text-secondary">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>

      {/* Speed toggles */}
      <div className="flex items-center gap-2">
        <span className="text-xs text-text-secondary mr-1">Speed</span>
        {speeds.map((s) => (
          <button
            key={s}
            onClick={() => handleSpeed(s)}
            className={`px-2.5 py-0.5 text-xs rounded-full border transition-colors duration-300 ${
              speed === s
                ? "border-gold bg-gold/15 text-gold"
                : "border-border-subtle text-text-secondary hover:border-gold/40"
            }`}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}
