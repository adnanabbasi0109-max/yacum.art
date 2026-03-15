"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useParams } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/layout/CustomCursor";
import ScrollProgress from "@/components/layout/ScrollProgress";
import CountdownTimer from "@/components/auction/CountdownTimer";
import BidForm from "@/components/auction/BidForm";
import BidHistory from "@/components/auction/BidHistory";
import AuctionStatus from "@/components/auction/AuctionStatus";
import { verses } from "@/data/verses";

export default function SingleAuction() {
  const params = useParams();
  const auctionPiece = verses.find((v) => v.isAuctionPiece);

  if (!auctionPiece) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center">
        <p className="text-text-secondary">Auction not found.</p>
      </div>
    );
  }

  // Demo data
  const endTime = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString();
  const currentBid = 75000;
  const bidIncrement = 2500;
  const demoBids = [
    { bidderNumber: 7, amount: 75000, time: "2 minutes ago" },
    { bidderNumber: 3, amount: 72500, time: "8 minutes ago" },
    { bidderNumber: 12, amount: 70000, time: "15 minutes ago" },
    { bidderNumber: 7, amount: 67500, time: "22 minutes ago" },
    { bidderNumber: 5, amount: 65000, time: "31 minutes ago" },
    { bidderNumber: 1, amount: 62500, time: "45 minutes ago" },
    { bidderNumber: 3, amount: 60000, time: "1 hour ago" },
    { bidderNumber: 9, amount: 57500, time: "1 hour ago" },
    { bidderNumber: 12, amount: 55000, time: "2 hours ago" },
    { bidderNumber: 1, amount: 50000, time: "3 hours ago" },
  ];

  const handleBid = (amount: number) => {
    // TODO: integrate with API
    console.log("Bid placed:", amount);
  };

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <Navbar />
      <main className="min-h-screen bg-bg-primary pt-24 pb-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Artwork */}
            <motion.div
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.8,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <div className="aspect-[3/4] relative overflow-hidden bg-bg-secondary sticky top-24">
                <Image
                  src={`https://placehold.co/900x1200/111111/C8A96E?text=${encodeURIComponent("ONE PIECE ONLY")}`}
                  alt={auctionPiece.surah}
                  fill
                  className="object-cover"
                  priority
                />
                {/* Serial badge */}
                <div className="absolute bottom-4 left-4 bg-auction-red/90 px-3 py-1.5 text-xs text-text-primary font-[family-name:var(--font-mono)] tracking-wider">
                  SERIAL: YA-001/001
                </div>
                {/* Certification badge */}
                <div className="absolute top-4 right-4 bg-bg-primary/80 backdrop-blur-sm border border-auction-red/30 px-3 py-1.5 text-[10px] text-auction-red font-[family-name:var(--font-mono)] tracking-wider">
                  ONE PIECE ONLY
                </div>
              </div>
            </motion.div>

            {/* Right: Auction Info */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.2,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <AuctionStatus status="live" />
                <span className="text-text-secondary text-xs font-[family-name:var(--font-mono)]">
                  ID: {params.id}
                </span>
              </div>

              <div>
                <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-light italic text-text-primary">
                  {auctionPiece.surah} — The Infinite Ink
                </h1>
                <p className="text-text-secondary text-sm mt-1 font-[family-name:var(--font-mono)]">
                  {auctionPiece.surah} {auctionPiece.surahNumber}:
                  {auctionPiece.ayah}
                </p>
              </div>

              <p
                className="font-[family-name:var(--font-arabic)] text-2xl text-gold leading-loose"
                dir="rtl"
                lang="ar"
              >
                {auctionPiece.arabic}
              </p>

              <p className="text-text-secondary italic">
                {auctionPiece.translation}
              </p>

              {/* Artist's Note */}
              <div className="border border-border-subtle p-5 bg-bg-secondary">
                <h3 className="text-text-secondary text-xs uppercase tracking-wider mb-2">
                  Artist&apos;s Note
                </h3>
                <p className="text-text-primary text-sm leading-relaxed font-[family-name:var(--font-display)] italic">
                  {auctionPiece.paintingConcept}
                </p>
              </div>

              <div className="h-px bg-gold/20" />

              {/* Current Bid */}
              <div>
                <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">
                  Current Bid
                </p>
                <p className="text-gold text-4xl font-[family-name:var(--font-mono)]">
                  &#8377;{currentBid.toLocaleString("en-IN")}
                </p>
                <p className="text-text-secondary text-xs mt-1">
                  Minimum next bid: &#8377;
                  {(currentBid + bidIncrement).toLocaleString("en-IN")}
                </p>
              </div>

              {/* Countdown */}
              <div>
                <p className="text-text-secondary text-xs uppercase tracking-wider mb-2">
                  Auction Ends In
                </p>
                <CountdownTimer endTime={endTime} />
              </div>

              <div className="h-px bg-gold/20" />

              {/* Bid Form */}
              <BidForm
                currentBid={currentBid}
                bidIncrement={bidIncrement}
                onBid={handleBid}
              />

              <div className="h-px bg-gold/20" />

              {/* Bid History */}
              <BidHistory bids={demoBids} />

              <div className="h-px bg-gold/20" />

              {/* Certificate Info */}
              <div className="space-y-3">
                <h3 className="text-text-secondary text-xs uppercase tracking-wider">
                  Certificate of Authenticity
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  The winning bidder receives a digitally signed Certificate of
                  Authenticity confirming this as serial YA-001/001 — the one and
                  only reproduction of this artwork. The certificate is stored on
                  our secure servers and linked to your account.
                </p>
              </div>

              {/* Shipping */}
              <div className="space-y-3">
                <h3 className="text-text-secondary text-xs uppercase tracking-wider">
                  Shipping Information
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  The winning bidder receives both the high-resolution digital
                  file and a museum-quality framed print shipped worldwide.
                  Shipping costs are included in the final bid price.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
