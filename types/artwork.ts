export interface PrintSize {
  label: string;
  dimensions: string;
  price: number;
}

export interface FrameOption {
  label: string;
  material: string;
  priceAddon: number;
}

export interface Artwork {
  _id: string;
  slug: string;
  title: string;
  verseId: string;
  arabic: string;
  translation: string;
  theme: string;
  previewImageUrl: string;
  highResS3Key: string;
  qrCodeImageUrl?: string;
  digitalPrice: number;
  printPriceBase: number;
  printSizes: PrintSize[];
  frameOptions: FrameOption[];
  orientation?: "vertical" | "horizontal";
  status: "draft" | "published" | "soldout";
  isAuctionPiece: boolean;
  isFeatured: boolean;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
