"use client";

import { motion } from "framer-motion";

export interface FrameOption {
  id: string;
  name: string;
  borderColor: string;
  borderWidth: number;
  innerBorderColor?: string;
  priceAddon: number;
}

export const frameOptions: FrameOption[] = [
  { id: "none", name: "No Frame", borderColor: "transparent", borderWidth: 0, priceAddon: 0 },
  { id: "thin-black", name: "Thin Black", borderColor: "#1A1A1A", borderWidth: 3, priceAddon: 500 },
  { id: "dark-walnut", name: "Dark Walnut", borderColor: "#3E2723", borderWidth: 5, innerBorderColor: "#5D4037", priceAddon: 1200 },
  { id: "natural-wood", name: "Natural Oak", borderColor: "#8B6F47", borderWidth: 5, innerBorderColor: "#A0845C", priceAddon: 1000 },
  { id: "gilded-gold", name: "Gilded Gold", borderColor: "#C8A96E", borderWidth: 5, innerBorderColor: "#D4B87A", priceAddon: 2000 },
  { id: "floating-white", name: "Floating White", borderColor: "#F5F0E8", borderWidth: 4, priceAddon: 1500 },
];

interface FrameSelectorProps {
  selected: string;
  onSelect: (frame: string) => void;
  basePrice: number;
}

export default function FrameSelector({ selected, onSelect }: FrameSelectorProps) {
  return (
    <div className="space-y-3">
      <h4 className="text-text-secondary text-xs tracking-widest uppercase">
        Frame Style
      </h4>
      <div className="grid grid-cols-3 gap-3">
        {frameOptions.map((frame) => {
          const isSelected = selected === frame.id;
          return (
            <motion.button
              key={frame.id}
              onClick={() => onSelect(frame.id)}
              whileTap={{ scale: 0.97 }}
              className={`relative flex flex-col items-center gap-2 p-3 border transition-colors duration-200 ${
                isSelected
                  ? "border-gold bg-gold/5"
                  : "border-border-subtle hover:border-white/10"
              }`}
            >
              {isSelected && (
                <motion.div
                  layoutId="frame-selection"
                  className="absolute inset-0 border-2 border-gold pointer-events-none"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              {/* Vertical frame preview thumbnail */}
              <div className="relative">
                {frame.id === "none" ? (
                  <div className="w-8 h-11 bg-bg-secondary/50 border border-border-subtle" />
                ) : (
                  <div
                    className="w-10 h-14 flex items-center justify-center"
                    style={{
                      border: `${frame.borderWidth}px solid ${frame.borderColor}`,
                      boxShadow: frame.innerBorderColor
                        ? `inset 0 0 0 1px ${frame.innerBorderColor}`
                        : undefined,
                    }}
                  >
                    <div className="w-full h-full bg-bg-secondary/30" />
                  </div>
                )}
              </div>
              <span className="text-[10px] text-text-secondary text-center leading-tight">
                {frame.name}
              </span>
              {frame.priceAddon > 0 ? (
                <span className="text-[10px] text-gold font-[family-name:var(--font-mono)]">
                  +₹{(frame.priceAddon / 100).toFixed(0)}
                </span>
              ) : (
                <span className="text-[10px] text-text-secondary font-[family-name:var(--font-mono)]">
                  Free
                </span>
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
