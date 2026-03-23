"use client";

import Image from "next/image";

interface QRCodeBadgeProps {
  verseId: string;
  slug: string;
  variant: "overlay" | "panel";
}

export default function QRCodeBadge({ verseId, slug, variant }: QRCodeBadgeProps) {
  const qrSrc = `/qrcodes/${slug}.png`;

  if (variant === "overlay") {
    return (
      <a
        href={`/verse/${verseId}`}
        className="absolute bottom-4 right-4 w-[60px] h-[60px] bg-bg-primary/80 backdrop-blur-md border border-white/10 flex items-center justify-center rounded-sm hover:bg-bg-primary/90 transition-colors"
      >
        <Image
          src={qrSrc}
          alt="Scan QR code"
          width={44}
          height={44}
          className="w-[44px] h-[44px]"
        />
      </a>
    );
  }

  return (
    <div className="bg-bg-secondary border border-border-subtle p-6 flex flex-col items-center gap-4">
      <a href={`/verse/${verseId}`}>
        <Image
          src={qrSrc}
          alt={`QR code for verse ${verseId}`}
          width={200}
          height={200}
          className="w-[200px] h-[200px]"
        />
      </a>
      <div className="text-center space-y-1">
        <p className="text-text-secondary text-sm tracking-wide">
          Scan to read this verse
        </p>
        <p
          className="font-[family-name:var(--font-arabic)] text-text-secondary text-sm"
          dir="rtl"
          lang="ar"
        >
          امسح للقراءة
        </p>
      </div>
    </div>
  );
}
