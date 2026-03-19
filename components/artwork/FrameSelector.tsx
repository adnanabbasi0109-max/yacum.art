"use client";

import { motion } from "framer-motion";

interface FrameOption {
  id: string;
  name: string;
  borderColor: string;
  borderWidth: number;
  priceAddon: number;
}

const frameOptions: FrameOption[] = [
  { id: "thin-black", name: "Thin Black", borderColor: "#1A1A1A", borderWidth: 2, priceAddon: 500 },
  { id: "wide-black", name: "Wide Black", borderColor: "#1A1A1A", borderWidth: 6, priceAddon: 800 },
  { id: "natural-wood", name: "Natural Wood", borderColor: "#8B6F47", borderWidth: 4, priceAddon: 1000 },
  { id: "dark-walnut", name: "Dark Walnut", borderColor: "#3E2723", borderWidth: 4, priceAddon: 1200 },
  { id: "gilded-gold", name: "Gilded Gold", borderColor: "#C8A96E", borderWidth: 4, priceAddon: 2000 },
  { id: "floating-mount", name: "Floating Mount", borderColor: "#F5F0E8", borderWidth: 3, priceAddon: 1500 },
];

interface FrameSelectorProps {
  selected: string;
  onSelect: (frame: string) => void;
  basePrice: number;
}

export default function FrameSelector({ selected, onSelect, basePrice }: FrameSelectorProps) {
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
              {/* Frame preview thumbnail */}
              <div
                className="w-10 h-12 bg-bg-primary"
                style={{
                  border: `${frame.borderWidth}px solid ${frame.borderColor}`,
                }}
              />
              <span className="text-[10px] text-text-secondary text-center leading-tight">
                {frame.name}
              </span>
              <span className="text-[10px] text-gold font-[family-name:var(--font-mono)]">
                +${(frame.priceAddon / 100).toFixed(2)}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
