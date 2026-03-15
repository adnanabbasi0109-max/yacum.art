import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Artwork from '@/models/Artwork';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(request.url);
    const theme = searchParams.get('theme');
    const format = searchParams.get('format');
    const sort = searchParams.get('sort');
    const search = searchParams.get('search');

    // Base filter: only published artworks
    const filter: Record<string, unknown> = { status: 'published' };

    if (theme) {
      filter.theme = { $regex: new RegExp(`^${theme}$`, 'i') };
    }

    if (format) {
      if (format === 'digital') {
        filter.isAuctionPiece = false;
      } else if (format === 'auction') {
        filter.isAuctionPiece = true;
      }
    }

    if (search) {
      filter.$or = [
        { arabic: { $regex: search, $options: 'i' } },
        { translation: { $regex: search, $options: 'i' } },
        { theme: { $regex: search, $options: 'i' } },
        { slug: { $regex: search, $options: 'i' } },
      ];
    }

    // Build sort options
    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === 'price-asc') {
      sortOption = { digitalPrice: 1 };
    } else if (sort === 'price-desc') {
      sortOption = { digitalPrice: -1 };
    } else if (sort === 'featured') {
      sortOption = { isAuctionPiece: -1, createdAt: -1 };
    }

    const artworks = await Artwork.find(filter).sort(sortOption).lean();

    return NextResponse.json(artworks);
  } catch (error) {
    console.error('Error fetching artworks:', error);
    return NextResponse.json(
      { error: 'Failed to fetch artworks' },
      { status: 500 }
    );
  }
}
