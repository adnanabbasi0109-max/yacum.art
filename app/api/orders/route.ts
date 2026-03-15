import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import type { IOrderItem, IShippingAddress } from '@/models/Order';

function generateOrderNumber(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `YA-${result}`;
}

interface CreateOrderBody {
  userId: string;
  items: IOrderItem[];
  paymentMethod: 'stripe' | 'razorpay';
  shippingAddress?: IShippingAddress;
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = (await request.json()) as CreateOrderBody;
    const { userId, items, paymentMethod, shippingAddress } = body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0 || !paymentMethod) {
      return NextResponse.json(
        { error: 'userId, items, and paymentMethod are required' },
        { status: 400 }
      );
    }

    // Calculate totals
    const subtotal = items.reduce((sum, item) => sum + item.price, 0);
    const hasPrint = items.some((item) => item.type === 'print');
    const shippingCost = hasPrint ? 1500 : 0; // flat shipping for print orders
    const total = subtotal + shippingCost;

    const shippingStatus = hasPrint ? 'processing' : 'na';

    const order = await Order.create({
      orderNumber: generateOrderNumber(),
      userId,
      items,
      subtotal,
      shippingCost,
      total,
      paymentMethod,
      paymentStatus: 'pending',
      shippingAddress: shippingAddress || undefined,
      shippingStatus,
      downloadLinks: [],
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}
