"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import type { Artwork } from "@/types/artwork";
import ArtworkCard from "@/components/artwork/ArtworkCard";

export default function FeaturedCollection() {
  const [featured, setFeatured] = useState<Artwork[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/artworks")
      .then((res) => {
        if (!res.ok) throw new Error(`API error: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          const feat = data.filter((a: Artwork) => a.isFeatured).slice(0, 6);
          setFeatured(feat);
        }
      })
      .catch((err) => console.error("Featured fetch error:", err))
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded || featured.length === 0) {
    if (loaded && featured.length === 0) return null;
    // Show placeholder while loading
    return (
      <section className="py-24 bg-bg-primary">
        <div className="max-w-7xl mx-auto px-6">
          <div className="h-8 w-48 bg-bg-secondary/30 animate-pulse mb-12" />
          <div className="flex gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-[320px] flex-shrink-0">
                <div className="bg-bg-secondary/20 aspect-[3/4] animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
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
          {featured.map((artwork, i) => (
            <motion.div
              key={artwork._id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="flex-shrink-0 w-[280px] md:w-[320px]"
            >
              <ArtworkCard artwork={artwork} />
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
