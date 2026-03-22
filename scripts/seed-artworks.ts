import mongoose from "mongoose";

const MONGODB_URI =
  "mongodb+srv://abbasimusa1106_db_user:a2J2QaRAxhsYcLUd@cluster0.hjnciwe.mongodb.net/yacumart?retryWrites=true&w=majority";

const ArtworkSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true, required: true },
    title: { type: String, required: true },
    verseId: { type: String, required: true },
    arabic: { type: String, required: true },
    transliteration: { type: String },
    translation: { type: String, required: true },
    tafsir: { type: String },
    surah: { type: String },
    surahNumber: { type: Number },
    ayah: { type: Number },
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
    description: { type: String },
    isAuctionPiece: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Artwork =
  mongoose.models.Artwork || mongoose.model("Artwork", ArtworkSchema);

const defaultPrintSizes = [
  { label: "Small", dimensions: '12" × 16"', price: 149900 },
  { label: "Medium", dimensions: '18" × 24"', price: 249900 },
  { label: "Large", dimensions: '24" × 36"', price: 399900 },
];

const defaultFrameOptions = [
  { label: "No Frame", material: "Unframed", priceAddon: 0 },
  { label: "Black Wood", material: "Solid Black Wood", priceAddon: 99900 },
  { label: "Gold Metal", material: "Brushed Gold Metal", priceAddon: 149900 },
  { label: "Walnut", material: "Natural Walnut Wood", priceAddon: 129900 },
];

const artworks = [
  {
    slug: "sibghatallah-take-on-allahs-colour",
    title: "Sibghatallah",
    verseId: "al-baqarah-2-138",
    arabic: "صِبْغَةَ ٱللَّهِ ۖ وَمَنْ أَحْسَنُ مِنَ ٱللَّهِ صِبْغَةً ۖ وَنَحْنُ لَهُ عَـٰبِدُونَ",
    transliteration: "Sibghatallāhi wa man aḥsanu minallāhi sibghatan wa naḥnu lahū ʿābidūn",
    translation:
      '"Take on Allah\'s colour." And whose colour is better than Allah\'s? It is Him that we serve.',
    tafsir:
      "Ibn Kathir explains that 'Sibghah' (colour/dye) of Allah refers to the fitrah — the natural disposition of faith that Allah created in every human being. Just as a dye transforms cloth completely, Islam transforms the believer's entire being. The verse challenges: who can offer a better transformation than the one Allah provides? It is a call to embrace the pure faith of Ibrahim (AS) fully, letting it colour every aspect of life — thoughts, actions, and worship.",
    surah: "Al-Baqarah",
    surahNumber: 2,
    ayah: 138,
    theme: "Light",
    previewImageUrl: "/artworks/sibghatallah.png",
    highResS3Key: "artworks/sibghatallah-highres.png",
    digitalPrice: 49900,
    printPriceBase: 149900,
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
    transliteration: "Fī sidrim makhdūd",
    translation:
      "They shall be in the midst of thornless lote trees.",
    tafsir:
      "The Lote Tree (Sidr) in this world has thorns, but in Paradise, Allah removes every trace of harm and discomfort. The scholars of tafsir explain that 'makhdud' means the thorns have been stripped away and replaced with fruit. This is a metaphor for the afterlife itself — everything painful in this world is transformed into pure comfort and beauty. Ibn Abbas (RA) said the fruits of this tree are larger and sweeter than anything known on earth.",
    surah: "Al-Waqi'ah",
    surahNumber: 56,
    ayah: 28,
    theme: "Nature",
    previewImageUrl: "/artworks/thornless-lote-trees.png",
    highResS3Key: "artworks/thornless-lote-trees-highres.png",
    digitalPrice: 49900,
    printPriceBase: 149900,
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
    title: "Divine Precision — Sunflower",
    verseId: "al-mulk-67-3",
    arabic: "ٱلَّذِى خَلَقَ سَبْعَ سَمَـٰوَٰتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِى خَلْقِ ٱلرَّحْمَـٰنِ مِن تَفَـٰوُتٍ ۖ فَٱرْجِعِ ٱلْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ",
    transliteration: "Alladhī khalaqa sabʿa samāwātin ṭibāqan mā tarā fī khalqir-raḥmāni min tafāwut. Farjiʿil-baṣara hal tarā min fuṭūr",
    translation:
      "Who created the seven heavens one upon another. You will not see any inconsistency in the Merciful One's creation. Turn your vision again, can you see any flaw?",
    tafsir:
      "This verse invites humanity to observe the universe — not casually, but with deep reflection. Allah challenges us to look at the heavens repeatedly, searching for any crack, imbalance, or defect. The more one looks, the more perfect the design appears. The scholars note that 'tafawut' means disproportion or inconsistency. From the spirals of galaxies to the veins of a sunflower petal, the same mathematical precision appears. It is a sign that points to One Creator — Al-Rahman, the Most Merciful.",
    surah: "Al-Mulk",
    surahNumber: 67,
    ayah: 3,
    theme: "Creation",
    previewImageUrl: "/artworks/sunflower-closeup.png",
    highResS3Key: "artworks/sunflower-closeup-highres.png",
    digitalPrice: 49900,
    printPriceBase: 149900,
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
    title: "Divine Precision — Leaf",
    verseId: "al-mulk-67-3-leaf",
    arabic: "ٱلَّذِى خَلَقَ سَبْعَ سَمَـٰوَٰتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِى خَلْقِ ٱلرَّحْمَـٰنِ مِن تَفَـٰوُتٍ ۖ فَٱرْجِعِ ٱلْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ",
    transliteration: "Alladhī khalaqa sabʿa samāwātin ṭibāqan mā tarā fī khalqir-raḥmāni min tafāwut. Farjiʿil-baṣara hal tarā min fuṭūr",
    translation:
      "Who created the seven heavens one upon another. You will not see any inconsistency in the Merciful One's creation. Turn your vision again, can you see any flaw?",
    tafsir:
      "Al-Qurtubi elaborates that this verse is an open invitation to study nature. Every leaf, with its intricate network of veins distributing water and nutrients with mathematical precision, is a testament to divine design. The branching patterns follow the same fractal geometry found across all of creation — in rivers, in lungs, in lightning. No human engineer could replicate such efficiency. The leaf is small, yet it carries the signature of the same Creator who fashioned the seven heavens.",
    surah: "Al-Mulk",
    surahNumber: 67,
    ayah: 3,
    theme: "Creation",
    previewImageUrl: "/artworks/divine-leaf.png",
    highResS3Key: "artworks/divine-leaf-highres.png",
    digitalPrice: 49900,
    printPriceBase: 149900,
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
    verseId: "al-mulk-67-3-sunflower",
    arabic: "ٱلَّذِى خَلَقَ سَبْعَ سَمَـٰوَٰتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِى خَلْقِ ٱلرَّحْمَـٰنِ مِن تَفَـٰوُتٍ ۖ فَٱرْجِعِ ٱلْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ",
    transliteration: "Alladhī khalaqa sabʿa samāwātin ṭibāqan mā tarā fī khalqir-raḥmāni min tafāwut. Farjiʿil-baṣara hal tarā min fuṭūr",
    translation:
      "Who created the seven heavens one upon another. You will not see any inconsistency in the Merciful One's creation. Turn your vision again, can you see any flaw?",
    tafsir:
      "A sunflower's head contains seeds arranged in two interlocking spirals — typically 34 in one direction and 55 in the other — numbers from the Fibonacci sequence. This mathematical order is not random; it is the design of Al-Rahman. As-Sa'di notes that this verse calls believers to move from superficial seeing to deep contemplation (tafakkur). The more science reveals about nature's precision, the louder this verse echoes: there is no flaw in what the Most Merciful has made.",
    surah: "Al-Mulk",
    surahNumber: 67,
    ayah: 3,
    theme: "Creation",
    previewImageUrl: "/artworks/sunflower-garden.png",
    highResS3Key: "artworks/sunflower-garden-highres.png",
    digitalPrice: 49900,
    printPriceBase: 149900,
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
    title: "Flawless Design — Honeycomb",
    verseId: "al-mulk-67-3-honeycomb",
    arabic: "ٱلَّذِى خَلَقَ سَبْعَ سَمَـٰوَٰتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِى خَلْقِ ٱلرَّحْمَـٰنِ مِن تَفَـٰوُتٍ ۖ فَٱرْجِعِ ٱلْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ",
    transliteration: "Alladhī khalaqa sabʿa samāwātin ṭibāqan mā tarā fī khalqir-raḥmāni min tafāwut. Farjiʿil-baṣara hal tarā min fuṭūr",
    translation:
      "Who created the seven heavens one upon another. You will not see any inconsistency in the Merciful One's creation. Turn your vision again, can you see any flaw?",
    tafsir:
      "The honeycomb is one of nature's most perfect structures. Bees, guided by Allah's inspiration (wahy — as mentioned in Surah An-Nahl 16:68), construct hexagonal cells that use the least amount of wax to hold the most honey. Mathematicians call this the 'honeycomb conjecture' — it is the most efficient partition of a surface. Allah taught the bee this geometry. This artwork reflects on how even the smallest creatures carry the mark of Al-Khaliq, the Creator whose design knows no flaw.",
    surah: "Al-Mulk",
    surahNumber: 67,
    ayah: 3,
    theme: "Creation",
    previewImageUrl: "/artworks/honeycomb.png",
    highResS3Key: "artworks/honeycomb-highres.png",
    digitalPrice: 49900,
    printPriceBase: 149900,
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
    transliteration: "Wa ilal-jibāli kayfa nuṣibat",
    translation: "And the mountains: how they were fixed?",
    tafsir:
      "This verse is part of a series of rhetorical questions in Surah Al-Ghashiyah where Allah draws attention to His signs in creation — the camel, the sky, the mountains, and the earth. Ibn Kathir explains that mountains serve as pegs (awtad) that stabilise the earth's crust, preventing it from shaking. Modern geology confirms that mountains have deep roots extending far beneath the surface. The word 'nusibat' (fixed/erected) implies deliberate placement with purpose and wisdom. Every mountain stands as a monument to divine engineering.",
    surah: "Al-Ghashiyah",
    surahNumber: 88,
    ayah: 19,
    theme: "Creation",
    previewImageUrl: "/artworks/mountains.png",
    highResS3Key: "artworks/mountains-highres.png",
    digitalPrice: 49900,
    printPriceBase: 149900,
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
    transliteration: "Awalam yaraw ilat-ṭayri fawqahum ṣāffātin wa yaqbiḍn. Mā yumsikuhunna illar-raḥmān. Innahū bikulli shay'in baṣīr",
    translation:
      "Have they not seen birds above them spreading and closing their wings, with none holding them except the Merciful One? He oversees everything.",
    tafsir:
      "At-Tabari explains that this verse highlights a miracle we witness daily but rarely reflect upon: birds defy gravity. They spread their wings (saffat) and fold them (yaqbidn), yet they do not fall. The laws of aerodynamics, air pressure, and wing design all work in harmony — but who set these laws in motion? Allah answers: none holds them aloft except Ar-Rahman. The verse ends with a reminder that He is 'Baseer' — All-Seeing. The One who holds every bird in the sky also sees every detail of your life.",
    surah: "Al-Mulk",
    surahNumber: 67,
    ayah: 19,
    theme: "Mercy",
    previewImageUrl: "/artworks/birds-in-flight.png",
    highResS3Key: "artworks/birds-in-flight-highres.png",
    digitalPrice: 49900,
    printPriceBase: 149900,
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
