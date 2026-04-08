"use client";

import { useEffect, useState } from "react";
import type { Artwork } from "@/types/artwork";
import ArtworkGrid from "@/components/artwork/ArtworkGrid";

export default function GalleryContent() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/artworks")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setArtworks(data.filter((a: Artwork) => !a.isAuctionPiece));
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
      </div>
    );
  }

  return <ArtworkGrid artworks={artworks} />;
}
