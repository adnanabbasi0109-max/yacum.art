"use client";

import { useEffect, useRef } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { useUiStore } from "@/store/uiStore";

export default function CustomCursor() {
  const cursorVariant = useUiStore((s) => s.cursorVariant);
  const dotRef = useRef<HTMLDivElement>(null);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { damping: 25, stiffness: 250 });
  const springY = useSpring(mouseY, { damping: 25, stiffness: 250 });

  useEffect(() => {
    const isTouchDevice = "ontouchstart" in window;
    if (isTouchDevice) return;

    const move = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mouseX, mouseY]);

  // Hide on mobile
  const isView = cursorVariant === "view";
  const isHover = cursorVariant === "hover";

  return (
    <>
      {/* Dot */}
      <motion.div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none hidden md:block"
        style={{
          x: mouseX,
          y: mouseY,
          width: 4,
          height: 4,
          borderRadius: "50%",
          backgroundColor: "#ffffff",
          transform: "translate(-50%, -50%)",
        }}
      />
      {/* Circle */}
      <motion.div
        className="fixed top-0 left-0 z-[9998] pointer-events-none hidden md:flex items-center justify-center"
        style={{
          x: springX,
          y: springY,
          transform: "translate(-50%, -50%)",
        }}
        animate={{
          width: isView ? 80 : isHover ? 48 : 32,
          height: isView ? 80 : isHover ? 48 : 32,
          borderColor: isView
            ? "rgba(255,255,255,0.7)"
            : "rgba(255,255,255,0.4)",
        }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        <div
          className="rounded-full border"
          style={{
            width: "100%",
            height: "100%",
            borderColor: "inherit",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {isView && (
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gold text-xs font-medium tracking-wider"
            >
              View
            </motion.span>
          )}
        </div>
      </motion.div>
    </>
  );
}
