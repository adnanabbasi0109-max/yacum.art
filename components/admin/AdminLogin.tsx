"use client";

import { useState } from "react";
import { motion } from "framer-motion";

interface Props {
  onSuccess: () => void;
}

export default function AdminLogin({ onSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Sign in failed");
        return;
      }
      onSuccess();
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-10">
          <p className="text-text-secondary text-[10px] tracking-[0.3em] uppercase font-[family-name:var(--font-mono)] mb-3">
            Yacum Art · Control
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl text-text-primary">
            Admin Access
          </h1>
          <div className="h-px bg-gold/20 mt-6" />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Admin email"
            required
            className="w-full bg-bg-secondary border border-border-subtle text-text-primary px-4 py-3 text-sm placeholder:text-text-secondary/40 focus:border-gold focus:outline-none transition-colors"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full bg-bg-secondary border border-border-subtle text-text-primary px-4 py-3 text-sm placeholder:text-text-secondary/40 focus:border-gold focus:outline-none transition-colors"
          />
          {error && <p className="text-auction-red text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-gold text-bg-primary text-sm tracking-widest uppercase hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Enter"}
          </button>
        </form>
      </motion.div>
    </main>
  );
}
