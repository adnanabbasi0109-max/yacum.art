"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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
  _id: string;
  orderNumber: string;
  name: string;
  items: Array<{
    title: string;
    type: string;
    printSize?: string;
    frameOption?: string;
    quantity: number;
    price: number;
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

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/orders/my-orders")
      .then((r) => {
        if (r.status === 401) {
          setIsLoggedIn(false);
          return null;
        }
        setIsLoggedIn(true);
        return r.json();
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
          // Auto-expand if there's only one order
          if (data.length === 1) setExpandedOrder(data[0]._id);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const statusColors: Record<string, string> = {
    processing: "text-yellow-400",
    confirmed: "text-blue-400",
    printing: "text-purple-400",
    shipped: "text-green-400",
    delivered: "text-cyan-400",
  };

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
              My Orders
            </h1>
            <p className="text-text-secondary text-sm max-w-md mx-auto">
              View order status and tracking updates.
            </p>
          </motion.div>

          {/* Loading */}
          {loading && (
            <div className="text-center py-20">
              <p className="text-text-secondary animate-pulse">
                Loading your orders...
              </p>
            </div>
          )}

          {/* Not logged in */}
          {!loading && !isLoggedIn && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 border border-border-subtle"
            >
              <p className="text-text-secondary mb-4">
                Sign in to view your orders.
              </p>
              <Link
                href="/account"
                className="inline-block px-8 py-3 bg-gold text-bg-primary text-sm tracking-wider uppercase hover:bg-gold-light transition-colors"
              >
                Sign In
              </Link>
            </motion.div>
          )}

          {/* No orders */}
          {!loading && isLoggedIn && orders.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-16 border border-border-subtle"
            >
              <p className="text-text-secondary mb-4">
                You haven&apos;t placed any orders yet.
              </p>
              <Link
                href="/gallery"
                className="inline-block px-8 py-3 bg-gold text-bg-primary text-sm tracking-wider uppercase hover:bg-gold-light transition-colors"
              >
                Explore Gallery
              </Link>
            </motion.div>
          )}

          {/* Orders List */}
          {!loading && isLoggedIn && orders.length > 0 && (
            <div className="space-y-4">
              {orders.map((order, idx) => {
                const isExpanded = expandedOrder === order._id;
                const currentStepIndex = STEPS.indexOf(
                  order.fulfillmentStatus || "processing"
                );

                return (
                  <motion.div
                    key={order._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="border border-border-subtle overflow-hidden"
                  >
                    {/* Order Summary Row — click to expand */}
                    <button
                      onClick={() =>
                        setExpandedOrder(isExpanded ? null : order._id)
                      }
                      className="w-full p-5 flex items-center justify-between hover:bg-bg-secondary/50 transition-colors text-left"
                    >
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-gold font-[family-name:var(--font-mono)] text-sm">
                            {order.orderNumber}
                          </p>
                          <p className="text-text-secondary text-xs mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              }
                            )}
                          </p>
                        </div>
                        <div className="hidden sm:block">
                          <p className="text-text-primary text-sm">
                            {order.items.length} item
                            {order.items.length !== 1 ? "s" : ""}
                          </p>
                          <p className="text-text-secondary text-xs font-[family-name:var(--font-mono)]">
                            ₹{(order.total / 100).toFixed(0)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <span
                          className={`text-xs uppercase tracking-wider ${
                            statusColors[
                              order.fulfillmentStatus || "processing"
                            ] || "text-text-secondary"
                          }`}
                        >
                          {stepLabels[
                            order.fulfillmentStatus || "processing"
                          ] || "Processing"}
                        </span>
                        <svg
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className={`text-text-secondary transition-transform duration-300 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        >
                          <path d="M6 9l6 6 6-6" />
                        </svg>
                      </div>
                    </button>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-6 space-y-6 border-t border-border-subtle pt-5">
                            {/* Progress Tracker */}
                            <div>
                              <p className="text-text-secondary text-xs uppercase tracking-wider mb-4">
                                Order Status
                              </p>
                              <div className="relative">
                                <div className="flex items-center justify-between">
                                  {STEPS.map((step, i) => {
                                    const isCompleted = i <= currentStepIndex;
                                    const isCurrent = i === currentStepIndex;

                                    return (
                                      <div
                                        key={step}
                                        className="flex flex-col items-center relative z-10"
                                        style={{
                                          width: `${100 / STEPS.length}%`,
                                        }}
                                      >
                                        <div
                                          className={`w-7 h-7 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                                            isCurrent
                                              ? "border-gold bg-gold text-bg-primary"
                                              : isCompleted
                                              ? "border-gold bg-gold/20 text-gold"
                                              : "border-border-subtle bg-bg-secondary text-text-secondary/30"
                                          }`}
                                        >
                                          {isCompleted &&
                                          i < currentStepIndex ? (
                                            <svg
                                              width="12"
                                              height="12"
                                              viewBox="0 0 24 24"
                                              fill="none"
                                              stroke="currentColor"
                                              strokeWidth="2.5"
                                            >
                                              <path d="M20 6L9 17l-5-5" />
                                            </svg>
                                          ) : (
                                            <span className="text-[9px] font-[family-name:var(--font-mono)]">
                                              {i + 1}
                                            </span>
                                          )}
                                        </div>
                                        <p
                                          className={`text-[9px] mt-1.5 tracking-wider uppercase text-center ${
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
                                <div className="absolute top-3.5 left-[10%] right-[10%] h-[2px] bg-border-subtle -z-0">
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
                            </div>

                            {/* Tracking Number */}
                            {order.trackingNumber && (
                              <div className="p-4 bg-bg-secondary border border-border-subtle">
                                <p className="text-text-secondary text-xs uppercase tracking-wider mb-1">
                                  Tracking Number
                                  {order.trackingCarrier &&
                                    ` (${order.trackingCarrier})`}
                                </p>
                                <p className="text-gold font-[family-name:var(--font-mono)] text-sm">
                                  {order.trackingNumber}
                                </p>
                              </div>
                            )}

                            {/* Timeline */}
                            {order.trackingUpdates &&
                              order.trackingUpdates.length > 0 && (
                                <div>
                                  <p className="text-text-secondary text-xs uppercase tracking-wider mb-3">
                                    Tracking Timeline
                                  </p>
                                  <div className="space-y-0">
                                    {[...order.trackingUpdates]
                                      .sort(
                                        (a, b) =>
                                          new Date(b.timestamp).getTime() -
                                          new Date(a.timestamp).getTime()
                                      )
                                      .map((update, i) => (
                                        <div key={i} className="flex gap-3">
                                          <div className="flex flex-col items-center">
                                            <div
                                              className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                                                i === 0
                                                  ? "bg-gold"
                                                  : "bg-border-subtle"
                                              }`}
                                            />
                                            {i <
                                              order.trackingUpdates.length -
                                                1 && (
                                              <div className="w-px h-full min-h-[32px] bg-border-subtle" />
                                            )}
                                          </div>
                                          <div className="pb-4">
                                            <p
                                              className={`text-sm ${
                                                i === 0
                                                  ? "text-text-primary"
                                                  : "text-text-secondary"
                                              }`}
                                            >
                                              {update.message}
                                            </p>
                                            <p className="text-text-secondary/50 text-[10px] mt-0.5 font-[family-name:var(--font-mono)]">
                                              {new Date(
                                                update.timestamp
                                              ).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "short",
                                                year: "numeric",
                                              })}{" "}
                                              at{" "}
                                              {new Date(
                                                update.timestamp
                                              ).toLocaleTimeString("en-IN", {
                                                hour: "2-digit",
                                                minute: "2-digit",
                                              })}
                                            </p>
                                          </div>
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              )}

                            {/* Items */}
                            <div>
                              <p className="text-text-secondary text-xs uppercase tracking-wider mb-3">
                                Items
                              </p>
                              <div className="space-y-2">
                                {order.items.map((item, i) => (
                                  <div
                                    key={i}
                                    className="flex items-center justify-between py-1.5"
                                  >
                                    <div>
                                      <p className="text-text-primary text-sm">
                                        {item.title}
                                      </p>
                                      <p className="text-text-secondary text-xs capitalize">
                                        {item.type}
                                        {item.printSize &&
                                          ` — ${item.printSize}`}
                                        {item.frameOption &&
                                          ` — ${item.frameOption}`}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-text-secondary text-xs font-[family-name:var(--font-mono)]">
                                        ₹{(item.price / 100).toFixed(0)}
                                      </span>
                                      <span className="text-text-secondary/40 text-xs ml-1">
                                        ×{item.quantity}
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Shipping Address */}
                            {order.shippingAddress && (
                              <div>
                                <p className="text-text-secondary text-xs uppercase tracking-wider mb-2">
                                  Shipping To
                                </p>
                                <p className="text-text-primary text-sm leading-relaxed">
                                  {order.shippingAddress.address},{" "}
                                  {order.shippingAddress.city},{" "}
                                  {order.shippingAddress.zip},{" "}
                                  {order.shippingAddress.country}
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
