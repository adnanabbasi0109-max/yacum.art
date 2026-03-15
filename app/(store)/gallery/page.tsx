"use client";

import { useState, useMemo } from "react";
import { verses, themes } from "@/data/verses";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/layout/CustomCursor";
import ScrollProgress from "@/components/layout/ScrollProgress";
import ArtworkGrid from "@/components/artwork/ArtworkGrid";

type FormatFilter = "All" | "Digital" | "Print";
type SortOption = "Featured" | "Price: Low" | "Price: High";

export default function GalleryPage() {
  const [activeTheme, setActiveTheme] = useState<string>("All");
  const [formatFilter, setFormatFilter] = useState<FormatFilter>("All");
  const [sortOption, setSortOption] = useState<SortOption>("Featured");
  const [search, setSearch] = useState("");

  const filteredVerses = useMemo(() => {
    let result = [...verses];

    // Theme filter
    if (activeTheme !== "All") {
      result = result.filter((v) => v.theme === activeTheme);
    }

    // Format filter
    if (formatFilter === "Digital") {
      result = result.filter((v) => v.digitalPrice > 0);
    } else if (formatFilter === "Print") {
      result = result.filter((v) => v.printPriceBase > 0);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (v) =>
          v.surah.toLowerCase().includes(q) ||
          v.translation.toLowerCase().includes(q) ||
          v.theme.toLowerCase().includes(q)
      );
    }

    // Sort
    if (sortOption === "Price: Low") {
      result.sort((a, b) => a.digitalPrice - b.digitalPrice);
    } else if (sortOption === "Price: High") {
      result.sort((a, b) => b.digitalPrice - a.digitalPrice);
    }

    return result;
  }, [activeTheme, formatFilter, sortOption, search]);

  const pillBase =
    "px-3 py-1.5 text-xs tracking-wider uppercase whitespace-nowrap transition-colors duration-200 border";
  const pillActive = "bg-gold text-bg-primary border-gold";
  const pillInactive =
    "bg-transparent text-text-secondary border-border-subtle hover:border-gold/40 hover:text-text-primary";

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <Navbar />

      <main className="min-h-screen bg-bg-primary">
        {/* Sticky filter bar */}
        <div className="sticky top-0 z-30 bg-bg-primary/90 backdrop-blur-md border-b border-border-subtle">
          <div className="max-w-7xl mx-auto px-4 pt-24 pb-4 space-y-4">
            {/* Theme pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              <button
                onClick={() => setActiveTheme("All")}
                className={`${pillBase} ${
                  activeTheme === "All" ? pillActive : pillInactive
                }`}
              >
                All
              </button>
              {themes.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTheme(t.name)}
                  className={`${pillBase} ${
                    activeTheme === t.name ? pillActive : pillInactive
                  }`}
                >
                  {t.name}
                </button>
              ))}
            </div>

            {/* Format + Sort + Search row */}
            <div className="flex flex-wrap items-center gap-3">
              {/* Format filter */}
              <div className="flex gap-1.5">
                {(["All", "Digital", "Print"] as FormatFilter[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFormatFilter(f)}
                    className={`${pillBase} ${
                      formatFilter === f ? pillActive : pillInactive
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>

              {/* Divider */}
              <div className="w-px h-5 bg-border-subtle hidden sm:block" />

              {/* Sort */}
              <div className="flex gap-1.5">
                {(["Featured", "Price: Low", "Price: High"] as SortOption[]).map(
                  (s) => (
                    <button
                      key={s}
                      onClick={() => setSortOption(s)}
                      className={`${pillBase} ${
                        sortOption === s ? pillActive : pillInactive
                      }`}
                    >
                      {s}
                    </button>
                  )
                )}
              </div>

              {/* Divider */}
              <div className="w-px h-5 bg-border-subtle hidden sm:block" />

              {/* Search */}
              <input
                type="text"
                placeholder="Search verses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent border border-border-subtle px-3 py-1.5 text-xs text-text-primary placeholder:text-text-secondary/50 focus:border-gold focus:outline-none transition-colors duration-200 w-48 font-[family-name:var(--font-mono)]"
              />
            </div>
          </div>
        </div>

        {/* Grid */}
        <section className="max-w-7xl mx-auto px-4 py-12">
          {filteredVerses.length > 0 ? (
            <ArtworkGrid verses={filteredVerses} />
          ) : (
            <div className="text-center py-24">
              <p className="text-text-secondary text-sm tracking-wider uppercase">
                No artworks match your filters
              </p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}
