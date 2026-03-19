import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const { orderNumber, email } = await request.json();

    if (!orderNumber || !email) {
      return NextResponse.json(
        { error: 'Order number and email are required' },
        { status: 400 }
      );
    }

    const order = await Order.findOne({
      orderNumber: orderNumber.toUpperCase().trim(),
      email: email.toLowerCase().trim(),
    }).lean();

    if (!order) {
      return NextResponse.json(
        { error: 'No order found with that order number and email' },
        { status: 404 }
      );
    }

    // Return only safe fields (no tokens, payment IDs, admin notes)
    return NextResponse.json({
      orderNumber: order.orderNumber,
      name: order.name,
      items: order.items.map((item: { title: string; type: string; printSize?: string; frameOption?: string; quantity: number }) => ({
        title: item.title,
        type: item.type,
        printSize: item.printSize,
        frameOption: item.frameOption,
        quantity: item.quantity,
      })),
      total: order.total,
      currency: order.currency,
      paymentStatus: order.paymentStatus,
      fulfillmentStatus: order.fulfillmentStatus || 'processing',
      trackingNumber: order.trackingNumber,
      trackingCarrier: order.trackingCarrier,
      trackingUpdates: order.trackingUpdates || [],
      shippingAddress: order.shippingAddress,
      createdAt: order.createdAt,
    });
  } catch (error) {
    console.error('Error tracking order:', error);
    return NextResponse.json(
      { error: 'Failed to look up order' },
      { status: 500 }
    );
  }
}
