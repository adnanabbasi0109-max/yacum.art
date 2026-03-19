import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ orderNumber: string }> }
) {
  try {
    await connectToDatabase();
    const { orderNumber } = await params;
    const token = request.nextUrl.searchParams.get('token');

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    const order = await Order.findOne({ orderNumber, downloadToken: token }).lean();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.paymentStatus !== 'paid') {
      return NextResponse.json({ error: 'Payment not completed' }, { status: 403 });
    }

    // Return digital items for the success page
    const digitalItems = order.items
      .filter((item: { type: string }) => item.type === 'digital')
      .map((item: { slug: string; title: string }) => ({
        title: item.title,
        slug: item.slug,
      }));

    return NextResponse.json({
      orderNumber: order.orderNumber,
      email: order.email,
      items: digitalItems,
    });
  } catch (error) {
    console.error('Order fetch error:', error);
    return NextResponse.json({ error: 'Failed to fetch order' }, { status: 500 });
  }
}
