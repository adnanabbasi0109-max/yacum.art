import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="border-t border-border-subtle">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Gold separator */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent mb-12" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <Image src="/logo.png" alt="Yacum Art" width={100} height={34} />
            </div>
            <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
              Premium digital paintings inspired by Quranic verses. Each piece
              embeds a QR code linking to verse recitation and layered meaning.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-text-primary text-sm font-medium tracking-wider uppercase mb-4">
              Explore
            </h3>
            <div className="flex flex-col gap-3">
              <Link
                href="/gallery"
                className="text-text-secondary hover:text-gold transition-colors text-sm"
              >
                Gallery
              </Link>
              <Link
                href="/auction"
                className="text-text-secondary hover:text-gold transition-colors text-sm"
              >
                One Piece Only Auction
              </Link>
              <Link
                href="/account"
                className="text-text-secondary hover:text-gold transition-colors text-sm"
              >
                My Account
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-text-primary text-sm font-medium tracking-wider uppercase mb-4">
              Contact
            </h3>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:hello@yacum.art"
                className="text-text-secondary hover:text-gold transition-colors text-sm"
              >
                hello@yacum.art
              </a>
              <p className="text-text-secondary text-sm">Yacum Studio</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border-subtle flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-secondary text-xs">
            &copy; {new Date().getFullYear()} Yacum Studio. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
