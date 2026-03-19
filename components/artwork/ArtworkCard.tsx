"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useUiStore } from "@/store/uiStore";
import type { Artwork } from "@/types/artwork";

interface ArtworkCardProps {
  artwork: Artwork;
}

const themeColors: Record<string, string> = {
  Light: "bg-gold/20 text-gold",
  Creation: "bg-teal/20 text-teal",
  Soul: "bg-text-secondary/20 text-text-secondary",
  Water: "bg-teal/20 text-teal",
  Time: "bg-gold/20 text-gold",
  Nature: "bg-teal/20 text-teal",
  Mercy: "bg-gold/20 text-gold",
  Judgment: "bg-auction-red/20 text-auction-red",
  Knowledge: "bg-gold/20 text-gold",
};

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  const setCursorVariant = useUiStore((s) => s.setCursorVariant);

  return (
    <Link
      href={`/artwork/${artwork.slug}`}
      className="group block"
      onMouseEnter={() => setCursorVariant("view")}
      onMouseLeave={() => setCursorVariant("default")}
    >
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Image container - 3:4 ratio */}
        <div className="aspect-[3/4] relative overflow-hidden bg-bg-secondary mb-4">
          <Image
            src={artwork.previewImageUrl}
            alt={artwork.translation}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 320px"
          />

          {/* QR indicator */}
          <div className="absolute bottom-3 right-3 w-8 h-8 border border-white/20 bg-bg-primary/60 backdrop-blur-sm flex items-center justify-center">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-text-primary"
            >
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="3" height="3" />
              <rect x="19" y="14" width="2" height="2" />
              <rect x="14" y="19" width="2" height="2" />
              <rect x="19" y="19" width="2" height="2" />
            </svg>
          </div>
        </div>

        {/* Info */}
        <h3 className="font-[family-name:var(--font-display)] text-lg text-text-primary group-hover:text-gold transition-colors duration-300">
          {artwork.title || artwork.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
        </h3>
        <p
          className="font-[family-name:var(--font-arabic)] text-sm text-text-secondary mt-1 line-clamp-1"
          dir="rtl"
          lang="ar"
        >
          {artwork.arabic.slice(0, 50)}...
        </p>
        <div className="mt-2 flex items-center gap-2">
          {artwork.isAuctionPiece ? (
            <span className="text-auction-red text-xs font-[family-name:var(--font-mono)] tracking-wider">
              AUCTION ONLY
            </span>
          ) : (
            <span className="text-gold text-sm font-[family-name:var(--font-mono)]">
              ${(artwork.digitalPrice / 100).toFixed(2)}
            </span>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
