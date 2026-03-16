"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/layout/CustomCursor";

const tabs = ["Orders", "Downloads", "Bid History"] as const;
type Tab = (typeof tabs)[number];

function OrdersTab() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <svg
        className="w-16 h-16 text-text-secondary/30 mb-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
      <p className="text-text-secondary font-mono text-sm tracking-wide mb-4">
        No orders yet
      </p>
      <Link
        href="/gallery"
        className="text-gold hover:text-gold/80 font-mono text-xs tracking-widest uppercase transition-colors border-b border-gold/30 hover:border-gold/60 pb-0.5"
      >
        Browse Gallery
      </Link>
    </div>
  );
}

function DownloadsTab() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <svg
        className="w-16 h-16 text-text-secondary/30 mb-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
      <p className="text-text-secondary font-mono text-sm tracking-wide">
        No downloads available
      </p>
    </div>
  );
}

function BidHistoryTab() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <svg
        className="w-16 h-16 text-text-secondary/30 mb-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <p className="text-text-secondary font-mono text-sm tracking-wide mb-4">
        No bids placed yet
      </p>
      <Link
        href="/auction"
        className="text-gold hover:text-gold/80 font-mono text-xs tracking-widest uppercase transition-colors border-b border-gold/30 hover:border-gold/60 pb-0.5"
      >
        View Auctions
      </Link>
    </div>
  );
}

const tabContent: Record<Tab, React.ReactNode> = {
  Orders: <OrdersTab />,
  Downloads: <DownloadsTab />,
  "Bid History": <BidHistoryTab />,
};

function SignInForm() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSending(true);
    await signIn("email", { email, redirect: false });
    setSending(false);
    setSent(true);
  };

  return (
    <div className="max-w-md mx-auto space-y-8">
      <div className="text-center">
        <h2 className="font-display italic text-2xl text-text-primary mb-2">
          Welcome
        </h2>
        <p className="text-text-secondary text-sm">
          Sign in to place bids, track orders, and access your downloads
        </p>
      </div>

      {/* Google Sign In */}
      <button
        onClick={() => signIn("google")}
        className="w-full flex items-center justify-center gap-3 border border-border-subtle py-3 text-text-primary hover:border-gold/30 transition-colors"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        <span className="text-sm tracking-wide">Continue with Google</span>
      </button>

      <div className="flex items-center gap-4">
        <div className="flex-1 h-px bg-border-subtle" />
        <span className="text-text-secondary text-xs uppercase tracking-wider">
          or
        </span>
        <div className="flex-1 h-px bg-border-subtle" />
      </div>

      {/* Email Sign In */}
      {sent ? (
        <div className="text-center py-8 border border-gold/20 bg-gold/5">
          <p className="text-gold text-sm">
            Check your email for a sign-in link
          </p>
          <p className="text-text-secondary text-xs mt-2">
            We sent a magic link to {email}
          </p>
        </div>
      ) : (
        <form onSubmit={handleEmailSignIn} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            required
            className="w-full bg-bg-secondary border border-border-subtle text-text-primary px-4 py-3 text-sm placeholder:text-text-secondary/40 focus:border-gold focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={sending}
            className="w-full py-3 bg-gold text-bg-primary text-sm tracking-wider uppercase hover:bg-gold-light transition-colors disabled:opacity-50"
          >
            {sending ? "Sending link..." : "Sign In with Email"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function AccountPage() {
  const { data: session, status } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>("Orders");

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="min-h-screen bg-bg-primary pt-24">
        <div className="max-w-4xl mx-auto px-6 py-16">
          {status === "loading" ? (
            <div className="text-center py-20">
              <p className="text-text-secondary animate-pulse">Loading...</p>
            </div>
          ) : !session ? (
            <>
              <h1 className="font-display italic text-4xl md:text-5xl text-text-primary mb-12 text-center">
                My Account
              </h1>
              <SignInForm />
            </>
          ) : (
            <>
              {/* User Header */}
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h1 className="font-display italic text-4xl md:text-5xl text-text-primary">
                    My Account
                  </h1>
                  <p className="text-text-secondary text-sm mt-2">
                    {session.user?.name || session.user?.email}
                  </p>
                </div>
                <button
                  onClick={() => signOut()}
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
                    className={`relative px-5 py-3 font-mono text-xs tracking-widest uppercase transition-colors ${
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
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    {tabContent[activeTab]}
                  </motion.div>
                </AnimatePresence>
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
