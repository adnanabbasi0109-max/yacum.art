"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/layout/CustomCursor";
import ScrollProgress from "@/components/layout/ScrollProgress";

interface TrackingUpdate {
  status: string;
  message: string;
  timestamp: string;
}

interface OrderData {
  orderNumber: string;
  name: string;
  items: Array<{
    title: string;
    type: string;
    printSize?: string;
    frameOption?: string;
    quantity: number;
  }>;
  total: number;
  currency: string;
  paymentStatus: string;
  fulfillmentStatus: string;
  trackingNumber?: string;
  trackingCarrier?: string;
  trackingUpdates: TrackingUpdate[];
  shippingAddress?: {
    address: string;
    city: string;
    country: string;
    zip: string;
  };
  createdAt: string;
}

const STEPS = ["processing", "confirmed", "printing", "shipped", "delivered"];

const stepLabels: Record<string, string> = {
  processing: "Processing",
  confirmed: "Confirmed",
  printing: "Printing",
  shipped: "Shipped",
  delivered: "Delivered",
};

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [email, setEmail] = useState("");
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOrder(null);
    setLoading(true);

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: orderNumber.trim(),
          email: email.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Order not found");
        return;
      }

      setOrder(data);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const currentStepIndex = order
    ? STEPS.indexOf(order.fulfillmentStatus)
    : -1;

  return (
    <>
      <CustomCursor />
      <ScrollProgress />
      <Navbar />

      <main className="min-h-screen bg-bg-primary pt-28 pb-24">
        <div className="max-w-3xl mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="font-[family-name:var(--font-display)] text-3xl md:text-4xl text-text-primary mb-3">
              Track Your Order
            </h1>
            <p className="text-text-secondary text-sm max-w-md mx-auto">
              Enter your order number and email address to see the current
              status of your order.
            </p>
          </motion.div>

          {/* Lookup Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            onSubmit={handleTrack}
            className="space-y-4 mb-12"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-text-secondary text-xs uppercase tracking-wider block mb-2">
                  Order Number
                </label>
                <input
                  type="text"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="e.g. YA-1234567890"
                  required
                  className="w-full bg-bg-secondary border border-border-subtle text-text-primary px-4 py-3 text-sm font-[family-name:var(--font-mono)] placeholder:text-text-secondary/40 focus:border-gold focus:outline-none transition-colors"
                />
              </div>
              <div>
                <label className="text-text-secondary text-xs uppercase tracking-wider block mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="w-full bg-bg-secondary border border-border-subtle text-text-primary px-4 py-3 text-sm placeholder:text-text-secondary/40 focus:border-gold focus:outline-none transition-colors"
                />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 bg-gold text-bg-primary text-sm tracking-wider uppercase hover:bg-gold-light transition-colors disabled:opacity-50"
            >
              {loading ? "Looking up..." : "Track Order"}
            </motion.button>

            {error && (
              <p className="text-auction-red text-sm text-center">{error}</p>
            )}
          </motion.form>

          {/* Order Result */}
          {order && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Order Header */}
              <div className="border border-border-subtle p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">
                      Order Number
                    </p>
                    <p className="text-gold font-[family-name:var(--font-mono)] text-lg">
                      {order.orderNumber}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">
                      Placed On
                    </p>
                    <p className="text-text-primary text-sm">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="h-px bg-border-subtle mb-4" />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">
                      Total
                    </p>
                    <p className="text-text-primary font-[family-name:var(--font-mono)]">
                      ₹{(order.total / 100).toFixed(0)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">
                      Payment
                    </p>
                    <span
                      className={`text-xs px-2 py-1 ${
                        order.paymentStatus === "paid"
                          ? "bg-teal/20 text-teal"
                          : order.paymentStatus === "failed"
                          ? "bg-auction-red/20 text-auction-red"
                          : "bg-gold/20 text-gold"
                      }`}
                    >
                      {order.paymentStatus.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress Tracker */}
              <div className="border border-border-subtle p-6">
                <h2 className="text-text-secondary text-xs uppercase tracking-wider mb-6">
                  Order Status
                </h2>

                {/* Step Progress Bar */}
                <div className="relative">
                  <div className="flex items-center justify-between">
                    {STEPS.map((step, i) => {
                      const isCompleted = i <= currentStepIndex;
                      const isCurrent = i === currentStepIndex;

                      return (
                        <div
                          key={step}
                          className="flex flex-col items-center relative z-10"
                          style={{ width: `${100 / STEPS.length}%` }}
                        >
                          {/* Circle */}
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                              isCurrent
                                ? "border-gold bg-gold text-bg-primary"
                                : isCompleted
                                ? "border-gold bg-gold/20 text-gold"
                                : "border-border-subtle bg-bg-secondary text-text-secondary/30"
                            }`}
                          >
                            {isCompleted && i < currentStepIndex ? (
                              <svg
                                width="14"
                                height="14"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                              >
                                <path d="M20 6L9 17l-5-5" />
                              </svg>
                            ) : (
                              <span className="text-[10px] font-[family-name:var(--font-mono)]">
                                {i + 1}
                              </span>
                            )}
                          </div>

                          {/* Label */}
                          <p
                            className={`text-[10px] mt-2 tracking-wider uppercase text-center ${
                              isCurrent
                                ? "text-gold"
                                : isCompleted
                                ? "text-text-primary"
                                : "text-text-secondary/40"
                            }`}
                          >
                            {stepLabels[step]}
                          </p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Connecting Line */}
                  <div className="absolute top-4 left-[10%] right-[10%] h-[2px] bg-border-subtle -z-0">
                    <div
                      className="h-full bg-gold transition-all duration-700"
                      style={{
                        width:
                          currentStepIndex <= 0
                            ? "0%"
                            : `${(currentStepIndex / (STEPS.length - 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>

                {/* Tracking Number */}
                {order.trackingNumber && (
                  <div className="mt-6 p-4 bg-bg-secondary border border-border-subtle">
                    <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">
                      Tracking Number
                      {order.trackingCarrier && ` (${order.trackingCarrier})`}
                    </p>
                    <p className="text-gold font-[family-name:var(--font-mono)] text-sm">
                      {order.trackingNumber}
                    </p>
                  </div>
                )}
              </div>

              {/* Timeline */}
              {order.trackingUpdates.length > 0 && (
                <div className="border border-border-subtle p-6">
                  <h2 className="text-text-secondary text-xs uppercase tracking-wider mb-6">
                    Tracking Timeline
                  </h2>

                  <div className="space-y-0">
                    {[...order.trackingUpdates]
                      .sort(
                        (a, b) =>
                          new Date(b.timestamp).getTime() -
                          new Date(a.timestamp).getTime()
                      )
                      .map((update, i) => (
                        <div key={i} className="flex gap-4">
                          {/* Timeline dot & line */}
                          <div className="flex flex-col items-center">
                            <div
                              className={`w-3 h-3 rounded-full flex-shrink-0 ${
                                i === 0 ? "bg-gold" : "bg-border-subtle"
                              }`}
                            />
                            {i <
                              order!.trackingUpdates.length - 1 && (
                              <div className="w-px h-full min-h-[40px] bg-border-subtle" />
                            )}
                          </div>

                          {/* Content */}
                          <div className="pb-6">
                            <p
                              className={`text-sm ${
                                i === 0
                                  ? "text-text-primary"
                                  : "text-text-secondary"
                              }`}
                            >
                              {update.message}
                            </p>
                            <p className="text-text-secondary/50 text-xs mt-1 font-[family-name:var(--font-mono)]">
                              {new Date(update.timestamp).toLocaleDateString(
                                "en-IN",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                }
                              )}{" "}
                              at{" "}
                              {new Date(update.timestamp).toLocaleTimeString(
                                "en-IN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Items */}
              <div className="border border-border-subtle p-6">
                <h2 className="text-text-secondary text-xs uppercase tracking-wider mb-4">
                  Items Ordered
                </h2>

                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between py-2 border-b border-border-subtle last:border-0"
                    >
                      <div>
                        <p className="text-text-primary text-sm">
                          {item.title}
                        </p>
                        <p className="text-text-secondary text-xs capitalize">
                          {item.type}
                          {item.printSize && ` — ${item.printSize}`}
                          {item.frameOption && ` — ${item.frameOption}`}
                        </p>
                      </div>
                      <span className="text-text-secondary text-xs">
                        ×{item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              {order.shippingAddress && (
                <div className="border border-border-subtle p-6">
                  <h2 className="text-text-secondary text-xs uppercase tracking-wider mb-3">
                    Shipping To
                  </h2>
                  <p className="text-text-primary text-sm leading-relaxed">
                    {order.name}
                    <br />
                    {order.shippingAddress.address}
                    <br />
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.zip}
                    <br />
                    {order.shippingAddress.country}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
