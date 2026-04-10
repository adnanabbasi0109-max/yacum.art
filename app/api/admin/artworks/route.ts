import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import Artwork from "@/models/Artwork";
import { requireAdmin } from "@/lib/auth";

const defaultPrintSizes = [
  { label: "A3", dimensions: "297 x 420mm", price: 499900 },
  { label: "A2", dimensions: "420 x 594mm", price: 499900 },
  { label: "A1", dimensions: "594 x 841mm", price: 499900 },
];

const defaultFrameOptions = [
  { label: "No Frame", material: "Unframed", priceAddon: 0 },
  { label: "Black Wood", material: "Solid Black Wood", priceAddon: 0 },
  { label: "Walnut", material: "Natural Walnut Wood", priceAddon: 0 },
];

export async function GET() {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const artworks = await Artwork.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json({ artworks });
  } catch (error) {
    console.error("Admin artworks fetch error:", error);
    return NextResponse.json(
      { error: "Failed to load artworks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin();
  if (!auth.ok) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const body = await request.json();

    const {
      slug,
      title,
      verseId,
      arabic,
      transliteration,
      translation,
      tafsir,
      surah,
      surahNumber,
      ayah,
      theme,
      previewImageUrl,
      highResS3Key,
      digitalPrice = 99900,
      printPriceBase = 499900,
      status = "published",
      orientation = "vertical",
      description,
      isAuctionPiece = false,
      isFeatured = false,
    } = body;

    if (!slug || !title || !verseId || !arabic || !translation || !theme || !previewImageUrl) {
      return NextResponse.json(
        { error: "Missing required fields: slug, title, verseId, arabic, translation, theme, previewImageUrl" },
        { status: 400 }
      );
    }

    const artwork = await Artwork.create({
      slug,
      title,
      verseId,
      arabic,
      transliteration,
      translation,
      tafsir,
      surah,
      surahNumber,
      ayah,
      theme,
      previewImageUrl,
      highResS3Key: highResS3Key || `artworks/${slug}-highres.png`,
      digitalPrice,
      printPriceBase,
      printSizes: defaultPrintSizes,
      frameOptions: defaultFrameOptions,
      status,
      orientation,
      description,
      isAuctionPiece,
      isFeatured,
    });

    return NextResponse.json({ artwork }, { status: 201 });
  } catch (error) {
    console.error("Admin artwork create error:", error);
    const message = error instanceof Error ? error.message : "Failed to create artwork";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
