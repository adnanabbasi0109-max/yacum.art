"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { Artwork } from "@/types/artwork";
import ArtworkCard from "@/components/artwork/ArtworkCard";

interface ArtworkGridProps {
  artworks: Artwork[];
}

function AnimatedItem({ artwork, index }: { artwork: Artwork; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{
        duration: 0.6,
        delay: (index % 3) * 0.15,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <ArtworkCard artwork={artwork} />
    </motion.div>
  );
}

export default function ArtworkGrid({ artworks }: ArtworkGridProps) {
  if (artworks.length === 0) {
    return (
      <p className="text-text-secondary text-center py-20">
        No artworks available yet.
      </p>
    );
  }

  // Separate vertical and horizontal artworks
  const vertical = artworks.filter((a) => a.orientation !== "horizontal");
  const horizontal = artworks.filter((a) => a.orientation === "horizontal");

  return (
    <div className="space-y-8">
      {/* Vertical artworks in 3-column masonry */}
      {vertical.length > 0 && (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
          {vertical.map((artwork, index) => (
            <div key={artwork._id} className="break-inside-avoid mb-6">
              <AnimatedItem artwork={artwork} index={index} />
            </div>
          ))}
        </div>
      )}

      {/* Horizontal artworks in 2-column grid */}
      {horizontal.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {horizontal.map((artwork, index) => (
            <AnimatedItem key={artwork._id} artwork={artwork} index={index} />
          ))}
        </div>
      )}
    </div>
  );
}
