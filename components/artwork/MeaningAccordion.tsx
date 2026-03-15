"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MeaningLayer } from "@/data/verses";

interface MeaningAccordionProps {
  layers: MeaningLayer[];
}

const depthLabels: Record<number, string> = {
  1: "Literal",
  2: "Tafsir",
  3: "Spiritual",
  4: "Cosmological",
};

export default function MeaningAccordion({ layers }: MeaningAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-0">
      {layers.map((layer, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={layer.depth} className="border-b border-border-subtle">
            <button
              onClick={() => toggle(index)}
              className="w-full flex items-center gap-3 py-4 text-left group"
            >
              {/* Gold depth circle */}
              <span className="flex-shrink-0 w-7 h-7 rounded-full border border-gold/40 flex items-center justify-center">
                <span className="text-gold text-xs font-[family-name:var(--font-mono)]">
                  {layer.depth}
                </span>
              </span>

              {/* Label */}
              <span className="text-text-primary text-sm tracking-wide flex-1 group-hover:text-gold transition-colors duration-200">
                {depthLabels[layer.depth] || layer.label}
              </span>

              {/* Expand/collapse icon */}
              <motion.span
                animate={{ rotate: isOpen ? 45 : 0 }}
                transition={{ duration: 0.2 }}
                className="text-text-secondary text-lg leading-none"
              >
                +
              </motion.span>
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
      })}
    </div>
  );
}
