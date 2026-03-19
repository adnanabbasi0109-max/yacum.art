import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/db';
import Order from '@/models/Order';
import Razorpay from 'razorpay';

export async function POST(request: NextRequest) {
  try {
    const keyId = process.env.RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || !keySecret) {
      return NextResponse.json(
        { error: 'Payment gateway not configured. Please set RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.' },
        { status: 500 }
      );
    }

    await connectToDatabase();

    const body = await request.json();
    const { email, name, items, shippingAddress } = body;

    if (!email || !name || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Calculate total in paise
    const total = items.reduce(
      (sum: number, item: { price: number; quantity: number }) =>
        sum + item.price * item.quantity,
      0
    );

    // Generate order number
    const orderNumber = `YA-${Date.now().toString(36).toUpperCase()}`;

    // Create order in DB
    const order = await Order.create({
      orderNumber,
      email,
      name,
      items,
      total,
      paymentStatus: 'pending',
      shippingAddress: shippingAddress || undefined,
    });

    // Create Razorpay order
    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const razorpayOrder = await razorpay.orders.create({
      amount: total, // in paise
      currency: 'INR',
      receipt: order.orderNumber,
      notes: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber,
      },
    });

    // Save razorpay order ID
    order.razorpayOrderId = razorpayOrder.id;
    await order.save();

    return NextResponse.json({
      orderId: razorpayOrder.id,
      amount: total,
      currency: 'INR',
      orderNumber: order.orderNumber,
      keyId,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    const message = error instanceof Error ? error.message : 'Checkout failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
