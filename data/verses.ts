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

// Products are managed via the admin panel and stored in MongoDB.
export const verses: Verse[] = [];

export const themes = [
  { id: "light", name: "Light", arabic: "النور", count: 0 },
  { id: "creation", name: "Creation", arabic: "الخلق", count: 0 },
  { id: "soul", name: "Soul", arabic: "النفس", count: 0 },
  { id: "water", name: "Water", arabic: "الماء", count: 0 },
  { id: "time", name: "Time", arabic: "الزمن", count: 0 },
  { id: "nature", name: "Nature", arabic: "الطبيعة", count: 0 },
  { id: "mercy", name: "Mercy", arabic: "الرحمة", count: 0 },
  { id: "judgment", name: "Judgment", arabic: "الحكم", count: 0 },
  { id: "knowledge", name: "Knowledge", arabic: "العلم", count: 0 },
];
