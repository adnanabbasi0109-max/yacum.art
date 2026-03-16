import type { Metadata } from "next";
import AuthProvider from "@/components/providers/AuthProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "YACUM.ART — Quranic Verse Art",
  description:
    "Premium digital paintings themed on Quranic verses. Each piece embeds a QR code linking to verse recitation and layered meaning.",
  icons: {
    icon: "/icon.png",
    apple: "/icon.png",
  },
  keywords: [
    "Islamic art",
    "Quranic art",
    "digital paintings",
    "verse art",
    "Muslim art",
  ],
  openGraph: {
    title: "YACUM.ART — Quranic Verse Art",
    description:
      "Premium digital paintings themed on Quranic verses.",
    type: "website",
    url: "https://yacum.art",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&family=Scheherazade+New:wght@400;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
