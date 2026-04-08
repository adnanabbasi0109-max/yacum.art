"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/layout/CustomCursor";
import ScrollProgress from "@/components/layout/ScrollProgress";
import CountdownTimer from "@/components/auction/CountdownTimer";
import AuctionStatus from "@/components/auction/AuctionStatus";

interface AuctionData {
  _id: string;
  artworkId: {
    _id: string;
    previewImageUrl?: string;
    arabic?: string;
    translation?: string;
    theme?: string;
    slug?: string;
  };
  startingBid: number;
  currentBid: number;
  bidIncrement: number;
  bidHistory: Array<{
    userId: string;
    userName: string;
    amount: number;
    time: string;
  }>;
  endTime: string;
  status: "upcoming" | "live" | "ended" | "sold" | "unsold";
  serialNumber: string;
}

export default function SingleAuction() {
  const params = useParams();
  const router = useRouter();
  const [auction, setAuction] = useState<AuctionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState(0);
  const [bidderName, setBidderName] = useState("");
  const [bidding, setBidding] = useState(false);
  const [bidError, setBidError] = useState("");
  const [bidSuccess, setBidSuccess] = useState("");

  const fetchAuction = useCallback(async () => {
    try {
      const res = await fetch(`/api/auction/${params.id}`);
      if (res.ok) {
        const data = await res.json();
        setAuction(data);
        const min =
          data.currentBid > 0
            ? data.currentBid + data.bidIncrement
            : data.startingBid;
        setBidAmount(min);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  useEffect(() => {
    fetchAuction();
    const interval = setInterval(fetchAuction, 10000);
    return () => clearInterval(interval);
  }, [fetchAuction]);

  const minimumBid = auction
    ? auction.currentBid > 0
      ? auction.currentBid + auction.bidIncrement
      : auction.startingBid
    : 0;

  const handleBid = async (e: React.FormEvent) => {
    e.preventDefault();
    setBidError("");
    setBidSuccess("");

    if (!bidderName.trim()) {
      setBidError("Please enter your name");
      return;
    }

    if (bidAmount < minimumBid) {
      setBidError(`Minimum bid is ₹${(minimumBid / 100).toFixed(0)}`);
      return;
    }

    setBidding(true);
    try {
      const res = await fetch(`/api/auction/${params.id}/bid`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: bidAmount, userName: bidderName.trim() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setBidError(data.error || "Failed to place bid");
        return;
      }

      setBidSuccess("Bid placed successfully!");
      setAuction(data);
      const newMin = data.currentBid + data.bidIncrement;
      setBidAmount(newMin);
      setTimeout(() => setBidSuccess(""), 3000);
    } catch {
      setBidError("Something went wrong. Please try again.");
    } finally {
      setBidding(false);
    }
  };

  if (loading) {
    return (
      <>
        <CustomCursor />
        <Navbar />
        <main className="min-h-screen bg-bg-primary flex items-center justify-center pt-20">
          <p className="text-text-secondary animate-pulse">
            Loading auction...
          </p>
        </main>
      </>
    );
  }

  if (!auction) {
    return (
      <>
        <CustomCursor />
        <Navbar />
        <main className="min-h-screen bg-bg-primary flex flex-col items-center justify-center pt-20 gap-4">
          <p className="text-text-secondary">Auction not found.</p>
          <button
            onClick={() => router.push("/auction")}
            className="text-gold text-sm hover:underline"
          >
            &larr; Back to Auctions
          </button>
        </main>
        <Footer />
      </>
    );
  }

  const artwork = auction.artworkId;
  const imageUrl =
    artwork?.previewImageUrl ||
    `https://placehold.co/900x1200/111111/C8A96E?text=${encodeURIComponent("ARTWORK")}`;
  const sortedBids = [...(auction.bidHistory || [])].sort(
    (a, b) => new Date(b.time).getTime() - new Date(a.time).getTime()
  );

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
                  src={imageUrl}
                  alt={artwork?.translation || "Auction Artwork"}
                  fill
                  className="object-cover"
                  priority
                  unoptimized
                />
                <div className="absolute bottom-4 left-4 bg-auction-red/90 px-3 py-1.5 text-xs text-text-primary font-[family-name:var(--font-mono)] tracking-wider">
                  SERIAL: {auction.serialNumber}
                </div>
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
                <AuctionStatus status={auction.status} />
                <span className="text-text-secondary text-xs font-[family-name:var(--font-mono)]">
                  {sortedBids.length} bid{sortedBids.length !== 1 ? "s" : ""}
                </span>
              </div>

              {artwork?.arabic && (
                <p
                  className="font-[family-name:var(--font-arabic)] text-2xl text-gold leading-loose"
                  dir="rtl"
                  lang="ar"
                >
                  {artwork.arabic}
                </p>
              )}

              {artwork?.translation && (
                <p className="text-text-secondary italic">
                  {artwork.translation}
                </p>
              )}

              <div className="h-px bg-gold/20" />

              {/* Current Bid */}
              <div>
                <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">
                  {auction.currentBid > 0 ? "Current Bid" : "Starting Bid"}
                </p>
                <p className="text-gold text-4xl font-[family-name:var(--font-mono)]">
                  ₹{((auction.currentBid > 0
                    ? auction.currentBid
                    : auction.startingBid
                  ) / 100).toFixed(0)}
                </p>
                {auction.status === "live" && (
                  <p className="text-text-secondary text-xs mt-1">
                    Minimum next bid: ₹{(minimumBid / 100).toFixed(0)}
                  </p>
                )}
              </div>

              <div className="h-px bg-gold/20" />

              {/* Bid Form - only show for live auctions */}
              {auction.status === "live" && (
                <form onSubmit={handleBid} className="space-y-4">
                  <div>
                    <label className="text-text-secondary text-xs uppercase tracking-wider block mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={bidderName}
                      onChange={(e) => setBidderName(e.target.value)}
                      placeholder="Enter your name"
                      required
                      className="w-full bg-bg-secondary border border-border-subtle text-text-primary px-4 py-3 text-sm placeholder:text-text-secondary/40 focus:border-gold focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-text-secondary text-xs uppercase tracking-wider block mb-2">
                      Your Bid (minimum ₹{(minimumBid / 100).toFixed(0)})
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
                          ₹
                        </span>
                        <input
                          type="number"
                          value={bidAmount}
                          onChange={(e) =>
                            setBidAmount(Number(e.target.value))
                          }
                          min={minimumBid}
                          step={auction.bidIncrement}
                          className="w-full bg-bg-secondary border border-border-subtle text-text-primary pl-8 pr-4 py-3 font-[family-name:var(--font-mono)] focus:border-gold focus:outline-none transition-colors"
                        />
                      </div>
                      <motion.button
                        type="submit"
                        disabled={bidding || bidAmount < minimumBid}
                        whileTap={{ scale: 0.98 }}
                        className="px-8 py-3 bg-auction-red text-text-primary text-sm tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-auction-red/80 transition-colors"
                      >
                        {bidding ? "Placing..." : "Place Bid"}
                      </motion.button>
                    </div>
                  </div>

                  {/* Quick bid buttons */}
                  <div className="flex gap-2">
                    {[0, 1, 2, 3].map((multiplier) => {
                      const quickBid =
                        minimumBid + auction.bidIncrement * multiplier;
                      return (
                        <button
                          key={multiplier}
                          type="button"
                          onClick={() => setBidAmount(quickBid)}
                          className={`flex-1 py-2 text-xs font-[family-name:var(--font-mono)] border transition-colors ${
                            bidAmount === quickBid
                              ? "border-gold text-gold"
                              : "border-border-subtle text-text-secondary hover:border-gold/30"
                          }`}
                        >
                          ₹{(quickBid / 100).toFixed(0)}
                        </button>
                      );
                    })}
                  </div>

                  {bidError && (
                    <p className="text-auction-red text-sm">{bidError}</p>
                  )}
                  {bidSuccess && (
                    <p className="text-teal text-sm">{bidSuccess}</p>
                  )}
                </form>
              )}

              {auction.status === "ended" && (
                <div className="border border-border-subtle p-6 text-center">
                  <p className="text-text-secondary">
                    This auction has ended.
                  </p>
                </div>
              )}

              <div className="h-px bg-gold/20" />

              {/* Bid History */}
              <div className="space-y-2">
                <h3 className="text-text-secondary text-xs uppercase tracking-wider mb-3">
                  Bid History ({sortedBids.length})
                </h3>
                {sortedBids.length === 0 ? (
                  <p className="text-text-secondary text-sm">
                    No bids yet. Be the first!
                  </p>
                ) : (
                  <div className="space-y-1 max-h-80 overflow-y-auto">
                    {sortedBids.map((bid, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.03 }}
                        className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-full bg-bg-secondary border border-border-subtle flex items-center justify-center">
                            <span className="text-[10px] text-text-secondary font-[family-name:var(--font-mono)]">
                              {bid.userName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-text-secondary text-sm">
                            {bid.userName}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-gold text-sm font-[family-name:var(--font-mono)]">
                            ₹{(bid.amount / 100).toFixed(0)}
                          </span>
                          <p className="text-text-secondary text-[10px]">
                            {new Date(bid.time).toLocaleString()}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              <div className="h-px bg-gold/20" />

              {/* Certificate Info */}
              <div className="space-y-3">
                <h3 className="text-text-secondary text-xs uppercase tracking-wider">
                  Certificate of Authenticity
                </h3>
                <p className="text-text-secondary text-sm leading-relaxed">
                  The winning bidder receives a digitally signed Certificate of
                  Authenticity confirming this as serial {auction.serialNumber}{" "}
                  &mdash; the one and only reproduction of this artwork.
                </p>
              </div>

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
