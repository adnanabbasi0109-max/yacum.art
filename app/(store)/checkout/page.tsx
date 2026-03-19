"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/layout/CustomCursor";
import { useCartStore } from "@/store/cartStore";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const hasPrintItems = items.some((i) => i.type === "print");

  const [form, setForm] = useState({
    email: "",
    name: "",
    address: "",
    city: "",
    country: "",
    zip: "",
  });
  const [processing, setProcessing] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [downloadLinks, setDownloadLinks] = useState<
    { title: string; url: string }[]
  >([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const canSubmit =
    form.email.trim() !== "" &&
    form.name.trim() !== "" &&
    (!hasPrintItems ||
      (form.address.trim() !== "" &&
        form.city.trim() !== "" &&
        form.country.trim() !== ""));

  const handleCheckout = async () => {
    if (!canSubmit) return;
    setProcessing(true);

    // Build download links for digital items
    const digitalItems = items.filter((i) => i.type === "digital");
    const links = digitalItems.map((item) => {
      // Extract base filename from slug
      const slugToFile: Record<string, string> = {
        "sibghatallah-take-on-allahs-colour": "sibghatallah",
        "thornless-lote-trees-sidrin-makhdud": "thornless-lote-trees",
        "divine-precision-sunflower": "sunflower-closeup",
        "divine-precision-leaf": "divine-leaf",
        "radiant-sunflower-divine-design": "sunflower-garden",
        "honeycomb-flawless-design": "honeycomb",
        "mountains-raised-in-measure": "mountains",
        "birds-in-flight-divine-mercy": "birds-in-flight",
      };
      const file = slugToFile[item.slug] || item.slug;
      return {
        title: item.title,
        url: `/downloads/${file}.png`,
      };
    });

    // Save order to database
    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          name: form.name,
          items: items.map((i) => ({
            artworkId: i.artworkId,
            slug: i.slug,
            title: i.title,
            type: i.type,
            printSize: i.printSize,
            frameOption: i.frameOption,
            price: i.price,
            quantity: i.quantity,
          })),
          shippingAddress: hasPrintItems
            ? {
                name: form.name,
                address: form.address,
                city: form.city,
                country: form.country,
                zip: form.zip,
              }
            : null,
          total,
        }),
      });
    } catch {
      // Order saved or not, still show downloads
    }

    setDownloadLinks(links);
    setCompleted(true);
    setProcessing(false);
    clearCart();
  };

  if (completed) {
    return (
      <>
        <CustomCursor />
        <Navbar />
        <main className="min-h-screen bg-bg-primary pt-24 pb-24">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
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
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-text-primary mb-3 italic">
                Order Confirmed
              </h2>
              <p className="text-text-secondary mb-8">
                Thank you for your purchase. Your digital downloads are ready below.
              </p>

              {downloadLinks.length > 0 && (
                <div className="space-y-3 mb-8">
                  <h3 className="text-gold text-sm tracking-widest uppercase mb-4">
                    Your Downloads
                  </h3>
                  {downloadLinks.map((link) => (
                    <a
                      key={link.url}
                      href={link.url}
                      download
                      className="flex items-center justify-between p-4 border border-border-subtle hover:border-gold transition-colors group"
                    >
                      <span className="text-text-primary group-hover:text-gold transition-colors">
                        {link.title}
                      </span>
                      <span className="text-gold text-sm tracking-wider uppercase flex items-center gap-2">
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
                        Download PNG
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
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="min-h-screen bg-bg-primary pt-24 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-light italic text-text-primary mb-8"
          >
            Checkout
          </motion.h1>

          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-text-secondary mb-4">
                Your cart is empty. Nothing to checkout.
              </p>
              <button
                onClick={() => router.push("/gallery")}
                className="text-gold text-sm tracking-wider uppercase hover:text-gold-light transition-colors"
              >
                Explore the Gallery &rarr;
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left: Form */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="lg:col-span-3 space-y-6"
              >
                {/* Contact */}
                <div>
                  <h3 className="text-text-primary font-[family-name:var(--font-display)] text-lg mb-4">
                    Contact Information
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="email"
                      name="email"
                      placeholder="Email address"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full bg-transparent border border-border-subtle px-4 py-3 text-text-primary text-sm placeholder:text-text-secondary/50 focus:border-gold focus:outline-none transition-colors"
                    />
                    <input
                      type="text"
                      name="name"
                      placeholder="Full name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full bg-transparent border border-border-subtle px-4 py-3 text-text-primary text-sm placeholder:text-text-secondary/50 focus:border-gold focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                {/* Shipping (only for print items) */}
                {hasPrintItems && (
                  <div>
                    <h3 className="text-text-primary font-[family-name:var(--font-display)] text-lg mb-4">
                      Shipping Address
                    </h3>
                    <div className="space-y-3">
                      <input
                        type="text"
                        name="address"
                        placeholder="Street address"
                        value={form.address}
                        onChange={handleChange}
                        className="w-full bg-transparent border border-border-subtle px-4 py-3 text-text-primary text-sm placeholder:text-text-secondary/50 focus:border-gold focus:outline-none transition-colors"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <input
                          type="text"
                          name="city"
                          placeholder="City"
                          value={form.city}
                          onChange={handleChange}
                          className="w-full bg-transparent border border-border-subtle px-4 py-3 text-text-primary text-sm placeholder:text-text-secondary/50 focus:border-gold focus:outline-none transition-colors"
                        />
                        <input
                          type="text"
                          name="zip"
                          placeholder="Postal code"
                          value={form.zip}
                          onChange={handleChange}
                          className="w-full bg-transparent border border-border-subtle px-4 py-3 text-text-primary text-sm placeholder:text-text-secondary/50 focus:border-gold focus:outline-none transition-colors"
                        />
                      </div>
                      <input
                        type="text"
                        name="country"
                        placeholder="Country"
                        value={form.country}
                        onChange={handleChange}
                        className="w-full bg-transparent border border-border-subtle px-4 py-3 text-text-primary text-sm placeholder:text-text-secondary/50 focus:border-gold focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                )}

                {/* Checkout button */}
                <motion.button
                  whileHover={{ scale: canSubmit ? 1.01 : 1 }}
                  whileTap={{ scale: canSubmit ? 0.98 : 1 }}
                  onClick={handleCheckout}
                  disabled={!canSubmit || processing}
                  className={`w-full py-4 text-sm tracking-widest uppercase font-medium transition-colors duration-200 ${
                    canSubmit && !processing
                      ? "bg-gold text-bg-primary hover:bg-gold-light"
                      : "bg-gold/30 text-bg-primary/50 cursor-not-allowed"
                  }`}
                >
                  {processing ? "Processing..." : `Complete Order — $${(total / 100).toFixed(2)}`}
                </motion.button>

                <p className="text-text-secondary text-xs">
                  Digital downloads are available immediately after checkout.
                  {hasPrintItems &&
                    " Print orders ship within 5-7 business days."}
                </p>
              </motion.div>

              {/* Right: Order Summary */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <div className="border border-border-subtle p-6 space-y-4">
                  <h3 className="text-text-primary font-[family-name:var(--font-display)] text-lg">
                    Order Summary
                  </h3>

                  <div className="space-y-3">
                    {items.map((item) => (
                      <div
                        key={`${item.artworkId}-${item.type}-${item.printSize}`}
                        className="flex gap-3"
                      >
                        <div className="w-12 h-16 relative flex-shrink-0 bg-bg-secondary">
                          <Image
                            src={item.previewImageUrl}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-text-primary text-sm truncate">
                            {item.title}
                          </p>
                          <p className="text-text-secondary text-xs capitalize">
                            {item.type}
                            {item.printSize && ` — ${item.printSize}`}
                            {item.quantity > 1 && ` × ${item.quantity}`}
                          </p>
                        </div>
                        <span className="text-gold text-sm font-[family-name:var(--font-mono)]">
                          ${((item.price * item.quantity) / 100).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="h-px bg-border-subtle" />

                  <div className="flex justify-between">
                    <span className="text-text-secondary text-sm">Total</span>
                    <span className="text-gold text-lg font-[family-name:var(--font-mono)]">
                      ${(total / 100).toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
