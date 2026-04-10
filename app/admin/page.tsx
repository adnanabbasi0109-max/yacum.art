"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import CustomCursor from "@/components/layout/CustomCursor";
import AdminLogin from "@/components/admin/AdminLogin";
import AdminOrders from "@/components/admin/AdminOrders";
import AdminArtworks from "@/components/admin/AdminArtworks";

type Tab = "orders" | "artworks";

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string>("");
  const [tab, setTab] = useState<Tab>("orders");

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/me", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setAuthed(true);
        setEmail(data.email || "");
      } else {
        setAuthed(false);
      }
    } catch {
      setAuthed(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setEmail("");
  };

  if (authed === null) {
    return (
      <>
        <CustomCursor />
        <main className="min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-gold/30 border-t-gold rounded-full animate-spin" />
        </main>
      </>
    );
  }

  if (!authed) {
    return (
      <>
        <CustomCursor />
        <AdminLogin onSuccess={checkAuth} />
      </>
    );
  }

  return (
    <>
      <CustomCursor />
      <main className="min-h-screen pt-10 pb-20">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="flex items-start justify-between mb-10 pb-6 border-b border-border-subtle"
          >
            <div>
              <p className="text-text-secondary text-[10px] tracking-[0.3em] uppercase font-[family-name:var(--font-mono)] mb-2">
                Yacum Art · Control
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-4xl lg:text-5xl text-text-primary">
                Admin Panel
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-text-secondary text-xs font-[family-name:var(--font-mono)]">
                {email}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs tracking-widest uppercase text-text-secondary hover:text-gold transition-colors border border-border-subtle hover:border-gold px-4 py-2"
              >
                Sign out
              </button>
            </div>
          </motion.div>

          {/* Tabs */}
          <div className="flex border-b border-border-subtle mb-10">
            {([
              { id: "orders", label: "Orders" },
              { id: "artworks", label: "Products" },
            ] as const).map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-6 pb-3 text-xs tracking-widest uppercase transition-colors duration-200 ${
                  tab === t.id
                    ? "text-gold border-b-2 border-gold"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === "orders" ? <AdminOrders /> : <AdminArtworks />}
        </div>
      </main>
    </>
  );
}
