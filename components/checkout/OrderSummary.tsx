"use client";

import Image from "next/image";
import { useCartStore } from "@/store/cartStore";

interface OrderSummaryProps {
  shippingCost: number;
}

export default function OrderSummary({ shippingCost }: OrderSummaryProps) {
  const items = useCartStore((s) => s.items);
  const subtotal = items.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const digitalItems = items.filter((i) => i.type === "digital");
  const printItems = items.filter((i) => i.type === "print");
  const total = subtotal + (printItems.length > 0 ? shippingCost : 0);

  return (
    <div className="border border-border-subtle bg-bg-secondary p-6 space-y-6">
      <h3 className="text-text-primary font-[family-name:var(--font-display)] text-lg">
        Order Summary
      </h3>

      {/* Digital Items */}
      {digitalItems.length > 0 && (
        <div>
          <p className="text-text-secondary text-xs uppercase tracking-wider mb-3">
            Digital Downloads
          </p>
          {digitalItems.map((item) => (
            <div
              key={`${item.artworkId}-digital`}
              className="flex gap-3 mb-3"
            >
              <div className="w-10 h-12 relative flex-shrink-0 bg-bg-primary">
                <Image
                  src={item.previewImageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-text-primary text-sm truncate">
                  {item.title}
                </p>
                <p className="text-text-secondary text-xs">
                  Digital &times; {item.quantity}
                </p>
              </div>
              <span className="text-gold text-sm font-[family-name:var(--font-mono)]">
                ₹{(item.price * item.quantity / 100).toFixed(0)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Print Items */}
      {printItems.length > 0 && (
        <div>
          <p className="text-text-secondary text-xs uppercase tracking-wider mb-3">
            Printed &amp; Framed
          </p>
          {printItems.map((item) => (
            <div
              key={`${item.artworkId}-${item.printSize}`}
              className="flex gap-3 mb-3"
            >
              <div className="w-10 h-12 relative flex-shrink-0 bg-bg-primary">
                <Image
                  src={item.previewImageUrl}
                  alt={item.title}
                  fill
                  className="object-cover"
                  sizes="40px"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-text-primary text-sm truncate">
                  {item.title}
                </p>
                <p className="text-text-secondary text-xs">
                  Print — {item.printSize}
                  {item.frameOption && ` — ${item.frameOption}`} &times;{" "}
                  {item.quantity}
                </p>
              </div>
              <span className="text-gold text-sm font-[family-name:var(--font-mono)]">
                ₹{(item.price * item.quantity / 100).toFixed(0)}
              </span>
            </div>
          ))}
        </div>
      )}

      <div className="h-px bg-border-subtle" />

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-text-secondary">Subtotal</span>
          <span className="text-text-primary font-[family-name:var(--font-mono)]">
            ₹{(subtotal / 100).toFixed(0)}
          </span>
        </div>
        {printItems.length > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-text-secondary">Shipping</span>
            <span className="text-text-primary font-[family-name:var(--font-mono)]">
              ₹{(shippingCost / 100).toFixed(0)}
            </span>
          </div>
        )}
        <div className="h-px bg-border-subtle" />
        <div className="flex justify-between">
          <span className="text-text-primary font-medium">Total</span>
          <span className="text-gold text-xl font-[family-name:var(--font-mono)]">
            ₹{(total / 100).toFixed(0)}
          </span>
        </div>
      </div>
    </div>
  );
}
