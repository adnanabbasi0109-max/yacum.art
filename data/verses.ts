export interface MeaningLayer {
  depth: number;
  label: "Literal" | "Tafsir" | "Spiritual" | "Cosmological";
  content: string;
}

export interface Verse {
  id: string;
  surah: string;
  surahNumber: number;
  ayah: number;
  theme: string;
  arabic: string;
  transliteration: string;
  translation: string;
  paintingConcept: string;
  meaningLayers: MeaningLayer[];
  recitationUrl: string;
  digitalPrice: number;
  printPriceBase: number;
  isAuctionPiece: boolean;
}

export const verses: Verse[] = [
  {
    id: "light-an-nur-35",
    surah: "An-Nur",
    surahNumber: 24,
    ayah: 35,
    theme: "Light",
    arabic:
      "ٱللَّهُ نُورُ ٱلسَّمَٰوَٰتِ وَٱلۡأَرۡضِۚ مَثَلُ نُورِهِۦ كَمِشۡكَوٰةٍ فِيهَا مِصۡبَاحٌۖ ٱلۡمِصۡبَاحُ فِي زُجَاجَةٍۖ ٱلزُّجَاجَةُ كَأَنَّهَا كَوۡكَبٌ دُرِّيّٞ",
    transliteration:
      "Allahu noorus samaawaati wal ard. Masalu noorihi kamishkaatin feehaa misbaah. Al-misbaahu fee zujaajah. Az-zujaajatu ka-annahaa kawkabun durriyyun",
    translation:
      "Allah is the Light of the heavens and the earth. The example of His light is like a niche within which is a lamp; the lamp is within glass, the glass as if it were a brilliant star.",
    paintingConcept:
      "A luminous mihrab niche radiating concentric gold rings in infinite dark. The Arabic letters are woven into the light itself.",
    meaningLayers: [
      {
        depth: 1,
        label: "Literal",
        content:
          "Allah declares Himself the source of all illumination in the heavens and earth. The verse uses the metaphor of a niche (mishkat), a lamp, and glass to describe layers of divine light — each one amplifying the next.",
      },
      {
        depth: 2,
        label: "Tafsir",
        content:
          "Ibn Kathir explains the niche as the believer's chest, the lamp as the heart, and the glass as the clarity of faith. Al-Ghazali dedicated an entire treatise (Mishkat al-Anwar) to this verse, describing 70,000 veils of light between creation and the Divine.",
      },
      {
        depth: 3,
        label: "Spiritual",
        content:
          "This verse is the foundation of Islamic mystical theology. The light is not physical — it is the light of guidance, awareness, and truth. The niche-within-lamp-within-glass structure mirrors the soul's journey inward toward its source.",
      },
      {
        depth: 4,
        label: "Cosmological",
        content:
          "Modern physics describes light as both particle and wave — the most fundamental force in the universe. The verse's description of light upon light (noorun ala noor) resonates with the quantum understanding of photons as carriers of all electromagnetic force.",
      },
    ],
    recitationUrl:
      "https://cdn.islamic.network/quran/audio/128/ar.abdurrahmaansudais/2805.mp3",
    digitalPrice: 2999,
    printPriceBase: 4999,
    isAuctionPiece: false,
  },
  {
    id: "creation-al-anbiya-30",
    surah: "Al-Anbiya",
    surahNumber: 21,
    ayah: 30,
    theme: "Creation",
    arabic:
      "أَوَلَمۡ يَرَ ٱلَّذِينَ كَفَرُوٓاْ أَنَّ ٱلسَّمَٰوَٰتِ وَٱلۡأَرۡضَ كَانَتَا رَتۡقٗا فَفَتَقۡنَٰهُمَاۖ وَجَعَلۡنَا مِنَ ٱلۡمَآءِ كُلَّ شَيۡءٍ حَيٍّۚ أَفَلَا يُؤۡمِنُونَ",
    transliteration:
      "Awalam yaral lazeena kafarooo annas samaawaati wal arda kaanataa ratqan fafataqnaahumaa wa ja'alnaa minal maaa'i kulla shai'in hayy; afalaa yu'minoon",
    translation:
      "Have those who disbelieved not considered that the heavens and the earth were a joined entity, and We separated them and made from water every living thing? Then will they not believe?",
    paintingConcept:
      "Two cosmic bodies tearing apart at a seam, releasing a burst of light. The Big Bang as Quranic truth. Oil-painting texture.",
    meaningLayers: [
      {
        depth: 1,
        label: "Literal",
        content:
          "The verse addresses the disbelievers directly, pointing to the heavens and earth as once being a single, fused mass (ratq) that was then split apart (fatq). It further points to water as the origin of all life.",
      },
      {
        depth: 2,
        label: "Tafsir",
        content:
          "Classical scholars like At-Tabari interpreted ratq as the sky and earth being joined — the sky producing no rain and the earth growing no vegetation — until Allah separated them. Ibn Abbas narrated that they were stuck together, then Allah sent wind to separate them.",
      },
      {
        depth: 3,
        label: "Spiritual",
        content:
          "The verse invites contemplation of origins. The act of separation (fatq) is an act of creation — distinction, individuation, the emergence of plurality from unity. It mirrors the soul's emergence from the divine into the material world.",
      },
      {
        depth: 4,
        label: "Cosmological",
        content:
          "The description of the heavens and earth as a joined entity later separated is remarkably consistent with the Big Bang theory, formalized in the 20th century. The emphasis on water as the basis of life aligns with modern astrobiology's focus on water as a prerequisite for life.",
      },
    ],
    recitationUrl:
      "https://cdn.islamic.network/quran/audio/128/ar.abdurrahmaansudais/2566.mp3",
    digitalPrice: 2999,
    printPriceBase: 4999,
    isAuctionPiece: false,
  },
  {
    id: "soul-al-fajr-27",
    surah: "Al-Fajr",
    surahNumber: 89,
    ayah: 27,
    theme: "Soul",
    arabic:
      "يَٰٓأَيَّتُهَا ٱلنَّفۡسُ ٱلۡمُطۡمَئِنَّةُ",
    transliteration: "Yaaa ayyatuhan nafsul mutma'innah",
    translation:
      "O tranquil soul!",
    paintingConcept:
      "Vast black canvas. A single still sphere of warm light at center. Concentric rings like a peaceful pond. Pure minimalism.",
    meaningLayers: [
      {
        depth: 1,
        label: "Literal",
        content:
          "A direct divine address to a specific type of soul — the one that has found tranquility (itmi'nan). This is the nafs al-mutma'innah, the highest state of the human soul in Islamic psychology.",
      },
      {
        depth: 2,
        label: "Tafsir",
        content:
          "Ibn Kathir explains this as the soul that is content with Allah's decree, at rest in faith. Al-Qurtubi notes that this address comes at the moment of death or on the Day of Judgment — a welcoming call to the righteous soul.",
      },
      {
        depth: 3,
        label: "Spiritual",
        content:
          "In Sufi tradition, the nafs progresses through seven stages, from the commanding self (ammara) to the tranquil self (mutma'innah). This verse marks the culmination — a soul that has surrendered its ego entirely and found peace in divine will.",
      },
      {
        depth: 4,
        label: "Cosmological",
        content:
          "Modern neuroscience and psychology recognize states of deep inner peace as measurable brain states. Meditation traditions across cultures point to a universal human capacity for transcendence that this verse names and celebrates.",
      },
    ],
    recitationUrl:
      "https://cdn.islamic.network/quran/audio/128/ar.abdurrahmaansudais/6156.mp3",
    digitalPrice: 2499,
    printPriceBase: 3999,
    isAuctionPiece: false,
  },
  {
    id: "water-al-furqan-53",
    surah: "Al-Furqan",
    surahNumber: 25,
    ayah: 53,
    theme: "Water",
    arabic:
      "وَهُوَ ٱلَّذِي مَرَجَ ٱلۡبَحۡرَيۡنِ هَٰذَا عَذۡبٞ فُرَاتٞ وَهَٰذَا مِلۡحٌ أُجَاجٞ وَجَعَلَ بَيۡنَهُمَا بَرۡزَخٗا وَحِجۡرٗا مَّحۡجُورٗا",
    transliteration:
      "Wa Huwal lazee marajal bahraini haaza 'azbun furaatunw wa haazaa milhun ujaaj, wa ja'ala bainahumaa barzakhanw wa hijram mahjoora",
    translation:
      "And it is He who has released the two seas — one fresh and sweet and the other salty and bitter — and He placed between them a barrier and prohibiting partition.",
    paintingConcept:
      "Aerial view: two oceans meeting — teal and sapphire — with a luminous boundary line where they touch but never mix.",
    meaningLayers: [
      {
        depth: 1,
        label: "Literal",
        content:
          "Allah describes His power in releasing two bodies of water — one fresh, one salt — and placing an invisible barrier (barzakh) between them so they do not encroach upon each other.",
      },
      {
        depth: 2,
        label: "Tafsir",
        content:
          "Ibn Kathir notes this as a sign of Allah's perfect design — that two waters can coexist without mixing despite no visible barrier. This phenomenon is observable at river-ocean estuaries worldwide.",
      },
      {
        depth: 3,
        label: "Spiritual",
        content:
          "The barzakh (barrier) is a recurring Quranic concept. It represents the boundary between worlds — the seen and unseen, life and death, knowledge and mystery. The two seas are often interpreted as the material and spiritual dimensions of existence.",
      },
      {
        depth: 4,
        label: "Cosmological",
        content:
          "Oceanography confirms that fresh and salt water meet at estuaries with a measurable halocline — a gradient layer that prevents immediate mixing due to differences in density. This was only documented scientifically in the modern era.",
      },
    ],
    recitationUrl:
      "https://cdn.islamic.network/quran/audio/128/ar.abdurrahmaansudais/2896.mp3",
    digitalPrice: 2999,
    printPriceBase: 4999,
    isAuctionPiece: false,
  },
  {
    id: "time-al-asr-1",
    surah: "Al-Asr",
    surahNumber: 103,
    ayah: 1,
    theme: "Time",
    arabic: "وَٱلۡعَصۡرِ",
    transliteration: "Wal 'asr",
    translation: "By time,",
    paintingConcept:
      "An hourglass containing galaxies instead of sand. Cracked. The Arabic العصر inscribed at the narrowest point.",
    meaningLayers: [
      {
        depth: 1,
        label: "Literal",
        content:
          "Allah swears by time (al-asr), which can mean the era, the afternoon, or time itself. An oath by Allah elevates the subject to cosmic significance — time is not neutral but sacred.",
      },
      {
        depth: 2,
        label: "Tafsir",
        content:
          "Imam Ash-Shafi'i said that if only this surah had been revealed, it would be sufficient for humanity. The oath by time is followed by the declaration that mankind is in loss — except those who believe, do good, and counsel each other in truth and patience.",
      },
      {
        depth: 3,
        label: "Spiritual",
        content:
          "Time is the most precious and irreversible resource. This verse shakes the listener awake — every moment that passes is either invested or lost. The brevity of the surah mirrors the brevity of life itself.",
      },
      {
        depth: 4,
        label: "Cosmological",
        content:
          "Einstein showed that time is relative — not absolute. The Quran's treatment of time as something worthy of a divine oath suggests a deeper reality to time than mere chronological passage. Modern physics still grapples with the nature of time.",
      },
    ],
    recitationUrl:
      "https://cdn.islamic.network/quran/audio/128/ar.abdurrahmaansudais/6230.mp3",
    digitalPrice: 1999,
    printPriceBase: 3499,
    isAuctionPiece: false,
  },
  {
    id: "nature-an-nahl-68",
    surah: "An-Nahl",
    surahNumber: 16,
    ayah: 68,
    theme: "Nature",
    arabic:
      "وَأَوۡحَىٰ رَبُّكَ إِلَى ٱلنَّحۡلِ أَنِ ٱتَّخِذِي مِنَ ٱلۡجِبَالِ بُيُوتٗا وَمِنَ ٱلشَّجَرِ وَمِمَّا يَعۡرِشُونَ",
    transliteration:
      "Wa awhaa Rabbuka ilan nahli anit takhizee minal jibaali buyootanw wa minash shajari wa mimmaa ya'rishoon",
    translation:
      "And your Lord inspired to the bee, 'Take for yourself among the mountains, houses, and among the trees and in that which they construct.'",
    paintingConcept:
      "A bee's perfect hexagonal honeycomb in gold on black. A single bee at center receiving a beam of divine light.",
    meaningLayers: [
      {
        depth: 1,
        label: "Literal",
        content:
          "Allah reveals that He inspired (awha) the bee — using the same word used for prophetic revelation — to build homes in mountains, trees, and human structures. The bee is addressed in the feminine form (ittakhizi).",
      },
      {
        depth: 2,
        label: "Tafsir",
        content:
          "The use of 'awha' (divine inspiration) for a bee elevates the creature's instinct to a form of guided wisdom. Classical scholars noted the feminine address, which modern science confirmed — worker bees are indeed all female.",
      },
      {
        depth: 3,
        label: "Spiritual",
        content:
          "If Allah communicates with a bee, how much more intimately does He guide the human heart? The verse is an invitation to recognize divine guidance in all creation — even the smallest creatures operate within a sacred order.",
      },
      {
        depth: 4,
        label: "Cosmological",
        content:
          "The hexagonal honeycomb is the most materially efficient structure in nature — using the least wax for the most storage. Bees' navigation uses the sun's polarized light. The verse's implication of divine programming aligns with the concept of biological algorithms.",
      },
    ],
    recitationUrl:
      "https://cdn.islamic.network/quran/audio/128/ar.abdurrahmaansudais/2004.mp3",
    digitalPrice: 2499,
    printPriceBase: 3999,
    isAuctionPiece: false,
  },
  {
    id: "mercy-az-zumar-53",
    surah: "Az-Zumar",
    surahNumber: 39,
    ayah: 53,
    theme: "Mercy",
    arabic:
      "قُلۡ يَٰعِبَادِيَ ٱلَّذِينَ أَسۡرَفُواْ عَلَىٰٓ أَنفُسِهِمۡ لَا تَقۡنَطُواْ مِن رَّحۡمَةِ ٱللَّهِۚ إِنَّ ٱللَّهَ يَغۡفِرُ ٱلذُّنُوبَ جَمِيعًاۚ إِنَّهُۥ هُوَ ٱلۡغَفُورُ ٱلرَّحِيمُ",
    transliteration:
      "Qul yaa 'ibaadial lazeena asrafoo 'alaaa anfusihim laa taqnatoo mir rahmatillaah; innallaaha yaghfiruz zunooba jamee'aa; innahoo Huwal Ghafoorur Raheem",
    translation:
      "Say, 'O My servants who have transgressed against themselves, do not despair of the mercy of Allah. Indeed, Allah forgives all sins. Indeed, it is He who is the Forgiving, the Merciful.'",
    paintingConcept:
      "A dark figure surrounded by shadows. Above: an immense ocean of gold light descending, dwarfing every shadow.",
    meaningLayers: [
      {
        depth: 1,
        label: "Literal",
        content:
          "Allah commands the Prophet to convey a message of hope: no matter how gravely one has sinned ('transgressed against themselves'), divine mercy encompasses all. The phrase 'all sins' (junooba jamee'an) is absolute — no sin is excluded.",
      },
      {
        depth: 2,
        label: "Tafsir",
        content:
          "Many scholars call this the most hopeful verse in the Quran. Ali ibn Abi Talib said this is the most expansive verse in the Book of Allah. At-Tabari emphasizes that 'all sins' means precisely that — the door of repentance is never closed.",
      },
      {
        depth: 3,
        label: "Spiritual",
        content:
          "The verse addresses the deepest human wound: shame. It says that no matter what you have done, the door is open. Despair of God's mercy is itself considered a sin — because it limits the limitless. The verse is a lifeline.",
      },
      {
        depth: 4,
        label: "Cosmological",
        content:
          "The concept of infinite mercy has parallels in the mathematical concept of infinity — no matter how large a finite number, infinity still exceeds it. The verse encodes this truth: human sin, however great, is finite; divine mercy is infinite.",
      },
    ],
    recitationUrl:
      "https://cdn.islamic.network/quran/audio/128/ar.abdurrahmaansudais/4597.mp3",
    digitalPrice: 2999,
    printPriceBase: 4999,
    isAuctionPiece: false,
  },
  {
    id: "judgment-az-zalzalah-7",
    surah: "Az-Zalzalah",
    surahNumber: 99,
    ayah: 7,
    theme: "Judgment",
    arabic:
      "فَمَن يَعۡمَلۡ مِثۡقَالَ ذَرَّةٍ خَيۡرٗا يَرَهُۥ",
    transliteration: "Famai ya'mal misqaala zarratin khairal yarah",
    translation:
      "So whoever does an atom's weight of good will see it,",
    paintingConcept:
      "A single glowing atom beside a perfect scale. One side: the atom of good. Other side: nothing. And yet the scale tips.",
    meaningLayers: [
      {
        depth: 1,
        label: "Literal",
        content:
          "On the Day of Judgment, even the smallest deed — the weight of a zarrah (atom/dust particle) — will be made visible. Nothing is too small to matter. The verse uses 'yarah' (will see it) — making accountability tangible and visual.",
      },
      {
        depth: 2,
        label: "Tafsir",
        content:
          "This is paired with verse 8: 'And whoever does an atom's weight of evil will see it.' Together they establish perfect divine justice. Ibn Abbas said this is among the most comprehensive verses — covering every deed of every person.",
      },
      {
        depth: 3,
        label: "Spiritual",
        content:
          "The verse demolishes the excuse of insignificance. No act of kindness is too small. No whispered prayer is lost. It creates a world where every micro-moment of goodness has eternal weight — a profoundly empowering worldview.",
      },
      {
        depth: 4,
        label: "Cosmological",
        content:
          "The word zarrah was classically understood as the smallest visible particle. Modern science revealed the atom — and then subatomic particles. The Quran's use of the smallest conceivable unit to illustrate accountability maps onto atomic precision in nature's laws.",
      },
    ],
    recitationUrl:
      "https://cdn.islamic.network/quran/audio/128/ar.abdurrahmaansudais/6222.mp3",
    digitalPrice: 2499,
    printPriceBase: 3999,
    isAuctionPiece: false,
  },
  {
    id: "knowledge-al-alaq-1",
    surah: "Al-Alaq",
    surahNumber: 96,
    ayah: 1,
    theme: "Knowledge",
    arabic:
      "ٱقۡرَأۡ بِٱسۡمِ رَبِّكَ ٱلَّذِي خَلَقَ",
    transliteration: "Iqra bismi Rabbikal lazee khalaq",
    translation:
      "Read in the name of your Lord who created.",
    paintingConcept:
      "A quill of light writing 'iqra' onto the fabric of the universe. Stars spell words. The first command.",
    meaningLayers: [
      {
        depth: 1,
        label: "Literal",
        content:
          "The very first word revealed to Prophet Muhammad was 'Iqra' — Read. The command links reading/recitation to the name of the Lord and to the act of creation. Knowledge and creation are inseparable from the divine.",
      },
      {
        depth: 2,
        label: "Tafsir",
        content:
          "The Prophet, who was unlettered, responded 'I cannot read.' The angel Jibreel embraced him three times before the words came. Scholars note that the first revelation being 'Read' — not 'Pray' or 'Fast' — elevates knowledge as the foundation of faith.",
      },
      {
        depth: 3,
        label: "Spiritual",
        content:
          "Iqra is not just literacy — it is the command to engage, contemplate, and seek understanding. It transforms every Muslim into a seeker. The verse sanctifies curiosity and makes the pursuit of knowledge an act of worship.",
      },
      {
        depth: 4,
        label: "Cosmological",
        content:
          "The Islamic Golden Age — triggered by this command to read — produced algebra, optics, algorithms, and the scientific method. The verse planted a seed that grew into centuries of civilization-defining discovery.",
      },
    ],
    recitationUrl:
      "https://cdn.islamic.network/quran/audio/128/ar.abdurrahmaansudais/6157.mp3",
    digitalPrice: 2999,
    printPriceBase: 4999,
    isAuctionPiece: false,
  },
  {
    id: "knowledge-al-kahf-109",
    surah: "Al-Kahf",
    surahNumber: 18,
    ayah: 109,
    theme: "Knowledge",
    arabic:
      "قُل لَّوۡ كَانَ ٱلۡبَحۡرُ مِدَادٗا لِّكَلِمَٰتِ رَبِّي لَنَفِدَ ٱلۡبَحۡرُ قَبۡلَ أَن تَنفَدَ كَلِمَٰتُ رَبِّي وَلَوۡ جِئۡنَا بِمِثۡلِهِۦ مَدَدٗا",
    transliteration:
      "Qul law kaanal bahru midaadal likalimaati Rabbee lanafidal bahru qabla an tanfada kalimaatu Rabbee wa law ji'naa bimislihee madadaa",
    translation:
      "Say, 'If the sea were ink for the words of my Lord, the sea would be exhausted before the words of my Lord were exhausted, even if We brought the like of it as a supplement.'",
    paintingConcept:
      "An ocean as an inkwell. A quill writes one word before the ocean runs dry. ONE PIECE ONLY auction piece.",
    meaningLayers: [
      {
        depth: 1,
        label: "Literal",
        content:
          "Allah commands the Prophet to convey a staggering metaphor: if all the world's oceans were ink, they would run dry before Allah's words (knowledge, wisdom, creation) could be fully written. Even doubling the ink would not suffice.",
      },
      {
        depth: 2,
        label: "Tafsir",
        content:
          "Ibn Kathir explains that Allah's knowledge and words are infinite, while all of creation — even the vast oceans — is finite. A parallel verse in Luqman (31:27) adds 'and seven more seas' to the metaphor, reinforcing the incomprehensibility of divine knowledge.",
      },
      {
        depth: 3,
        label: "Spiritual",
        content:
          "This verse is the ultimate meditation on humility before knowledge. No matter how much a scholar learns, they have barely touched the surface. It invites perpetual wonder and protects against intellectual arrogance.",
      },
      {
        depth: 4,
        label: "Cosmological",
        content:
          "Modern information theory estimates the observable universe contains approximately 10^80 atoms. Yet the verse claims divine knowledge exceeds even this. It posits an information source that transcends the physical universe — a concept that resonates with theories of a computational or informational universe.",
      },
    ],
    recitationUrl:
      "https://cdn.islamic.network/quran/audio/128/ar.abdurrahmaansudais/2326.mp3",
    digitalPrice: 0,
    printPriceBase: 0,
    isAuctionPiece: true,
  },
];

export const themes = [
  { id: "light", name: "Light", arabic: "النور", count: 1 },
  { id: "creation", name: "Creation", arabic: "الخلق", count: 1 },
  { id: "soul", name: "Soul", arabic: "النفس", count: 1 },
  { id: "water", name: "Water", arabic: "الماء", count: 1 },
  { id: "time", name: "Time", arabic: "الزمن", count: 1 },
  { id: "nature", name: "Nature", arabic: "الطبيعة", count: 1 },
  { id: "mercy", name: "Mercy", arabic: "الرحمة", count: 1 },
  { id: "judgment", name: "Judgment", arabic: "الحكم", count: 1 },
  { id: "knowledge", name: "Knowledge", arabic: "العلم", count: 2 },
];
