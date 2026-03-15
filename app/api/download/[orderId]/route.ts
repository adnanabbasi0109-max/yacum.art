import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import Artwork from '@/models/Artwork';
import { getSignedDownloadUrl } from '@/lib/s3';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    await connectToDatabase();

    const { orderId } = await params;
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    if (order.paymentStatus !== 'paid') {
      return NextResponse.json(
        { error: 'Payment has not been completed for this order' },
        { status: 403 }
      );
    }

    // Filter to digital items only
    const digitalItems = order.items.filter((item) => item.type === 'digital');

    if (digitalItems.length === 0) {
      return NextResponse.json(
        { error: 'No digital items in this order' },
        { status: 400 }
      );
    }

    const downloadUrls: Array<{
      artworkId: string;
      slug: string;
      url: string;
      downloadsRemaining: number;
    }> = [];

    for (const item of digitalItems) {
      // Find existing download link entry
      const downloadLink = order.downloadLinks.find(
        (dl) => dl.artworkId.toString() === item.artworkId.toString()
      );

      if (downloadLink && downloadLink.downloadCount >= downloadLink.maxDownloads) {
        downloadUrls.push({
          artworkId: item.artworkId.toString(),
          slug: '',
          url: '',
          downloadsRemaining: 0,
        });
        continue;
      }

      // Fetch the artwork to get S3 key
      const artwork = await Artwork.findById(item.artworkId).lean();
      if (!artwork) continue;

      const signedUrl = await getSignedDownloadUrl(artwork.highResS3Key);

      if (downloadLink) {
        // Increment existing download count
        downloadLink.downloadCount += 1;
      } else {
        // Create new download link entry
        order.downloadLinks.push({
          artworkId: item.artworkId,
          url: signedUrl,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 min
          downloadCount: 1,
          maxDownloads: 5,
        });
      }

      downloadUrls.push({
        artworkId: item.artworkId.toString(),
        slug: artwork.slug,
        url: signedUrl,
        downloadsRemaining: downloadLink
          ? downloadLink.maxDownloads - downloadLink.downloadCount
          : 4,
      });
    }

    await order.save();

    return NextResponse.json({ downloads: downloadUrls });
  } catch (error) {
    console.error('Error generating download links:', error);
    return NextResponse.json(
      { error: 'Failed to generate download links' },
      { status: 500 }
    );
  }
}
