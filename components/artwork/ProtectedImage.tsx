"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";

interface ProtectedImageProps {
  src: string;
  alt: string;
  fill?: boolean;
  width?: number;
  height?: number;
  className?: string;
  sizes?: string;
  priority?: boolean;
  unoptimized?: boolean;
}

export default function ProtectedImage({
  src,
  alt,
  fill,
  width,
  height,
  className,
  sizes,
  priority,
  unoptimized,
}: ProtectedImageProps) {
  const [blurred, setBlurred] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Blur when page loses visibility (screenshot tools, screen capture, tab switch)
    const handleVisibility = () => {
      if (document.hidden) {
        setBlurred(true);
      } else {
        // Small delay before unblurring to catch quick screenshot attempts
        setTimeout(() => setBlurred(false), 300);
      }
    };

    // Detect PrintScreen and screenshot shortcuts
    const handleKeyDown = (e: KeyboardEvent) => {
      // PrintScreen
      if (e.key === "PrintScreen") {
        e.preventDefault();
        setBlurred(true);
        triggerWarning();
        setTimeout(() => setBlurred(false), 2000);
      }
      // Cmd+Shift+3/4/5 (macOS screenshots)
      if (e.metaKey && e.shiftKey && ["3", "4", "5"].includes(e.key)) {
        setBlurred(true);
        triggerWarning();
        setTimeout(() => setBlurred(false), 2000);
      }
      // Ctrl+Shift+S (various screenshot tools)
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "s") {
        e.preventDefault();
        setBlurred(true);
        triggerWarning();
        setTimeout(() => setBlurred(false), 2000);
      }
    };

    // Blur on window blur (screen sharing, screenshot tools that steal focus)
    const handleWindowBlur = () => {
      setBlurred(true);
    };
    const handleWindowFocus = () => {
      setTimeout(() => setBlurred(false), 200);
    };

    document.addEventListener("visibilitychange", handleVisibility);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("blur", handleWindowBlur);
    window.addEventListener("focus", handleWindowFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("blur", handleWindowBlur);
      window.removeEventListener("focus", handleWindowFocus);
    };
  }, []);

  const triggerWarning = () => {
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 3000);
  };

  // Prevent right-click
  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    triggerWarning();
  };

  // Prevent drag
  const handleDragStart = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      ref={containerRef}
      className="relative overflow-hidden"
      style={{ userSelect: "none", WebkitUserSelect: "none" }}
      onContextMenu={handleContextMenu}
      onDragStart={handleDragStart}
    >
      {/* The actual image */}
      <div
        className="transition-all duration-300"
        style={{
          filter: blurred ? "blur(30px) brightness(0.3)" : "none",
          transform: blurred ? "scale(1.1)" : "scale(1)",
        }}
      >
        <Image
          src={src}
          alt={alt}
          fill={fill}
          width={width}
          height={height}
          className={className}
          sizes={sizes}
          priority={priority}
          unoptimized={unoptimized}
          draggable={false}
          onContextMenu={handleContextMenu}
        />
      </div>

      {/* Invisible overlay to prevent direct image interaction */}
      <div
        className="absolute inset-0 z-10"
        style={{
          WebkitTouchCallout: "none",
          WebkitUserSelect: "none",
          userSelect: "none",
        }}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
      />

      {/* Warning message */}
      {showWarning && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-bg-primary/80 backdrop-blur-sm">
          <div className="text-center px-6">
            <div className="w-12 h-12 mx-auto mb-3 border border-gold/30 rounded-full flex items-center justify-center">
              <svg
                className="w-6 h-6 text-gold"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
                />
              </svg>
            </div>
            <p className="text-gold text-sm font-[family-name:var(--font-display)] italic">
              This artwork is protected
            </p>
            <p className="text-text-secondary text-xs mt-1">
              Screenshots are not allowed
            </p>
          </div>
        </div>
      )}

      {/* Blurred state overlay */}
      {blurred && !showWarning && (
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="w-8 h-8 border border-gold/20 rounded-full flex items-center justify-center">
            <svg
              className="w-4 h-4 text-gold/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
              />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
}
