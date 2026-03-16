"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CustomCursor from "@/components/layout/CustomCursor";

export default function AccountPage() {
  return (
    <>
      <CustomCursor />
      <Navbar />
      <main className="min-h-screen bg-bg-primary pt-24">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <h1 className="font-[family-name:var(--font-display)] italic text-4xl md:text-5xl text-text-primary mb-6">
            Coming Soon
          </h1>
          <p className="text-text-secondary text-sm max-w-md mx-auto">
            Account features including order tracking, downloads, and bid
            history are coming soon.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
