import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb+srv://abbasimusa1106_db_user:a2J2QaRAxhsYcLUd@cluster0.hjnciwe.mongodb.net/yacumart?retryWrites=true&w=majority";

const ArtworkSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    verseId: { type: String, required: true },
    arabic: { type: String, required: true },
    translation: { type: String, required: true },
    theme: { type: String, required: true },
    previewImageUrl: { type: String, required: true },
    highResS3Key: { type: String, required: true },
    qrCodeImageUrl: { type: String },
    digitalPrice: { type: Number, required: true },
    printPriceBase: { type: Number, required: true },
    printSizes: [
      {
        label: String,
        dimensions: String,
        price: Number,
      },
    ],
    frameOptions: [
      {
        label: String,
        material: String,
        priceAddon: Number,
      },
    ],
    status: {
      type: String,
      enum: ["draft", "published", "soldout"],
      default: "published",
    },
    isAuctionPiece: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Artwork =
  mongoose.models.Artwork || mongoose.model("Artwork", ArtworkSchema);

const defaultPrintSizes = [
  { label: "Small", dimensions: '12" × 16"', price: 4999 },
  { label: "Medium", dimensions: '18" × 24"', price: 7999 },
  { label: "Large", dimensions: '24" × 36"', price: 12999 },
];

const defaultFrameOptions = [
  { label: "No Frame", material: "Unframed", priceAddon: 0 },
  { label: "Black Wood", material: "Solid Black Wood", priceAddon: 2999 },
  { label: "Gold Metal", material: "Brushed Gold Metal", priceAddon: 4999 },
  { label: "Walnut", material: "Natural Walnut Wood", priceAddon: 3999 },
];

const artworks = [
  {
    slug: "sibghatallah-take-on-allahs-colour",
    title: "Sibghatallah",
    verseId: "al-baqarah-2-138",
    arabic: "صِبْغَةَ ٱللَّهِ ۖ وَمَنْ أَحْسَنُ مِنَ ٱللَّهِ صِبْغَةً ۖ وَنَحْنُ لَهُ عَـٰبِدُونَ",
    translation:
      '"Take on Allah\'s colour." And whose colour is better than Allah\'s? It is Him that we serve.',
    theme: "Light",
    previewImageUrl: "/artworks/sibghatallah.png",
    highResS3Key: "artworks/sibghatallah-highres.png",
    digitalPrice: 1999,
    printPriceBase: 4999,
    printSizes: defaultPrintSizes,
    frameOptions: defaultFrameOptions,
    status: "published",
    isAuctionPiece: false,
    isFeatured: true,
    description:
      "A vast, ethereal desert landscape where divine light descends like a luminous waterfall, painting veins of colour through ancient stone. The barren earth awakens with subtle hues — a visual meditation on how Allah's colour transforms even the most desolate terrain into something sacred and alive.",
  },
  {
    slug: "thornless-lote-trees-sidrin-makhdud",
    title: "Thornless Lote Trees",
    verseId: "al-waqiah-56-28",
    arabic: "فِى سِدْرٍ مَّخْضُودٍ",
    translation:
      "They shall be in the midst of thornless lote trees.",
    theme: "Nature",
    previewImageUrl: "/artworks/thornless-lote-trees.png",
    highResS3Key: "artworks/thornless-lote-trees-highres.png",
    digitalPrice: 1999,
    printPriceBase: 4999,
    printSizes: defaultPrintSizes,
    frameOptions: defaultFrameOptions,
    status: "published",
    isAuctionPiece: false,
    isFeatured: true,
    description:
      "A serene vision of Paradise: beneath thornless lote trees, the gardens glow with peace, soft light, and flowing streams, offering a glimpse of the comfort and beauty prepared for the blessed.",
  },
  {
    slug: "divine-precision-sunflower",
    title: "Divine Precision \u2014 Sunflower",
    verseId: "al-mulk-67-3-4",
    arabic: "ٱلَّذِى خَلَقَ سَبْعَ سَمَـٰوَٰتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِى خَلْقِ ٱلرَّحْمَـٰنِ مِن تَفَـٰوُتٍ ۖ فَٱرْجِعِ ٱلْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ",
    translation:
      "Who created the seven heavens one upon another. You will not see any inconsistency in the Merciful One's creation. Turn your vision again, can you see any flaw?",
    theme: "Creation",
    previewImageUrl: "/artworks/sunflower-closeup.png",
    highResS3Key: "artworks/sunflower-closeup-highres.png",
    digitalPrice: 1999,
    printPriceBase: 4999,
    printSizes: defaultPrintSizes,
    frameOptions: defaultFrameOptions,
    status: "published",
    isAuctionPiece: false,
    isFeatured: false,
    description:
      "The perfection of Allah's creation: layered, balanced, and without fault. It invites the heart to look again and again, finding harmony, beauty, and signs of divine design in every detail.",
  },
  {
    slug: "divine-precision-leaf",
    title: "Divine Precision \u2014 Leaf",
    verseId: "al-mulk-67-3-4",
    arabic: "ٱلَّذِى خَلَقَ سَبْعَ سَمَـٰوَٰتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِى خَلْقِ ٱلرَّحْمَـٰنِ مِن تَفَـٰوُتٍ ۖ فَٱرْجِعِ ٱلْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ",
    translation:
      "Who created the seven heavens one upon another. You will not see any inconsistency in the Merciful One's creation. Turn your vision again, can you see any flaw?",
    theme: "Creation",
    previewImageUrl: "/artworks/divine-leaf.png",
    highResS3Key: "artworks/divine-leaf-highres.png",
    digitalPrice: 1999,
    printPriceBase: 4999,
    printSizes: defaultPrintSizes,
    frameOptions: defaultFrameOptions,
    status: "published",
    isAuctionPiece: false,
    isFeatured: false,
    description:
      "The perfection of Allah's creation, where no flaw or imbalance can truly be found. Its delicate patterns invite the eye to look again and again, witnessing harmony, beauty, and divine precision in even the smallest part of nature.",
  },
  {
    slug: "radiant-sunflower-divine-design",
    title: "Radiant Sunflower",
    verseId: "al-mulk-67-3-4",
    arabic: "ٱلَّذِى خَلَقَ سَبْعَ سَمَـٰوَٰتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِى خَلْقِ ٱلرَّحْمَـٰنِ مِن تَفَـٰوُتٍ ۖ فَٱرْجِعِ ٱلْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ",
    translation:
      "Who created the seven heavens one upon another. You will not see any inconsistency in the Merciful One's creation. Turn your vision again, can you see any flaw?",
    theme: "Creation",
    previewImageUrl: "/artworks/sunflower-garden.png",
    highResS3Key: "artworks/sunflower-garden-highres.png",
    digitalPrice: 1999,
    printPriceBase: 4999,
    printSizes: defaultPrintSizes,
    frameOptions: defaultFrameOptions,
    status: "published",
    isAuctionPiece: false,
    isFeatured: true,
    description:
      "A radiant sunflower stands as a gentle sign of divine perfection, where creation is described as flawless and harmonious. Its balanced petals, ordered center, and graceful form invite the heart to look again and witness the beauty, precision, and unity woven into Allah's design.",
  },
  {
    slug: "honeycomb-flawless-design",
    title: "Flawless Design \u2014 Honeycomb",
    verseId: "al-mulk-67-3-4",
    arabic: "ٱلَّذِى خَلَقَ سَبْعَ سَمَـٰوَٰتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِى خَلْقِ ٱلرَّحْمَـٰنِ مِن تَفَـٰوُتٍ ۖ فَٱرْجِعِ ٱلْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ",
    translation:
      "Who created the seven heavens one upon another. You will not see any inconsistency in the Merciful One's creation. Turn your vision again, can you see any flaw?",
    theme: "Creation",
    previewImageUrl: "/artworks/honeycomb.png",
    highResS3Key: "artworks/honeycomb-highres.png",
    digitalPrice: 1999,
    printPriceBase: 4999,
    printSizes: defaultPrintSizes,
    frameOptions: defaultFrameOptions,
    status: "published",
    isAuctionPiece: false,
    isFeatured: false,
    description:
      "The creation of Allah is marked by balance, precision, and flawless design. The perfect geometry of the hexagonal cells invites the eye to look again and again, yet find no disorder, only beauty, wisdom, and proportion in what He has created.",
  },
  {
    slug: "mountains-raised-in-measure",
    title: "Mountains Raised in Measure",
    verseId: "al-ghashiyah-88-19",
    arabic: "وَإِلَى ٱلْجِبَالِ كَيْفَ نُصِبَتْ",
    translation: "And the mountains: how they were fixed?",
    theme: "Creation",
    previewImageUrl: "/artworks/mountains.png",
    highResS3Key: "artworks/mountains-highres.png",
    digitalPrice: 1999,
    printPriceBase: 4999,
    printSizes: defaultPrintSizes,
    frameOptions: defaultFrameOptions,
    status: "published",
    isAuctionPiece: false,
    isFeatured: false,
    description:
      "A majestic canyon of layered mountains rises in flowing bands of gold, rose, and amber, while still pools of turquoise water rest below. The scene feels sculpted with precision and grandeur, capturing the quiet power and beauty of mountains raised in perfect measure.",
  },
  {
    slug: "birds-in-flight-divine-mercy",
    title: "Birds in Flight",
    verseId: "al-mulk-67-19",
    arabic: "أَوَلَمْ يَرَوْا۟ إِلَى ٱلطَّيْرِ فَوْقَهُمْ صَـٰٓفَّـٰتٍ وَيَقْبِضْنَ ۚ مَا يُمْسِكُهُنَّ إِلَّا ٱلرَّحْمَـٰنُ ۚ إِنَّهُ بِكُلِّ شَىْءٍۭ بَصِيرٌ",
    translation:
      "Have they not seen birds above them spreading and closing their wings, with none holding them except the Merciful One? He oversees everything.",
    theme: "Mercy",
    previewImageUrl: "/artworks/birds-in-flight.png",
    highResS3Key: "artworks/birds-in-flight-highres.png",
    digitalPrice: 1999,
    printPriceBase: 4999,
    printSizes: defaultPrintSizes,
    frameOptions: defaultFrameOptions,
    status: "published",
    isAuctionPiece: false,
    isFeatured: false,
    description:
      "Wings open and fold in perfect rhythm, yet nothing about their flight feels self-sustained. Beauty, motion, and mercy meet in a single breath of air.",
  },
];

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected!");

  // Clear existing artworks
  await Artwork.deleteMany({});
  console.log("Cleared existing artworks.");

  // Insert new artworks
  for (const art of artworks) {
    await Artwork.create(art);
    console.log(`✓ Added: ${art.slug}`);
  }

  console.log(`\nDone! ${artworks.length} artworks seeded.`);
  console.log("Featured: 3 (Sibghatallah, Lote Trees, Sunflower Garden)");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
