"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { themes } from "@/data/verses";

export default function ThemeGrid() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-bg-primary">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-light italic text-text-primary text-center mb-4"
        >
          Browse by Theme
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="text-text-secondary text-center mb-12"
        >
          9 themes drawn from the Quran
        </motion.p>

        <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 scrollbar-hide">
          {themes.map((theme, i) => (
            <motion.div
              key={theme.id}
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{
                duration: 0.6,
                delay: i * 0.08,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              className="flex-shrink-0"
            >
              <Link
                href={`/gallery?theme=${theme.id}`}
                className="group block w-[180px] p-6 border border-border-subtle hover:border-gold/30 bg-bg-secondary transition-all duration-500"
              >
                <p
                  className="font-[family-name:var(--font-arabic)] text-2xl text-gold mb-3 text-center"
                  dir="rtl"
                  lang="ar"
                >
                  {theme.arabic}
                </p>
                <p className="text-text-primary text-sm text-center font-medium">
                  {theme.name}
                </p>
                <p className="text-text-secondary text-xs text-center mt-1">
                  {theme.count} {theme.count === 1 ? "piece" : "pieces"}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
