"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useUiStore } from "@/store/uiStore";
import { useCartStore } from "@/store/cartStore";

export default function CartDrawer() {
  const { isCartOpen, setCartOpen } = useUiStore();
  const { items, removeItem, updateQuantity } = useCartStore();
  const total = useCartStore((s) =>
    s.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
  );
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
            className="fixed inset-0 bg-black/60 z-[200]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-bg-primary border-l border-border-subtle z-[201] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border-subtle">
              <h2 className="font-[family-name:var(--font-display)] text-xl text-text-primary">
                Cart ({itemCount})
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-text-secondary">Your cart is empty.</p>
                  <Link
                    href="/gallery"
                    onClick={() => setCartOpen(false)}
                    className="text-gold text-sm mt-2 inline-block hover:text-gold-light transition-colors"
                  >
                    Explore the Gallery &rarr;
                  </Link>
                </div>
              ) : (
                items.map((item, i) => (
                  <motion.div
                    key={`${item.artworkId}-${item.type}-${item.printSize}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex gap-4 border-b border-border-subtle pb-4"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-20 relative flex-shrink-0 bg-bg-secondary">
                      <Image
                        src={item.previewImageUrl}
                        alt={item.title}
                        fill
                        className="object-cover"
                        sizes="64px"
                      />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-text-primary text-sm truncate">
                        {item.title}
                      </h3>
                      <p className="text-text-secondary text-xs mt-0.5 capitalize">
                        {item.type}
                        {item.printSize && ` — ${item.printSize}`}
                        {item.frameOption && ` — ${item.frameOption}`}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.artworkId,
                                item.type,
                                Math.max(1, item.quantity - 1),
                                item.printSize
                              )
                            }
                            className="w-6 h-6 border border-border-subtle text-text-secondary hover:border-gold hover:text-gold text-xs flex items-center justify-center transition-colors"
                          >
                            -
                          </button>
                          <span className="text-text-primary text-xs font-[family-name:var(--font-mono)] w-4 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(
                                item.artworkId,
                                item.type,
                                item.quantity + 1,
                                item.printSize
                              )
                            }
                            className="w-6 h-6 border border-border-subtle text-text-secondary hover:border-gold hover:text-gold text-xs flex items-center justify-center transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <span className="text-gold text-sm font-[family-name:var(--font-mono)]">
                          ${(item.price * item.quantity / 100).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() =>
                        removeItem(item.artworkId, item.type, item.printSize)
                      }
                      className="text-text-secondary hover:text-auction-red transition-colors self-start"
                    >
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <path d="M18 6L6 18M6 6l12 12" />
                      </svg>
                    </button>
                  </motion.div>
                ))
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border-subtle space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-text-secondary text-sm">Subtotal</span>
                  <span className="text-gold text-lg font-[family-name:var(--font-mono)]">
                    ${(total / 100).toFixed(2)}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setCartOpen(false)}
                  className="block w-full py-3.5 bg-gold text-bg-primary text-center text-sm tracking-wider uppercase hover:bg-gold-light transition-colors"
                >
                  Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
