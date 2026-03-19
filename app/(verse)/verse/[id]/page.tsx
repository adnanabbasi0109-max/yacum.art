"use client";

import { useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { verses } from "@/data/verses";
import RecitationPlayer from "@/components/verse/RecitationPlayer";
import VerseLayer from "@/components/verse/VerseLayer";

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.25, delayChildren: 0.3 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

export default function VersePage() {
  const params = useParams<{ id: string }>();
  const verse = verses.find((v) => v.id === params.id);
  const [openLayer, setOpenLayer] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);

  const handleToggleLayer = useCallback(
    (depth: number) => {
      setOpenLayer((prev) => (prev === depth ? null : depth));
    },
    []
  );

  const handleCopyUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: do nothing
    }
  }, []);

  const handleWhatsAppShare = useCallback(() => {
    const text = verse
      ? `${verse.translation} — ${verse.surah} ${verse.surahNumber}:${verse.ayah}\n\n${window.location.href}`
      : window.location.href;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  }, [verse]);

  if (!verse) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-text-secondary text-sm">Verse not found</p>
      </div>
    );
  }

  return (
    <>
      <head>
        <title>{verse.translation.slice(0, 60)} — Yacum Art</title>
      </head>

      <main className="min-h-screen bg-[#0A0A0A]">
        <motion.div
          className="max-w-lg mx-auto px-6 py-12 space-y-10"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {/* Arabic verse — slow fade in */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p
              className="font-[family-name:var(--font-arabic)] text-3xl sm:text-4xl text-gold leading-loose"
              dir="rtl"
              lang="ar"
            >
              {verse.arabic}
            </p>
          </motion.div>

          {/* Transliteration */}
          <motion.p
            className="text-center italic text-text-secondary text-sm sm:text-base"
            variants={fadeUp}
          >
            {verse.transliteration}
          </motion.p>

          {/* English translation */}
          <motion.p
            className="text-center font-[family-name:var(--font-display)] text-text-primary text-lg sm:text-xl leading-relaxed"
            variants={fadeUp}
          >
            {verse.translation}
          </motion.p>

          {/* Surah reference */}
          <motion.p
            className="text-center text-text-secondary text-xs tracking-widest uppercase"
            variants={fadeUp}
          >
            {verse.surah} {verse.surahNumber}:{verse.ayah}
          </motion.p>

          {/* Recitation Player */}
          <motion.div variants={fadeUp}>
            <RecitationPlayer recitationUrl={verse.recitationUrl} />
          </motion.div>

          {/* Meaning Layers */}
          <motion.div variants={fadeUp}>
            <h2 className="text-xs text-text-secondary tracking-widest uppercase mb-3">
              Layers of Meaning
            </h2>
            <div className="border-t border-border-subtle">
              {verse.meaningLayers.map((layer) => (
                <VerseLayer
                  key={layer.depth}
                  layer={layer}
                  isOpen={openLayer === layer.depth}
                  onToggle={() => handleToggleLayer(layer.depth)}
                />
              ))}
            </div>
          </motion.div>

          {/* Share section */}
          <motion.div variants={fadeUp} className="space-y-3">
            <h2 className="text-xs text-text-secondary tracking-widest uppercase text-center">
              Share this verse
            </h2>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleCopyUrl}
                className="px-5 py-2.5 border border-gold text-gold text-sm hover:bg-gold/10 transition-colors duration-300 rounded-sm"
              >
                {copied ? "Copied!" : "Copy Link"}
              </button>
              <button
                onClick={handleWhatsAppShare}
                className="px-5 py-2.5 border border-gold text-gold text-sm hover:bg-gold/10 transition-colors duration-300 rounded-sm"
              >
                WhatsApp
              </button>
            </div>
          </motion.div>

          {/* Subtle branding */}
          <motion.div variants={fadeUp} className="pt-8">
            <a
              href="https://yacum.art"
              className="block text-center text-xs text-text-secondary/50 hover:text-text-secondary transition-colors duration-300"
            >
              Yacum Art
            </a>
          </motion.div>
        </motion.div>
      </main>
    </>
  );
}
