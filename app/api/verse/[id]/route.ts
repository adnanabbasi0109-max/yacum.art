import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Artwork from '@/models/Artwork';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    await connectToDatabase();

    // verseId format: "al-baqarah-2-138"
    const artwork = await Artwork.findOne({ verseId: id }).lean();

    if (!artwork) {
      return NextResponse.json(
        { error: 'Verse not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      id: artwork.verseId,
      arabic: artwork.arabic,
      transliteration: artwork.transliteration || '',
      translation: artwork.translation,
      tafsir: artwork.tafsir || '',
      surah: artwork.surah || '',
      surahNumber: artwork.surahNumber || 0,
      ayah: artwork.ayah || 0,
      theme: artwork.theme,
      title: artwork.title,
      slug: artwork.slug,
    });
  } catch (error) {
    console.error('Error fetching verse:', error);
    return NextResponse.json(
      { error: 'Failed to fetch verse' },
      { status: 500 }
    );
  }
}
