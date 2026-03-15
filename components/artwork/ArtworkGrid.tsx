"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import type { Verse } from "@/data/verses";
import ArtworkCard from "@/components/artwork/ArtworkCard";

interface ArtworkGridProps {
  verses: Verse[];
}

function AnimatedItem({ verse, index }: { verse: Verse; index: number }) {
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
      className="break-inside-avoid mb-6"
    >
      <ArtworkCard verse={verse} />
    </motion.div>
  );
}

export default function ArtworkGrid({ verses }: ArtworkGridProps) {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-6">
      {verses.map((verse, index) => (
        <AnimatedItem key={verse.id} verse={verse} index={index} />
      ))}
    </div>
  );
}
