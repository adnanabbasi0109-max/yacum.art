import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import type { IOrderItem, IShippingAddress } from '@/models/Order';

interface CreateOrderBody {
  email: string;
  name: string;
  items: IOrderItem[];
  shippingAddress?: IShippingAddress;
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const body = (await request.json()) as CreateOrderBody;
    const { email, name, items, shippingAddress } = body;

    if (!email || !name || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: 'email, name, and items are required' },
        { status: 400 }
      );
    }

    // Calculate total in paise
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Generate order number
    const orderNumber = `YA-${Date.now().toString(36).toUpperCase()}`;

    const order = await Order.create({
      orderNumber,
      email,
      name,
      items,
      total,
      currency: 'INR',
      paymentStatus: 'pending',
      shippingAddress: shippingAddress || undefined,
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
