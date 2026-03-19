"use client";

import { motion } from "framer-motion";

interface Bid {
  bidderNumber: number;
  amount: number;
  time: string;
}

interface BidHistoryProps {
  bids: Bid[];
}

export default function BidHistory({ bids }: BidHistoryProps) {
  return (
    <div className="space-y-2">
      <h3 className="text-text-secondary text-xs uppercase tracking-wider mb-3">
        Recent Bids
      </h3>
      {bids.length === 0 ? (
        <p className="text-text-secondary text-sm">No bids yet. Be the first!</p>
      ) : (
        <div className="space-y-1">
          {bids.map((bid, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0"
            >
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full bg-bg-secondary border border-border-subtle flex items-center justify-center">
                  <span className="text-[10px] text-text-secondary font-[family-name:var(--font-mono)]">
                    {bid.bidderNumber}
                  </span>
                </div>
                <span className="text-text-secondary text-sm">
                  Bidder #{String(bid.bidderNumber).padStart(2, "0")}
                </span>
              </div>
              <div className="text-right">
                <span className="text-gold text-sm font-[family-name:var(--font-mono)]">
                  ${(bid.amount / 100).toFixed(2)}
                </span>
                <p className="text-text-secondary text-[10px]">{bid.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
