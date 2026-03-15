import { NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Auction from '@/models/Auction';

export async function GET() {
  try {
    await connectToDatabase();

    const auctions = await Auction.find()
      .populate('artworkId')
      .sort({ endTime: -1 })
      .lean();

    return NextResponse.json(auctions);
  } catch (error) {
    console.error('Error fetching auctions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch auctions' },
      { status: 500 }
    );
  }
}
