import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import path from 'path';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';

// Map artwork slugs to download filenames in public/downloads/
const slugToFile: Record<string, string> = {
  // Old 8
  'sibghatallah-take-on-allahs-colour': 'sibghatallah',
  'thornless-lote-trees-sidrin-makhdud': 'thornless-lote-trees',
  'divine-precision-sunflower': 'sunflower-closeup',
  'divine-precision-leaf': 'divine-leaf',
  'radiant-sunflower-divine-design': 'sunflower-garden',
  'honeycomb-flawless-design': 'honeycomb',
  'mountains-raised-in-measure': 'mountains',
  'birds-in-flight-divine-mercy': 'birds-in-flight',
  // New 8
  'water-droplet-divine-precision': 'water-droplet-divine-precision',
  'tree-rings-divine-precision': 'tree-rings-divine-precision',
  'luminous-niche-light-verse': 'luminous-niche-light-verse',
  'seashell-determined-measure': 'seashell-determined-measure',
  'feather-determined-measure': 'feather-determined-measure',
  'nautilus-determined-measure': 'nautilus-determined-measure',
  'pinecone-determined-measure': 'pinecone-determined-measure',
  'flower-bud-determined-measure': 'flower-bud-determined-measure',
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    await connectToDatabase();
    const { token } = await params;
    const slug = request.nextUrl.searchParams.get('slug');

    if (!slug) {
      return NextResponse.json({ error: 'Missing slug parameter' }, { status: 400 });
    }

    const order = await Order.findOne({ downloadToken: token }).lean();

    if (!order) {
      return NextResponse.json({ error: 'Invalid download link' }, { status: 404 });
    }

    if (order.paymentStatus !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 403 });
    }

    const digitalItem = order.items.find(
      (item: { slug: string; type: string }) =>
        item.slug === slug && item.type === 'digital'
    );

    if (!digitalItem) {
      return NextResponse.json(
        { error: 'This item is not part of your order' },
        { status: 403 }
      );
    }

    // Serve PDF files
    const baseName = slugToFile[slug] || slug;
    const filename = `${baseName}.pdf`;
    const filePath = path.join(process.cwd(), 'public', 'downloads', filename);

    try {
      const fileBuffer = await readFile(filePath);

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${filename}"`,
          'Content-Length': fileBuffer.length.toString(),
        },
      });
    } catch {
      return NextResponse.json(
        { error: 'Download file not available yet. Please contact support.' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json({ error: 'Download failed' }, { status: 500 });
  }
}
