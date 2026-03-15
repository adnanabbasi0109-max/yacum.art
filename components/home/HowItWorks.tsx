"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const steps = [
  {
    number: "01",
    title: "Choose a Verse",
    description: "Browse our collection of Quranic verse paintings.",
  },
  {
    number: "02",
    title: "Download the File",
    description: "Receive a print-ready digital file after purchase.",
  },
  {
    number: "03",
    title: "Scan the QR Code",
    description: "Every painting contains a QR code linking to the verse.",
  },
  {
    number: "04",
    title: "Print or Frame",
    description: "Order a physical print or use our framing service.",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-24 bg-bg-secondary">
      <div className="max-w-7xl mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-[family-name:var(--font-display)] text-3xl md:text-4xl font-light italic text-text-primary text-center mb-16"
        >
          How It Works
        </motion.h2>

        <div className="relative">
          {/* Gold dashed connection line - desktop only */}
          <div className="hidden md:block absolute top-12 left-[12.5%] right-[12.5%] h-px border-t border-dashed border-gold/30" />

          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{
                  duration: 0.6,
                  delay: i * 0.15,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className="text-center relative"
              >
                <div className="w-24 h-24 mx-auto mb-6 rounded-full border border-gold/20 flex items-center justify-center bg-bg-primary relative z-10">
                  <span className="text-gold font-[family-name:var(--font-mono)] text-lg">
                    {step.number}
                  </span>
                </div>
                <h3 className="text-text-primary font-medium mb-2">
                  {step.title}
                </h3>
                <p className="text-text-secondary text-sm">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
