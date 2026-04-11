"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";

interface VerseData {
  id: string;
  arabic: string;
  transliteration: string;
  translation: string;
  tafsir: string;
  surah: string;
  surahNumber: number;
  ayah: number;
  theme: string;
  title: string;
  slug: string;
}

const stagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.25, delayChildren: 0.3 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] as const },
  },
};

export default function VersePage() {
  const params = useParams<{ id: string }>();
  const [verse, setVerse] = useState<VerseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function fetchVerse() {
      try {
        const res = await fetch(`/api/verse/${params.id}`);
        if (res.ok) {
          const data = await res.json();
          setVerse(data);
        }
      } catch (err) {
        console.error("Failed to load verse:", err);
      } finally {
        setLoading(false);
      }
    }
    if (params.id) fetchVerse();
  }, [params.id]);

  const artworkUrl = verse ? `https://yacum.art/artwork/${verse.slug}` : (typeof window !== 'undefined' ? window.location.href : 'https://yacum.art');

  const handleCopyUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(artworkUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  }, [artworkUrl]);

  const handleWhatsAppShare = useCallback(() => {
    const text = verse
      ? `${verse.title} — ${verse.surah} ${verse.surahNumber}:${verse.ayah}\n\n${artworkUrl}`
      : artworkUrl;
    window.open(
      `https://wa.me/?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  }, [verse, artworkUrl]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#d4af37] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!verse) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <p className="text-[#888] text-sm">Verse not found</p>
      </div>
    );
  }

  return (
      <main className="min-h-screen bg-[#0A0A0A]">
        <motion.div
          className="max-w-lg mx-auto px-6 py-12 space-y-10"
          variants={stagger}
          initial="hidden"
          animate="show"
        >
          {/* ─── AYAT ─── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 1.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <p className="text-xs text-[#d4af37] tracking-[0.3em] uppercase text-center mb-6">
              Ayat
            </p>

            <div className="border-t border-[#d4af37]/20 pt-6">
              <p
                className="font-[family-name:var(--font-arabic)] text-3xl sm:text-4xl text-[#d4af37] leading-loose text-center"
                dir="rtl"
                lang="ar"
              >
                {verse.arabic}
              </p>
            </div>

            {verse.transliteration && (
              <p className="text-center italic text-[#888] text-sm sm:text-base mt-4">
                {verse.transliteration}
              </p>
            )}

            {/* Surah reference */}
            <p className="text-center text-[#666] text-xs tracking-widest uppercase mt-4">
              {verse.surah} {verse.surahNumber}:{verse.ayah}
            </p>
          </motion.div>

          {/* ─── MEANING ─── */}
          <motion.div variants={fadeUp}>
            <p className="text-xs text-[#d4af37] tracking-[0.3em] uppercase text-center mb-6">
              Meaning
            </p>

            <div className="border-t border-[#d4af37]/20 pt-6">
              <p className="text-center font-[family-name:var(--font-display)] text-white text-lg sm:text-xl leading-relaxed">
                {verse.translation}
              </p>
            </div>
          </motion.div>

          {/* ─── TAFSIR ─── */}
          {verse.tafsir && (
            <motion.div variants={fadeUp}>
              <p className="text-xs text-[#d4af37] tracking-[0.3em] uppercase text-center mb-6">
                Tafsir
              </p>

              <div className="border-t border-[#d4af37]/20 pt-6">
                <p className="text-[#ccc] text-sm sm:text-base leading-relaxed text-center">
                  {verse.tafsir}
                </p>
              </div>
            </motion.div>
          )}

          {/* Divider */}
          <motion.div variants={fadeUp}>
            <div className="w-full border-t border-[#333]" />
          </motion.div>

          {/* Share section */}
          <motion.div variants={fadeUp} className="space-y-3">
            <p className="text-xs text-[#666] tracking-widest uppercase text-center">
              Share this verse
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleCopyUrl}
                className="px-5 py-2.5 border border-[#d4af37] text-[#d4af37] text-sm hover:bg-[#d4af37]/10 transition-colors duration-300 rounded-sm"
              >
                {copied ? "Copied!" : "Copy Link"}
              </button>
              <button
                onClick={handleWhatsAppShare}
                className="px-5 py-2.5 border border-[#d4af37] text-[#d4af37] text-sm hover:bg-[#d4af37]/10 transition-colors duration-300 rounded-sm"
              >
                WhatsApp
              </button>
            </div>
          </motion.div>

          {/* View artwork link */}
          <motion.div variants={fadeUp} className="text-center">
            <a
              href={`/artwork/${verse.slug}`}
              className="inline-block px-6 py-3 bg-[#d4af37] text-[#0a0a0a] text-sm font-semibold hover:bg-[#c9a432] transition-colors duration-300 rounded-sm"
            >
              View Artwork
            </a>
          </motion.div>

          {/* Branding */}
          <motion.div variants={fadeUp} className="pt-8">
            <a
              href="https://yacum.art"
              className="block text-center text-xs text-[#444] hover:text-[#666] transition-colors duration-300"
            >
              Yacum Art
            </a>
          </motion.div>
        </motion.div>
      </main>
  );
}
