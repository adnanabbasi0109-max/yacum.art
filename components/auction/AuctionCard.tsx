"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useUiStore } from "@/store/uiStore";
import CountdownTimer from "./CountdownTimer";

interface AuctionCardProps {
  id: string;
  title: string;
  verseRef: string;
  arabic: string;
  currentBid: number;
  bidCount: number;
  endTime: string;
  imageUrl: string;
}

export default function AuctionCard({
  id,
  title,
  verseRef,
  arabic,
  currentBid,
  bidCount,
  endTime,
  imageUrl,
}: AuctionCardProps) {
  const setCursorVariant = useUiStore((s) => s.setCursorVariant);

  return (
    <Link
      href={`/auction/${id}`}
      className="group block"
      onMouseEnter={() => setCursorVariant("view")}
      onMouseLeave={() => setCursorVariant("default")}
    >
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="border border-border-subtle hover:border-auction-red/30 transition-colors duration-500"
      >
        {/* Image */}
        <div className="aspect-[4/3] relative overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 400px"
          />
          <div className="absolute top-3 left-3 bg-auction-red/90 px-2 py-0.5 text-[10px] text-text-primary font-[family-name:var(--font-mono)] tracking-wider">
            ONE PIECE ONLY
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          <p className="text-text-secondary text-xs font-[family-name:var(--font-mono)] tracking-wider mb-1">
            {verseRef}
          </p>
          <h3 className="font-[family-name:var(--font-display)] text-lg text-text-primary mb-1">
            {title}
          </h3>
          <p
            className="font-[family-name:var(--font-arabic)] text-sm text-text-secondary line-clamp-1 mb-4"
            dir="rtl"
            lang="ar"
          >
            {arabic}
          </p>

          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">
                Current Bid
              </p>
              <p className="text-gold text-xl font-[family-name:var(--font-mono)]">
                &#8377;{currentBid.toLocaleString("en-IN")}
              </p>
            </div>
            <p className="text-text-secondary text-xs">
              {bidCount} {bidCount === 1 ? "bid" : "bids"}
            </p>
          </div>

          <CountdownTimer endTime={endTime} />

          <button className="mt-4 w-full py-2.5 bg-auction-red text-text-primary text-sm tracking-wider uppercase hover:bg-auction-red/80 transition-colors duration-300">
            Place Bid
          </button>
        </div>
      </motion.div>
    </Link>
  );
}
