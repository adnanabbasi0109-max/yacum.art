"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useUiStore } from "@/store/uiStore";
import { useCartStore } from "@/store/cartStore";
import { useState, useEffect } from "react";

export default function Navbar() {
  const { toggleCart, toggleMobileMenu, isMobileMenuOpen, setMobileMenuOpen } =
    useUiStore();
  const itemCount = useCartStore((s) => s.items.reduce((acc, i) => acc + i.quantity, 0));
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-bg-primary/90 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <Image src="/logo.png" alt="Yacum Art" width={120} height={40} priority />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/gallery"
            className="text-text-secondary hover:text-text-primary transition-colors duration-300 text-sm tracking-wider uppercase"
          >
            Gallery
          </Link>
          <Link
            href="/auction"
            className="text-text-secondary hover:text-text-primary transition-colors duration-300 text-sm tracking-wider uppercase"
          >
            Auctions
          </Link>
          <Link
            href="/track-order"
            className="text-text-secondary hover:text-text-primary transition-colors duration-300 text-sm tracking-wider uppercase"
          >
            Track Order
          </Link>
          <Link
            href="/account"
            className="text-text-secondary hover:text-text-primary transition-colors duration-300 text-sm tracking-wider uppercase"
          >
            Account
          </Link>
          {/* Cart */}
          <button
            onClick={toggleCart}
            className="relative text-text-secondary hover:text-gold transition-colors duration-300"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
            {itemCount > 0 && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gold text-bg-primary text-[10px] font-bold rounded-full flex items-center justify-center"
              >
                {itemCount}
              </motion.span>
            )}
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          onClick={toggleMobileMenu}
          className="md:hidden text-text-primary p-2"
          aria-label="Menu"
        >
          <div className="w-5 flex flex-col gap-1">
            <motion.span
              animate={isMobileMenuOpen ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }}
              className="block h-[1px] bg-text-primary w-full"
            />
            <motion.span
              animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
              className="block h-[1px] bg-text-primary w-full"
            />
            <motion.span
              animate={isMobileMenuOpen ? { rotate: -45, y: -5 } : { rotate: 0, y: 0 }}
              className="block h-[1px] bg-text-primary w-full"
            />
          </div>
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-bg-primary/95 backdrop-blur-md border-t border-border-subtle"
          >
            <div className="px-6 py-6 flex flex-col gap-4">
              <Link
                href="/gallery"
                onClick={() => setMobileMenuOpen(false)}
                className="text-text-secondary hover:text-text-primary text-lg"
              >
                Gallery
              </Link>
              <Link
                href="/auction"
                onClick={() => setMobileMenuOpen(false)}
                className="text-text-secondary hover:text-text-primary text-lg"
              >
                Auctions
              </Link>
              <Link
                href="/track-order"
                onClick={() => setMobileMenuOpen(false)}
                className="text-text-secondary hover:text-text-primary text-lg"
              >
                Track Order
              </Link>
              <Link
                href="/account"
                onClick={() => setMobileMenuOpen(false)}
                className="text-text-secondary hover:text-text-primary text-lg"
              >
                Account
              </Link>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  toggleCart();
                }}
                className="text-gold text-lg text-left"
              >
                Cart {itemCount > 0 && `(${itemCount})`}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
