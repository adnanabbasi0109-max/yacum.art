"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/layout/CustomCursor";
import ShippingForm, {
  getShippingCost,
} from "@/components/checkout/ShippingForm";
import OrderSummary from "@/components/checkout/OrderSummary";
import { useCartStore } from "@/store/cartStore";

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items);
  const [shippingCost, setShippingCost] = useState(299);
  const [step, setStep] = useState<"shipping" | "payment" | "success">(
    "shipping"
  );

  const hasPrintItems = items.some((i) => i.type === "print");

  const handleShippingSubmit = (address: {
    name: string;
    country: string;
  }) => {
    setShippingCost(getShippingCost(address.country));
    setStep("payment");
  };

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="min-h-screen bg-bg-primary pt-24 pb-24">
        <div className="max-w-5xl mx-auto px-6">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.6,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
            className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-light italic text-text-primary mb-8"
          >
            Checkout
          </motion.h1>

          {items.length === 0 ? (
            <p className="text-text-secondary">
              Your cart is empty. Nothing to checkout.
            </p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
              {/* Left: Form */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.1,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="lg:col-span-3"
              >
                {/* Steps indicator */}
                <div className="flex gap-4 mb-8">
                  {["shipping", "payment"].map((s, i) => (
                    <div key={s} className="flex items-center gap-2">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-[family-name:var(--font-mono)] ${
                          step === s
                            ? "bg-gold text-bg-primary"
                            : "border border-border-subtle text-text-secondary"
                        }`}
                      >
                        {i + 1}
                      </div>
                      <span
                        className={`text-sm capitalize ${
                          step === s
                            ? "text-text-primary"
                            : "text-text-secondary"
                        }`}
                      >
                        {s}
                      </span>
                      {i === 0 && (
                        <div className="w-8 h-px bg-border-subtle mx-2" />
                      )}
                    </div>
                  ))}
                </div>

                {step === "shipping" && hasPrintItems && (
                  <ShippingForm onSubmit={handleShippingSubmit} />
                )}

                {(step === "payment" || !hasPrintItems) && (
                  <div className="space-y-6">
                    <h3 className="text-text-primary font-[family-name:var(--font-display)] text-lg">
                      Payment
                    </h3>

                    <div className="grid grid-cols-2 gap-4">
                      <button className="py-4 border border-border-subtle hover:border-gold text-text-primary text-sm tracking-wider transition-colors">
                        Pay with Stripe
                      </button>
                      <button className="py-4 border border-border-subtle hover:border-teal text-text-primary text-sm tracking-wider transition-colors">
                        Pay with Razorpay
                      </button>
                    </div>

                    <p className="text-text-secondary text-xs">
                      All payments are secure and encrypted. Digital downloads
                      are available immediately after payment. Print orders ship
                      within 2-3 business days.
                    </p>
                  </div>
                )}

                {step === "success" && (
                  <div className="text-center py-12">
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
                    <h2 className="font-[family-name:var(--font-display)] text-2xl text-text-primary mb-2">
                      Order Confirmed
                    </h2>
                    <p className="text-text-secondary">
                      Check your email for download links and order details.
                    </p>
                  </div>
                )}
              </motion.div>

              {/* Right: Order Summary */}
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  delay: 0.2,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="lg:col-span-2"
              >
                <OrderSummary shippingCost={shippingCost} />
              </motion.div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
