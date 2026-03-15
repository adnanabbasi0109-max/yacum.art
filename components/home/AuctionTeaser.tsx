"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { verses } from "@/data/verses";
import CountdownTimer from "@/components/auction/CountdownTimer";

export default function AuctionTeaser() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const auctionPiece = verses.find((v) => v.isAuctionPiece);

  // Demo end time: 3 days from now
  const endTime = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();

  return (
    <section
      ref={ref}
      className="py-24 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, rgba(192, 74, 58, 0.08) 0%, #0A0A0A 50%, rgba(192, 74, 58, 0.05) 100%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-center mb-12"
        >
          <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-6xl font-light italic text-text-primary mb-4">
            <span className="text-auction-red">ONE PIECE ONLY.</span>
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto">
            Each auction piece is certified unique. Once sold, it is never
            reproduced. Database-enforced exclusivity. Own a one-of-one.
          </p>
        </motion.div>

        {auctionPiece && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="max-w-4xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              {/* Artwork preview */}
              <div className="aspect-[3/4] bg-bg-secondary rounded-sm overflow-hidden relative">
                <div
                  className="w-full h-full"
                  style={{
                    background:
                      "linear-gradient(135deg, #1a1a2e 0%, #0A0A0A 40%, #16213e 100%)",
                  }}
                />
                <div className="absolute bottom-4 left-4 bg-auction-red/90 px-3 py-1 text-xs text-text-primary font-[family-name:var(--font-mono)] tracking-wider">
                  SERIAL: YA-001/001
                </div>
              </div>

              {/* Info */}
              <div>
                <p className="text-auction-red text-xs tracking-wider uppercase font-[family-name:var(--font-mono)] mb-2">
                  Live Auction
                </p>
                <h3 className="font-[family-name:var(--font-display)] text-2xl md:text-3xl italic text-text-primary mb-2">
                  {auctionPiece.surah} {auctionPiece.surahNumber}:
                  {auctionPiece.ayah}
                </h3>
                <p
                  className="font-[family-name:var(--font-arabic)] text-xl text-gold mb-4"
                  dir="rtl"
                  lang="ar"
                >
                  {auctionPiece.arabic.slice(0, 60)}...
                </p>
                <p className="text-text-secondary text-sm mb-6 line-clamp-3">
                  {auctionPiece.translation}
                </p>

                <div className="mb-6">
                  <p className="text-text-secondary text-xs uppercase tracking-wider mb-2">
                    Auction ends in
                  </p>
                  <CountdownTimer endTime={endTime} />
                </div>

                <Link
                  href="/auction"
                  className="inline-block px-8 py-3.5 bg-auction-red text-text-primary hover:bg-auction-red/80 transition-all duration-500 text-sm tracking-wider uppercase"
                >
                  Enter the Auction Room &rarr;
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
