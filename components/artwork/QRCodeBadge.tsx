"use client";

import Image from "next/image";

interface QRCodeBadgeProps {
  verseId: string;
  variant: "overlay" | "panel";
}

export default function QRCodeBadge({ verseId, variant }: QRCodeBadgeProps) {
  if (variant === "overlay") {
    return (
      <div className="absolute bottom-4 right-4 w-[60px] h-[60px] bg-bg-primary/80 backdrop-blur-md border border-white/10 flex items-center justify-center rounded-sm">
        <svg
          width="28"
          height="28"
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
    );
  }

  return (
    <div className="bg-bg-secondary border border-border-subtle p-6 flex flex-col items-center gap-4">
      <Image
        src="https://placehold.co/200x200/0A0A0A/FFFFFF?text=QR"
        alt={`QR code for verse ${verseId}`}
        width={200}
        height={200}
        className="w-[200px] h-[200px]"
      />
      <div className="text-center space-y-1">
        <p className="text-text-secondary text-sm tracking-wide">
          Scan to hear this verse
        </p>
        <p
          className="font-[family-name:var(--font-arabic)] text-text-secondary text-sm"
          dir="rtl"
          lang="ar"
        >
          امسح للاستماع
        </p>
      </div>
    </div>
  );
}
