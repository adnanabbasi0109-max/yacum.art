"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import Script from "next/script";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/layout/CustomCursor";
import { useCartStore } from "@/store/cartStore";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCartStore();
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
  const [error, setError] = useState("");

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
    setError("");

    try {
      // 1. Create order + Razorpay order
      const res = await fetch("/api/checkout", {
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
                address: form.address,
                city: form.city,
                country: form.country,
                zip: form.zip,
              }
            : null,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Checkout failed");

      // 2. Open Razorpay payment popup
      const options = {
        key: data.keyId,
        amount: data.amount,
        currency: data.currency,
        name: "YACUM.ART",
        description: "Quranic Art Purchase",
        order_id: data.orderId,
        prefill: {
          name: form.name,
          email: form.email,
        },
        theme: {
          color: "#C8A96E",
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          // 3. Verify payment
          try {
            const verifyRes = await fetch("/api/checkout/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                orderNumber: data.orderNumber,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              router.push(`/checkout/success?order=${data.orderNumber}`);
            } else {
              setError("Payment verification failed. Please contact support.");
              setProcessing(false);
            }
          } catch {
            setError("Payment verification failed. Please contact support.");
            setProcessing(false);
          }
        },
        modal: {
          ondismiss: () => {
            setProcessing(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setProcessing(false);
    }
  };

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
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

                {/* Error message */}
                {error && (
                  <p className="text-auction-red text-sm">{error}</p>
                )}

                {/* Pay button */}
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
                  {processing
                    ? "Processing..."
                    : `Pay ₹${(total / 100).toFixed(0)}`}
                </motion.button>

                <p className="text-text-secondary text-xs text-center">
                  Secure payment via Razorpay. UPI, cards, wallets &amp; netbanking accepted.
                  Digital downloads available immediately after payment.
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
                          ₹{((item.price * item.quantity) / 100).toFixed(0)}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="h-px bg-border-subtle" />

                  <div className="flex justify-between">
                    <span className="text-text-secondary text-sm">Total</span>
                    <span className="text-gold text-lg font-[family-name:var(--font-mono)]">
                      ₹{(total / 100).toFixed(0)}
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
