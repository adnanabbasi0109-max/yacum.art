"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

interface Artwork {
  _id: string;
  slug: string;
  title: string;
  arabic: string;
  translation: string;
  theme: string;
  previewImageUrl: string;
  digitalPrice: number;
  printPriceBase: number;
  status: "draft" | "published" | "soldout";
  orientation?: "vertical" | "horizontal";
  isFeatured?: boolean;
}

const THEMES = [
  "Light",
  "Creation",
  "Soul",
  "Water",
  "Time",
  "Nature",
  "Mercy",
  "Judgment",
  "Knowledge",
];

export default function AdminArtworks() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/artworks", { cache: "no-store" });
      const data = await res.json();
      setArtworks(data.artworks || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const remove = async (id: string) => {
    if (!confirm("Delete this artwork? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/artworks/${id}`, { method: "DELETE" });
    if (res.ok) setArtworks((prev) => prev.filter((a) => a._id !== id));
  };

  const format = (paise: number) => `₹${(paise / 100).toFixed(0)}`;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <p className="text-text-secondary text-xs tracking-wider">
          {artworks.length} product{artworks.length === 1 ? "" : "s"}
        </p>
        <button
          onClick={() => setShowForm(true)}
          className="px-5 py-3 bg-gold text-bg-primary text-xs tracking-widest uppercase hover:bg-gold-light transition-colors"
        >
          + New product
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        </div>
      ) : artworks.length === 0 ? (
        <div className="border border-border-subtle py-20 text-center text-text-secondary text-sm">
          No products yet. Click &ldquo;New product&rdquo; to upload your first artwork.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artworks.map((art) => (
            <div
              key={art._id}
              className="border border-border-subtle hover:border-gold/40 transition-colors"
            >
              <div className="relative aspect-[3/4] bg-bg-secondary">
                {art.previewImageUrl && (
                  <Image
                    src={art.previewImageUrl}
                    alt={art.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 50vw, 33vw"
                    unoptimized={art.previewImageUrl.startsWith("http")}
                  />
                )}
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-[family-name:var(--font-display)] text-lg text-text-primary leading-tight">
                    {art.title}
                  </h3>
                  <span
                    className={`text-[10px] uppercase tracking-wider font-[family-name:var(--font-mono)] ${
                      art.status === "published"
                        ? "text-teal"
                        : art.status === "draft"
                          ? "text-gold"
                          : "text-auction-red"
                    }`}
                  >
                    {art.status}
                  </span>
                </div>
                <p className="text-text-secondary text-xs">{art.theme}</p>
                <div className="flex gap-3 text-xs font-[family-name:var(--font-mono)] pt-1">
                  <span className="text-text-secondary">
                    Digital <span className="text-gold">{format(art.digitalPrice)}</span>
                  </span>
                  <span className="text-text-secondary">
                    Frame <span className="text-gold">{format(art.printPriceBase)}</span>
                  </span>
                </div>
                <button
                  onClick={() => remove(art._id)}
                  className="w-full mt-3 py-2 text-[10px] tracking-widest uppercase text-text-secondary hover:text-auction-red border border-border-subtle hover:border-auction-red/60 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <ProductForm
            onClose={() => setShowForm(false)}
            onCreated={(art) => {
              setArtworks((prev) => [art, ...prev]);
              setShowForm(false);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ProductForm({
  onClose,
  onCreated,
}: {
  onClose: () => void;
  onCreated: (a: Artwork) => void;
}) {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [verseId, setVerseId] = useState("");
  const [arabic, setArabic] = useState("");
  const [translation, setTranslation] = useState("");
  const [theme, setTheme] = useState("Light");
  const [description, setDescription] = useState("");
  const [orientation, setOrientation] = useState<"vertical" | "horizontal">("vertical");
  const [digitalPrice, setDigitalPrice] = useState(999);
  const [printPriceBase, setPrintPriceBase] = useState(4999);
  const [isFeatured, setIsFeatured] = useState(false);
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const autoSlug = (value: string) =>
    value
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("slug", slug || autoSlug(title) || "artwork");
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed");
        return;
      }
      setPreviewImageUrl(data.url);
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!previewImageUrl) {
      setError("Please upload a preview image.");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/artworks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          slug: slug || autoSlug(title),
          verseId,
          arabic,
          translation,
          theme,
          description,
          orientation,
          previewImageUrl,
          digitalPrice: Math.round(digitalPrice * 100),
          printPriceBase: Math.round(printPriceBase * 100),
          isFeatured,
          status: "published",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to create");
        return;
      }
      onCreated(data.artwork);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 z-40"
      />
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 280, damping: 32 }}
        className="fixed right-0 top-0 h-full w-full max-w-2xl bg-bg-primary border-l border-border-subtle z-50 overflow-y-auto"
      >
        <form onSubmit={submit} className="p-8 space-y-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-text-secondary text-[10px] tracking-[0.3em] uppercase font-[family-name:var(--font-mono)] mb-2">
                Upload
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-text-primary">
                New Product
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-text-secondary hover:text-gold text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Image upload */}
          <div>
            <label className="text-text-secondary text-[10px] tracking-[0.2em] uppercase font-[family-name:var(--font-mono)] block mb-2">
              Preview Image
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border border-dashed border-border-subtle hover:border-gold/60 transition-colors aspect-[3/4] max-w-[200px] relative cursor-pointer flex items-center justify-center bg-bg-secondary/40"
            >
              {previewImageUrl ? (
                <Image
                  src={previewImageUrl}
                  alt="preview"
                  fill
                  className="object-cover"
                  unoptimized={previewImageUrl.startsWith("http")}
                />
              ) : uploading ? (
                <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
              ) : (
                <span className="text-text-secondary text-xs">Click to upload</span>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              onChange={handleFile}
              className="hidden"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Title">
              <input
                type="text"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (!slug) setSlug(autoSlug(e.target.value));
                }}
                required
                className="input"
              />
            </Field>
            <Field label="Slug">
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(autoSlug(e.target.value))}
                required
                className="input"
              />
            </Field>
          </div>

          <Field label="Verse ID (e.g. al-mulk-67-3-4)">
            <input
              type="text"
              value={verseId}
              onChange={(e) => setVerseId(e.target.value)}
              required
              className="input"
            />
          </Field>

          <Field label="Arabic verse">
            <textarea
              value={arabic}
              onChange={(e) => setArabic(e.target.value)}
              required
              dir="rtl"
              rows={2}
              className="input resize-none font-[family-name:var(--font-arabic)] text-lg"
            />
          </Field>

          <Field label="Translation">
            <textarea
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
              required
              rows={2}
              className="input resize-none"
            />
          </Field>

          <Field label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="input resize-none"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Theme">
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="input"
              >
                {THEMES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Orientation">
              <select
                value={orientation}
                onChange={(e) => setOrientation(e.target.value as "vertical" | "horizontal")}
                className="input"
              >
                <option value="vertical">Vertical</option>
                <option value="horizontal">Horizontal</option>
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Digital price (₹)">
              <input
                type="number"
                min={0}
                value={digitalPrice}
                onChange={(e) => setDigitalPrice(Number(e.target.value))}
                required
                className="input"
              />
            </Field>
            <Field label="Frame price (₹)">
              <input
                type="number"
                min={0}
                value={printPriceBase}
                onChange={(e) => setPrintPriceBase(Number(e.target.value))}
                required
                className="input"
              />
            </Field>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="accent-gold"
            />
            <span className="text-text-secondary text-xs tracking-wider uppercase">
              Featured on home page
            </span>
          </label>

          {error && <p className="text-auction-red text-sm">{error}</p>}

          <button
            type="submit"
            disabled={submitting || uploading}
            className="w-full py-4 bg-gold text-bg-primary text-xs tracking-widest uppercase hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {submitting ? "Publishing..." : "Publish product"}
          </button>
        </form>
      </motion.aside>

      {/* Scoped styles for form inputs — reuses the existing palette */}
      <style jsx global>{`
        .input {
          width: 100%;
          background: var(--color-bg-secondary);
          border: 1px solid var(--color-border-subtle);
          color: var(--color-text-primary);
          padding: 0.6rem 0.75rem;
          font-size: 0.875rem;
          transition: border-color 0.2s;
        }
        .input:focus {
          outline: none;
          border-color: var(--color-gold);
        }
        .input::placeholder {
          color: rgba(154, 148, 136, 0.4);
        }
      `}</style>
    </>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-text-secondary text-[10px] tracking-[0.2em] uppercase font-[family-name:var(--font-mono)] block mb-2">
        {label}
      </span>
      {children}
    </label>
  );
}
