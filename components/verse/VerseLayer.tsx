"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { MeaningLayer } from "@/data/verses";

interface VerseLayerProps {
  layer: MeaningLayer;
  isOpen: boolean;
  onToggle: () => void;
}

export default function VerseLayer({ layer, isOpen, onToggle }: VerseLayerProps) {
  return (
    <div className="border-b border-border-subtle last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 py-3 text-left group"
        aria-expanded={isOpen}
      >
        {/* Gold depth circle */}
        <span className="w-7 h-7 rounded-full border border-gold flex items-center justify-center shrink-0">
          <span className="text-xs text-gold font-[family-name:var(--font-mono)]">
            {layer.depth}
          </span>
        </span>

        {/* Label */}
        <span className="text-sm text-text-primary group-hover:text-gold transition-colors duration-300 flex-1">
          {layer.label}
        </span>

        {/* Chevron */}
        <motion.svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
          className="text-text-secondary shrink-0"
        >
          <path
            d="M4 6L8 10L12 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </motion.svg>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="overflow-hidden"
          >
            <p className="text-text-secondary text-sm leading-relaxed pb-4 pl-10">
              {layer.content}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
