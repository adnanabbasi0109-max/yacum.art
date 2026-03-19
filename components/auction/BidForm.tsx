"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface BidFormProps {
  currentBid: number;
  bidIncrement: number;
  onBid: (amount: number) => void;
}

export default function BidForm({
  currentBid,
  bidIncrement,
  onBid,
}: BidFormProps) {
  const minimumBid = currentBid + bidIncrement;
  const [amount, setAmount] = useState(minimumBid);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount < minimumBid) return;
    setIsSubmitting(true);
    try {
      onBid(amount);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-text-secondary text-xs uppercase tracking-wider block mb-2">
          Your Bid (minimum ${(minimumBid / 100).toFixed(2)})
        </label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary">
              $
            </span>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={minimumBid}
              step={bidIncrement}
              className="w-full bg-bg-secondary border border-border-subtle text-text-primary pl-8 pr-4 py-3 font-[family-name:var(--font-mono)] focus:border-gold focus:outline-none transition-colors"
            />
          </div>
          <motion.button
            type="submit"
            disabled={isSubmitting || amount < minimumBid}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-3 bg-auction-red text-text-primary text-sm tracking-wider uppercase disabled:opacity-50 disabled:cursor-not-allowed hover:bg-auction-red/80 transition-colors"
          >
            {isSubmitting ? "Placing..." : "Place Bid"}
          </motion.button>
        </div>
      </div>

      {/* Quick bid buttons */}
      <div className="flex gap-2">
        {[0, 1, 2, 3].map((multiplier) => {
          const quickBid = minimumBid + bidIncrement * multiplier;
          return (
            <button
              key={multiplier}
              type="button"
              onClick={() => setAmount(quickBid)}
              className={`flex-1 py-2 text-xs font-[family-name:var(--font-mono)] border transition-colors ${
                amount === quickBid
                  ? "border-gold text-gold"
                  : "border-border-subtle text-text-secondary hover:border-gold/30"
              }`}
            >
              ${(quickBid / 100).toFixed(2)}
            </button>
          );
        })}
      </div>
    </form>
  );
}
