"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
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

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState<Tab>("Orders");

  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="min-h-screen bg-bg-primary pt-24">
        <div className="max-w-4xl mx-auto px-6 py-16">
          {/* Page Title */}
          <h1 className="font-display italic text-4xl md:text-5xl text-text-primary mb-12">
            My Account
          </h1>

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
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
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
        </div>
      </main>
      <Footer />
    </>
  );
}
