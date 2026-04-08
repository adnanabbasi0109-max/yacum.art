"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useUiStore } from "@/store/uiStore";
import type { Artwork } from "@/types/artwork";

interface ArtworkCardProps {
  artwork: Artwork;
}

export default function ArtworkCard({ artwork }: ArtworkCardProps) {
  const setCursorVariant = useUiStore((s) => s.setCursorVariant);
  const isHorizontal = artwork.orientation === "horizontal";

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
        {/* Wall mockup */}
        <div className="relative bg-[#E8E0D4] mb-4 flex items-center justify-center py-8 px-6 overflow-hidden">
          {/* Subtle wall texture */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: "url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCI+PGRlZnM+PGZpbHRlciBpZD0ibiI+PGZlVHVyYnVsZW5jZSB0eXBlPSJmcmFjdGFsTm9pc2UiIGJhc2VGcmVxdWVuY3k9IjAuNyIgbnVtT2N0YXZlcz0iMyIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjwvZGVmcz48cmVjdCB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIGZpbHRlcj0idXJsKCNuKSIgb3BhY2l0eT0iMSIvPjwvc3ZnPg==')",
          }} />
          {/* Framed artwork */}
          <div
            className={`relative ${
              isHorizontal ? "w-[85%] aspect-[16/9]" : "w-[55%] aspect-[3/4]"
            }`}
            style={{
              border: "4px solid #1A1A1A",
              boxShadow: "0 4px 20px rgba(0,0,0,0.25), 0 2px 6px rgba(0,0,0,0.15)",
            }}
          >
            <Image
              src={artwork.previewImageUrl}
              alt={artwork.translation}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
              sizes={isHorizontal ? "(max-width: 768px) 100vw, 640px" : "(max-width: 768px) 100vw, 320px"}
            />
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
              ₹{(artwork.digitalPrice / 100).toFixed(0)}
            </span>
          )}
        </div>
      </motion.div>
    </Link>
  );
}
