"use client";

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface OrderItem {
  artworkId: string;
  slug: string;
  title: string;
  type: "digital" | "print";
  printSize?: string;
  frameOption?: string;
  price: number;
  quantity: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  email: string;
  name: string;
  items: OrderItem[];
  total: number;
  paymentStatus: "pending" | "paid" | "failed";
  fulfillmentStatus: "processing" | "confirmed" | "printing" | "shipped" | "delivered";
  trackingNumber?: string;
  trackingCarrier?: string;
  adminNotes?: string;
  shippingAddress?: {
    address: string;
    city: string;
    country: string;
    zip: string;
  };
  createdAt: string;
}

const statusColors: Record<string, string> = {
  pending: "text-gold",
  paid: "text-teal",
  failed: "text-auction-red",
  processing: "text-text-secondary",
  confirmed: "text-gold",
  printing: "text-gold",
  shipped: "text-teal",
  delivered: "text-teal",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("");
  const [selected, setSelected] = useState<Order | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.set("search", search);
      if (paymentFilter) params.set("paymentStatus", paymentFilter);
      const res = await fetch(`/api/admin/orders?${params.toString()}`, {
        cache: "no-store",
      });
      const data = await res.json();
      setOrders(data.orders || []);
    } finally {
      setLoading(false);
    }
  }, [search, paymentFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const format = (paise: number) => `₹${(paise / 100).toFixed(0)}`;

  return (
    <div>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          placeholder="Search order #, email, name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-bg-secondary border border-border-subtle text-text-primary px-4 py-3 text-sm placeholder:text-text-secondary/40 focus:border-gold focus:outline-none transition-colors"
        />
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="bg-bg-secondary border border-border-subtle text-text-primary px-4 py-3 text-sm focus:border-gold focus:outline-none transition-colors"
        >
          <option value="">All payments</option>
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="failed">Failed</option>
        </select>
      </div>

      {/* Orders table */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-6 h-6 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        </div>
      ) : orders.length === 0 ? (
        <div className="border border-border-subtle py-20 text-center text-text-secondary text-sm">
          No orders yet.
        </div>
      ) : (
        <div className="border border-border-subtle">
          <div className="grid grid-cols-12 gap-4 px-6 py-3 border-b border-border-subtle text-[10px] tracking-[0.2em] uppercase text-text-secondary font-[family-name:var(--font-mono)]">
            <div className="col-span-3">Order</div>
            <div className="col-span-3">Customer</div>
            <div className="col-span-2">Payment</div>
            <div className="col-span-2">Fulfillment</div>
            <div className="col-span-2 text-right">Total</div>
          </div>
          {orders.map((order) => (
            <button
              key={order._id}
              onClick={() => setSelected(order)}
              className="w-full grid grid-cols-12 gap-4 px-6 py-4 border-b border-border-subtle hover:bg-bg-secondary/40 transition-colors text-left"
            >
              <div className="col-span-3">
                <div className="text-gold text-sm font-[family-name:var(--font-mono)]">
                  {order.orderNumber}
                </div>
                <div className="text-text-secondary text-[10px] mt-1">
                  {new Date(order.createdAt).toLocaleString()}
                </div>
              </div>
              <div className="col-span-3">
                <div className="text-text-primary text-sm">{order.name}</div>
                <div className="text-text-secondary text-xs mt-0.5">{order.email}</div>
              </div>
              <div className={`col-span-2 text-xs uppercase tracking-wider ${statusColors[order.paymentStatus]}`}>
                {order.paymentStatus}
              </div>
              <div className={`col-span-2 text-xs uppercase tracking-wider ${statusColors[order.fulfillmentStatus]}`}>
                {order.fulfillmentStatus}
              </div>
              <div className="col-span-2 text-right text-gold font-[family-name:var(--font-mono)] text-sm">
                {format(order.total)}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Order detail drawer */}
      <AnimatePresence>
        {selected && (
          <OrderDrawer
            order={selected}
            onClose={() => setSelected(null)}
            onSaved={(updated) => {
              setSelected(updated);
              setOrders((prev) => prev.map((o) => (o._id === updated._id ? updated : o)));
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function OrderDrawer({
  order,
  onClose,
  onSaved,
}: {
  order: Order;
  onClose: () => void;
  onSaved: (o: Order) => void;
}) {
  const [fulfillmentStatus, setFulfillmentStatus] = useState(order.fulfillmentStatus);
  const [paymentStatus, setPaymentStatus] = useState(order.paymentStatus);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber || "");
  const [trackingCarrier, setTrackingCarrier] = useState(order.trackingCarrier || "");
  const [adminNotes, setAdminNotes] = useState(order.adminNotes || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const format = (paise: number) => `₹${(paise / 100).toFixed(0)}`;

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/orders/${order._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fulfillmentStatus,
          paymentStatus,
          trackingNumber,
          trackingCarrier,
          adminNotes,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to save");
        return;
      }
      onSaved(data.order);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/70 z-40"
      />
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", stiffness: 280, damping: 32 }}
        className="fixed right-0 top-0 h-full w-full max-w-xl bg-bg-primary border-l border-border-subtle z-50 overflow-y-auto"
      >
        <div className="p-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <p className="text-text-secondary text-[10px] tracking-[0.3em] uppercase font-[family-name:var(--font-mono)] mb-2">
                Order
              </p>
              <h2 className="font-[family-name:var(--font-display)] text-3xl text-gold">
                {order.orderNumber}
              </h2>
              <p className="text-text-secondary text-xs mt-1">
                {new Date(order.createdAt).toLocaleString()}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-text-secondary hover:text-gold text-2xl leading-none"
            >
              ×
            </button>
          </div>

          {/* Customer */}
          <section className="mb-6">
            <h3 className="text-text-secondary text-[10px] tracking-[0.2em] uppercase font-[family-name:var(--font-mono)] mb-3">
              Customer
            </h3>
            <p className="text-text-primary">{order.name}</p>
            <p className="text-text-secondary text-sm">{order.email}</p>
            {order.shippingAddress && (
              <div className="mt-3 text-text-secondary text-sm space-y-0.5">
                <p>{order.shippingAddress.address}</p>
                <p>
                  {order.shippingAddress.city}, {order.shippingAddress.zip}
                </p>
                <p>{order.shippingAddress.country}</p>
              </div>
            )}
          </section>

          {/* Items */}
          <section className="mb-6">
            <h3 className="text-text-secondary text-[10px] tracking-[0.2em] uppercase font-[family-name:var(--font-mono)] mb-3">
              Items
            </h3>
            <div className="border border-border-subtle">
              {order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between px-4 py-3 border-b border-border-subtle last:border-b-0"
                >
                  <div>
                    <p className="text-text-primary text-sm">{item.title}</p>
                    <p className="text-text-secondary text-xs mt-0.5">
                      {item.type === "digital" ? "Digital" : `Print · ${item.printSize || ""} · ${item.frameOption || "No frame"}`}
                      {" × "}
                      {item.quantity}
                    </p>
                  </div>
                  <p className="text-gold font-[family-name:var(--font-mono)] text-sm">
                    {format(item.price * item.quantity)}
                  </p>
                </div>
              ))}
              <div className="flex justify-between px-4 py-3 bg-bg-secondary/50">
                <p className="text-text-secondary text-xs tracking-widest uppercase">Total</p>
                <p className="text-gold font-[family-name:var(--font-mono)]">
                  {format(order.total)}
                </p>
              </div>
            </div>
          </section>

          {/* Status updates */}
          <section className="space-y-4 mb-6">
            <h3 className="text-text-secondary text-[10px] tracking-[0.2em] uppercase font-[family-name:var(--font-mono)]">
              Update
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-text-secondary text-[10px] tracking-wider uppercase block mb-1">
                  Payment
                </label>
                <select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as Order["paymentStatus"])}
                  className="w-full bg-bg-secondary border border-border-subtle text-text-primary px-3 py-2 text-sm focus:border-gold focus:outline-none"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
              <div>
                <label className="text-text-secondary text-[10px] tracking-wider uppercase block mb-1">
                  Fulfillment
                </label>
                <select
                  value={fulfillmentStatus}
                  onChange={(e) =>
                    setFulfillmentStatus(e.target.value as Order["fulfillmentStatus"])
                  }
                  className="w-full bg-bg-secondary border border-border-subtle text-text-primary px-3 py-2 text-sm focus:border-gold focus:outline-none"
                >
                  <option value="processing">Processing</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="printing">Printing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="text"
                value={trackingCarrier}
                onChange={(e) => setTrackingCarrier(e.target.value)}
                placeholder="Carrier (e.g. DTDC)"
                className="bg-bg-secondary border border-border-subtle text-text-primary px-3 py-2 text-sm placeholder:text-text-secondary/40 focus:border-gold focus:outline-none"
              />
              <input
                type="text"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
                placeholder="Tracking number"
                className="bg-bg-secondary border border-border-subtle text-text-primary px-3 py-2 text-sm placeholder:text-text-secondary/40 focus:border-gold focus:outline-none"
              />
            </div>

            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Internal notes"
              rows={3}
              className="w-full bg-bg-secondary border border-border-subtle text-text-primary px-3 py-2 text-sm placeholder:text-text-secondary/40 focus:border-gold focus:outline-none resize-none"
            />

            {error && <p className="text-auction-red text-sm">{error}</p>}

            <button
              onClick={save}
              disabled={saving}
              className="w-full py-3 bg-gold text-bg-primary text-xs tracking-widest uppercase hover:bg-gold-light transition-colors disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save changes"}
            </button>
          </section>
        </div>
      </motion.aside>
    </>
  );
}
