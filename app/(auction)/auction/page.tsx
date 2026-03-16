"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/layout/CustomCursor";
import ScrollProgress from "@/components/layout/ScrollProgress";
import AuctionCard from "@/components/auction/AuctionCard";

interface Auction {
  _id: string;
  artworkId: {
    _id: string;
    arabic?: string;
    translation?: string;
    theme?: string;
    previewImageUrl?: string;
    slug?: string;
  };
  startingBid: number;
  currentBid: number;
  bidHistory: Array<{ amount: number }>;
  endTime: string;
  status: string;
  serialNumber: string;
}

export default function AuctionHall() {
  const [auctions, setAuctions] = useState<Auction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auction")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setAuctions(data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <main className="min-h-screen bg-bg-primary pt-20">
        {/* Header */}
        <section
          className="py-24 text-center relative"
          style={{
            background:
              "linear-gradient(180deg, rgba(192, 74, 58, 0.1) 0%, #0A0A0A 100%)",
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="font-[family-name:var(--font-display)] text-5xl md:text-7xl font-light italic text-text-primary"
          >
            <span className="text-auction-red">ONE PIECE ONLY.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.2,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="mt-6 text-text-secondary max-w-2xl mx-auto px-6 text-lg"
          >
            Each auction piece is a certified unique artwork. Once sold, it is
            never reproduced — enforced at the database level. You are not
            buying a copy. You are buying the only one that will ever exist.
          </motion.p>
        </section>

        {/* Auction Grid */}
        <section className="max-w-7xl mx-auto px-6 pb-24">
          {loading ? (
            <div className="text-center py-24">
              <p className="text-text-secondary animate-pulse">
                Loading auctions...
              </p>
            </div>
          ) : auctions.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-text-secondary text-lg">
                No active auctions at the moment. Check back soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {auctions.map((auction, i) => (
                <motion.div
                  key={auction._id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.6,
                    delay: 0.4 + i * 0.1,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  <AuctionCard
                    id={auction._id}
                    title={
                      auction.artworkId?.translation?.slice(0, 60) ||
                      "Auction Piece"
                    }
                    verseRef={auction.artworkId?.theme || ""}
                    arabic={auction.artworkId?.arabic || ""}
                    currentBid={
                      auction.currentBid > 0
                        ? auction.currentBid
                        : auction.startingBid
                    }
                    bidCount={auction.bidHistory?.length || 0}
                    endTime={auction.endTime}
                    imageUrl={
                      auction.artworkId?.previewImageUrl ||
                      `https://placehold.co/800x600/111111/C8A96E?text=${encodeURIComponent("ONE PIECE ONLY")}`
                    }
                  />
                </motion.div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
