"use client";

interface AuctionStatusProps {
  status: "upcoming" | "live" | "ended" | "sold" | "unsold";
}

const statusConfig = {
  upcoming: { label: "Upcoming", color: "text-text-secondary border-text-secondary/30" },
  live: { label: "Live", color: "text-auction-red border-auction-red/30 animate-pulse" },
  ended: { label: "Ended", color: "text-text-secondary border-text-secondary/30" },
  sold: { label: "Sold", color: "text-gold border-gold/30" },
  unsold: { label: "Unsold", color: "text-text-secondary border-text-secondary/30" },
};

export default function AuctionStatus({ status }: AuctionStatusProps) {
  const config = statusConfig[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 border text-xs font-[family-name:var(--font-mono)] tracking-wider uppercase ${config.color}`}
    >
      {status === "live" && (
        <span className="w-1.5 h-1.5 rounded-full bg-auction-red animate-pulse" />
      )}
      {config.label}
    </span>
  );
}
