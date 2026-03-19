import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Auction from '@/models/Auction';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectToDatabase();

    const { id } = await params;
    const body = await request.json();
    const { amount, userName } = body as { amount: number; userName: string };

    if (!amount) {
      return NextResponse.json(
        { error: 'Bid amount is required' },
        { status: 400 }
      );
    }

    if (!userName || !userName.trim()) {
      return NextResponse.json(
        { error: 'Name is required to place a bid' },
        { status: 400 }
      );
    }

    const auction = await Auction.findById(id);

    if (!auction) {
      return NextResponse.json(
        { error: 'Auction not found' },
        { status: 404 }
      );
    }

    if (auction.status !== 'live') {
      return NextResponse.json(
        { error: 'Auction is not currently live' },
        { status: 400 }
      );
    }

    if (new Date() > new Date(auction.endTime)) {
      return NextResponse.json(
        { error: 'Auction has ended' },
        { status: 400 }
      );
    }

    const minimumBid = auction.currentBid > 0
      ? auction.currentBid + auction.bidIncrement
      : auction.startingBid;

    if (amount < minimumBid) {
      return NextResponse.json(
        { error: `Bid must be at least ₹${(minimumBid / 100).toFixed(0)}` },
        { status: 400 }
      );
    }

    auction.bidHistory.push({
      userId: 'guest',
      userName: userName.trim(),
      amount,
      time: new Date(),
    });

    auction.currentBid = amount;
    await auction.save();

    const updated = await Auction.findById(id).populate('artworkId').lean();

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Error placing bid:', error);
    return NextResponse.json(
      { error: 'Failed to place bid' },
      { status: 500 }
    );
  }
}
