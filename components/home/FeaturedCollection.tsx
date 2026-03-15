"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { verses } from "@/data/verses";
import ArtworkCard from "@/components/artwork/ArtworkCard";

export default function FeaturedCollection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const featured = verses.filter((v) => !v.isAuctionPiece).slice(0, 6);

  return (
    <section ref={ref} className="py-24 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <h2 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-light italic text-text-primary">
              Featured Works
            </h2>
            <p className="text-text-secondary mt-2">
              Curated pieces from our collection
            </p>
          </div>
          <Link
            href="/gallery"
            className="hidden md:block text-gold text-sm tracking-wider uppercase hover:text-gold-light transition-colors"
          >
            View All &rarr;
          </Link>
        </motion.div>

        {/* Horizontal scroll row */}
        <div className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
          {featured.map((verse, i) => (
            <motion.div
              key={verse.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="flex-shrink-0 w-[280px] md:w-[320px]"
            >
              <ArtworkCard verse={verse} />
            </motion.div>
          ))}
        </div>

        <Link
          href="/gallery"
          className="md:hidden block text-center text-gold text-sm tracking-wider uppercase mt-8 hover:text-gold-light transition-colors"
        >
          View All &rarr;
        </Link>
      </div>
    </section>
  );
}
