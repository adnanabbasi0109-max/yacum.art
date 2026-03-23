"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/layout/CustomCursor";

interface User {
  id: string;
  email: string;
  name: string;
}

function SignInForm({ onSuccess }: { onSuccess: (user: User) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Sign in failed");
        return;
      }

      onSuccess(data.user);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
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
        className="w-full py-3 bg-gold text-bg-primary text-sm tracking-wider uppercase hover:bg-gold-light transition-colors disabled:opacity-50"
      >
        {loading ? "Signing in..." : "Sign In"}
      </button>
    </form>
  );
}

function SignUpForm({ onSuccess }: { onSuccess: (user: User) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Sign up failed");
        return;
      }

      onSuccess(data.user);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Full Name"
        required
        className="w-full bg-bg-secondary border border-border-subtle text-text-primary px-4 py-3 text-sm placeholder:text-text-secondary/40 focus:border-gold focus:outline-none transition-colors"
      />
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
        className="w-full bg-bg-secondary border border-border-subtle text-text-primary px-4 py-3 text-sm placeholder:text-text-secondary/40 focus:border-gold focus:outline-none transition-colors"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password (min 6 characters)"
        required
        minLength={6}
        className="w-full bg-bg-secondary border border-border-subtle text-text-primary px-4 py-3 text-sm placeholder:text-text-secondary/40 focus:border-gold focus:outline-none transition-colors"
      />
      {error && <p className="text-auction-red text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gold text-bg-primary text-sm tracking-wider uppercase hover:bg-gold-light transition-colors disabled:opacity-50"
      >
        {loading ? "Creating account..." : "Create Account"}
      </button>
    </form>
  );
}

const tabs = ["Orders", "Downloads", "Bid History"] as const;
type Tab = (typeof tabs)[number];

export default function AccountPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect");
  const [user, setUser] = useState<User | null>(null);
  const [checking, setChecking] = useState(true);
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [activeTab, setActiveTab] = useState<Tab>("Orders");

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.user) {
          setUser(data.user);
          if (redirectTo) router.push(`/${redirectTo}`);
        }
      })
      .catch(() => {})
      .finally(() => setChecking(false));
  }, [redirectTo, router]);

  const handleAuthSuccess = (u: User) => {
    setUser(u);
    if (redirectTo) router.push(`/${redirectTo}`);
  };

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", { method: "POST" });
    setUser(null);
  };

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="min-h-screen bg-bg-primary pt-24">
        <div className="max-w-4xl mx-auto px-6 py-16">
          {checking ? (
            <div className="text-center py-20">
              <p className="text-text-secondary animate-pulse">Loading...</p>
            </div>
          ) : !user ? (
            <>
              <h1 className="font-[family-name:var(--font-display)] italic text-4xl md:text-5xl text-text-primary mb-12 text-center">
                My Account
              </h1>
              <div className="max-w-md mx-auto space-y-8">
                <div className="text-center">
                  {redirectTo && (
                    <p className="text-gold text-sm mb-2">
                      Please sign in to continue to checkout
                    </p>
                  )}
                  <p className="text-text-secondary text-sm">
                    {mode === "signin"
                      ? "Sign in to place bids, track orders, and access your downloads"
                      : "Create an account to get started"}
                  </p>
                </div>

                {mode === "signin" ? (
                  <SignInForm onSuccess={handleAuthSuccess} />
                ) : (
                  <SignUpForm onSuccess={handleAuthSuccess} />
                )}

                <div className="text-center">
                  <button
                    onClick={() =>
                      setMode(mode === "signin" ? "signup" : "signin")
                    }
                    className="text-gold text-sm hover:text-gold-light transition-colors"
                  >
                    {mode === "signin"
                      ? "Don't have an account? Sign Up"
                      : "Already have an account? Sign In"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* User Header */}
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h1 className="font-[family-name:var(--font-display)] italic text-4xl md:text-5xl text-text-primary">
                    My Account
                  </h1>
                  <p className="text-text-secondary text-sm mt-2">
                    {user.name} &middot; {user.email}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="text-text-secondary text-xs uppercase tracking-wider hover:text-auction-red transition-colors border border-border-subtle px-4 py-2 hover:border-auction-red/30"
                >
                  Sign Out
                </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 border-b border-border-subtle mb-8">
                {tabs.map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`relative px-5 py-3 font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase transition-colors ${
                      activeTab === tab
                        ? "text-gold"
                        : "text-text-secondary hover:text-text-primary"
                    }`}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute bottom-0 left-0 right-0 h-px bg-gold"
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      />
                    )}
                  </button>
                ))}
              </div>

              {/* Tab Content */}
              <div className="bg-bg-secondary/30 border border-border-subtle rounded-sm min-h-[300px]">
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <p className="text-text-secondary font-[family-name:var(--font-mono)] text-sm tracking-wide mb-4">
                    {activeTab === "Orders" && "No orders yet"}
                    {activeTab === "Downloads" && "No downloads available"}
                    {activeTab === "Bid History" && "No bids placed yet"}
                  </p>
                  {activeTab === "Orders" && (
                    <Link
                      href="/gallery"
                      className="text-gold hover:text-gold/80 font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase transition-colors border-b border-gold/30 hover:border-gold/60 pb-0.5"
                    >
                      Browse Gallery
                    </Link>
                  )}
                  {activeTab === "Bid History" && (
                    <Link
                      href="/auction"
                      className="text-gold hover:text-gold/80 font-[family-name:var(--font-mono)] text-xs tracking-widest uppercase transition-colors border-b border-gold/30 hover:border-gold/60 pb-0.5"
                    >
                      View Auctions
                    </Link>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
