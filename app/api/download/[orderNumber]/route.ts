import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';

const slugToFile: Record<string, string> = {
  'sibghatallah-take-on-allahs-colour': 'sibghatallah',
  'thornless-lote-trees-sidrin-makhdud': 'thornless-lote-trees',
  'divine-precision-sunflower': 'sunflower-closeup',
  'divine-precision-leaf': 'divine-leaf',
  'radiant-sunflower-divine-design': 'sunflower-garden',
  'honeycomb-flawless-design': 'honeycomb',
  'mountains-raised-in-measure': 'mountains',
  'birds-in-flight-divine-mercy': 'birds-in-flight',
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    await connectToDatabase();
    const { orderNumber } = await params;

    const order = await Order.findOne({ orderNumber }).lean();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.paymentStatus !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 403 });
    }

    // Return download info for digital items
    const digitalItems = order.items
      .filter((item: { type: string }) => item.type === 'digital')
      .map((item: { slug: string; title: string }) => ({
        title: item.title,
        filename: `${slugToFile[item.slug] || item.slug}.png`,
        url: `/downloads/${slugToFile[item.slug] || item.slug}.png`,
      }));

    return NextResponse.json({
      orderNumber: order.orderNumber,
      email: order.email,
      items: digitalItems,
    });
  } catch (error) {
    console.error('Download API error:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}
