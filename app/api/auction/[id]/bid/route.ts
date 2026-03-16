import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import connectToDatabase from '@/lib/db';
import Auction from '@/models/Auction';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Require authentication
    const session = await getServerSession();
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'You must be logged in to place a bid' },
        { status: 401 }
      );
    }

    await connectToDatabase();

    const { id } = await params;
    const body = await request.json();
    const { amount } = body as { amount: number };

    if (!amount) {
      return NextResponse.json(
        { error: 'Bid amount is required' },
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
        { error: `Bid must be at least ₹${minimumBid.toLocaleString('en-IN')}` },
        { status: 400 }
      );
    }

    // Add to bid history
    const userName = session.user.name || session.user.email.split('@')[0];
    auction.bidHistory.push({
      userId: (session.user as { id?: string }).id || session.user.email,
      userName,
      amount,
      time: new Date(),
    });

    auction.currentBid = amount;
    auction.currentBidderId = ((session.user as { id?: string }).id || session.user.email) as unknown as typeof auction.currentBidderId;
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
