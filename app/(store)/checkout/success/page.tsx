"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/layout/CustomCursor";
import { useCartStore } from "@/store/cartStore";

interface DownloadItem {
  title: string;
  slug: string;
}

function triggerDownload(url: string, filename: string) {
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.style.display = "none";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const clearCart = useCartStore((s) => s.clearCart);
  const orderNumber = searchParams.get("order");
  const downloadToken = searchParams.get("token");

  const [downloads, setDownloads] = useState<DownloadItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [autoDownloaded, setAutoDownloaded] = useState(false);

  useEffect(() => {
    clearCart();

    if (!orderNumber || !downloadToken) {
      setError("No order found");
      setLoading(false);
      return;
    }

    fetch(`/api/orders/${orderNumber}?token=${downloadToken}`)
      .then((res) => {
        if (!res.ok) throw new Error("Order not found or payment pending");
        return res.json();
      })
      .then((data) => {
        setDownloads(data.items || []);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, [orderNumber, downloadToken, clearCart]);

  // Auto-download all files without popup
  useEffect(() => {
    if (downloads.length > 0 && downloadToken && !autoDownloaded) {
      setAutoDownloaded(true);
      downloads.forEach((item, i) => {
        setTimeout(() => {
          triggerDownload(
            `/api/download/${downloadToken}?slug=${item.slug}`,
            `${item.slug}.pdf`
          );
        }, i * 800);
      });
    }
  }, [downloads, downloadToken, autoDownloaded]);

  return (
    <main className="min-h-screen bg-bg-primary pt-24 pb-24">
      <div className="max-w-2xl mx-auto px-6 text-center">
        {loading ? (
          <div className="py-24">
            <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" />
            <p className="text-text-secondary mt-4">
              Verifying your payment...
            </p>
          </div>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="py-24"
          >
            <p className="text-text-secondary mb-4">{error}</p>
            <p className="text-text-secondary text-sm mb-6">
              If you just completed payment, it may take a moment to process.
              Try refreshing in a few seconds.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="text-gold text-sm tracking-wider uppercase hover:text-gold-light transition-colors"
            >
              Refresh Page
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            {/* Success icon */}
            <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-gold flex items-center justify-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#C8A96E"
                strokeWidth="2"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h1 className="font-[family-name:var(--font-display)] text-3xl text-text-primary mb-3 italic">
              Payment Successful
            </h1>
            <p className="text-text-secondary text-sm mb-8">
              Thank you for your purchase.
            </p>

            {/* Download links */}
            {downloads.length > 0 && (
              <div className="space-y-3 mb-10">
                <h3 className="text-gold text-xs tracking-widest uppercase mb-4">
                  Your Downloads
                </h3>
                {downloads.map((item) => (
                  <a
                    key={item.slug}
                    href={`/api/download/${downloadToken}?slug=${item.slug}`}
                    className="flex items-center justify-between p-4 border border-border-subtle hover:border-gold transition-colors group"
                  >
                    <span className="text-text-primary group-hover:text-gold transition-colors text-left">
                      {item.title}
                    </span>
                    <span className="text-gold text-sm tracking-wider uppercase flex items-center gap-2 flex-shrink-0">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      Download
                    </span>
                  </a>
                ))}
              </div>
            )}

            <button
              onClick={() => router.push("/gallery")}
              className="text-gold text-sm tracking-wider uppercase hover:text-gold-light transition-colors"
            >
              Back to Gallery &rarr;
            </button>
          </motion.div>
        )}
      </div>
    </main>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <Suspense
        fallback={
          <main className="min-h-screen bg-bg-primary pt-24 pb-24">
            <div className="max-w-2xl mx-auto px-6 text-center py-24">
              <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin mx-auto" />
            </div>
          </main>
        }
      >
        <SuccessContent />
      </Suspense>
      <Footer />
    </>
  );
}
