import QRCode from "qrcode";
import fs from "fs";
import path from "path";

const artworks = [
  { slug: "sibghatallah-take-on-allahs-colour", verseId: "al-baqarah-2-138" },
  { slug: "thornless-lote-trees-sidrin-makhdud", verseId: "al-waqiah-56-28" },
  { slug: "divine-precision-sunflower", verseId: "al-mulk-67-3" },
  { slug: "divine-precision-leaf", verseId: "al-mulk-67-3-leaf" },
  { slug: "radiant-sunflower-divine-design", verseId: "al-mulk-67-3-sunflower" },
  { slug: "honeycomb-flawless-design", verseId: "al-mulk-67-3-honeycomb" },
  { slug: "mountains-raised-in-measure", verseId: "al-ghashiyah-88-19" },
  { slug: "birds-in-flight-divine-mercy", verseId: "al-mulk-67-19" },
];

const outDir = path.join(process.cwd(), "public/qrcodes");

async function generate() {
  for (const art of artworks) {
    const url = `https://yacum.art/verse/${art.verseId}`;
    const filePath = path.join(outDir, `${art.slug}.png`);

    await QRCode.toFile(filePath, url, {
      width: 400,
      margin: 2,
      color: {
        dark: "#d4af37",
        light: "#00000000",
      },
    });

    console.log(`✓ ${art.slug} → ${url}`);
  }

  console.log(`\nDone! ${artworks.length} QR codes generated in public/qrcodes/`);
}

generate().catch(console.error);
