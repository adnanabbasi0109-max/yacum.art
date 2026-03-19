"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import type { Artwork } from "@/types/artwork";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/layout/CustomCursor";
import ProtectedImage from "@/components/artwork/ProtectedImage";
import ScrollProgress from "@/components/layout/ScrollProgress";
import QRCodeBadge from "@/components/artwork/QRCodeBadge";
import { useCartStore } from "@/store/cartStore";
import { useUiStore } from "@/store/uiStore";
import FrameSelector from "@/components/artwork/FrameSelector";

function formatVerseRef(verseId: string): string {
  const parts = verseId.split('-');
  const nameParts: string[] = [];
  const numberParts: string[] = [];
  let hitNumber = false;

  for (const part of parts) {
    if (!hitNumber && /^\d+$/.test(part)) hitNumber = true;
    if (hitNumber) numberParts.push(part);
    else nameParts.push(part);
  }

  const name = nameParts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join('-');
  const nums = numberParts.length > 1
    ? numberParts[0] + ':' + numberParts.slice(1).join('-')
    : numberParts[0] || '';

  return `${name} ${nums}`.trim();
}

const themeColors: Record<string, string> = {
  Light: "bg-gold/20 text-gold",
  Creation: "bg-teal/20 text-teal",
  Soul: "bg-text-secondary/20 text-text-secondary",
  Water: "bg-teal/20 text-teal",
  Time: "bg-gold/20 text-gold",
  Nature: "bg-teal/20 text-teal",
  Mercy: "bg-gold/20 text-gold",
  Judgment: "bg-auction-red/20 text-auction-red",
  Knowledge: "bg-gold/20 text-gold",
};

const printSizes = [
  { label: "A3", dimensions: "297 x 420mm", priceMultiplier: 1 },
  { label: "A2", dimensions: "420 x 594mm", priceMultiplier: 1.5 },
  { label: "A1", dimensions: "594 x 841mm", priceMultiplier: 2.2 },
];

export default function ArtworkDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [loading, setLoading] = useState(true);
  const [purchaseTab, setPurchaseTab] = useState<"digital" | "print">("digital");
  const [selectedSize, setSelectedSize] = useState("A3");
  const [selectedFrame, setSelectedFrame] = useState("thin-black");
  const [addedToCart, setAddedToCart] = useState(false);
  const addItem = useCartStore((s) => s.addItem);
  const setCartOpen = useUiStore((s) => s.setCartOpen);

  useEffect(() => {
    fetch(`/api/artworks/${slug}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(setArtwork)
      .catch(() => setArtwork(null))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <>
        <CustomCursor />
        <Navbar />
        <main className="min-h-screen flex items-center justify-center pt-20">
          <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        </main>
        <Footer />
      </>
    );
  }

  if (!artwork) {
    return (
      <>
        <CustomCursor />
        <Navbar />
        <main className="min-h-screen flex items-center justify-center pt-20">
          <p className="text-text-secondary text-lg">Artwork not found</p>
        </main>
        <Footer />
      </>
    );
  }

  const currentSizeOption = printSizes.find((s) => s.label === selectedSize) || printSizes[0];
  const printPrice = Math.round(artwork.printPriceBase * currentSizeOption.priceMultiplier);

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <Navbar />

      <main className="min-h-screen pt-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 lg:gap-8 max-w-[1400px] mx-auto px-4 lg:px-8">
          {/* Left column - Artwork image (60%) */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="aspect-[3/4] relative bg-bg-secondary">
              <ProtectedImage
                src={artwork.previewImageUrl}
                alt={artwork.translation}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
              <QRCodeBadge verseId={artwork.verseId} variant="overlay" />
            </div>

            {/* Print size thumbnails */}
            <div className="flex gap-3 mt-4">
              {printSizes.map((size) => (
                <button
                  key={size.label}
                  onClick={() => setSelectedSize(size.label)}
                  className={`px-3 py-2 text-xs font-[family-name:var(--font-mono)] tracking-wider border transition-colors duration-200 ${
                    selectedSize === size.label
                      ? "border-gold text-gold"
                      : "border-border-subtle text-text-secondary hover:border-white/10"
                  }`}
                >
                  {size.label}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Right column - Details (40%) */}
          <motion.div
            className="lg:col-span-2 lg:max-h-screen lg:overflow-y-auto py-8 lg:py-0 lg:pr-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Artwork title */}
            <h2 className="font-[family-name:var(--font-display)] text-2xl lg:text-3xl text-text-primary mb-4">
              {artwork.title || artwork.slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </h2>

            {/* Arabic verse */}
            <h1
              className="font-[family-name:var(--font-arabic)] text-3xl lg:text-4xl leading-relaxed text-text-primary mb-4"
              dir="rtl"
              lang="ar"
            >
              {artwork.arabic}
            </h1>

            {/* English translation */}
            <p className="font-[family-name:var(--font-display)] text-xl text-text-primary leading-relaxed mb-3">
              {artwork.translation}
            </p>

            {/* Verse reference */}
            <p className="text-text-secondary text-xs font-[family-name:var(--font-mono)] tracking-wider mb-6">
              {formatVerseRef(artwork.verseId)}
            </p>

            {/* Gold divider */}
            <div className="h-px bg-gold/20 mb-6" />

            {/* Description */}
            {artwork.description && (
              <>
                <div className="mb-6">
                  <h3 className="text-text-secondary text-xs tracking-widest uppercase mb-3">
                    About This Piece
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {artwork.description}
                  </p>
                </div>
                <div className="h-px bg-gold/20 mb-6" />
              </>
            )}

            {/* Purchase section */}
            <div className="mb-6">
              {/* Tabs */}
              <div className="flex border-b border-border-subtle mb-6">
                <button
                  onClick={() => setPurchaseTab("digital")}
                  className={`flex-1 pb-3 text-xs tracking-widest uppercase transition-colors duration-200 ${
                    purchaseTab === "digital"
                      ? "text-gold border-b-2 border-gold"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  Digital Download
                </button>
                <button
                  onClick={() => setPurchaseTab("print")}
                  className={`flex-1 pb-3 text-xs tracking-widest uppercase transition-colors duration-200 ${
                    purchaseTab === "print"
                      ? "text-gold border-b-2 border-gold"
                      : "text-text-secondary hover:text-text-primary"
                  }`}
                >
                  Printed &amp; Framed
                </button>
              </div>

              {purchaseTab === "digital" ? (
                <motion.div
                  key="digital"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-baseline justify-between">
                    <span className="text-gold text-2xl font-[family-name:var(--font-mono)]">
                      ₹{(artwork.digitalPrice / 100).toFixed(0)}
                    </span>
                  </div>
                  <div className="space-y-2 text-text-secondary text-sm">
                    <div className="flex justify-between">
                      <span>Resolution</span>
                      <span className="font-[family-name:var(--font-mono)] text-xs">
                        4800 x 6400px
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Format</span>
                      <span className="font-[family-name:var(--font-mono)] text-xs">
                        PNG + TIFF
                      </span>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="print"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  {/* Size selector */}
                  <div className="space-y-3">
                    <h4 className="text-text-secondary text-xs tracking-widest uppercase">
                      Print Size
                    </h4>
                    <div className="flex gap-3">
                      {printSizes.map((size) => (
                        <button
                          key={size.label}
                          onClick={() => setSelectedSize(size.label)}
                          className={`flex-1 py-3 border text-center transition-colors duration-200 ${
                            selectedSize === size.label
                              ? "border-gold text-gold"
                              : "border-border-subtle text-text-secondary hover:border-white/10"
                          }`}
                        >
                          <span className="block text-sm font-[family-name:var(--font-mono)]">
                            {size.label}
                          </span>
                          <span className="block text-[10px] text-text-secondary mt-1">
                            {size.dimensions}
                          </span>
                          <span className="block text-[10px] text-gold font-[family-name:var(--font-mono)] mt-1">
                            ₹{(artwork.printPriceBase * size.priceMultiplier / 100).toFixed(0)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Frame selector */}
                  <FrameSelector
                    selected={selectedFrame}
                    onSelect={setSelectedFrame}
                    basePrice={printPrice}
                  />
                </motion.div>
              )}
            </div>

            {/* Add to Cart button */}
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (!artwork) return;
                const price = purchaseTab === "digital"
                  ? artwork.digitalPrice
                  : printPrice;
                addItem({
                  artworkId: artwork._id,
                  slug: artwork.slug,
                  title: artwork.title || artwork.slug,
                  arabic: artwork.arabic,
                  previewImageUrl: artwork.previewImageUrl,
                  type: purchaseTab,
                  printSize: purchaseTab === "print" ? selectedSize : undefined,
                  frameOption: purchaseTab === "print" ? selectedFrame : undefined,
                  price,
                });
                setAddedToCart(true);
                setCartOpen(true);
                setTimeout(() => setAddedToCart(false), 2000);
              }}
              className={`w-full py-4 text-sm tracking-widest uppercase font-medium transition-colors duration-200 ${
                addedToCart
                  ? "bg-teal text-bg-primary"
                  : "bg-gold text-bg-primary hover:bg-gold-light"
              }`}
            >
              {addedToCart ? "✓ Added to Cart" : "Add to Cart"}
            </motion.button>

            {/* Provenance block */}
            <div className="mt-6 p-4 border border-border-subtle mb-8">
              <p className="text-text-secondary text-xs leading-relaxed">
                Each artwork contains an embedded QR code linking to the original
                Quranic verse recitation and its layered meaning. This serves as
                a certificate of authenticity and a bridge between visual art and
                sacred text.
              </p>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </>
  );
}
